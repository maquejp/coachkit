import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AnalyticsPage from '@/admin/AnalyticsPage';

const server = setupServer(
  http.get('/api/admin/analytics', () => {
    return HttpResponse.json({
      success: true,
      data: {
        conversionRate: 0.068,
        bounceRate: 0.32,
        avgSessionDuration: 245,
        totalPageViews: 15280,
        uniqueVisitors: 8940,
        popularClasses: [
          { className: 'HIIT Circuit', bookings: 320, revenueCents: 4800000 },
          { className: 'Morning Yoga', bookings: 280, revenueCents: 4200000 },
        ],
        peakBookingTimes: [
          { timeSlot: '07:00–08:00', count: 420, percentage: 28 },
          { timeSlot: '12:00–13:00', count: 380, percentage: 25 },
        ],
        referralSources: [
          { source: 'Direct', count: 3576, percentage: 40 },
          { source: 'Google Organic', count: 2235, percentage: 25 },
        ],
      },
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <AnalyticsPage />
    </MemoryRouter>,
  );
}

describe('AnalyticsPage', () => {
  it('renders page title', () => {
    renderPage();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderPage();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders KPI cards after loading', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('6.8%')).toBeInTheDocument();
    });
    expect(screen.getByText('32.0%')).toBeInTheDocument();
    expect(screen.getByText('4m 5s')).toBeInTheDocument();
    expect(screen.getByText('15,280')).toBeInTheDocument();
    expect(screen.getByText('8,940')).toBeInTheDocument();
  });

  it('renders popular classes section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    });
  });

  it('renders peak booking times section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('07:00–08:00')).toBeInTheDocument();
      expect(screen.getByText('12:00–13:00')).toBeInTheDocument();
    });
  });

  it('renders referral sources section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Direct')).toBeInTheDocument();
      expect(screen.getByText('Google Organic')).toBeInTheDocument();
    });
  });
});
