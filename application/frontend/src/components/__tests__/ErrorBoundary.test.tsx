import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Use a module-level reference to trigger re-renders
let triggerError = false;

function ThrowOnRender() {
  if (triggerError) {
    throw new Error('test error');
  }
  return <p>All good</p>;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  triggerError = false;
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>Hello</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders fallback UI on error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
    triggerError = true;
    rerender(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const { rerender } = render(
      <ErrorBoundary fallback={<div>Custom Error</div>}>
        <ThrowOnRender />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
    triggerError = true;
    rerender(
      <ErrorBoundary fallback={<div>Custom Error</div>}>
        <ThrowOnRender />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('retry button resets error state', () => {
    triggerError = true;
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    triggerError = false;
    act(() => {
      fireEvent.click(screen.getByText('Retry'));
    });
    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
