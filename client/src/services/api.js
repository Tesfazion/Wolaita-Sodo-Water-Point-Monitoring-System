/**
 * API Service
 * Centralized API calls for the application
 */

import axios from 'axios';

const API_BASE = '/api';

// ===== Water Points API =====
export const waterPointsAPI = {
  getAll: (params = {}) => axios.get(`${API_BASE}/water-points`, { params }),
  getById: (id) => axios.get(`${API_BASE}/water-points/${id}`),
  getNearby: (lat, lng, radius) => 
    axios.get(`${API_BASE}/water-points/nearby/${lat}/${lng}`, { params: { radius } }),
  create: (data) => axios.post(`${API_BASE}/admin/water-points`, data),
  update: (id, data) => axios.put(`${API_BASE}/admin/water-points/${id}`, data)
};

// ===== Reports API =====
export const reportsAPI = {
  getAll: (params = {}) => axios.get(`${API_BASE}/reports`, { params }),
  getById: (id) => axios.get(`${API_BASE}/reports/${id}`),
  trackReport: (id) => axios.get(`${API_BASE}/reports/${id}`),
  submit: (formData) => axios.post(`${API_BASE}/reports`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  confirm: (id, data) => axios.post(`${API_BASE}/reports/${id}/confirm`, data),
  updateStatus: (id, data) => axios.put(`${API_BASE}/admin/reports/${id}/status`, data)
};

// ===== Admin API =====
export const adminAPI = {
  getReports: (params = {}) => axios.get(`${API_BASE}/admin/reports`, { params }),
  getTechnicians: () => axios.get(`${API_BASE}/admin/technicians`),
  getOffices: () => axios.get(`${API_BASE}/admin/offices`),
  getMyTasks: () => axios.get(`${API_BASE}/admin/my-tasks`)
};

// ===== Analytics API =====
export const analyticsAPI = {
  getDashboard: () => axios.get(`${API_BASE}/analytics/dashboard`),
  getPerformance: () => axios.get(`${API_BASE}/analytics/performance`),
  getMapData: () => axios.get(`${API_BASE}/analytics/map-data`)
};

// ===== Auth API =====
export const authAPI = {
  login: (credentials) => axios.post(`${API_BASE}/auth/login`, credentials),
  getProfile: () => axios.get(`${API_BASE}/auth/me`),
  changePassword: (data) => axios.post(`${API_BASE}/auth/change-password`, data)
};

const api = {
  waterPoints: waterPointsAPI,
  reports: reportsAPI,
  admin: adminAPI,
  analytics: analyticsAPI,
  auth: authAPI
};

export default api;
