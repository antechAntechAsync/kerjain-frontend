import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

/**
 * Express Admin API client.
 * Base URL: http://localhost:3001/api/v1/admin
 */
const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:3001/api/v1/admin',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- Request interceptor: attach JWT token ----
adminClient.interceptors.request.use(
  (config) => {
    const adminToken = useAuthStore.getState().adminToken;
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response interceptor ----
adminClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      useAuthStore.getState().logoutAdmin();
      window.location.href = '/admin/login';
    }

    const apiError = new Error(data?.message || error.message);
    apiError.status = status;
    apiError.errorCode = data?.error_code;
    apiError.errors = data?.errors;
    apiError.data = data;

    return Promise.reject(apiError);
  },
);

export default adminClient;
