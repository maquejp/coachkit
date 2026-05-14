import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import DashboardPage from '@/customer/DashboardPage';
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
  http.get('/api/bookings', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    return HttpResponse.json({
      success: true,
      data:
        userId === 'user-002'
          ? [
              {
                id: 'bkg-001',
                userId: 'user-002',
                guestEmail: null,
                classTypeId: 'ct-001',
                scheduleId: 'ws-001',
                date: '2025-05-12',
                status: 'confirmed',
                createdAt: '2025-05-10T08:00:00Z',
                updatedAt: '2025-05-10T08:00:00Z',
              },
              {
                id: 'bkg-002',
                userId: 'user-002',
                guestEmail: null,
                classTypeId: 'ct-002',
                scheduleId: 'ws-002',
                date: '2025-05-12',
                status: 'confirmed',
                createdAt: '2025-05-10T08:05:00Z',
                updatedAt: '2025-05-10T08:05:00Z',
              },
            ]
          : [],
    });
  }),

  http.get('/api/customer-subscriptions', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    return HttpResponse.json({
      success: true,
      data:
        userId === 'user-002'
          ? [
              {
                id: 'cs-001',
                userId: 'user-002',
                planId: 'sp-002',
                status: 'active',
                startDate: '2025-02-01T00:00:00Z',
                endDate: null,
                trialEnd: '2025-02-08T00:00:00Z',
                sessionsUsed: 15,
                sessionsLimit: null,
                createdAt: '2025-02-01T00:00:00Z',
                updatedAt: '2025-02-01T00:00:00Z',
              },
            ]
          : [],
    });
  }),

  http.get('/api/point-card-purchases', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    return HttpResponse.json({
      success: true,
      data:
        userId === 'user-002'
          ? [
              {
                id: 'pc-001',
                userId: 'user-002',
                planId: 'pcp-002',
                sessionsRemaining: 7,
                expiresAt: '2025-09-27T00:00:00Z',
                purchasedAt: '2025-03-30T00:00:00Z',
              },
            ]
          : [],
    });
  }),

  http.get('/api/subscription-plans', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'sp-002',
          name: 'Monthly Unlimited',
          description: 'Unlimited classes every month.',
          priceCents: 9900,
          interval: 'monthly',
          trialDays: 7,
          features: ['Unlimited classes', 'Priority booking', 'Free guest pass', 'Cancel anytime'],
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.get('/api/point-card-plans', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'pcp-002',
          name: '10-Class Pack',
          description: 'Best value per session.',
          priceCents: 16000,
          sessionsCount: 10,
          validityDays: 180,
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
    });
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
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
    });
  });

  it('renders welcome message with user first name', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Alice/)).toBeInTheDocument();
    });
  });

  it('renders upcoming bookings section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Upcoming Bookings')).toBeInTheDocument();
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
      expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    });
  });

  it('renders subscription section with plan details', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument();
      expect(screen.getAllByText('€99.00').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText((c) => c.includes('monthly'))).toBeInTheDocument();
    });
  });

  it('renders point cards section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('10-Class Pack')).toBeInTheDocument();
      expect(screen.getByText((c) => c.includes('remaining'))).toBeInTheDocument();
    });
  });

  it('renders manage subscription link', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Manage')).toBeInTheDocument();
    });
  });

  it('renders view all bookings link', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('View all')).toBeInTheDocument();
    });
  });
});
