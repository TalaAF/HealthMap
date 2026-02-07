import { useState } from 'react';
import { healthSignalApi } from '../services/api';

export default function HealthSignalEntry({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    areaId: '',
    areaName: '',
    signalDate: new Date().toISOString().split('T')[0],
    signalType: 'RESPIRATORY',
    signalLevel: 'NORMAL',
    source: 'CLINIC',
    notes: '',
    latitude: '',
    longitude: '',
    reportedBy: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate area ID from area name
    if (name === 'areaName') {
      const areaId = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      setFormData(prev => ({ ...prev, areaId }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.areaName || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await healthSignalApi.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating health signal:', err);
      setError('Failed to create health signal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Area Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area / Neighborhood *
          </label>
          <input
            type="text"
            name="areaName"
            value={formData.areaName}
            onChange={handleChange}
            required
            placeholder="e.g., Al-Shifa District"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Signal Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="signalDate"
            value={formData.signalDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Signal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Signal Type *
          </label>
          <select
            name="signalType"
            value={formData.signalType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="RESPIRATORY">🔴 Respiratory (Cough, breathing difficulties)</option>
            <option value="GASTROINTESTINAL">🟠 Gastrointestinal (Diarrhea, stomach issues)</option>
            <option value="SKIN">🟡 Skin (Rashes, infections)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {formData.signalType === 'RESPIRATORY' && 'Often related to: Dust, debris, old materials'}
            {formData.signalType === 'GASTROINTESTINAL' && 'Often related to: Contaminated water, sewage'}
            {formData.signalType === 'SKIN' && 'Often related to: Water contamination, hygiene'}
          </p>
        </div>

        {/* Signal Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level Compared to Normal *
          </label>
          <select
            name="signalLevel"
            value={formData.signalLevel}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="NORMAL">🟢 Normal (Usual levels)</option>
            <option value="ELEVATED">🔴 Elevated (Higher than usual)</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source *
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="CLINIC">Clinic</option>
            <option value="FIELD_TEAM">Field Team</option>
            <option value="MOBILE_UNIT">Mobile Unit</option>
            <option value="ORGANIZATION">Organization</option>
          </select>
        </div>

        {/* Reported By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reported By
          </label>
          <input
            type="text"
            name="reportedBy"
            value={formData.reportedBy}
            onChange={handleChange}
            placeholder="e.g., Dr. Ahmad, Nurse Fatima"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            placeholder="e.g., 31.5152"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            placeholder="e.g., 34.4431"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Additional observations or context..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {submitting ? 'Submitting...' : '✅ Submit Health Signal'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Estimated Time */}
      <p className="text-xs text-gray-500 text-center">
        ⏱️ Estimated time: Less than 30 seconds
      </p>
    </form>
  );
}
