import apiClient from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: import('@/types').User;
    token: string;
  };
  error?: string;
}

export async function loginApi(payload: LoginPayload) {
  await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function registerApi(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function meApi() {
  const { data } = await apiClient.get<{ success: boolean; data: import('@/types').User }>(
    '/auth/me',
  );
  return data;
}

export async function logoutApi() {
  const { data } = await apiClient.post<{ success: boolean }>('/auth/logout');
  return data;
}
