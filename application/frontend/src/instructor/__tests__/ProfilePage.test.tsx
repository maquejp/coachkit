import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import InstructorProfilePage from '@/instructor/ProfilePage';
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
  bio: 'Yoga & Mindfulness — 10+ years.',
  coachId: 'coach-001',
  emailVerifiedAt: null,
  createdAt: '',
  updatedAt: '',
};

const server = setupServer(
  http.get('/api/coaches/:coachId', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'coach-001',
        name: 'Alex Rivera',
        bio: 'Yoga & Mindfulness — 10+ years.',
        email: 'alex@coachkit.test',
        phone: '+1-555-2001',
        photoUrl: null,
        isActive: true,
      },
    });
  }),

  http.put('/api/coaches/:coachId', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        id: 'coach-001',
        name: body.name ?? 'Alex Rivera',
        bio: body.bio ?? 'Yoga & Mindfulness.',
        email: 'alex@coachkit.test',
        phone: body.phone ?? null,
        photoUrl: body.photoUrl ?? null,
        isActive: true,
      },
    });
  }),

  http.put('/api/profile/password', () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  http.delete('/api/profile', () => {
    return HttpResponse.json({ success: true, data: null });
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
      <InstructorProfilePage />
    </MemoryRouter>,
  );
}

describe('InstructorProfilePage', () => {
  it('renders page title', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeInTheDocument();
    });
  });

  it('renders personal information card', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });
  });

  it('renders name and email inputs', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    });
  });

  it('renders biography textarea in personal info card', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Biography')).toBeInTheDocument();
    });
  });

  it('saves changes and shows confirmation', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('My Profile')).toBeInTheDocument());
    const nameInput = screen.getByLabelText('Full Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Alex R.');
    await userEvent.click(screen.getByText('Save Changes'));
    await waitFor(() => {
      expect(screen.getByText('Profile updated.')).toBeInTheDocument();
    });
  });

  it('renders change password section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });
  });

  it('renders danger zone', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Danger Zone')).toBeInTheDocument();
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
    });
  });
});
