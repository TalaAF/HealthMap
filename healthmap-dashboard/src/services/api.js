import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assessment endpoints
export const assessmentApi = {
  getAll: () => api.get('/api/assessments'),
  getById: (id) => api.get(`/api/assessments/${id}`),
  create: (data) => api.post('/api/assessments', data),
  update: (id, data) => api.put(`/api/assessments/${id}`, data),
  delete: (id) => api.delete(`/api/assessments/${id}`),
  getPriorities: () => api.get('/api/assessments/priorities'),
  getRecent: () => api.get('/api/assessments/recent'),
  getGeoJson: () => api.get('/api/assessments/geojson'),
};

// Stats endpoints
export const statsApi = {
  getStats: () => api.get('/api/stats'),
  getRiskDistribution: () => api.get('/api/stats/risk-distribution'),
};

// File endpoints
export const fileApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getUrl: (filename) => `${API_BASE_URL}/api/files/${filename}`,
};

// Health Signal endpoints
export const healthSignalApi = {
  getAll: () => api.get('/api/health-signals'),
  getById: (id) => api.get(`/api/health-signals/${id}`),
  create: (data) => api.post('/api/health-signals', data),
  delete: (id) => api.delete(`/api/health-signals/${id}`),
  getRecent: (days = 7) => api.get(`/api/health-signals/recent?days=${days}`),
  getByArea: (areaId) => api.get(`/api/health-signals/area/${areaId}`),
  getStats: () => api.get('/api/health-signals/stats'),
};

export default api;
