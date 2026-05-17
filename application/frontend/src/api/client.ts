import axios from 'axios';
import { toastStore } from '@/stores/toast';

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function deepCamelToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(deepCamelToSnake);
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[camelToSnake(key)] = deepCamelToSnake(value);
    }
    return result;
  }
  return obj;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
    config.data = deepCamelToSnake(config.data);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    if (error.response?.status && error.response.status !== 401 && error.response.status !== 422) {
      toastStore.add('error', message);
    }
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.config?.url, error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
