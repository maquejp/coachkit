import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import LoginPage from '@/public/LoginPage';

const server = setupServer(
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    if (email === 'alice@example.test') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'user-002',
            email: 'alice@example.test',
            role: 'customer',
            firstName: 'Alice',
            lastName: 'Johnson',
            emailVerifiedAt: '2025-01-15T00:00:00Z',
            createdAt: '2025-01-10T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
          },
          token: 'mock-token-user-002',
        },
      });
    }
    return HttpResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('renders the login form', () => {
    renderPage();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    renderPage();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders links to register and forgot password', () => {
    renderPage();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'wrong@example.test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByText('Log In'));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('shows loading state while logging in', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'alice@example.test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText('Log In'));
    expect(screen.getByText('Logging in…')).toBeInTheDocument();
  });
});
