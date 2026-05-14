import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import PricingPage from '@/admin/PricingPage';

const server = setupServer(
  http.get('/api/subscription-plans', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'sp-001',
          name: 'Monthly Unlimited',
          description: 'Go monthly.',
          priceCents: 9900,
          interval: 'monthly',
          trialDays: 7,
          features: ['Unlimited classes', 'Priority booking'],
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
      ],
    });
  }),

  http.get('/api/point-card-plans', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'pcp-001',
          name: '5-Class Pack',
          description: 'Five sessions.',
          priceCents: 9000,
          sessionsCount: 5,
          validityDays: 90,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
      ],
    });
  }),

  http.post('/api/admin/subscription-plans', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { success: true, data: { id: 'sp-new', ...body, createdAt: '', updatedAt: '' } },
      { status: 201 },
    );
  }),

  http.put('/api/admin/subscription-plans/:id', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ success: true, data: { id: 'sp-001', ...body, updatedAt: '' } });
  }),

  http.delete('/api/admin/subscription-plans/:id', () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  http.post('/api/admin/point-card-plans', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { success: true, data: { id: 'pcp-new', ...body, createdAt: '', updatedAt: '' } },
      { status: 201 },
    );
  }),

  http.put('/api/admin/point-card-plans/:id', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ success: true, data: { id: 'pcp-001', ...body, updatedAt: '' } });
  }),

  http.delete('/api/admin/point-card-plans/:id', () => {
    return HttpResponse.json({ success: true, data: null });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <PricingPage />
    </MemoryRouter>,
  );
}

describe('PricingPage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Pricing')).toBeInTheDocument());
  });

  it('renders subscription plans', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument();
    });
  });

  it('renders point card packs', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('5-Class Pack')).toBeInTheDocument();
    });
  });

  it('shows price on subscription cards', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('/monthly')).toBeInTheDocument();
    });
  });

  it('opens create subscription modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Subscription Plans')).toBeInTheDocument());
    const btns = screen.getAllByText('Add Plan');
    await userEvent.click(btns[0]);
    await waitFor(() => {
      expect(screen.getByText('Add Subscription Plan')).toBeInTheDocument();
    });
  });

  it('creates a subscription plan', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Plan')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Add Plan')[0]);
    await waitFor(() => expect(screen.getByText('Add Subscription Plan')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/^name/i), 'Test Plan');
    await userEvent.type(screen.getByLabelText(/^description/i), 'A test');
    await userEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('Test Plan')).toBeInTheDocument();
    });
  });

  it('opens edit subscription modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Edit')[0]);
    await waitFor(() => {
      expect(screen.getByText('Edit Subscription Plan')).toBeInTheDocument();
    });
  });

  it('deletes a subscription plan', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(screen.getByText(/Are you sure/)).toBeInTheDocument());
    await userEvent.click(screen.getByText('Yes, Delete'));
    await waitFor(() => {
      expect(screen.queryByText('Monthly Unlimited')).not.toBeInTheDocument();
    });
  });

  it('opens create point card modal', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Point Card Packs')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Add Pack')[0]);
    await waitFor(() => {
      expect(screen.getByText('Add Point Card Pack')).toBeInTheDocument();
    });
  });

  it('creates a point card plan', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Add Pack')).toBeInTheDocument());
    await userEvent.click(screen.getAllByText('Add Pack')[0]);
    await waitFor(() => expect(screen.getByText('Add Point Card Pack')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/^name/i), 'New Pack');
    await userEvent.type(screen.getByLabelText(/^description/i), 'A new pack');
    await userEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('New Pack')).toBeInTheDocument();
    });
  });

  it('deletes a point card plan', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('5-Class Pack')).toBeInTheDocument());
    const allDelete = screen.getAllByText('Delete');
    await userEvent.click(allDelete[allDelete.length - 1]);
    await waitFor(() => expect(screen.getByText(/Are you sure/)).toBeInTheDocument());
    await userEvent.click(screen.getByText('Yes, Delete'));
    await waitFor(() => {
      expect(screen.queryByText('5-Class Pack')).not.toBeInTheDocument();
    });
  });
});
