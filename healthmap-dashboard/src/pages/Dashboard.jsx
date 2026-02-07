import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi, assessmentApi, healthSignalApi } from '../services/api';
import RiskChart from '../components/RiskChart';
import AssessmentTable from '../components/AssessmentTable';
import MapView from '../components/MapView';
import { MdWarning, MdTrendingUp, MdSpa, MdTrendingDown, MdShowChart, MdAssessment } from 'react-icons/md';
import { FaLungs, FaPills } from 'react-icons/fa';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [allAssessments, setAllAssessments] = useState([]);
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [healthSignals, setHealthSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes, allRes, healthStatsRes, healthSignalsRes] = await Promise.all([
          statsApi.getStats(),
          assessmentApi.getRecent(),
          assessmentApi.getAll(),
          healthSignalApi.getStats().catch(() => ({ data: null })),
          healthSignalApi.getAll().catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data);
        setRecentAssessments(recentRes.data);
        setAllAssessments(allRes.data);
        setHealthAlerts(healthStatsRes.data?.alerts || []);
        setHealthSignals(healthSignalsRes.data || []);
      } catch (err) {
        setError('Failed to load dashboard data. Make sure the backend is running.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Run the backend with: <code className="bg-red-200 px-1">cd healthmap-backend && mvn spring-boot:run</code>
        </p>
      </div>
    );
  }

  // Calculate metrics
  const criticalSites = allAssessments.filter(a => a.priority === 'CRITICAL').length;
  const elevatedHealthSignals = healthSignals.filter(s => s.signalLevel === 'ELEVATED').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sites Assessed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{allAssessments.length}</p>
            </div>
            <MdAssessment className="text-blue-600 text-4xl" />
          </div>
          <div className="mt-3 flex items-center text-sm text-green-600">
            <MdTrendingUp className="mr-1" />
            <span>Active monitoring</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Sites</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{criticalSites}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <MdShowChart className="text-red-600 text-2xl" />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Require immediate attention
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Health Signals</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{healthSignals.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaLungs className="text-orange-600 text-2xl" />
            </div>
          </div>
          <div className="mt-3 text-sm text-red-600">
            {elevatedHealthSignals} elevated
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Risk Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.averageOverallRisk?.toFixed(1) || 0}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              stats?.averageOverallRisk >= 70 ? 'bg-red-100' :
              stats?.averageOverallRisk >= 50 ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              {stats?.averageOverallRisk >= 50 ? 
                <MdTrendingUp className="text-red-600 text-2xl" /> :
                <MdTrendingDown className="text-green-600 text-2xl" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Health Alert Summary */}
      {healthAlerts && healthAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg shadow-md p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <MdWarning className="text-orange-600 text-2xl" />
                <h2 className="text-lg font-semibold text-gray-900">Health Alert Summary</h2>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Areas showing elevated health signals that may require attention
              </p>
              <div className="space-y-3">
                {healthAlerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        alert.type === 'RESPIRATORY' ? 'bg-red-100' :
                        alert.type === 'GASTROINTESTINAL' ? 'bg-orange-100' :
                        'bg-yellow-100'
                      }`}>
                        {alert.type === 'RESPIRATORY' && <FaLungs className="text-red-600" />}
                        {alert.type === 'GASTROINTESTINAL' && <FaPills className="text-orange-600" />}
                        {alert.type === 'SKIN' && <MdSpa className="text-yellow-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{alert.area || 'Area ' + (index + 1)}</div>
                        <div className="text-sm text-gray-600">
                          {alert.type === 'RESPIRATORY' ? 'Respiratory' : 
                           alert.type === 'GASTROINTESTINAL' ? 'Gastrointestinal' : 'Skin'} signals elevated
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdTrendingUp className="text-red-600" />
                      <span className="text-sm font-semibold text-red-600">Elevated</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/health-signals"
              className="ml-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              View All Signals
            </Link>
          </div>
        </div>
      )}

      {/* Charts and Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h2>
          <RiskChart distribution={stats?.riskDistribution} />
        </div>

        {/* Mini Map */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Site Locations</h2>
            <Link to="/map" className="text-blue-600 hover:text-blue-800 text-sm">
              View Full Map →
            </Link>
          </div>
          <div className="h-64 rounded-lg overflow-hidden">
            <MapView 
              assessments={allAssessments} 
              healthSignals={healthSignals}
              zoom={9} 
            />
          </div>
        </div>
      </div>

      {/* Average Risk Scores */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Average Risk Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Asbestos Risk</span>
              <span className="text-sm font-medium">{stats?.averageAsbestosRisk || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full"
                style={{ width: `${stats?.averageAsbestosRisk || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Water Risk</span>
              <span className="text-sm font-medium">{stats?.averageWaterRisk || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${stats?.averageWaterRisk || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Overall Risk</span>
              <span className="text-sm font-medium">{stats?.averageOverallRisk || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  stats?.averageOverallRisk >= 70
                    ? 'bg-red-600'
                    : stats?.averageOverallRisk >= 50
                    ? 'bg-orange-500'
                    : stats?.averageOverallRisk >= 30
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${stats?.averageOverallRisk || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assessments Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Assessments</h2>
          <Link to="/priorities" className="text-blue-600 hover:text-blue-800 text-sm">
            View All →
          </Link>
        </div>
        <AssessmentTable 
          assessments={recentAssessments} 
          healthSignals={healthSignals}
        />
      </div>
    </div>
  );
}

export default Dashboard;
