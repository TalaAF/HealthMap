import { useState, useEffect } from 'react';
import { assessmentApi, healthSignalApi, statsApi } from '../services/api';
import { MdDownload, MdPictureAsPdf, MdTableChart, MdRefresh } from 'react-icons/md';

export default function ReportsPage() {
  const [assessments, setAssessments] = useState([]);
  const [healthSignals, setHealthSignals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assessmentsRes, healthRes, statsRes] = await Promise.all([
        assessmentApi.getAll(),
        healthSignalApi.getAll().catch(() => ({ data: [] })),
        statsApi.getStats(),
      ]);
      setAssessments(assessmentsRes.data);
      setHealthSignals(healthRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAssessmentsCSV = () => {
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

    const rows = assessments.map((a) => [
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
    downloadFile(csv, `healthmap-assessments-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const exportHealthSignalsCSV = () => {
    const headers = [
      'ID',
      'Area Name',
      'Signal Type',
      'Signal Level',
      'Latitude',
      'Longitude',
      'Notes',
      'Signal Date',
      'Created At',
    ];

    const rows = healthSignals.map((s) => [
      s.id,
      s.areaName || 'N/A',
      s.signalType,
      s.signalLevel,
      s.latitude || '',
      s.longitude || '',
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      s.signalDate || '',
      s.createdAt,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csv, `healthmap-health-signals-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const exportSummaryReport = () => {
    const criticalSites = assessments.filter(a => a.priority === 'CRITICAL').length;
    const highSites = assessments.filter(a => a.priority === 'HIGH').length;
    const elevatedSignals = healthSignals.filter(s => s.signalLevel === 'ELEVATED').length;

    const report = `
HEALTHMAP SUMMARY REPORT
Generated: ${new Date().toLocaleString()}
======================================

SITE ASSESSMENTS
----------------
Total Sites Assessed: ${assessments.length}
Critical Priority: ${criticalSites}
High Priority: ${highSites}
Medium Priority: ${assessments.filter(a => a.priority === 'MEDIUM').length}
Low Priority: ${assessments.filter(a => a.priority === 'LOW').length}

Average Risk Scores:
- Asbestos Risk: ${stats?.averageAsbestosRisk?.toFixed(1) || 0}%
- Water Risk: ${stats?.averageWaterRisk?.toFixed(1) || 0}%
- Overall Risk: ${stats?.averageOverallRisk?.toFixed(1) || 0}%

HEALTH SIGNALS
--------------
Total Health Signals: ${healthSignals.length}
Elevated Signals: ${elevatedSignals}
Normal Signals: ${healthSignals.filter(s => s.signalLevel === 'NORMAL').length}

Breakdown by Type:
- Respiratory: ${healthSignals.filter(s => s.signalType === 'RESPIRATORY').length}
- Gastrointestinal: ${healthSignals.filter(s => s.signalType === 'GASTROINTESTINAL').length}
- Skin: ${healthSignals.filter(s => s.signalType === 'SKIN').length}

CRITICAL SITES REQUIRING IMMEDIATE ATTENTION
---------------------------------------------
${assessments.filter(a => a.priority === 'CRITICAL').map(a => 
  `Site #${a.id} - ${a.siteType} - Risk: ${a.overallRisk}% - Location: (${a.latitude.toFixed(4)}, ${a.longitude.toFixed(4)})`
).join('\n') || 'None'}

======================================
End of Report
`;

    downloadFile(report, `healthmap-summary-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
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

  const criticalCount = assessments.filter(a => a.priority === 'CRITICAL').length;
  const elevatedCount = healthSignals.filter(s => s.signalLevel === 'ELEVATED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download reports</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MdRefresh />
          Refresh Data
        </button>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Available Reports</h3>
          <p className="text-3xl font-bold text-blue-600">3</p>
          <p className="text-sm text-gray-500 mt-1">Export formats available</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Records</h3>
          <p className="text-3xl font-bold text-gray-900">{assessments.length + healthSignals.length}</p>
          <p className="text-sm text-gray-500 mt-1">{assessments.length} assessments, {healthSignals.length} signals</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Alerts</h3>
          <p className="text-3xl font-bold text-red-600">{criticalCount + elevatedCount}</p>
          <p className="text-sm text-gray-500 mt-1">{criticalCount} critical sites, {elevatedCount} elevated signals</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setReportType('summary')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              reportType === 'summary' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <MdTableChart className="text-2xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Summary Report</h3>
            <p className="text-sm text-gray-600 mt-1">Overview of all data with key metrics</p>
          </button>
          <button
            onClick={() => setReportType('assessments')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              reportType === 'assessments' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <MdTableChart className="text-2xl text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Site Assessments</h3>
            <p className="text-sm text-gray-600 mt-1">Detailed environmental assessment data</p>
          </button>
          <button
            onClick={() => setReportType('health')}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              reportType === 'health' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <MdTableChart className="text-2xl text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Health Signals</h3>
            <p className="text-sm text-gray-600 mt-1">Community health signal records</p>
          </button>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Report</h2>
        
        {reportType === 'summary' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Summary Report (TXT)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete overview including site assessments, health signals, and critical alerts
              </p>
              <button
                onClick={exportSummaryReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MdDownload />
                Download TXT Report
              </button>
            </div>
          </div>
        )}

        {reportType === 'assessments' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Site Assessments (CSV)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Exportable data for {assessments.length} site assessments with all risk scores
              </p>
              <button
                onClick={exportAssessmentsCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <MdDownload />
                Download CSV
              </button>
            </div>
          </div>
        )}

        {reportType === 'health' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Health Signals (CSV)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Community health signal data for {healthSignals.length} records
              </p>
              <button
                onClick={exportHealthSignalsCSV}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <MdDownload />
                Download CSV
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Preview</h2>
        
        {reportType === 'summary' && (
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <div className="space-y-2 text-gray-800">
              <p className="font-bold">HEALTHMAP SUMMARY REPORT</p>
              <p>Generated: {new Date().toLocaleString()}</p>
              <p className="border-t pt-2 mt-2">Total Sites: {assessments.length}</p>
              <p>Critical Sites: {criticalCount}</p>
              <p>Health Signals: {healthSignals.length}</p>
              <p>Elevated Signals: {elevatedCount}</p>
              <p className="text-gray-600 mt-4">...and more details</p>
            </div>
          </div>
        )}

        {reportType === 'assessments' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Site Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Risk Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-2 text-sm">#{a.id}</td>
                    <td className="px-4 py-2 text-sm">{a.siteType}</td>
                    <td className="px-4 py-2 text-sm">{a.overallRisk}</td>
                    <td className="px-4 py-2 text-sm">{a.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2">Showing 5 of {assessments.length} records</p>
          </div>
        )}

        {reportType === 'health' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Area</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthSignals.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2 text-sm">#{s.id}</td>
                    <td className="px-4 py-2 text-sm">{s.areaName || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm">{s.signalType}</td>
                    <td className="px-4 py-2 text-sm">{s.signalLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2">Showing 5 of {healthSignals.length} records</p>
          </div>
        )}
      </div>
    </div>
  );
}
