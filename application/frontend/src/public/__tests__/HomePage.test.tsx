import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HomePage from '@/public/HomePage';

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

  it('renders Our Classes section', () => {
    renderPage();
    expect(screen.getByText('Our Classes')).toBeInTheDocument();
    expect(screen.getAllByText('Morning Yoga').length).toBeGreaterThanOrEqual(1);
  });

  it('renders instructors section', () => {
    renderPage();
    expect(screen.getByText('Meet Our Instructors')).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
  });

  it('renders weekly schedule section', () => {
    renderPage();
    expect(screen.getByText("This Week's Schedule")).toBeInTheDocument();
  });

  it('renders pricing section', () => {
    renderPage();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('renders reviews carousel', () => {
    renderPage();
    expect(screen.getByText('What Our Members Say')).toBeInTheDocument();
  });

  it('renders gallery section', () => {
    renderPage();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  it('renders social media section', () => {
    renderPage();
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });
});
