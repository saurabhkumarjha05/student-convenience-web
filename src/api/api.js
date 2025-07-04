import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔁 Update to your deployed URL when going live
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token from localStorage to Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🛡️ Optional: Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Auth error: Unauthorized or Forbidden');
      // Optional: logout user or redirect to login
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
