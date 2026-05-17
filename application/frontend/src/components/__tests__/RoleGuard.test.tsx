import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoleGuard from '@/components/RoleGuard';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const { mockAuthStore } = vi.hoisted(() => ({
  mockAuthStore: {
    token: 'test' as string | null,
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

describe('RoleGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.token = 'test';
    mockAuthStore.user = null;
    meApiImpl.mockReset();
  });

  it('renders spinner when token present and no user', () => {
    meApiImpl.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <RoleGuard role="admin">
          <div>Admin Content</div>
        </RoleGuard>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders children when user has matching role', () => {
    mockAuthStore.user = { id: '1', role: 'admin' };
    render(
      <MemoryRouter>
        <RoleGuard role="admin">
          <div>Admin Content</div>
        </RoleGuard>
      </MemoryRouter>,
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('navigates home when user has wrong role', () => {
    mockAuthStore.user = { id: '1', role: 'customer' };
    render(
      <MemoryRouter>
        <RoleGuard role="admin">
          <div>Admin Content</div>
        </RoleGuard>
      </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('navigates to login when no token', () => {
    mockAuthStore.token = null;
    render(
      <MemoryRouter>
        <RoleGuard role="admin">
          <div>Admin Content</div>
        </RoleGuard>
      </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('returns null when token is null', () => {
    mockAuthStore.token = null;
    const { container } = render(
      <MemoryRouter>
        <RoleGuard role="admin">
          <div>Admin Content</div>
        </RoleGuard>
      </MemoryRouter>,
    );
    expect(container.innerHTML).toBe('');
  });
});
