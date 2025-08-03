import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Request interceptor for dual auth tokens
api.interceptors.request.use(config => {
  const isAdminRequest = config.url?.startsWith('/admin');
  
  // Skip auth header for login requests
  if (config.url?.endsWith('/login')) return config;

  const token = isAdminRequest
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const isAdminRequest = error.config.url?.startsWith('/admin');
      
      if (isAdminRequest) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
