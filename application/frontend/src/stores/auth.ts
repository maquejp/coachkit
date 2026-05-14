import { create } from 'zustand';
import i18n from 'i18next';
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
    if (user.language) {
      void i18n.changeLanguage(user.language);
    }
    set({ user, token, isLoading: false });
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
