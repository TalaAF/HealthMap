import { useState, useEffect } from 'react';
import { healthSignalApi } from '../services/api';
import HealthSignalEntry from '../components/HealthSignalEntry';
import HealthSignalWidget from '../components/HealthSignalWidget';

export default function HealthSignalsPage() {
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEntry, setShowEntry] = useState(false);
  const [filter, setFilter] = useState('all'); // all, elevated, normal
  const [timeFilter, setTimeFilter] = useState(7); // days

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [signalsRes, statsRes] = await Promise.all([
        healthSignalApi.getRecent(timeFilter),
        healthSignalApi.getStats(),
      ]);
      setSignals(signalsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching health signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignalCreated = () => {
    setShowEntry(false);
    fetchData();
  };

  const filteredSignals = signals.filter((signal) => {
    if (filter === 'elevated') return signal.signalLevel === 'ELEVATED';
    if (filter === 'normal') return signal.signalLevel === 'NORMAL';
    return true;
  });

  const getSignalIcon = (type) => {
    const icons = {
      RESPIRATORY: '🔴',
      GASTROINTESTINAL: '🟠',
      SKIN: '🟡',
    };
    return icons[type] || '⚪';
  };

  const getLevelBadge = (level) => {
    if (level === 'ELEVATED') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
          🔴 Elevated
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
        🟢 Normal
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading health signals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Signals</h1>
            <p className="text-gray-600 mt-2">
              Public Health Early Warning System - Community health monitoring that provides signals, not diagnoses
            </p>
          </div>
          <button
            onClick={() => setShowEntry(!showEntry)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showEntry ? 'Cancel' : '+ Add Health Signal'}
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> This module provides public health signals, not clinical diagnoses.
            It monitors unusual patterns in community health to support early intervention.
          </p>
        </div>
      </div>

      {/* Entry Form */}
      {showEntry && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Report Health Signal</h2>
          <HealthSignalEntry onSuccess={handleSignalCreated} onCancel={() => setShowEntry(false)} />
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Signals</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalSignals}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Elevated Signals</div>
            <div className="text-3xl font-bold text-red-600">{stats.elevatedSignals}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Normal Signals</div>
            <div className="text-3xl font-bold text-green-600">{stats.normalSignals}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Areas with Risks</div>
            <div className="text-3xl font-bold text-orange-600">
              {Object.values(stats.signalsByArea || {}).filter(a => a.hasRisk).length}
            </div>
          </div>
        </div>
      )}

      {/* Area Summaries */}
      {stats && stats.signalsByArea && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Health Signals by Area</h2>
          <div className="space-y-4">
            {Object.entries(stats.signalsByArea).map(([areaId, area]) => (
              <HealthSignalWidget key={areaId} areaId={areaId} areaData={area} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600 mr-2">Time Period:</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            >
              <option value={1}>Today</option>
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">Level:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Levels</option>
              <option value="elevated">Elevated Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
        </div>

        {/* Signals List */}
        <h2 className="text-xl font-bold mb-4">Recent Signals</h2>
        <div className="space-y-3">
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getSignalIcon(signal.signalType)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{signal.areaName}</h3>
                      <p className="text-sm text-gray-600">{signal.signalTypeDisplay}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <span className="text-gray-600">Date:</span>{' '}
                      <span className="font-medium">{signal.signalDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Source:</span>{' '}
                      <span className="font-medium">{signal.sourceDisplay}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Reported by:</span>{' '}
                      <span className="font-medium">{signal.reportedBy || 'N/A'}</span>
                    </div>
                  </div>
                  {signal.notes && (
                    <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-3 rounded">
                      {signal.notes}
                    </p>
                  )}
                </div>
                <div className="ml-4">{getLevelBadge(signal.signalLevel)}</div>
              </div>
            </div>
          ))}
          {filteredSignals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No health signals found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
