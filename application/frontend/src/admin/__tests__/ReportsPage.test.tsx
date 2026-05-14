import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ReportsPage from '@/admin/ReportsPage';

const server = setupServer(
  http.get('/api/admin/reports/customers', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'user-002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1-555-0102',
          status: 'active',
          subscriptionPlan: 'Monthly Unlimited',
          sessionsUsed: 12,
          sessionsLimit: 20,
          totalBookings: 15,
          lastBookingDate: '2025-05-14',
          createdAt: '2025-01-15',
        },
      ],
    });
  }),

  http.get('/api/admin/reports/attendance', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          date: '2025-05-12',
          totalCheckIns: 28,
          uniqueCustomers: 22,
          byClass: [
            { className: 'Morning Yoga', count: 8 },
            { className: 'HIIT Circuit', count: 12 },
          ],
        },
      ],
    });
  }),

  http.get('/api/admin/reports/subscriptions', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalActive: 85,
        totalCancelled: 12,
        totalExpired: 8,
        monthlyRevenueCents: 4250000,
        annualRevenueCents: 12000000,
        churnRate: 0.045,
        byPlan: [{ planName: 'Monthly Unlimited', active: 40, cancelled: 6 }],
      },
    });
  }),

  http.get('/api/admin/reports/occupancy', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          className: 'Morning Yoga',
          totalSlots: 20,
          totalBookings: 17,
          averageOccupancy: 0.85,
          peakDay: 'Monday',
          peakTime: '07:00',
        },
      ],
    });
  }),

  http.get('/api/admin/reports/revenue', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          month: '2025-01',
          revenueCents: 4250000,
          subscriptionCents: 3200000,
          pointCardCents: 750000,
          bookingsCents: 300000,
          transactions: 45,
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
      <ReportsPage />
    </MemoryRouter>,
  );
}

describe('ReportsPage', () => {
  it('renders page title', () => {
    renderPage();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('shows all report tabs', () => {
    renderPage();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Attendance')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Occupancy')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders customer report data', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument();
  });

  it('shows export buttons on customer tab', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getAllByText('Export PDF').length).toBeGreaterThan(0);
    });
  });

  it('switches to attendance tab and shows data', async () => {
    renderPage();
    await userEvent.click(screen.getByText('Attendance'));
    await waitFor(() => {
      expect(screen.getByText('2025-05-12')).toBeInTheDocument();
    });
    expect(screen.getByText('28 check-ins')).toBeInTheDocument();
  });

  it('switches to subscriptions tab and shows KPIs', async () => {
    renderPage();
    await userEvent.click(screen.getByText('Subscriptions'));
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
  });

  it('switches to occupancy tab and shows data', async () => {
    renderPage();
    await userEvent.click(screen.getByText('Occupancy'));
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    });
    expect(screen.getByText('Peak: Monday at 07:00')).toBeInTheDocument();
  });

  it('switches to revenue tab and shows data', async () => {
    renderPage();
    await userEvent.click(screen.getByText('Revenue'));
    await waitFor(() => {
      expect(screen.getByText('2025-01')).toBeInTheDocument();
    });
  });
});
