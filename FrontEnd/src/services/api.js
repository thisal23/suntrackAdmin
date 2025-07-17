import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  getProfile: () => api.get('/auth/profile'),
};

export const fleetManagerService = {
  getAll: (params) => api.get('/fleet-managers', { params }),
  getById: (id) => api.get(`/fleet-managers/${id}`),
  create: (data) => api.post('/auth/register/fleet-manager', data),
  update: (id, data) => api.put(`/fleet-managers/${id}`, data),
  delete: (id) => api.delete(`/fleet-managers/${id}`),
};

export default api;
