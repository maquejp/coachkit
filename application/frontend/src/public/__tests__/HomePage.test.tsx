import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { coachHandlers } from '@/mocks/handlers/coaches';
import { classTypeHandlers } from '@/mocks/handlers/classTypes';
import { locationHandlers } from '@/mocks/handlers/locations';
import { subscriptionHandlers } from '@/mocks/handlers/subscriptions';
import { scheduleHandlers } from '@/mocks/handlers/schedule';
import HomePage from '@/public/HomePage';

const server = setupServer(
  ...coachHandlers,
  ...classTypeHandlers,
  ...locationHandlers,
  ...subscriptionHandlers,
  ...scheduleHandlers,
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('renders hero section with first session free CTA', () => {
    renderPage();
    expect(screen.getByText('Your First Session, On Us.')).toBeInTheDocument();
    expect(screen.getByText('Claim Free Session')).toBeInTheDocument();
  });

  it('renders Why CoachKit section', () => {
    renderPage();
    expect(screen.getByText('Why CoachKit?')).toBeInTheDocument();
    expect(screen.getByText('Smart Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Member Management')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('renders Our Classes section', async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getAllByText('Morning Yoga').length).toBeGreaterThanOrEqual(1),
    );
  });

  it('renders instructors section', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Alex Rivera')).toBeInTheDocument());
  });

  it('renders weekly schedule section', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("This Week's Schedule")).toBeInTheDocument());
  });

  it('renders pricing section', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('€99')).toBeInTheDocument());
  });

  it('renders reviews carousel', () => {
    renderPage();
    expect(screen.getByText('What Our Members Say')).toBeInTheDocument();
  });

  it('renders gallery section', () => {
    renderPage();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });
});
