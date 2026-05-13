import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PricingPage from '@/public/PricingPage';

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

  it('renders subscription plan names from fixtures', () => {
    renderPage();
    expect(screen.getByText('Drop-In')).toBeInTheDocument();
    expect(screen.getByText('Monthly Unlimited')).toBeInTheDocument();
    expect(screen.getByText('Annual Unlimited')).toBeInTheDocument();
    expect(screen.getByText('Student Monthly')).toBeInTheDocument();
  });

  it('renders subscription prices from fixtures', () => {
    renderPage();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('$899')).toBeInTheDocument();
    expect(screen.getByText('$69')).toBeInTheDocument();
  });

  it('renders class pack (point card) section', () => {
    renderPage();
    expect(screen.getByText('Class Packs')).toBeInTheDocument();
    expect(screen.getByText('5-Class Pack')).toBeInTheDocument();
    expect(screen.getByText('10-Class Pack')).toBeInTheDocument();
    expect(screen.getByText('20-Class Pack')).toBeInTheDocument();
  });

  it('renders point card prices from fixtures', () => {
    renderPage();
    expect(screen.getByText('$90')).toBeInTheDocument();
    expect(screen.getByText('$160')).toBeInTheDocument();
    expect(screen.getByText('$280')).toBeInTheDocument();
  });

  it('renders single session pricing section', () => {
    renderPage();
    expect(screen.getByText('Single Session')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });
});
