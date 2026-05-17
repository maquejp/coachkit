import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AttendancePage from '@/admin/AttendancePage';

const today = new Date().toISOString().slice(0, 10);

const server = setupServer(
  http.get('/api/admin/attendance/check-in', ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    if (date === '2025-05-12') {
      return HttpResponse.json({
        success: true,
        data: [
          {
            id: 'bkg-001',
            userId: 'user-002',
            guestEmail: null,
            classTypeId: 'ct-001',
            date: '2025-05-12',
            status: 'confirmed',
            customerName: 'Alice Johnson',
            className: 'Morning Yoga',
            classColor: '#0ea5e9',
            checkInTime: null,
          },
          {
            id: 'bkg-002',
            userId: 'user-002',
            guestEmail: null,
            classTypeId: 'ct-002',
            date: '2025-05-12',
            status: 'confirmed',
            customerName: 'Bob Smith',
            className: 'HIIT Circuit',
            classColor: '#f43f5e',
            checkInTime: null,
          },
        ],
      });
    }
    return HttpResponse.json({ success: true, data: [] });
  }),

  http.post('/api/admin/attendance/check-in', async ({ request }) => {
    const { bookingId } = (await request.json()) as { bookingId: string };
    return HttpResponse.json(
      {
        success: true,
        data: { id: 'att-new', bookingId, checkInTime: '09:00' },
      },
      { status: 201 },
    );
  }),

  http.get('/api/admin/attendance/report', () => {
    return HttpResponse.json({
      success: true,
      data: {
        total: 1,
        records: [
          {
            id: 'att-001',
            bookingId: 'bkg-003',
            userId: 'user-003',
            date: '2025-05-13',
            checkInTime: '07:55',
            customerName: 'Bob Smith',
            className: 'Pilates Flow',
            classColor: '#14b8a6',
          },
        ],
      },
    });
  }),

  http.get('/api/admin/session-usage', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          userId: 'user-002',
          customerName: 'Alice Johnson',
          subscription: {
            planName: 'Monthly Unlimited',
            sessionsUsed: 15,
            sessionsLimit: null,
            status: 'active',
          },
          pointCards: [],
        },
      ],
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <AttendancePage />
    </MemoryRouter>,
  );
}

describe('AttendancePage', () => {
  it('renders page title', async () => {
    renderPage();
    expect(screen.getByText('Attendance')).toBeInTheDocument();
  });

  it('shows check-in tab by default', async () => {
    renderPage();
    expect(screen.getByText('Check-In')).toBeInTheDocument();
  });

  it('renders check-in bookings for selected date', async () => {
    renderPage();
    const dateInput = screen.getByDisplayValue(today);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2025-05-12');
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
      expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    });
  });

  it('shows Check In buttons for unconfirmed bookings', async () => {
    renderPage();
    const dateInput = screen.getByDisplayValue(today);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2025-05-12');
    await waitFor(() => {
      expect(screen.getAllByText('Check In').length).toBeGreaterThan(0);
    });
  });

  it('switches to History tab', async () => {
    renderPage();
    await userEvent.click(screen.getByText('History'));
    await waitFor(() => {
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });
  });

  it('switches to Usage Report tab', async () => {
    renderPage();
    await userEvent.click(screen.getByText('Usage Report'));
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText((c) => c.includes('Monthly Unlimited'))).toBeInTheDocument();
    });
  });
});
