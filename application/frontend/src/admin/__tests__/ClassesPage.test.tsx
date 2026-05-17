import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ClassesPage from '@/admin/ClassesPage';

const mockClassTypes: Array<Record<string, unknown>> = [
  {
    id: 'ct-001',
    name: 'Morning Yoga',
    description: 'Gentle stretches.',
    color: '#0ea5e9',
    durationMinutes: 60,
    capacity: 25,
    defaultPriceCents: 2000,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ct-002',
    name: 'HIIT Circuit',
    description: 'High intensity.',
    color: '#f43f5e',
    durationMinutes: 45,
    capacity: 20,
    defaultPriceCents: 2500,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

const server = setupServer(
  http.get('/api/class-types', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 50;
    const total = mockClassTypes.length;
    const totalPages = Math.ceil(total / pageSize);
    const items = mockClassTypes.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({
      success: true,
      data: { items, total, totalPages, page, pageSize },
    });
  }),

  http.post('/api/admin/class-types', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'ct-new-001',
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  http.put('/api/admin/class-types/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const idx = mockClassTypes.findIndex((c) => c.id === params.id);
    if (idx !== -1)
      mockClassTypes[idx] = {
        ...mockClassTypes[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
    return HttpResponse.json({
      success: true,
      data: mockClassTypes[idx] ?? { id: params.id, ...body, updatedAt: new Date().toISOString() },
    });
  }),

  http.delete('/api/admin/class-types/:id', ({ params }) => {
    const idx = mockClassTypes.findIndex((c) => c.id === params.id);
    if (idx !== -1) mockClassTypes.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),
);

const initialClassTypes = JSON.parse(JSON.stringify(mockClassTypes));

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
beforeEach(() => {
  mockClassTypes.length = 0;
  mockClassTypes.push(...initialClassTypes);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <ClassesPage />
    </MemoryRouter>,
  );
}

describe('ClassesPage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Classes')).toBeInTheDocument();
    });
  });

  it('renders class type cards', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
      expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    });
  });

  it('shows duration on cards', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('60 min')).toBeInTheDocument();
      expect(screen.getByText('45 min')).toBeInTheDocument();
    });
  });

  it('shows price on cards', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('€20.00')).toBeInTheDocument();
    });
  });

  it('opens create modal on Add Class click', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Class')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Add Class'));
    await waitFor(() => {
      expect(screen.getByText('Add Class Type')).toBeInTheDocument();
    });
  });

  it('creates a new class type', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Class')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Add Class'));
    await waitFor(() => expect(screen.getByText('Add Class Type')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/^name/i), 'New Class');
    await userEvent.type(screen.getByLabelText(/^description/i), 'A brand new class');
    await userEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('New Class')).toBeInTheDocument();
    });
  });

  it('opens edit modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    const editBtns = screen.getAllByText('Edit');
    await userEvent.click(editBtns[0]);
    await waitFor(() => {
      expect(screen.getByText('Edit Class Type')).toBeInTheDocument();
    });
  });

  it('updates a class type', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Edit')[0]);
    await waitFor(() => expect(screen.getByText('Edit Class Type')).toBeInTheDocument());
    const nameInput = screen.getByLabelText(/^name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Yoga Updated');
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Yoga Updated')).toBeInTheDocument();
    });
  });

  it('opens delete confirmation', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    const deleteBtns = screen.getAllByText('Delete');
    await userEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });
  });

  it('deletes a class type', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() =>
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByText('Yes, Delete'));
    await waitFor(() => {
      expect(screen.queryByText('Morning Yoga')).not.toBeInTheDocument();
    });
  });
});
