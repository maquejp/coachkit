import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { coachHandlers } from '@/mocks/handlers/coaches';
import { locationHandlers } from '@/mocks/handlers/locations';
import AboutPage from '@/public/AboutPage';

const server = setupServer(...coachHandlers, ...locationHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );
}

describe('AboutPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('renders mission section', () => {
    renderPage();
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
  });

  it('renders vision section', () => {
    renderPage();
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders instructors section heading', () => {
    renderPage();
    expect(screen.getByText('Meet Our Instructors')).toBeInTheDocument();
  });

  it('renders all active coaches from fixtures', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Alex Rivera')).toBeInTheDocument());
    expect(screen.getByText('Jordan Chen')).toBeInTheDocument();
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Marcus Webb')).toBeInTheDocument();
  });

  it('renders locations section', () => {
    renderPage();
    expect(screen.getByText('Our Locations')).toBeInTheDocument();
  });

  it('renders active location names from fixtures', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument());
    expect(screen.getByText('CoachKit Eastside')).toBeInTheDocument();
  });
});
