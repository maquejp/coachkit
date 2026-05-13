import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ProfilePage from '@/customer/ProfilePage';
import { useAuthStore } from '@/stores/auth';
import type { CustomerUser } from '@/types';

const mockUser: CustomerUser = {
  id: 'user-002',
  email: 'alice@example.test',
  role: 'customer',
  firstName: 'Alice',
  lastName: 'Johnson',
  phone: '+1-555-0102',
  avatarUrl: null,
  emailVerifiedAt: '2025-01-15T00:00:00Z',
  createdAt: '2025-01-10T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

const server = setupServer(
  http.put('/api/profile', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ success: true, data: { ...mockUser, ...body } });
  }),
  http.put('/api/profile/password', async () => {
    return HttpResponse.json({ success: true, data: null });
  }),
  http.delete('/api/profile', async () => {
    return HttpResponse.json({ success: true, data: null });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  useAuthStore.setState({ user: null, token: null, isLoading: false });
});
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
    });
  });

  it('renders page title', () => {
    renderPage();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('pre-fills form with user data', () => {
    renderPage();
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Johnson')).toBeInTheDocument();
    expect(screen.getByDisplayValue('alice@example.test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1-555-0102')).toBeInTheDocument();
  });

  it('updates profile on save', async () => {
    renderPage();
    const firstNameInput = screen.getByLabelText('First Name');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Alicia');
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => {
      expect(screen.getByText('Profile updated.')).toBeInTheDocument();
    });
  });

  it('shows password error when passwords do not match', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText('New Password'), 'newpass123');
    await userEvent.type(screen.getByLabelText('Confirm New Password'), 'different');
    await userEvent.click(screen.getByRole('button', { name: 'Update Password' }));
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });

  it('shows password error when too short', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText('New Password'), 'ab');
    await userEvent.type(screen.getByLabelText('Confirm New Password'), 'ab');
    await userEvent.click(screen.getByRole('button', { name: 'Update Password' }));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    });
  });

  it('opens delete account modal', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
    await waitFor(() => {
      expect(
        screen.getByText((c) => c.includes('Are you sure you want to delete')),
      ).toBeInTheDocument();
    });
  });

  it('shows danger zone section', () => {
    renderPage();
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
  });
});
