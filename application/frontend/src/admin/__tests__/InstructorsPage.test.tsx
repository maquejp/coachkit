import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import InstructorsPage from '@/admin/InstructorsPage';

const server = setupServer(
  http.get('/api/coaches', () => {
    return HttpResponse.json({
      success: true,
      data: [
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
      ],
    });
  }),

  http.post('/api/coaches', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { success: true, data: { id: 'coach-new', ...body, createdAt: '', updatedAt: '' } },
      { status: 201 },
    );
  }),

  http.put('/api/coaches/:id', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ success: true, data: { id: 'coach-001', ...body, updatedAt: '' } });
  }),

  http.delete('/api/coaches/:id', () => {
    return HttpResponse.json({ success: true, data: null });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
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
