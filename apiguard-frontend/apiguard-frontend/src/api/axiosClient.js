import axios from 'axios';

/**
 * Central Axios instance. Every request automatically gets the JWT
 * (if the user is logged in) attached as a Bearer token.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('apiguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired/invalid — clear session so ProtectedRoute redirects to login
      localStorage.removeItem('apiguard_token');
      localStorage.removeItem('apiguard_user');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
