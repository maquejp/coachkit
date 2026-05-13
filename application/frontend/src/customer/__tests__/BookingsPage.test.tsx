import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import BookingsPage from '@/customer/BookingsPage';
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

const futureDate = '2026-06-15';
const pastDate = '2026-05-01';

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
                id: 'bkg-upcoming-1',
                userId: 'user-002',
                guestEmail: null,
                classTypeId: 'ct-001',
                scheduleId: 'ws-001',
                date: futureDate,
                status: 'confirmed',
                createdAt: '2026-05-10T08:00:00Z',
                updatedAt: '2026-05-10T08:00:00Z',
              },
              {
                id: 'bkg-upcoming-2',
                userId: 'user-002',
                guestEmail: null,
                classTypeId: 'ct-002',
                scheduleId: 'ws-002',
                date: futureDate,
                status: 'confirmed',
                createdAt: '2026-05-10T08:05:00Z',
                updatedAt: '2026-05-10T08:05:00Z',
              },
              {
                id: 'bkg-history-1',
                userId: 'user-002',
                guestEmail: null,
                classTypeId: 'ct-003',
                scheduleId: 'ws-003',
                date: pastDate,
                status: 'attended',
                createdAt: '2026-04-28T09:00:00Z',
                updatedAt: '2026-05-01T08:00:00Z',
              },
              {
                id: 'bkg-history-2',
                userId: 'user-002',
                guestEmail: null,
                classTypeId: 'ct-004',
                scheduleId: 'ws-004',
                date: pastDate,
                status: 'cancelled',
                createdAt: '2026-04-28T10:00:00Z',
                updatedAt: '2026-04-30T10:00:00Z',
              },
            ]
          : [],
    });
  }),

  http.post('/api/bookings/:id/cancel', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        userId: 'user-002',
        guestEmail: null,
        classTypeId: 'ct-001',
        scheduleId: 'ws-001',
        date: futureDate,
        status: 'cancelled',
        createdAt: '2026-05-10T08:00:00Z',
        updatedAt: '2026-05-11T08:00:00Z',
      },
    });
  }),

  http.post('/api/bookings/:id/reschedule', async ({ params, request }) => {
    const body = (await request.json()) as { date: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        userId: 'user-002',
        guestEmail: null,
        classTypeId: 'ct-001',
        scheduleId: 'ws-001',
        date: body.date,
        status: 'confirmed',
        createdAt: '2026-05-10T08:00:00Z',
        updatedAt: '2026-05-11T08:00:00Z',
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
      <BookingsPage />
    </MemoryRouter>,
  );
}

describe('BookingsPage', () => {
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
      expect(screen.getByText('My Bookings')).toBeInTheDocument();
    });
  });

  it('shows upcoming tab with count', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Upcoming \(2\)/)).toBeInTheDocument();
    });
  });

  it('shows history tab with count', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/History \(2\)/)).toBeInTheDocument();
    });
  });

  it('renders upcoming booking class names', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
      expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    });
  });

  it('renders history booking class names when tab clicked', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/History \(2\)/)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(/History \(2\)/));
    await waitFor(() => {
      expect(screen.getByText('Pilates Flow')).toBeInTheDocument();
      expect(screen.getByText('Strength & Tone')).toBeInTheDocument();
    });
  });

  it('shows status badges for bookings', async () => {
    renderPage();
    await waitFor(() => {
      const badges = screen.getAllByText('confirmed');
      expect(badges.length).toBe(2);
    });
  });

  it('shows cancel button on upcoming bookings', async () => {
    renderPage();
    await waitFor(() => {
      const cancelBtns = screen.getAllByRole('button', { name: 'Cancel' });
      expect(cancelBtns.length).toBe(2);
    });
  });

  it('opens cancel modal and cancels booking', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Cancel' }).length).toBe(2);
    });
    const cancelBtn = screen.getAllByRole('button', { name: 'Cancel' })[0];
    await userEvent.click(cancelBtn);
    await waitFor(() => {
      expect(
        screen.getByText((c) => c.includes('Are you sure you want to cancel')),
      ).toBeInTheDocument();
    });
    const confirmBtn = screen.getByRole('button', { name: 'Yes, Cancel' });
    await userEvent.click(confirmBtn);
    await waitFor(() => {
      expect(screen.getByText(/Upcoming \(1\)/)).toBeInTheDocument();
    });
  });

  it('shows reschedule button on upcoming bookings', async () => {
    renderPage();
    await waitFor(() => {
      const rescheduleBtns = screen.getAllByRole('button', { name: 'Reschedule' });
      expect(rescheduleBtns.length).toBe(2);
    });
  });

  it('opens reschedule modal and reschedules booking', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Reschedule' }).length).toBe(2);
    });
    const rescheduleBtn = screen.getAllByRole('button', { name: 'Reschedule' })[0];
    await userEvent.click(rescheduleBtn);
    await waitFor(() => {
      expect(screen.getByText('Reschedule Booking')).toBeInTheDocument();
    });
    const dateInput = screen.getByLabelText('New Date');
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2026-07-01');
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    await userEvent.click(confirmBtn);
    await waitFor(() => {
      expect(screen.queryByText('Reschedule Booking')).not.toBeInTheDocument();
    });
  });
});
