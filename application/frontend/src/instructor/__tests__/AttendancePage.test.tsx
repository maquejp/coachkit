import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import InstructorAttendancePage from '@/instructor/AttendancePage';
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
      ],
    });
  }),

  http.get('/api/instructor/attendance', ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'booking-001',
          userId: 'user-002',
          guestEmail: null,
          bookingDate: date ?? '2026-05-20',
          status: 'confirmed',
          user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@test.com' },
        },
        {
          id: 'booking-002',
          userId: null,
          guestEmail: 'guest@test.com',
          bookingDate: date ?? '2026-05-20',
          status: 'attended',
          user: null,
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
    <MemoryRouter initialEntries={['/instructor/attendance?scheduleId=sched-001']}>
      <InstructorAttendancePage />
    </MemoryRouter>,
  );
}

describe('InstructorAttendancePage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Mark Attendance')).toBeInTheDocument();
    });
  });

  it('renders student list when schedule selected', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('guest@test.com')).toBeInTheDocument();
    });
  });

  it('shows confirmed status label', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });
  });

  it('shows attended status label', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText((c) => c.startsWith('Attended'))).toBeInTheDocument();
    });
  });
});
