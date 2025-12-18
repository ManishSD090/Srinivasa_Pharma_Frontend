import axios from 'axios';

// Create an axios instance
const api = axios.create({
  // Use environment variable for the URL (Best Practice)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically add the Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming you store JWT in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Handle Global Errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto-logout if token is expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;