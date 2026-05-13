import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import AboutPage from '@/public/AboutPage';

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

  it('renders all active coaches from fixtures', () => {
    renderPage();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('Jordan Chen')).toBeInTheDocument();
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Marcus Webb')).toBeInTheDocument();
  });

  it('renders locations section', () => {
    renderPage();
    expect(screen.getByText('Our Locations')).toBeInTheDocument();
  });

  it('renders active location names from fixtures', () => {
    renderPage();
    expect(screen.getByText('CoachKit Downtown')).toBeInTheDocument();
    expect(screen.getByText('CoachKit Eastside')).toBeInTheDocument();
  });
});
