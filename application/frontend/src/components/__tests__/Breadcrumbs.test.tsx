import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Breadcrumbs from '@/components/Breadcrumbs';

function renderWithPath(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );
}

describe('Breadcrumbs', () => {
  it('renders nothing on root path', () => {
    const { container } = renderWithPath('/');
    expect(container.innerHTML).toBe('');
  });

  it('renders home link and segment for /admin', () => {
    renderWithPath('/admin');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders all segments for nested path', () => {
    renderWithPath('/admin/classes');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Classes')).toBeInTheDocument();
  });

  it('marks last segment as bold text not link', () => {
    renderWithPath('/admin/settings');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
