import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ContactPage from '@/public/ContactPage';

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
    expect(screen.getByText('Send us a message')).toBeInTheDocument();
  });

  it('renders locations heading', () => {
    renderPage();
    expect(screen.getByText('Visit us')).toBeInTheDocument();
  });

  it('renders active location names from fixtures', () => {
    renderPage();
    expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument();
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
