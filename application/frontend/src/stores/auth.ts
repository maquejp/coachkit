import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: false,
  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    set({ user, token, isLoading: false });
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
