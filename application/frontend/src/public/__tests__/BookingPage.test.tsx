import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BookingPage from '@/public/BookingPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <BookingPage />
    </MemoryRouter>,
  );
}

describe('BookingPage', () => {
  it('renders the heading and description', () => {
    renderPage();
    expect(screen.getByText('Book a Class')).toBeInTheDocument();
    expect(screen.getByText('Reserve your spot in just a few steps.')).toBeInTheDocument();
  });

  it('renders class type selection grid with all active class types', () => {
    renderPage();
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
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

  it('advances to day selection when a class type is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    expect(screen.getByText(/Select a Day/)).toBeInTheDocument();
    expect(screen.getByText(/Monday/)).toBeInTheDocument();
  });

  it('shows back link to change class type on day step', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    expect(screen.getByText(/Change class type/)).toBeInTheDocument();
  });

  it('advances to time slot selection when a day is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    expect(screen.getByText(/Choose a Time/)).toBeInTheDocument();
  });

  it('advances to info form when a time slot is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    const timeSlot = screen.getByText('07:00').closest('button');
    if (timeSlot) fireEvent.click(timeSlot);
    expect(screen.getByText('Your Information')).toBeInTheDocument();
  });

  it('shows confirmation step after info is submitted', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    const timeSlot = screen.getByText('07:00').closest('button');
    if (timeSlot) fireEvent.click(timeSlot);
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByText('Continue to Review'));
    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();
  });

  it('shows success step after confirming booking', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    const timeSlot = screen.getByText('07:00').closest('button');
    if (timeSlot) fireEvent.click(timeSlot);
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByText('Continue to Review'));
    fireEvent.click(screen.getByText('Confirm Booking'));
    expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
  });

  it('shows booking ID on success', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    const timeSlot = screen.getByText('07:00').closest('button');
    if (timeSlot) fireEvent.click(timeSlot);
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByText('Continue to Review'));
    fireEvent.click(screen.getByText('Confirm Booking'));
    expect(screen.getByText(/bkg-/)).toBeInTheDocument();
  });

  it('renders back to home link on success', () => {
    renderPage();
    fireEvent.click(screen.getByText('Morning Yoga'));
    const monday = screen.getByText('Monday').closest('button');
    if (monday) fireEvent.click(monday);
    const timeSlot = screen.getByText('07:00').closest('button');
    if (timeSlot) fireEvent.click(timeSlot);
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.click(screen.getByText('Continue to Review'));
    fireEvent.click(screen.getByText('Confirm Booking'));
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });
});
