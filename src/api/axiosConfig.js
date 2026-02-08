import axios from 'axios';

// Base URL for the API
// In development, requests will be proxied through Vite (see vite.config.js)
// In production, you should set this to the full API URL
// const BASE_URL = 'https://alrajihy.com' ;
const BASE_URL = import.meta.env.PROD ? 'https://alrajihy.com' : '';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth data and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
      
      // Return error message from server or default message
      const errorMessage = data?.message || data?.error || 'An error occurred';
      const customError = new Error(errorMessage);
      customError.response = error.response;
      return Promise.reject(customError);
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred'));
    }
  }
);

export default axiosInstance;
