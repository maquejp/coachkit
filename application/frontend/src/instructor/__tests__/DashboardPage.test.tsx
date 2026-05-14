import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import InstructorDashboardPage from '@/instructor/DashboardPage';
import { useAuthStore } from '@/stores/auth';

const mockInstructorUser = {
  id: 'user-012',
  email: 'alex@coachkit.test',
  role: 'instructor' as const,
  fullName: 'Alex Rivera',
  firstName: 'Alex',
  lastName: 'Rivera',
  phone: '+1-555-2001',
  photoUrl: null,
  bio: 'Yoga & Mindfulness.',
  coachId: 'coach-001',
  emailVerifiedAt: null,
  createdAt: '',
  updatedAt: '',
};

const server = setupServer(
  http.get('/api/instructor/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        upcomingClasses: 5,
        totalStudents: 12,
        classesThisWeek: 3,
      },
    });
  }),

  http.get('/api/instructor/upcoming', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'booking-001',
          userId: 'user-002',
          guestEmail: null,
          bookingDate: '2026-05-20',
          status: 'confirmed',
          user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@test.com' },
        },
      ],
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  useAuthStore.setState({ user: null, token: null, isLoading: false });
});
afterAll(() => server.close());

function renderPage() {
  useAuthStore.setState({
    user: mockInstructorUser,
    token: 'mock-token-user-012',
    isLoading: false,
  });
  return render(
    <MemoryRouter>
      <InstructorDashboardPage />
    </MemoryRouter>,
  );
}

describe('InstructorDashboardPage', () => {
  it('renders welcome message', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/welcome.*alex/i)).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Upcoming Classes')).toBeInTheDocument();
      expect(screen.getByText('Classes This Week')).toBeInTheDocument();
      expect(screen.getByText('Total Students')).toBeInTheDocument();
    });
  });

  it('renders stat values', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  it('renders upcoming bookings', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('2026-05-20')).toBeInTheDocument();
    });
  });

  it('renders View Schedule link', async () => {
    renderPage();
    await waitFor(() => {
      const link = screen.getByText('View Schedule');
      expect(link.closest('a')).toHaveAttribute('href', '/instructor/schedule');
    });
  });
});
