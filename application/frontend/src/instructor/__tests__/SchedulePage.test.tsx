import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import InstructorSchedulePage from '@/instructor/SchedulePage';
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
  http.get('/api/instructor/schedule', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'sched-001',
          classTypeId: 'ct-001',
          locationId: 'loc-001',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:00',
          maxCapacity: 20,
          isActive: true,
        },
        {
          id: 'sched-002',
          classTypeId: 'ct-002',
          locationId: 'loc-001',
          dayOfWeek: 3,
          startTime: '14:00',
          endTime: '15:00',
          maxCapacity: 15,
          isActive: true,
        },
      ],
    });
  }),

  http.get('/api/class-types', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'ct-001',
          name: 'Morning Yoga',
          color: '#E879F9',
          durationMinutes: 60,
          isActive: true,
        },
        {
          id: 'ct-002',
          name: 'HIIT Circuit',
          color: '#F97316',
          durationMinutes: 45,
          isActive: true,
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
      <InstructorSchedulePage />
    </MemoryRouter>,
  );
}

describe('InstructorSchedulePage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('My Schedule')).toBeInTheDocument();
    });
  });

  it('renders day columns', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
    });
  });

  it('renders class names', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
      expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    });
  });

  it('renders time slots', async () => {
    renderPage();
    await waitFor(() => {
      const times = screen.getAllByText(/9:00|10:00|2:00|3:00/);
      expect(times.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows empty day', async () => {
    renderPage();
    await waitFor(() => {
      const emptyDays = screen.getAllByText('No classes');
      expect(emptyDays.length).toBeGreaterThanOrEqual(1);
    });
  });
});
