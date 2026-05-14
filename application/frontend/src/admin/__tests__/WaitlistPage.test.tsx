import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import WaitlistPage from '@/admin/WaitlistPage';

const server = setupServer(
  http.get('/api/weekly-schedule', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'ws-002',
          dayOfWeek: 1,
          classTypeId: 'ct-002',
          coachId: 'coach-002',
          locationId: 'loc-001',
          startTime: '09:00',
          endTime: '09:45',
          maxCapacity: 20,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
      ],
    });
  }),

  http.get('/api/class-types', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'ct-002',
          name: 'HIIT Circuit',
          description: 'High-intensity.',
          color: '#f43f5e',
          durationMinutes: 45,
          capacity: 20,
          defaultPriceCents: 2500,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
      ],
    });
  }),

  http.get('/api/admin/waitlist', ({ request }) => {
    const url = new URL(request.url);
    const scheduleId = url.searchParams.get('scheduleId');
    if (scheduleId === 'ws-002') {
      return HttpResponse.json({
        success: true,
        data: [
          {
            id: 'wl-001',
            userId: 'user-009',
            scheduleId: 'ws-002',
            date: '2026-05-14',
            position: 1,
            status: 'waiting',
            customerName: 'Henry Thomas',
            className: 'HIIT Circuit',
            classColor: '#f43f5e',
            createdAt: '',
          },
          {
            id: 'wl-002',
            userId: 'user-010',
            scheduleId: 'ws-002',
            date: '2026-05-14',
            position: 2,
            status: 'waiting',
            customerName: 'Iris Jackson',
            className: 'HIIT Circuit',
            classColor: '#f43f5e',
            createdAt: '',
          },
        ],
      });
    }
    return HttpResponse.json({ success: true, data: [] });
  }),

  http.post('/api/admin/waitlist/:id/promote', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        status: 'promoted',
        customerName: 'Henry Thomas',
      },
    });
  }),

  http.post('/api/admin/waitlist/:id/remove', () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  http.post('/api/admin/waitlist/notify-all', () => {
    return HttpResponse.json({
      success: true,
      data: { notified: 2, message: '2 customer(s) notified.' },
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <WaitlistPage />
    </MemoryRouter>,
  );
}

describe('WaitlistPage', () => {
  it('renders page title', () => {
    renderPage();
    expect(screen.getByText('Waitlist')).toBeInTheDocument();
  });

  it('shows placeholder when no class selected', () => {
    renderPage();
    expect(screen.getByText(/Select a class slot/)).toBeInTheDocument();
  });

  it('renders waitlist after selecting a class', async () => {
    renderPage();
    await waitFor(() => {
      expect(
        screen.getByRole('combobox').querySelector('option[value="ws-002"]'),
      ).toBeInTheDocument();
    });
    await userEvent.selectOptions(screen.getByRole('combobox'), 'ws-002');
    await waitFor(() => {
      expect(screen.getByText('Henry Thomas')).toBeInTheDocument();
      expect(screen.getByText('Iris Jackson')).toBeInTheDocument();
    });
  });

  it('shows promote and remove buttons for waiting entries', async () => {
    renderPage();
    await waitFor(() => {
      expect(
        screen.getByRole('combobox').querySelector('option[value="ws-002"]'),
      ).toBeInTheDocument();
    });
    await userEvent.selectOptions(screen.getByRole('combobox'), 'ws-002');
    await waitFor(() => {
      expect(screen.getAllByText('Promote').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Remove').length).toBeGreaterThan(0);
    });
  });

  it('shows Notify All button with count', async () => {
    renderPage();
    await waitFor(() => {
      expect(
        screen.getByRole('combobox').querySelector('option[value="ws-002"]'),
      ).toBeInTheDocument();
    });
    await userEvent.selectOptions(screen.getByRole('combobox'), 'ws-002');
    await waitFor(() => {
      expect(screen.getByText(/Notify All.*2/)).toBeInTheDocument();
    });
  });

  it('promotes an entry', async () => {
    renderPage();
    await waitFor(() => {
      expect(
        screen.getByRole('combobox').querySelector('option[value="ws-002"]'),
      ).toBeInTheDocument();
    });
    await userEvent.selectOptions(screen.getByRole('combobox'), 'ws-002');
    await waitFor(() => expect(screen.getByText('Henry Thomas')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Promote')[0]);
    await waitFor(() => {
      expect(screen.getByText('Promoted')).toBeInTheDocument();
    });
  });
});
