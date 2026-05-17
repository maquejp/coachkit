import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from '@/components/Sidebar';

const { mockUser, mockPathname } = vi.hoisted(() => ({
  mockUser: { role: 'admin' as string | null, id: '1' },
  mockPathname: { value: '/admin' },
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: (sel: (s: unknown) => unknown) => sel({ user: mockUser }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useLocation: () => ({ pathname: mockPathname.value }) };
});

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    mockUser.role = 'admin';
    mockPathname.value = '/admin';
  });

  it('renders admin items for admin role', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders collapsed toggle button', () => {
    renderSidebar();
    const toggleBtn = document.querySelector('button');
    expect(toggleBtn).toBeTruthy();
  });

  it('shows customer items for customer role', () => {
    mockUser.role = 'customer';
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
    expect(screen.getByText('My Subscription')).toBeInTheDocument();
  });

  it('shows management child links when group is open', () => {
    renderSidebar();
    expect(screen.getByText('Classes')).toBeInTheDocument();
    expect(screen.getByText('Instructors')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('toggles management group on click', async () => {
    const user = userEvent.setup();
    renderSidebar();
    const buttons = screen.getAllByText('Management');
    await user.click(buttons[0]);
    await waitFor(() => {
      expect(screen.queryByText('Classes')).toBeNull();
    });
  });

  it('highlights active link', () => {
    renderSidebar();
    const activeLinks = document.querySelectorAll('.bg-primary-50');
    expect(activeLinks.length).toBeGreaterThanOrEqual(1);
  });
});
