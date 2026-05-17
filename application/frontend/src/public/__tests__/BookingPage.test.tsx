import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { classTypeHandlers } from '@/mocks/handlers/classTypes';
import { coachHandlers } from '@/mocks/handlers/coaches';
import { locationHandlers } from '@/mocks/handlers/locations';
import { scheduleHandlers } from '@/mocks/handlers/schedule';
import BookingPage from '@/public/BookingPage';

let claimStore: Array<{ email: string; bookingId: string }> = [];

const server = setupServer(
  ...classTypeHandlers,
  ...coachHandlers,
  ...locationHandlers,
  ...scheduleHandlers,

  http.get('/api/free-session-claims/check', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const existing = claimStore.find((c) => c.email === email);
    return HttpResponse.json({
      success: true,
      data: { claimed: !!existing, claim: existing ?? null },
    });
  }),

  http.post('/api/free-session-claims', async ({ request }) => {
    const body = (await request.json()) as { email: string; bookingId: string };
    claimStore.push(body);
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'fsc-test-001',
          email: body.email,
          userId: null,
          bookingId: body.bookingId,
          claimedAt: new Date().toISOString(),
          activatedAt: null,
        },
      },
      { status: 201 },
    );
  }),

  http.post('/api/bookings', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: 'bkg-test-001',
          ...body,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  }),

  http.post('/api/guest/register', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: {
          user: {
            id: 'user-guest-001',
            email: body.email,
            role: 'customer',
            firstName: body.firstName,
            lastName: body.lastName,
            emailVerifiedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-token-guest',
        },
      },
      { status: 201 },
    );
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
  claimStore = [];
});
afterAll(() => server.close());

function renderPage() {
  return render(
    <MemoryRouter>
      <BookingPage />
    </MemoryRouter>,
  );
}

async function navigateToInfo() {
  await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
  fireEvent.click(screen.getByText('Morning Yoga'));
  const monday = screen.getByText('Monday').closest('button');
  if (monday) fireEvent.click(monday);
  const timeSlot = screen.getByText('07:00').closest('button');
  if (timeSlot) fireEvent.click(timeSlot);
  await waitFor(() => expect(screen.getByText('Your Information')).toBeInTheDocument());
}

async function fillInfoAndContinue(email = 'test@test.com', name = 'Test User') {
  await navigateToInfo();
  fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: name } });
  fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
    target: { value: email },
  });
  fireEvent.click(screen.getByText('Continue to Review'));
}

describe('BookingPage', () => {
  it('renders the heading and description', () => {
    renderPage();
    expect(screen.getByText('Book a Class')).toBeInTheDocument();
    expect(screen.getByText('Reserve your spot in just a few steps.')).toBeInTheDocument();
  });

  it('renders class type selection grid with all active class types', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    expect(screen.getByText('HIIT Circuit')).toBeInTheDocument();
    expect(screen.getByText('Pilates Flow')).toBeInTheDocument();
    expect(screen.getByText('Strength & Tone')).toBeInTheDocument();
    expect(screen.getByText('Boxing Fitness')).toBeInTheDocument();
    expect(screen.getByText('Meditation')).toBeInTheDocument();
  });

  it('shows step 1 active in the progress indicator', () => {
    renderPage();
    const steps = screen.getAllByText(/[1-5]/);
    expect(steps.length).toBeGreaterThanOrEqual(5);
  });

  it('has a link to classes page', () => {
    renderPage();
    const link = screen.getByText('View all classes');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/classes');
  });

  it('advances to day selection when a class type is clicked', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Morning Yoga'));
    expect(screen.getByText(/Select a Day/)).toBeInTheDocument();
    expect(screen.getByText(/Monday/)).toBeInTheDocument();
  });

  it('shows back link to change class type on day step', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Morning Yoga'));
    expect(screen.getByText(/Change class type/)).toBeInTheDocument();
  });

  it('advances to time slot selection when a day is clicked', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    expect(screen.getByText(/Choose a Time/)).toBeInTheDocument();
  });

  it('advances to info form when a time slot is clicked', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Morning Yoga')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    const timeSlot = screen.getByText('07:00').closest('button');
    if (timeSlot) fireEvent.click(timeSlot);
    expect(screen.getByText('Your Information')).toBeInTheDocument();
  });

  it('shows confirmation step after info is submitted with unclaimed email', async () => {
    renderPage();
    await fillInfoAndContinue();
    await waitFor(() => expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument());
  });

  it('shows error when email has already claimed a free session', async () => {
    claimStore.push({ email: 'used@test.com', bookingId: 'bkg-999' });
    renderPage();
    await fillInfoAndContinue('used@test.com');
    await waitFor(() => {
      expect(
        screen.getByText(
          'This email has already used a free session. Please log in to book additional classes.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('shows success step after confirming booking', async () => {
    renderPage();
    await fillInfoAndContinue();
    await waitFor(() => expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument());
  });

  it('shows booking ID on success', async () => {
    renderPage();
    await fillInfoAndContinue();
    await waitFor(() => expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => expect(screen.getByText(/bkg-/)).toBeInTheDocument());
  });

  it('renders back to home link on success', async () => {
    renderPage();
    await fillInfoAndContinue();
    await waitFor(() => expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => expect(screen.getByText('Back to Home')).toBeInTheDocument());
  });

  it('shows create account form on success for guest users', async () => {
    renderPage();
    await fillInfoAndContinue();
    await waitFor(() => expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => {
      expect(screen.getByText('Create Your Free Account')).toBeInTheDocument();
    });
  });

  it('shows error step when booking API fails', async () => {
    server.use(
      http.post('/api/bookings', async () => {
        return HttpResponse.json({ success: false, error: 'Server error' }, { status: 500 });
      }),
    );
    renderPage();
    await fillInfoAndContinue();
    await waitFor(() => expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => expect(screen.getByText('Something Went Wrong')).toBeInTheDocument());
  });
});
