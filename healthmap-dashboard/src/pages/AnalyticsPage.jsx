import { useState, useEffect } from 'react';
import { statsApi, assessmentApi, healthSignalApi } from '../services/api';
import RiskChart from '../components/RiskChart';
import { MdTrendingUp, MdTrendingDown, MdShowChart, MdAssessment } from 'react-icons/md';
import { FaLungs, FaPills } from 'react-icons/fa';
import { MdSpa } from 'react-icons/md';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [healthSignals, setHealthSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, assessmentsRes, healthRes] = await Promise.all([
        statsApi.getStats(),
        assessmentApi.getAll(),
        healthSignalApi.getAll().catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setAssessments(assessmentsRes.data);
      setHealthSignals(healthRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate metrics
  const criticalSites = assessments.filter(a => a.priority === 'CRITICAL').length;
  const highRiskSites = assessments.filter(a => a.priority === 'HIGH').length;
  const elevatedHealthSignals = healthSignals.filter(s => s.signalLevel === 'ELEVATED').length;
  const normalHealthSignals = healthSignals.filter(s => s.signalLevel === 'NORMAL').length;

  // Site type breakdown
  const siteTypeBreakdown = assessments.reduce((acc, a) => {
    acc[a.siteType] = (acc[a.siteType] || 0) + 1;
    return acc;
  }, {});

  // Health signal type breakdown
  const healthSignalBreakdown = healthSignals.reduce((acc, s) => {
    const key = s.signalType;
    if (!acc[key]) acc[key] = { elevated: 0, normal: 0 };
    if (s.signalLevel === 'ELEVATED') {
      acc[key].elevated++;
    } else {
      acc[key].normal++;
    }
    return acc;
  }, {});

  // Average risk scores by site type
  const avgRiskBySiteType = Object.keys(siteTypeBreakdown).map(type => {
    const sitesOfType = assessments.filter(a => a.siteType === type);
    const avgRisk = sitesOfType.reduce((sum, a) => sum + a.overallRisk, 0) / sitesOfType.length;
    return { type, avgRisk: avgRisk.toFixed(1), count: sitesOfType.length };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and trends</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All Time</option>
          <option value="30">Last 30 Days</option>
          <option value="7">Last 7 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sites Assessed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{assessments.length}</p>
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
            {highRiskSites} high risk sites
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Distribution</h2>
          <RiskChart distribution={stats?.riskDistribution} />
        </div>

        {/* Site Type Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sites by Type</h2>
          <div className="space-y-4">
            {Object.entries(siteTypeBreakdown).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{type}</span>
                  <span className="text-gray-600">{count} sites</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(count / assessments.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Average Risk by Site Type */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Risk Score by Site Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {avgRiskBySiteType.map(({ type, avgRisk, count }) => (
            <div key={type} className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">{type}</div>
              <div className="text-2xl font-bold text-gray-900">{avgRisk}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    avgRisk >= 70 ? 'bg-red-600' :
                    avgRisk >= 50 ? 'bg-orange-500' :
                    avgRisk >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${avgRisk}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{count} sites</div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Signal Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Signal Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(healthSignalBreakdown).map(([type, data]) => (
            <div key={type} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                {type === 'RESPIRATORY' && <FaLungs className="text-red-600" size={20} />}
                {type === 'GASTROINTESTINAL' && <FaPills className="text-orange-600" size={20} />}
                {type === 'SKIN' && <MdSpa className="text-yellow-600" size={20} />}
                <span className="font-medium text-gray-900">
                  {type === 'RESPIRATORY' ? 'Respiratory' :
                   type === 'GASTROINTESTINAL' ? 'Gastrointestinal' : 'Skin'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Elevated:</span>
                  <span className="font-semibold">{data.elevated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Normal:</span>
                  <span className="font-semibold">{data.normal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(data.elevated / (data.elevated + data.normal)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Score Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Asbestos Risk</span>
              <span className="text-sm font-semibold text-purple-600">
                {stats?.averageAsbestosRisk?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full"
                style={{ width: `${stats?.averageAsbestosRisk || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Water Risk</span>
              <span className="text-sm font-semibold text-blue-600">
                {stats?.averageWaterRisk?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${stats?.averageWaterRisk || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Risk</span>
              <span className="text-sm font-semibold text-red-600">
                {stats?.averageOverallRisk?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  stats?.averageOverallRisk >= 70 ? 'bg-red-600' :
                  stats?.averageOverallRisk >= 50 ? 'bg-orange-500' :
                  stats?.averageOverallRisk >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${stats?.averageOverallRisk || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
