import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { locationHandlers } from '@/mocks/handlers/locations';
import ContactPage from '@/public/ContactPage';

const server = setupServer(...locationHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>,
  );
}

describe('ContactPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    renderPage();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('renders locations heading', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Visit us')).toBeInTheDocument());
  });

  it('renders active location names from fixtures', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument());
    expect(screen.getByText('CoachKit Eastside')).toBeInTheDocument();
  });

  it('renders form labels', () => {
    renderPage();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderPage();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });
});
