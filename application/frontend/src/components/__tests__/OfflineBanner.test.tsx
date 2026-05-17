import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock navigator.onLine before importing the component
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
  configurable: true,
});

describe('OfflineBanner', () => {
  beforeEach(async () => {
    // Reset to online before each test
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    });
    // Clear dynamic imports/module cache
    vi.resetModules();
  });

  it('does not render when online', async () => {
    const { OfflineBanner } = await import('@/components/OfflineBanner');
    const { container } = render(<OfflineBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders banner when navigator.onLine is false', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    });
    const { OfflineBanner } = await import('@/components/OfflineBanner');
    render(<OfflineBanner />);
    expect(
      screen.getByText('You are currently offline. Some features may be unavailable.'),
    ).toBeInTheDocument();
  });

  it('responds to offline event', async () => {
    const { OfflineBanner } = await import('@/components/OfflineBanner');
    render(<OfflineBanner />);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(
      screen.getByText('You are currently offline. Some features may be unavailable.'),
    ).toBeInTheDocument();
  });

  it('responds to online event', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    });
    const { OfflineBanner } = await import('@/components/OfflineBanner');
    render(<OfflineBanner />);
    expect(
      screen.getByText('You are currently offline. Some features may be unavailable.'),
    ).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(
      screen.queryByText('You are currently offline. Some features may be unavailable.'),
    ).not.toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { OfflineBanner } = await import('@/components/OfflineBanner');
    const { unmount } = render(<OfflineBanner />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
  });
});
