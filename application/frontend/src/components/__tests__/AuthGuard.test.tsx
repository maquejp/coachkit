import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthGuard from '@/components/AuthGuard';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const { mockAuthStore } = vi.hoisted(() => ({
  mockAuthStore: {
    token: null as string | null,
    user: null as Record<string, unknown> | null,
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
  },
}));
vi.mock('@/stores/auth', () => ({
  useAuthStore: (sel: (s: typeof mockAuthStore) => unknown) => sel(mockAuthStore),
}));

const { meApiImpl } = vi.hoisted(() => ({ meApiImpl: vi.fn() }));
vi.mock('@/api/auth', () => ({ meApi: meApiImpl }));
vi.mock('@/components/ui/Spinner', () => ({
  Spinner: ({ centered, size }: Record<string, unknown>) => (
    <div data-testid="spinner" data-centered={centered} data-size={size} />
  ),
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.token = null;
    mockAuthStore.user = null;
    meApiImpl.mockReset();
  });

  it('navigates to login when no token', () => {
    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected</div>
        </AuthGuard>
      </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('renders spinner when token present but no user', async () => {
    mockAuthStore.token = 'test-token';
    meApiImpl.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected</div>
        </AuthGuard>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders children when token and user present', () => {
    mockAuthStore.token = 'test-token';
    mockAuthStore.user = { id: '1', role: 'admin' };
    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected</div>
        </AuthGuard>
      </MemoryRouter>,
    );
    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('returns null when no token', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected</div>
        </AuthGuard>
      </MemoryRouter>,
    );
    expect(container.innerHTML).toBe('');
  });
});
