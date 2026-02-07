import { useState, useEffect } from 'react';
import { assessmentApi, healthSignalApi } from '../services/api';
import MapView from '../components/MapView';
import { MdLayers } from 'react-icons/md';

function MapPage() {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [healthSignals, setHealthSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    critical: true,
    high: true,
    medium: true,
    low: true,
    siteType: 'ALL',
  });
  const [mapLayers, setMapLayers] = useState({
    environmental: true,
    healthSignals: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assessmentRes, healthRes] = await Promise.all([
          assessmentApi.getAll(),
          healthSignalApi.getAll().catch(() => ({ data: [] })),
        ]);
        setAssessments(assessmentRes.data);
        setFilteredAssessments(assessmentRes.data);
        setHealthSignals(healthRes.data || []);
      } catch (err) {
        setError('Failed to load map data');
        console.error('Map error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = assessments;

    // Filter by priority
    filtered = filtered.filter((a) => {
      if (a.priority === 'CRITICAL' && !filters.critical) return false;
      if (a.priority === 'HIGH' && !filters.high) return false;
      if (a.priority === 'MEDIUM' && !filters.medium) return false;
      if (a.priority === 'LOW' && !filters.low) return false;
      return true;
    });

    // Filter by site type
    if (filters.siteType !== 'ALL') {
      filtered = filtered.filter((a) => a.siteType === filters.siteType);
    }

    setFilteredAssessments(filtered);
  }, [filters, assessments]);

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Risk Map</h1>
        <span className="text-sm text-gray-500">
          Showing {filteredAssessments.length} of {assessments.length} sites
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by Priority:</span>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.critical}
              onChange={() => handleFilterChange('critical')}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-1"></span>
              Critical
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.high}
              onChange={() => handleFilterChange('high')}
              className="w-4 h-4 text-orange-500 rounded"
            />
            <span className="flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
              High
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.medium}
              onChange={() => handleFilterChange('medium')}
              className="w-4 h-4 text-yellow-500 rounded"
            />
            <span className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
              Medium
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.low}
              onChange={() => handleFilterChange('low')}
              className="w-4 h-4 text-green-500 rounded"
            />
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              Low
            </span>
          </label>

          <div className="border-l pl-4 ml-2">
            <label className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Site Type:</span>
              <select
                value={filters.siteType}
                onChange={(e) => setFilters((prev) => ({ ...prev, siteType: e.target.value }))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="ALL">All Types</option>
                <option value="DEBRIS">Debris</option>
                <option value="WATER">Water</option>
                <option value="BOTH">Both</option>
              </select>
            </label>
          </div>
        </div>

        {/* Map Layers Toggle */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            <MdLayers className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Map Layers:</span>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.environmental}
              onChange={() => setMapLayers((prev) => ({ ...prev, environmental: !prev.environmental }))}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm">Environmental Risk</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.healthSignals}
              onChange={() => setMapLayers((prev) => ({ ...prev, healthSignals: !prev.healthSignals }))}
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="text-sm">Health Signals</span>
          </label>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-md p-2" style={{ height: 'calc(100vh - 280px)' }}>
        <MapView 
          assessments={mapLayers.environmental ? filteredAssessments : []} 
          healthSignals={mapLayers.healthSignals ? healthSignals : []}
          zoom={10} 
        />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-red-600 rounded-full mr-2"></span>
            Critical (70-100 risk)
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
            High (50-69 risk)
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
            Medium (30-49 risk)
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
            Low (0-29 risk)
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
