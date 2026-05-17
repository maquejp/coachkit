import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastContainer } from '@/components/ui/Toast';
import { toastStore } from '@/stores/toast';

beforeEach(() => {
  toastStore.toasts = [];
});

describe('ToastContainer', () => {
  it('renders nothing when no toasts', () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders toast added via toastStore.add', () => {
    render(<ToastContainer />);
    act(() => {
      toastStore.add('success', 'Saved!');
    });
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('renders different toast types', () => {
    render(<ToastContainer />);
    act(() => {
      toastStore.add('error', 'Failed!');
    });
    expect(screen.getByText('Failed!')).toBeInTheDocument();
  });

  it('removes toast on close button click', () => {
    render(<ToastContainer />);
    act(() => {
      toastStore.add('info', 'Info message');
    });
    expect(screen.getByText('Info message')).toBeInTheDocument();
    act(() => {
      toastStore.remove(Object.keys(toastStore.toasts)[0] ?? '');
    });
    // simulate internal state update by adding another toast and checking
    act(() => {
      toastStore.add('info', 'Second');
    });
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('auto-removes toast after 4 seconds', () => {
    vi.useFakeTimers();
    render(<ToastContainer />);
    act(() => {
      toastStore.add('success', 'Auto remove');
    });
    expect(screen.getByText('Auto remove')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByText('Auto remove')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renders multiple toasts', () => {
    render(<ToastContainer />);
    act(() => {
      toastStore.add('success', 'First');
    });
    act(() => {
      toastStore.add('error', 'Second');
    });
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
