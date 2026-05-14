import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import SubscriptionPage from '@/customer/SubscriptionPage';
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

  http.get('/api/subscription-plans', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'sp-001',
          name: 'Drop-In',
          description: 'Pay per session, no commitment.',
          priceCents: 2000,
          interval: 'monthly',
          trialDays: 0,
          features: ['Single class access', 'No commitment', 'Valid for 30 days'],
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
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
        {
          id: 'sp-003',
          name: 'Annual Unlimited',
          description: 'Best value — two months free.',
          priceCents: 89900,
          interval: 'yearly',
          trialDays: 7,
          features: [
            'Everything in Monthly',
            '2 months free',
            'Exclusive workshops',
            'Member events',
          ],
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('/api/customer-subscriptions/:id/cancel', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        userId: 'user-002',
        planId: 'sp-002',
        status: 'cancelled',
        startDate: '2025-02-01T00:00:00Z',
        endDate: '2026-05-15T00:00:00Z',
        trialEnd: '2025-02-08T00:00:00Z',
        sessionsUsed: 15,
        sessionsLimit: null,
        createdAt: '2025-02-01T00:00:00Z',
        updatedAt: '2026-05-15T00:00:00Z',
      },
    });
  }),

  http.put('/api/customer-subscriptions/:id/change-plan', async ({ params, request }) => {
    const body = (await request.json()) as { planId: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        userId: 'user-002',
        planId: body.planId,
        status: 'active',
        startDate: '2025-02-01T00:00:00Z',
        endDate: null,
        trialEnd: '2025-02-08T00:00:00Z',
        sessionsUsed: 0,
        sessionsLimit: null,
        createdAt: '2025-02-01T00:00:00Z',
        updatedAt: '2026-05-15T00:00:00Z',
      },
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
      <SubscriptionPage />
    </MemoryRouter>,
  );
}

describe('SubscriptionPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
    });
  });

  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('My Subscription')).toBeInTheDocument();
    });
  });

  it('renders current plan name', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument();
    });
  });

  it('renders subscription status badge', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  it('renders plan price', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText((c) => c.includes('€99.00'))).toBeInTheDocument();
    });
  });

  it('renders session usage section for unlimited plan', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Session Usage')).toBeInTheDocument();
      expect(screen.getByText(/15 sessions used/)).toBeInTheDocument();
    });
  });

  it('shows change plan button and modal', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Change Plan' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Change Plan' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Drop-In')).toBeInTheDocument();
    });
  });

  it('changes plan successfully', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Change Plan' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Change Plan' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Drop-In')).toBeInTheDocument();
    });
    const selectButtons = screen.getAllByRole('button', { name: 'Select' });
    await userEvent.click(selectButtons[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows cancel subscription modal', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel Subscription' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel Subscription' }));
    await waitFor(() => {
      expect(
        screen.getByText((c) => c.includes('Are you sure you want to cancel')),
      ).toBeInTheDocument();
    });
  });

  it('cancels subscription', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel Subscription' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel Subscription' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes, Cancel' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' }));
    await waitFor(() => {
      expect(screen.getByText((c) => c.includes('subscription is cancelled'))).toBeInTheDocument();
    });
  });
});
