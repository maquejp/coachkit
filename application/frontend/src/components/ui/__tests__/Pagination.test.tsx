import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/components/ui/Pagination';

describe('Pagination', () => {
  it('returns null when total is <= 1', () => {
    const { container } = render(<Pagination current={1} total={1} onChange={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders page buttons for total > 1', () => {
    render(<Pagination current={1} total={3} onChange={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders Prev and Next buttons', () => {
    render(<Pagination current={2} total={3} onChange={vi.fn()} />);
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Prev on first page', () => {
    render(<Pagination current={1} total={3} onChange={vi.fn()} />);
    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('disables Next on last page', () => {
    render(<Pagination current={3} total={3} onChange={vi.fn()} />);
    expect(screen.getByText('Prev')).not.toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onChange with prev page on Prev click', async () => {
    const onChange = vi.fn();
    render(<Pagination current={3} total={5} onChange={onChange} />);
    await userEvent.click(screen.getByText('Prev'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with next page on Next click', async () => {
    const onChange = vi.fn();
    render(<Pagination current={3} total={5} onChange={onChange} />);
    await userEvent.click(screen.getByText('Next'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with page number on page button click', async () => {
    const onChange = vi.fn();
    render(<Pagination current={1} total={3} onChange={onChange} />);
    await userEvent.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('highlights the current page', () => {
    render(<Pagination current={2} total={3} onChange={vi.fn()} />);
    const activeBtn = screen.getByText('2');
    expect(activeBtn.className).toContain('bg-primary-600');
  });

  it('shows ellipsis for large page ranges', () => {
    render(<Pagination current={5} total={10} onChange={vi.fn()} />);
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
  });

  it('does not show ellipsis for small page ranges', () => {
    render(<Pagination current={2} total={3} onChange={vi.fn()} />);
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});
