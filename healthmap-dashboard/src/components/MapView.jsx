import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import { FaLungs, FaPills } from 'react-icons/fa';
import { MdWarning, MdSpa } from 'react-icons/md';

function MapView({ assessments = [], healthSignals = [], center = [31.5, 34.45], zoom = 10 }) {
  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: '#dc2626',
      HIGH: '#ea580c',
      MEDIUM: '#ca8a04',
      LOW: '#16a34a',
    };
    return colors[priority] || '#6b7280';
  };

  const getRadius = (priority) => {
    const sizes = {
      CRITICAL: 12,
      HIGH: 10,
      MEDIUM: 8,
      LOW: 6,
    };
    return sizes[priority] || 6;
  };

  const getHealthSignalColor = (type, level) => {
    if (level !== 'ELEVATED') return '#22c55e'; // green for normal
    
    const colors = {
      RESPIRATORY: '#dc2626', // red
      GASTROINTESTINAL: '#ea580c', // orange
      SKIN: '#eab308', // yellow
    };
    return colors[type] || '#6b7280';
  };

  const getHealthSignalIcon = (type) => {
    const iconProps = { size: 12, color: 'white' };
    switch(type) {
      case 'RESPIRATORY':
        return <FaLungs {...iconProps} />;
      case 'GASTROINTESTINAL':
        return <FaPills {...iconProps} />;
      case 'SKIN':
        return <MdSpa {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {assessments?.map((assessment) => (
        <CircleMarker
          key={assessment.id}
          center={[assessment.latitude, assessment.longitude]}
          radius={getRadius(assessment.priority)}
          fillColor={getPriorityColor(assessment.priority)}
          color={getPriorityColor(assessment.priority)}
          weight={2}
          opacity={0.8}
          fillOpacity={0.6}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Site #{assessment.id}</span>
                <RiskBadge priority={assessment.priority} size="sm" />
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Type:</strong> {assessment.siteType}</p>
                <p><strong>Risk Score:</strong> {assessment.overallRisk}/100</p>
                <p><strong>Asbestos Risk:</strong> {assessment.asbestosRisk}/100</p>
                <p><strong>Water Risk:</strong> {assessment.waterRisk}/100</p>
                {assessment.notes && (
                  <p className="text-gray-600 italic truncate">
                    {assessment.notes.substring(0, 50)}...
                  </p>
                )}
              </div>
              <Link
                to={`/site/${assessment.id}`}
                className="mt-3 block text-center bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      
      {/* Health Signal Markers */}
      {healthSignals?.map((signal) => (
        <CircleMarker
          key={`health-${signal.id}`}
          center={[signal.latitude || center[0], signal.longitude || center[1]]}
          radius={8}
          fillColor={getHealthSignalColor(signal.signalType, signal.signalLevel)}
          color={signal.signalLevel === 'ELEVATED' ? '#991b1b' : '#166534'}
          weight={2}
          opacity={1}
          fillOpacity={0.7}
          className={signal.signalLevel === 'ELEVATED' ? 'pulse-marker' : ''}
        >
          <Popup>
            <div className="p-2 min-w-[220px]">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-full ${
                  signal.signalType === 'RESPIRATORY' ? 'bg-red-100' :
                  signal.signalType === 'GASTROINTESTINAL' ? 'bg-orange-100' :
                  'bg-yellow-100'
                }`}>
                  {getHealthSignalIcon(signal.signalType)}
                </div>
                <div>
                  <span className="font-bold text-sm">Health Signal</span>
                  {signal.signalLevel === 'ELEVATED' && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <MdWarning size={12} />
                      <span>Elevated</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Area:</strong> {signal.areaName || 'Unknown'}</p>
                <p><strong>Type:</strong> {
                  signal.signalType === 'RESPIRATORY' ? 'Respiratory' :
                  signal.signalType === 'GASTROINTESTINAL' ? 'Gastrointestinal' :
                  'Skin'
                }</p>
                <p><strong>Level:</strong> 
                  <span className={signal.signalLevel === 'ELEVATED' ? 'text-red-600 font-semibold' : 'text-green-600'}>
                    {' '}{signal.signalLevel === 'ELEVATED' ? 'Elevated' : 'Normal'}
                  </span>
                </p>
                <p><strong>Date:</strong> {signal.signalDate || new Date(signal.createdAt).toLocaleDateString()}</p>
                {signal.notes && (
                  <p className="text-gray-600 italic text-xs mt-2 border-t pt-2">
                    {signal.notes}
                  </p>
                )}
              </div>
              {signal.signalLevel === 'ELEVATED' && (
                <div className="mt-3 p-2 bg-orange-50 border-l-2 border-orange-500 text-xs">
                  <strong>Action Required:</strong> Monitor area closely and investigate potential environmental links
                </div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default MapView;
