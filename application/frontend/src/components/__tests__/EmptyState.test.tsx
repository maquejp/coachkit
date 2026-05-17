import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '@/components/EmptyState';

describe('EmptyState', () => {
  it('renders default icon, title and message', () => {
    render(<EmptyState />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText('No data available at the moment.')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<EmptyState title="No Items" message="Nothing to show" />);
    expect(screen.getByText('No Items')).toBeInTheDocument();
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<EmptyState icon="🎯" />);
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('renders action element', () => {
    render(<EmptyState action={<button>Create</button>} />);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
