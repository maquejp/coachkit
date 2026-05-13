import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import SchedulePage from '@/admin/SchedulePage';

const server = setupServer(
  http.get('/api/weekly-schedule', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'ws-001',
          dayOfWeek: 1,
          classTypeId: 'ct-001',
          coachId: 'coach-001',
          locationId: 'loc-001',
          startTime: '07:00',
          endTime: '08:00',
          maxCapacity: 25,
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 'ws-002',
          dayOfWeek: 3,
          classTypeId: 'ct-002',
          coachId: 'coach-002',
          locationId: 'loc-002',
          startTime: '09:00',
          endTime: '09:45',
          maxCapacity: 20,
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('/api/weekly-schedule', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'ws-new-001',
          ...body,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  http.put('/api/weekly-schedule/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete('/api/weekly-schedule/:id', () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  http.get('/api/schedule-exceptions', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'se-001',
          date: '2025-12-25',
          locationId: 'loc-001',
          openTime: null,
          closeTime: null,
          isClosed: true,
          reason: 'Christmas Day',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('/api/schedule-exceptions', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'se-new-001',
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  http.delete('/api/schedule-exceptions/:id', () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  http.get('/api/class-types', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'ct-001',
          name: 'Morning Yoga',
          color: '#0ea5e9',
          durationMinutes: 60,
          capacity: 25,
          defaultPriceCents: 2000,
          isActive: true,
        },
        {
          id: 'ct-002',
          name: 'HIIT Circuit',
          color: '#f43f5e',
          durationMinutes: 45,
          capacity: 20,
          defaultPriceCents: 2500,
          isActive: true,
        },
      ],
    });
  }),

  http.get('/api/coaches', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'coach-001', name: 'Alex Rivera', isActive: true },
        { id: 'coach-002', name: 'Jordan Chen', isActive: true },
      ],
    });
  }),

  http.get('/api/locations', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'loc-001',
          name: 'CoachKit Downtown',
          isActive: true,
        },
        {
          id: 'loc-002',
          name: 'CoachKit Eastside',
          isActive: true,
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
      <SchedulePage />
    </MemoryRouter>,
  );
}

describe('SchedulePage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Schedule')).toBeInTheDocument();
    });
  });

  it('renders day headers', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
      expect(screen.getByText('Sunday')).toBeInTheDocument();
    });
  });

  it('renders existing schedule slots', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    });
  });

  it('renders location filter', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('All Locations')).toBeInTheDocument();
    });
  });

  it('opens create modal on add button click', async () => {
    renderPage();
    await waitFor(() => {
      const addBtn = screen.getAllByText('+ Add')[0];
      expect(addBtn).toBeInTheDocument();
    });
    const addBtn = screen.getAllByText('+ Add')[0];
    await userEvent.click(addBtn);
    await waitFor(() => {
      expect(screen.getByText('Create Schedule Slot')).toBeInTheDocument();
    });
  });

  it('creates a new schedule slot', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Schedule')).toBeInTheDocument());
    const addBtn = screen.getAllByText('+ Add')[0];
    await userEvent.click(addBtn);
    await waitFor(async () => {
      expect(screen.getByText('Create Schedule Slot')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');
    const selects = within(dialog).getAllByRole('combobox');
    await userEvent.selectOptions(selects[0], 'ct-001');
    await userEvent.selectOptions(selects[1], 'coach-001');
    await userEvent.selectOptions(selects[2], 'loc-001');
    await userEvent.click(within(dialog).getByText('Create'));
    await waitFor(() => {
      expect(screen.queryByText('Create Schedule Slot')).not.toBeInTheDocument();
    });
  });

  it('opens edit modal on slot click', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Morning Yoga'));
    await waitFor(() => {
      expect(screen.getByText('Edit Schedule Slot')).toBeInTheDocument();
    });
  });

  it('deletes a slot via edit modal', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Morning Yoga'));
    await waitFor(() => expect(screen.getByText('Edit Schedule Slot')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Delete Slot'));
    await waitFor(() => {
      expect(screen.getByText('Delete Schedule Slot')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Yes, Delete'));
    await waitFor(() => {
      expect(screen.queryByText('Delete Schedule Slot')).not.toBeInTheDocument();
    });
  });

  it('renders exceptions section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Schedule Exceptions')).toBeInTheDocument();
    });
  });

  it('renders existing exceptions', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText((c) => c.includes('Christmas Day'))).toBeInTheDocument();
    });
  });

  it('opens add exception modal', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Add Exception')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Add Exception'));
    await waitFor(() => {
      expect(screen.getByText('Add Schedule Exception')).toBeInTheDocument();
    });
  });

  it('creates a new exception', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Exception')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Add Exception'));
    await waitFor(() => expect(screen.getByText('Add Schedule Exception')).toBeInTheDocument());
    const dialog = screen.getByRole('dialog');
    const dateInput = within(dialog).getByLabelText(/^date/i);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2025-01-01');
    const reasonInput = within(dialog).getByLabelText(/^reason/i);
    await userEvent.type(reasonInput, 'New Year');
    const selects = within(dialog).getAllByRole('combobox');
    await userEvent.selectOptions(selects[0], 'loc-001');
    await userEvent.click(within(dialog).getByText('Add Exception'));
    await waitFor(() => {
      expect(screen.queryByText('Add Schedule Exception')).not.toBeInTheDocument();
    });
  });

  it('deletes an exception', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText((c) => c.includes('Christmas Day'))).toBeInTheDocument();
    });
    const removeBtns = screen.getAllByText('Remove');
    await userEvent.click(removeBtns[0]);
    await waitFor(() => {
      expect(screen.queryByText((c) => c.includes('Christmas Day'))).not.toBeInTheDocument();
    });
  });
});
