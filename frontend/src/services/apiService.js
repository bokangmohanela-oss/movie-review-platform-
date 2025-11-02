import axios from 'axios';

// Create axios instance with base configuration - NO AUTHENTICATION
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// NO request interceptor - no authentication tokens

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 500) {
      // Server error
      console.error('Server error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout');
    } else if (!error.response) {
      // Network error
      console.error('Network error - check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;