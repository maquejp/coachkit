import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ErrorPage from '@/components/ErrorPage';

function renderWithErrorRoute() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        errorElement: <ErrorPage />,
        element: <div />,
      },
    ],
    { initialEntries: ['/nonexistent'], initialIndex: 0 },
  );
  return render(<RouterProvider router={router} />);
}

describe('ErrorPage', () => {
  it('renders 404 error state for nonexistent route', async () => {
    renderWithErrorRoute();
    expect(await screen.findByText('Page not found')).toBeInTheDocument();
    expect(
      await screen.findByText('The page you are looking for does not exist.'),
    ).toBeInTheDocument();
  });

  it('renders back to home link', async () => {
    renderWithErrorRoute();
    const link = await screen.findByRole('link', { name: 'Back to home' });
    expect(link).toHaveAttribute('href', '/');
  });
});
