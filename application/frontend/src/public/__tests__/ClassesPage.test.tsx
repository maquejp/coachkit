import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ClassesPage from '@/public/ClassesPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ClassesPage />
    </MemoryRouter>,
  );
}

describe('ClassesPage', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByText('Our Classes')).toBeInTheDocument();
  });

  it('renders all active class types from fixtures', () => {
    renderPage();
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    expect(screen.getByText('Pilates Flow')).toBeInTheDocument();
    expect(screen.getByText('Strength & Tone')).toBeInTheDocument();
    expect(screen.getByText('Boxing Fitness')).toBeInTheDocument();
    expect(screen.getByText('Meditation')).toBeInTheDocument();
  });

  it('renders durations for each class', () => {
    renderPage();
    expect(screen.getAllByText('60 min').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('45 min').length).toBe(2);
    expect(screen.getAllByText('30 min').length).toBe(1);
  });

  it('renders class descriptions', () => {
    renderPage();
    expect(
      screen.getByText('Gentle stretches and mindfulness to start your day.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('High-intensity interval training for maximum results.'),
    ).toBeInTheDocument();
  });

  it('renders intensity badges', () => {
    renderPage();
    const badges = screen.getAllByText(/beginner|intermediate|advanced/);
    expect(badges.length).toBeGreaterThanOrEqual(6);
  });
});
