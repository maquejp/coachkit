import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders default spinner', () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('animate-spin');
  });

  it('renders centered wrapper when centered is true', () => {
    const { container } = render(<Spinner centered />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('justify-center');
    expect(wrapper.className).toContain('py-12');
    const spinner = wrapper.firstChild as HTMLElement;
    expect(spinner.className).toContain('animate-spin');
  });

  it('applies size classes correctly', () => {
    const { container: sm } = render(<Spinner size="sm" />);
    expect((sm.firstChild as HTMLElement).className).toContain('h-4');

    const { container: md } = render(<Spinner size="md" />);
    expect((md.firstChild as HTMLElement).className).toContain('h-6');

    const { container: lg } = render(<Spinner size="lg" />);
    expect((lg.firstChild as HTMLElement).className).toContain('h-10');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="my-spinner" />);
    expect((container.firstChild as HTMLElement).className).toContain('my-spinner');
  });
});
