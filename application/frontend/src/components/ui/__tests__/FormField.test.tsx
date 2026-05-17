import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from '@/components/ui/FormField';

describe('FormField', () => {
  it('renders label', () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders required asterisk', () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    const label = screen.getByText('Email');
    expect(label.innerHTML).toContain('*');
  });

  it('renders error message', () => {
    render(
      <FormField label="Email" error="Required">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders help text when no error', () => {
    render(
      <FormField label="Email" helpText="Enter your email">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('hides help text when error is present', () => {
    render(
      <FormField label="Email" helpText="Enter your email" error="Required">
        <input />
      </FormField>,
    );
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
  });

  it('passes id to child when has a label', () => {
    render(
      <FormField label="Email Address">
        <input />
      </FormField>,
    );
    const input = screen.getByLabelText('Email Address');
    expect(input).toBeInTheDocument();
  });
});
