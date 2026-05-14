import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AdminSettingsPage from '@/admin/SettingsPage';

const server = setupServer(
  http.get('/api/admin/settings', () => {
    return HttpResponse.json({
      success: true,
      data: {
        studioName: 'CoachKit Studio',
        studioEmail: 'hello@coachkit.app',
        studioPhone: '+1-555-0100',
        studioAddress: '123 Main Street',
        studioCity: 'Portland',
        timezone: 'America/New_York',
        defaultCurrency: 'EUR',
        businessHours: {
          1: { open: '06:00', close: '21:00', isClosed: false },
          2: { open: '06:00', close: '21:00', isClosed: false },
          3: { open: '06:00', close: '21:00', isClosed: false },
          4: { open: '06:00', close: '21:00', isClosed: false },
          5: { open: '06:00', close: '20:00', isClosed: false },
          6: { open: '08:00', close: '18:00', isClosed: false },
          7: { open: '08:00', close: '14:00', isClosed: true },
        },
        bookingLeadTimeMinutes: 60,
        cancellationWindowMinutes: 120,
        maxBookingsPerCustomer: 5,
        defaultEmailSender: 'noreply@coachkit.app',
        notifyOnBooking: true,
        notifyOnCancellation: true,
        notifyOnWaitlist: true,
        notifyOnReminder: true,
        taxRate: 8.5,
      },
    });
  }),
  http.put('/api/admin/settings', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ success: true, data: body });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminSettingsPage />
    </MemoryRouter>,
  );
}

describe('AdminSettingsPage', () => {
  it('renders all section headings', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('General')).toBeInTheDocument();
    });
    expect(screen.getByText('Business Hours')).toBeInTheDocument();
    expect(screen.getByText('Booking Rules')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
  });

  it('loads and displays settings values', async () => {
    renderPage();
    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('CoachKit Studio');
      expect(nameInput).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('hello@coachkit.app')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1-555-0100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main Street')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Portland')).toBeInTheDocument();
    expect(screen.getByDisplayValue('noreply@coachkit.app')).toBeInTheDocument();
  });

  it('allows editing studio name', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByDisplayValue('CoachKit Studio')).toBeInTheDocument());
    const nameInput = screen.getByDisplayValue('CoachKit Studio');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Studio Name');
    expect(screen.getByDisplayValue('New Studio Name')).toBeInTheDocument();
  });

  it('saves settings and shows success', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByDisplayValue('CoachKit Studio')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Save Changes'));
    await waitFor(() => {
      expect(screen.getByText('Settings saved successfully.')).toBeInTheDocument();
    });
  });

  it('shows business hours with closed checkbox for Sunday', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Sunday')).toBeInTheDocument();
    });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(11);
  });

  it('renders booking rules inputs', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByDisplayValue('60')).toBeInTheDocument();
      expect(screen.getByDisplayValue('120')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    });
  });

  it('renders notification checkboxes', async () => {
    renderPage();
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('renders tax rate input', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByDisplayValue('8.5')).toBeInTheDocument();
    });
  });
});
