import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AuthLayout from '@/components/AuthLayout';

vi.mock('@/components/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('@/components/Sidebar', () => ({ default: () => <div>Sidebar</div> }));
vi.mock('@/components/ui/Toast', () => ({ ToastContainer: () => <div>Toast</div> }));
vi.mock('@/components/OfflineBanner', () => ({ OfflineBanner: () => <div>Offline</div> }));

describe('AuthLayout', () => {
  it('renders outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  it('renders sidebar and header', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
  });
});
