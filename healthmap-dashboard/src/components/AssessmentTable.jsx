import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import { FaLungs, FaPills } from 'react-icons/fa';
import { MdCheckCircle, MdSpa } from 'react-icons/md';

function AssessmentTable({ assessments, showAll = false, healthSignals = [] }) {
  const displayAssessments = showAll ? assessments : assessments?.slice(0, 10);

  if (!displayAssessments || displayAssessments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No assessments found
      </div>
    );
  }

  // Map health signals by area/location
  const getHealthSignalForAssessment = (assessment) => {
    return healthSignals.find(signal => 
      signal.areaId === assessment.id || 
      (signal.latitude && Math.abs(signal.latitude - assessment.latitude) < 0.01 &&
       signal.longitude && Math.abs(signal.longitude - assessment.longitude) < 0.01)
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCoordinates = (lat, lng) => {
    return `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Score
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Health Signal
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayAssessments.map((assessment) => {
            const healthSignal = getHealthSignalForAssessment(assessment);
            
            return (
            <tr key={assessment.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                #{assessment.id}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatCoordinates(assessment.latitude, assessment.longitude)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                  {assessment.siteType}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        assessment.overallRisk >= 70
                          ? 'bg-red-600'
                          : assessment.overallRisk >= 50
                          ? 'bg-orange-500'
                          : assessment.overallRisk >= 30
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${assessment.overallRisk}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{assessment.overallRisk}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <RiskBadge priority={assessment.priority} size="sm" />
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {healthSignal ? (
                  <div className="flex items-center gap-2">
                    {healthSignal.signalType === 'RESPIRATORY' && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                        healthSignal.signalLevel === 'ELEVATED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <FaLungs size={12} />
                        <span className="text-xs font-medium">Resp</span>
                      </div>
                    )}
                    {healthSignal.signalType === 'GASTROINTESTINAL' && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                        healthSignal.signalLevel === 'ELEVATED' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <FaPills size={12} />
                        <span className="text-xs font-medium">GI</span>
                      </div>
                    )}
                    {healthSignal.signalType === 'SKIN' && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                        healthSignal.signalLevel === 'ELEVATED' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <MdSpa size={12} />
                        <span className="text-xs font-medium">Skin</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <MdCheckCircle size={14} />
                    <span>Normal</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(assessment.createdAt)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <Link
                  to={`/site/${assessment.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

export default AssessmentTable;
