import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AdminDashboardPage from '@/admin/DashboardPage';
import { useAuthStore } from '@/stores/auth';

const server = setupServer(
  http.get('/api/admin/dashboard/kpis', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalBookings: 50,
        confirmedBookings: 30,
        revenueCents: 150000,
        activeMembers: 85,
        occupancyRate: 0.72,
      },
    });
  }),

  http.get('/api/admin/dashboard/charts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        bookingsByDay: [
          { date: '2026-05-12', count: 4 },
          { date: '2026-05-13', count: 3 },
        ],
        revenueByMonth: [
          { month: '2026-01', amountCents: 89900 },
          { month: '2026-02', amountCents: 9900 },
        ],
        classPopularity: [
          { className: 'Morning Yoga', bookings: 12 },
          { className: 'HIIT Circuit', bookings: 10 },
        ],
      },
    });
  }),

  http.get('/api/admin/dashboard/occupancy', () => {
    return HttpResponse.json({
      success: true,
      data: {
        averageOccupancy: 0.72,
        peakDay: 'Monday',
        peakTime: '07:00',
        byClass: [
          { className: 'Morning Yoga', occupancy: 0.85 },
          { className: 'HIIT Circuit', occupancy: 0.9 },
        ],
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
      <AdminDashboardPage />
    </MemoryRouter>,
  );
}

describe('AdminDashboardPage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('renders KPI cards', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Active Members')).toBeInTheDocument();
      expect(screen.getByText('Occupancy')).toBeInTheDocument();
    });
  });

  it('renders KPI values', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });

  it('renders revenue chart section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Revenue by Month')).toBeInTheDocument();
      expect(screen.getByText('€1,500')).toBeInTheDocument();
    });
  });

  it('renders class popularity chart', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Class Popularity')).toBeInTheDocument();
      const yogaElements = screen.getAllByText('Morning Yoga');
      expect(yogaElements.length).toBeGreaterThanOrEqual(1);
      const hiitElements = screen.getAllByText('HIIT Circuit');
      expect(hiitElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders upcoming classes section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Upcoming Classes')).toBeInTheDocument();
    });
  });

  it('renders occupancy by class section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Occupancy by Class')).toBeInTheDocument();
      expect(screen.getByText((c) => c.includes('Peak day'))).toBeInTheDocument();
    });
  });

  it('renders daily bookings trend chart', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Daily Bookings Trend')).toBeInTheDocument();
    });
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
