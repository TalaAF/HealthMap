export default function HealthSignalWidget({ areaId, areaData }) {
  const hasElevated = areaData.hasRisk;

  return (
    <div
      className={`border rounded-lg p-4 ${
        hasElevated ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{areaData.areaName}</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {/* Respiratory */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🔴</span>
              <div>
                <div className="text-xs text-gray-600">Respiratory</div>
                <div
                  className={`font-semibold ${
                    areaData.respiratoryElevated > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {areaData.respiratoryElevated > 0 ? 'Elevated' : 'Normal'}
                </div>
              </div>
            </div>

            {/* Gastrointestinal */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🟠</span>
              <div>
                <div className="text-xs text-gray-600">Gastrointestinal</div>
                <div
                  className={`font-semibold ${
                    areaData.gastrointestinalElevated > 0 ? 'text-orange-600' : 'text-green-600'
                  }`}
                >
                  {areaData.gastrointestinalElevated > 0 ? 'Elevated' : 'Normal'}
                </div>
              </div>
            </div>

            {/* Skin */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🟡</span>
              <div>
                <div className="text-xs text-gray-600">Skin</div>
                <div
                  className={`font-semibold ${
                    areaData.skinElevated > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}
                >
                  {areaData.skinElevated > 0 ? 'Elevated' : 'Normal'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Badge */}
        <div>
          {hasElevated ? (
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
              ⚠️ Health Risk Detected
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
              ✅ All Normal
            </span>
          )}
        </div>
      </div>

      {/* Total Signals */}
      <div className="mt-3 text-xs text-gray-600">
        Total signals: {areaData.totalSignals}
      </div>

      {/* Recommendations */}
      {hasElevated && (
        <div className="mt-3 bg-white rounded p-3 text-sm border-l-4 border-red-500">
          <div className="font-semibold text-red-900 mb-1">⚠️ Recommended Actions:</div>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {areaData.respiratoryElevated > 0 && (
              <li>Check for nearby debris sites and dust exposure</li>
            )}
            {areaData.gastrointestinalElevated > 0 && (
              <li>Test water sources for contamination</li>
            )}
            {areaData.skinElevated > 0 && (
              <li>Assess hygiene facilities and water quality</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
