import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

/**
 * Laravel API client (Student + Professional endpoints).
 * Base URL: http://localhost:8000/api/v1
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- Request interceptor: attach Bearer token ----
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response interceptor: handle common errors ----
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      // Token expired or invalid → force logout
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }

    // Enrich error with API details
    const apiError = new Error(data?.message || error.message);
    apiError.status = status;
    apiError.errorCode = data?.error_code;
    apiError.errors = data?.errors;
    apiError.data = data;

    return Promise.reject(apiError);
  },
);

export default client;
