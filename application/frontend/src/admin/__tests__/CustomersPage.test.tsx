import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import CustomersPage from '@/admin/CustomersPage';

const allCustomers = [
  {
    id: 'user-002',
    email: 'alice@example.test',
    role: 'customer',
    firstName: 'Alice',
    lastName: 'Johnson',
    phone: '+1-555-0102',
    avatarUrl: null,
    emailVerifiedAt: '2025-01-15T00:00:00Z',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'user-003',
    email: 'bob@example.test',
    role: 'customer',
    firstName: 'Bob',
    lastName: 'Smith',
    phone: '+1-555-0103',
    avatarUrl: null,
    emailVerifiedAt: '2025-02-01T00:00:00Z',
    createdAt: '2025-01-28T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
  },
];

const server = setupServer(
  http.get('/api/admin/customers', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

    let filtered = allCustomers;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      success: true,
      data: { items, total, totalPages, page, pageSize },
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <CustomersPage />
    </MemoryRouter>,
  );
}

describe('CustomersPage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Customers')).toBeInTheDocument());
  });

  it('renders total count', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/2 total customers/)).toBeInTheDocument();
    });
  });

  it('renders customer names', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });
  });

  it('renders customer emails', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('alice@example.test')).toBeInTheDocument();
    });
  });

  it('filters by search', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Bob Smith')).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText(/search/i), 'Alice');
    await waitFor(() => {
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });
  });

  it('links to customer detail', async () => {
    renderPage();
    await waitFor(() => {
      const link = screen.getByText('Alice Johnson');
      expect(link.closest('a')).toHaveAttribute('href', '/admin/customers/user-002');
    });
  });
});
