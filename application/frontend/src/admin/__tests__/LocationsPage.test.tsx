import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import LocationsPage from '@/admin/LocationsPage';

const server = setupServer(
  http.get('/api/locations', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'loc-001',
          name: 'CoachKit Downtown',
          address: '123 Main Street',
          city: 'Portland',
          phone: '+1-555-1001',
          email: 'downtown@coachkit.test',
          mapLink: 'https://maps.example.com/downtown',
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('/api/locations', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: { id: 'loc-new', ...body, createdAt: '', updatedAt: '' },
      },
      { status: 201 },
    );
  }),

  http.put('/api/locations/:id', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ success: true, data: { id: 'loc-001', ...body, updatedAt: '' } });
  }),

  http.delete('/api/locations/:id', () => {
    return HttpResponse.json({ success: true, data: null });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <LocationsPage />
    </MemoryRouter>,
  );
}

describe('LocationsPage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Locations')).toBeInTheDocument());
  });

  it('renders locations list', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument();
    });
  });

  it('opens create modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Locations')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'Add Location' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Location' })).toBeInTheDocument();
    });
  });

  it('creates a location', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Location')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'Add Location' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Add Location' })).toBeInTheDocument(),
    );
    await userEvent.type(screen.getByLabelText(/^name/i), 'New Studio');
    await userEvent.type(screen.getByLabelText(/^address/i), '456 Oak St');
    await userEvent.type(screen.getByLabelText(/^city/i), 'Portland');
    await userEvent.type(screen.getByLabelText(/^Phone/i), '+1-555-9999');
    await userEvent.type(screen.getByLabelText(/^Email/i), 'new@coachkit.test');
    await userEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('New Studio')).toBeInTheDocument();
    });
  });

  it('opens edit modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Edit')[0]);
    await waitFor(() => {
      expect(screen.getByText('Edit Location')).toBeInTheDocument();
    });
  });

  it('deletes a location', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(screen.getByText(/Are you sure/)).toBeInTheDocument());
    await userEvent.click(screen.getByText('Yes, Delete'));
    await waitFor(() => {
      expect(screen.queryByText('CoachKit Downtown')).not.toBeInTheDocument();
    });
  });

  it('links to detail page', async () => {
    renderPage();
    await waitFor(() => {
      const link = screen.getByText('CoachKit Downtown');
      expect(link.closest('a')).toHaveAttribute('href', '/admin/locations/loc-001');
    });
  });
});
