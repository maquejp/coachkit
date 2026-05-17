import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth';
import { loginApi, registerApi, logoutApi, meApi } from '@/api/auth';
import type { LoginPayload, RegisterPayload } from '@/api/auth';

interface UseAuthResult {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const res = await loginApi(payload);
        setAuth(res.data.user, res.data.token);
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        const res = await registerApi(payload);
        setAuth(res.data.user, res.data.token);
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore — clear auth regardless
    }
    clearAuth();
  }, [clearAuth]);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await meApi();
      setAuth(res.data, token);
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, token]);

  return { user, token, isLoading, login, register, logout, fetchMe };
}
