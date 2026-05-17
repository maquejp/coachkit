import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { subscriptionHandlers } from '@/mocks/handlers/subscriptions';
import { classTypeHandlers } from '@/mocks/handlers/classTypes';
import PricingPage from '@/public/PricingPage';

const server = setupServer(...subscriptionHandlers, ...classTypeHandlers);

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
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders subscription plan names from fixtures', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Drop-In')).toBeInTheDocument());
    expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument();
    expect(screen.getByText('Annual Unlimited')).toBeInTheDocument();
    expect(screen.getByText('Student Monthly')).toBeInTheDocument();
  });

  it('renders subscription prices from fixtures', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('€99')).toBeInTheDocument());
    expect(screen.getByText('€899')).toBeInTheDocument();
    expect(screen.getByText('€69')).toBeInTheDocument();
  });

  it('renders class pack (point card) section', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('5-Class Pack')).toBeInTheDocument());
    expect(screen.getByText('10-Class Pack')).toBeInTheDocument();
    expect(screen.getByText('20-Class Pack')).toBeInTheDocument();
  });

  it('renders point card prices from fixtures', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('€90.00')).toBeInTheDocument());
    expect(screen.getByText('€160.00')).toBeInTheDocument();
    expect(screen.getByText('€280.00')).toBeInTheDocument();
  });

  it('renders single session pricing section', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Drop in for a single class')).toBeInTheDocument());
    expect(screen.getByText((c) => c.includes('€15.00'))).toBeInTheDocument();
  });
});
