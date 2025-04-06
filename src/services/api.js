import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://crm-backend-0yc3.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Lead APIs
export const leadAPI = {
  getAllLeads: () => api.get('/leads'),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (leadData) => api.post('/leads', leadData),
  updateLead: (id, leadData) => api.put(`/leads/${id}`, leadData),
  updateLeadStatus: (id, statusData) => api.patch(`/leads/status/${id}`, statusData),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  getConnectedCalls: () => api.get('/leads/connected'),
};

// Telecaller APIs
export const telecallerAPI = {
  getAllTelecallers: () => api.get('/telecallers'),
  getTelecaller: (id) => api.get(`/telecallers/${id}`),
  getTelecallerActivities: (id) => api.get(`/telecallers/${id}/activities`),
  updateTelecallerStatus: (id, status) => api.patch(`/telecallers/${id}/status`, { status }),
};

// Dashboard APIs
export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard/metrics'),
  getCallTrends: () => api.get('/dashboard/call-trends'),
  getRecentCalls: () => api.get('/dashboard/recent-calls'),
};

export default api; 