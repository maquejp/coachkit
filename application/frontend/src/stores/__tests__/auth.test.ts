import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';

const mockUser: User = {
  id: 'user-001',
  email: 'test@example.com',
  role: 'customer',
  emailVerifiedAt: '2025-01-01T00:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ user: null, token: null, isLoading: false });
});

describe('authStore', () => {
  it('initialises with no user and not loading', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('read token from localStorage on creation', () => {
    localStorage.setItem('auth_token', 'stored-token');
    const store = useAuthStore.getState();
    expect(store.token).toBeNull();
    useAuthStore.setState({ token: localStorage.getItem('auth_token') });
    const updated = useAuthStore.getState();
    expect(updated.token).toBe('stored-token');
  });

  it('setAuth sets user, token, and persists to localStorage', () => {
    const store = useAuthStore.getState();
    store.setAuth(mockUser, 'token-123');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('token-123');
    expect(state.isLoading).toBe(false);
    expect(localStorage.getItem('auth_token')).toBe('token-123');
  });

  it('clearAuth clears user, token, and removes from localStorage', () => {
    useAuthStore.getState().setAuth(mockUser, 'token-123');

    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('setLoading sets loading state', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
