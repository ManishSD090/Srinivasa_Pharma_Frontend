<<<<<<< HEAD
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

// Add token automatically if stored
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
    
=======
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
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
