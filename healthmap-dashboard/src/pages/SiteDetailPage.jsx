import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { assessmentApi, fileApi } from '../services/api';
import RiskBadge from '../components/RiskBadge';

function SiteDetailPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await assessmentApi.getById(id);
        setAssessment(response.data);
      } catch (err) {
        setError('Failed to load site details');
        console.error('Site detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Site not found'}
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: '#dc2626',
      HIGH: '#ea580c',
      MEDIUM: '#ca8a04',
      LOW: '#16a34a',
    };
    return colors[priority] || '#6b7280';
  };

  const indicators = [
    { label: 'Dust Present', value: assessment.dustPresent },
    { label: 'Old Materials', value: assessment.oldMaterials },
    { label: 'Near Population', value: assessment.nearPopulation },
    { label: 'Sewage Visible', value: assessment.sewageVisible },
    { label: 'Standing Water', value: assessment.standingWater },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/priorities" className="text-blue-600 hover:text-blue-800">
            ← Back to List
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Site #{assessment.id}</h1>
          <RiskBadge priority={assessment.priority} size="lg" />
        </div>
        <div className="text-sm text-gray-500">
          Created: {new Date(assessment.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Map and Location */}
        <div className="space-y-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Location</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={[assessment.latitude, assessment.longitude]}
                zoom={15}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                  center={[assessment.latitude, assessment.longitude]}
                  radius={15}
                  fillColor={getPriorityColor(assessment.priority)}
                  color={getPriorityColor(assessment.priority)}
                  weight={3}
                  opacity={1}
                  fillOpacity={0.6}
                />
              </MapContainer>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>
                <strong>Coordinates:</strong> {assessment.latitude.toFixed(6)}, {assessment.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Image */}
          {assessment.imagePath && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Site Photo</h2>
              <img
                src={fileApi.getUrl(assessment.imagePath)}
                alt="Site"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Risk Scores */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment</h2>

            <div className="space-y-4">
              {/* Overall Risk */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Overall Risk</span>
                  <span className="text-2xl font-bold" style={{ color: getPriorityColor(assessment.priority) }}>
                    {assessment.overallRisk}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all"
                    style={{
                      width: `${assessment.overallRisk}%`,
                      backgroundColor: getPriorityColor(assessment.priority),
                    }}
                  />
                </div>
              </div>

              {/* Asbestos Risk */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Asbestos Risk</span>
                  <span className="font-medium">{assessment.asbestosRisk}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-purple-600"
                    style={{ width: `${assessment.asbestosRisk}%` }}
                  />
                </div>
              </div>

              {/* Water Risk */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Water Contamination Risk</span>
                  <span className="font-medium">{assessment.waterRisk}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${assessment.waterRisk}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Site Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Site Information</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Site Type</dt>
                <dd className="font-medium">{assessment.siteType}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Building Age</dt>
                <dd className="font-medium">{assessment.buildingAge || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Material Type</dt>
                <dd className="font-medium">{assessment.materialType || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Assessed By</dt>
                <dd className="font-medium">{assessment.createdBy || 'Anonymous'}</dd>
              </div>
            </dl>
          </div>

          {/* Indicators */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Indicators</h2>
            <div className="grid grid-cols-2 gap-3">
              {indicators.map((indicator) => (
                <div
                  key={indicator.label}
                  className={`p-3 rounded-lg ${
                    indicator.value ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="mr-2">{indicator.value ? '⚠️' : '✓'}</span>
                  {indicator.label}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          {assessment.recommendation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Recommendation</h2>
              <p className="text-yellow-700">{assessment.recommendation}</p>
            </div>
          )}

          {/* Notes */}
          {assessment.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Notes</h2>
              <p className="text-gray-600">{assessment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SiteDetailPage;
