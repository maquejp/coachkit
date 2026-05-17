import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import InstructorsPage from '@/admin/InstructorsPage';

const mockCoaches: Array<Record<string, unknown>> = [
  {
    id: 'coach-001',
    name: 'Alex Rivera',
    bio: 'Yoga & Mindfulness.',
    email: 'alex@coachkit.test',
    phone: '+1-555-2001',
    photoUrl: null,
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
];

const server = setupServer(
  http.get('/api/coaches', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 50;
    const total = mockCoaches.length;
    const totalPages = Math.ceil(total / pageSize);
    const items = mockCoaches.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({
      success: true,
      data: { items, total, totalPages, page, pageSize },
    });
  }),

  http.get('/api/coaches/:id', ({ params }) => {
    const coach = mockCoaches.find((c) => c.id === params.id);
    if (!coach) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: coach });
  }),

  http.post('/api/admin/coaches', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newCoach: Record<string, unknown> = {
      id: 'coach-new',
      firstName: body.first_name ?? body.firstName ?? '',
      lastName: body.last_name ?? body.lastName ?? '',
      name:
        [body.first_name ?? body.firstName ?? '', body.last_name ?? body.lastName ?? '']
          .filter(Boolean)
          .join(' ') || 'New Coach',
      bio: body.bio ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      photoUrl: body.photo_url ?? body.photoUrl ?? null,
      isActive: body.is_active ?? body.isActive ?? true,
      createdAt: '',
      updatedAt: '',
    };
    mockCoaches.push(newCoach);
    return HttpResponse.json({ success: true, data: newCoach }, { status: 201 });
  }),

  http.put('/api/admin/coaches/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const idx = mockCoaches.findIndex((c) => c.id === params.id);
    if (idx !== -1) mockCoaches[idx] = { ...mockCoaches[idx], ...body, updatedAt: '' };
    return HttpResponse.json({
      success: true,
      data: mockCoaches[idx] ?? { id: params.id, ...body, updatedAt: '' },
    });
  }),

  http.delete('/api/admin/coaches/:id', ({ params }) => {
    const idx = mockCoaches.findIndex((c) => c.id === params.id);
    if (idx !== -1) mockCoaches.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),
);

const initialMockCoaches = JSON.parse(JSON.stringify(mockCoaches));

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
beforeEach(() => {
  mockCoaches.length = 0;
  mockCoaches.push(...initialMockCoaches);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <InstructorsPage />
    </MemoryRouter>,
  );
}

describe('InstructorsPage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Instructors')).toBeInTheDocument());
  });

  it('renders instructors list', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    });
  });

  it('opens create modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Instructors')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'Add Instructor' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Instructor' })).toBeInTheDocument();
    });
  });

  it('creates an instructor', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Instructor')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'Add Instructor' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Add Instructor' })).toBeInTheDocument(),
    );
    await userEvent.type(screen.getByLabelText(/^name/i), 'New Coach');
    await userEvent.type(screen.getByLabelText(/^bio/i), 'Great coach');
    await userEvent.type(screen.getByLabelText(/^Email/i), 'new@coach.test');
    await userEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('New Coach')).toBeInTheDocument();
    });
  });

  it('opens edit modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Alex Rivera')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Edit')[0]);
    await waitFor(() => {
      expect(screen.getByText('Edit Instructor')).toBeInTheDocument();
    });
  });

  it('deletes an instructor', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Alex Rivera')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(screen.getByText(/Are you sure/)).toBeInTheDocument());
    await userEvent.click(screen.getByText('Yes, Delete'));
    await waitFor(() => {
      expect(screen.queryByText('Alex Rivera')).not.toBeInTheDocument();
    });
  });

  it('links to detail page', async () => {
    renderPage();
    await waitFor(() => {
      const link = screen.getByText('Alex Rivera');
      expect(link.closest('a')).toHaveAttribute('href', '/admin/instructors/coach-001');
    });
  });
});
