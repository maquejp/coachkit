import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClickOutside } from '@/hooks/useClickOutside';

describe('useClickOutside', () => {
  let handler: ReturnType<typeof vi.fn>;
  let ref: { current: HTMLDivElement | null };

  beforeEach(() => {
    handler = vi.fn();
    ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);
  });

  it('calls handler when clicking outside', () => {
    renderHook(() => useClickOutside(ref, handler));
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when clicking inside', () => {
    renderHook(() => useClickOutside(ref, handler));
    act(() => {
      ref.current!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useClickOutside(ref, handler));
    unmount();
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(handler).not.toHaveBeenCalled();
  });
});
