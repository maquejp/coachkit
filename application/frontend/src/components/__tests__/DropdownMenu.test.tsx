import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

describe('DropdownMenu', () => {
  const items = [
    { label: 'Edit', onClick: vi.fn() },
    { label: 'Delete', onClick: vi.fn(), disabled: true },
    { label: 'Separator', onClick: vi.fn(), separator: true },
  ];

  it('renders trigger button', () => {
    render(<DropdownMenu trigger={<span>Menu</span>} items={items} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('shows items on trigger click', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<span>Menu</span>} items={items} />);
    await user.click(screen.getByText('Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders separator line', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<span>Menu</span>} items={items} />);
    await user.click(screen.getByText('Menu'));
    const separator = document.querySelector('.border-t');
    expect(separator).toBeTruthy();
  });

  it('renders with right alignment', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<span>Menu</span>} items={items} align="right" />);
    await user.click(screen.getByText('Menu'));
    const panel = document.querySelector('.right-0');
    expect(panel).toBeTruthy();
  });

  it('closes menu after item click', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<span>Menu</span>} items={items} />);
    await user.click(screen.getByText('Menu'));
    await user.click(screen.getByText('Edit'));
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('disables click handler when item is disabled', async () => {
    const user = userEvent.setup();
    const disabledOnClick = vi.fn();
    render(
      <DropdownMenu
        trigger={<span>Menu</span>}
        items={[{ label: 'Disabled', onClick: disabledOnClick, disabled: true }]}
      />,
    );
    await user.click(screen.getByText('Menu'));
    await user.click(screen.getByText('Disabled'));
    expect(disabledOnClick).not.toHaveBeenCalled();
  });
});
