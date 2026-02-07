import { useState, useEffect } from 'react';
import { assessmentApi, healthSignalApi } from '../services/api';
import AssessmentTable from '../components/AssessmentTable';
import { MdWarning } from 'react-icons/md';

function PrioritiesPage() {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [healthSignals, setHealthSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('risk');
  const [filterPriority, setFilterPriority] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assessmentRes, healthRes] = await Promise.all([
          assessmentApi.getPriorities(),
          healthSignalApi.getRecent(7).catch(() => ({ data: [] })),
        ]);
        setAssessments(assessmentRes.data);
        setFilteredAssessments(assessmentRes.data);
        setHealthSignals(healthRes.data || []);
      } catch (err) {
        setError('Failed to load priorities data');
        console.error('Priorities error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...assessments];

    // Filter by priority
    if (filterPriority !== 'ALL') {
      filtered = filtered.filter((a) => a.priority === filterPriority);
    }

    // Sort
    if (sortBy === 'risk') {
      filtered.sort((a, b) => b.overallRisk - a.overallRisk);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'asbestos') {
      filtered.sort((a, b) => b.asbestosRisk - a.asbestosRisk);
    } else if (sortBy === 'water') {
      filtered.sort((a, b) => b.waterRisk - a.waterRisk);
    }

    setFilteredAssessments(filtered);
  }, [filterPriority, sortBy, assessments]);

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Latitude',
      'Longitude',
      'Site Type',
      'Building Age',
      'Asbestos Risk',
      'Water Risk',
      'Overall Risk',
      'Priority',
      'Notes',
      'Created At',
    ];

    const rows = filteredAssessments.map((a) => [
      a.id,
      a.latitude,
      a.longitude,
      a.siteType,
      a.buildingAge,
      a.asbestosRisk,
      a.waterRisk,
      a.overallRisk,
      a.priority,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      a.createdAt,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthmap-priorities-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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
        {error}
      </div>
    );
  }

  const priorityCounts = {
    CRITICAL: assessments.filter((a) => a.priority === 'CRITICAL').length,
    HIGH: assessments.filter((a) => a.priority === 'HIGH').length,
    MEDIUM: assessments.filter((a) => a.priority === 'MEDIUM').length,
    LOW: assessments.filter((a) => a.priority === 'LOW').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Priority List</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <span>Export CSV</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterPriority(filterPriority === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            filterPriority === 'CRITICAL'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <div className="text-red-600 text-2xl font-bold">{priorityCounts.CRITICAL}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </button>
        <button
          onClick={() => setFilterPriority(filterPriority === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            filterPriority === 'HIGH'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
          }`}
        >
          <div className="text-orange-500 text-2xl font-bold">{priorityCounts.HIGH}</div>
          <div className="text-sm text-gray-600">High</div>
        </button>
        <button
          onClick={() => setFilterPriority(filterPriority === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            filterPriority === 'MEDIUM'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 hover:border-yellow-300'
          }`}
        >
          <div className="text-yellow-600 text-2xl font-bold">{priorityCounts.MEDIUM}</div>
          <div className="text-sm text-gray-600">Medium</div>
        </button>
        <button
          onClick={() => setFilterPriority(filterPriority === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            filterPriority === 'LOW'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-green-300'
          }`}
        >
          <div className="text-green-600 text-2xl font-bold">{priorityCounts.LOW}</div>
          <div className="text-sm text-gray-600">Low</div>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="risk">Overall Risk (Highest)</option>
              <option value="asbestos">Asbestos Risk</option>
              <option value="water">Water Risk</option>
              <option value="date">Most Recent</option>
            </select>
          </div>

          {filterPriority !== 'ALL' && (
            <button
              onClick={() => setFilterPriority('ALL')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filter
            </button>
          )}

          <div className="ml-auto text-sm text-gray-500">
            Showing {filteredAssessments.length} of {assessments.length} sites
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <AssessmentTable 
          assessments={filteredAssessments} 
          healthSignals={healthSignals}
          showAll={true} 
        />
      </div>
    </div>
  );
}

export default PrioritiesPage;
