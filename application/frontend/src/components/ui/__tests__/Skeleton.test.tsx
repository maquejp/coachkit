import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders text variant by default', () => {
    const { container } = render(<Skeleton />);
    const lines = container.querySelectorAll('.space-y-2 > div');
    expect(lines).toHaveLength(3);
  });

  it('renders specified number of lines', () => {
    const { container } = render(<Skeleton lines={5} />);
    const lines = container.querySelectorAll('.space-y-2 > div');
    expect(lines).toHaveLength(5);
  });

  it('renders avatar variant', () => {
    const { container } = render(<Skeleton variant="avatar" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-full');
    expect(el.className).toContain('h-10');
    expect(el.className).toContain('w-10');
  });

  it('renders card variant', () => {
    const { container } = render(<Skeleton variant="card" />);
    const innerLines = container.querySelectorAll('.rounded-xl > div');
    expect(innerLines).toHaveLength(3);
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="my-custom" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-custom');
  });
});
