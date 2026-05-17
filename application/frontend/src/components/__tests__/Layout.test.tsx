import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Layout from '@/components/Layout';

vi.mock('@/components/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('@/components/Footer', () => ({ default: () => <div>Footer</div> }));
vi.mock('@/components/JSONLD', () => ({ default: () => <div>JSONLD</div> }));
vi.mock('@/components/ui/Toast', () => ({ ToastContainer: () => <div>Toast</div> }));
vi.mock('@/components/OfflineBanner', () => ({ OfflineBanner: () => <div>Offline</div> }));
vi.mock('@/lib/analytics', () => ({ trackPageView: vi.fn() }));

describe('Layout', () => {
  it('renders header, footer, and outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
    expect(screen.getByText('Toast')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});
