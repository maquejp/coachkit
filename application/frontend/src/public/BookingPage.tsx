import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

import { classTypes, weeklySchedule, coaches, locations, bookings } from '@/mocks/fixtures';
import type { ClassType, WeeklySchedule } from '@/types';
import { trackEvent } from '@/lib/analytics';

type Step = 'class' | 'day' | 'time' | 'info' | 'confirm' | 'success' | 'error';

interface FormData {
  classTypeId: string;
  dayOfWeek: number;
  timeSlotId: string;
  guestName: string;
  guestEmail: string;
}

const DAY_LABELS: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

function classTypeToIntensity(ct: ClassType): 'beginner' | 'intermediate' | 'advanced' {
  const d = ct.durationMinutes;
  if (d <= 35) return 'beginner';
  if (d <= 50) return 'intermediate';
  return 'advanced';
}

export default function BookingPage() {
  const [step, setStep] = useState<Step>('class');
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<WeeklySchedule | null>(null);
  const [formData, setFormData] = useState<FormData>({
    classTypeId: '',
    dayOfWeek: 0,
    timeSlotId: '',
    guestName: '',
    guestEmail: '',
  });
  const [bookingId, setBookingId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeTypes = classTypes.filter((ct) => ct.isActive);
  const activeSchedule = weeklySchedule.filter((s) => s.isActive);

  function selectClassType(ct: ClassType) {
    setSelectedClass(ct);
    setSelectedDay(null);
    setSelectedSlot(null);
    setFormData((prev) => ({ ...prev, classTypeId: ct.id, dayOfWeek: 0, timeSlotId: '' }));
    setStep('day');
  }

  const availableDays = selectedClass
    ? [
        ...new Set(
          activeSchedule.filter((s) => s.classTypeId === selectedClass.id).map((s) => s.dayOfWeek),
        ),
      ].sort()
    : [];

  function selectDay(day: number) {
    setSelectedDay(day);
    setSelectedSlot(null);
    setFormData((prev) => ({ ...prev, dayOfWeek: day, timeSlotId: '' }));
    setStep('time');
  }

  const timeSlots =
    selectedClass && selectedDay
      ? activeSchedule.filter(
          (s) => s.classTypeId === selectedClass.id && s.dayOfWeek === selectedDay,
        )
      : [];

  function selectTimeSlot(slot: WeeklySchedule) {
    setSelectedSlot(slot);
    setFormData((prev) => ({ ...prev, timeSlotId: slot.id }));
    setStep('info');
  }

  function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.guestName.trim() || !formData.guestEmail.trim()) return;
    setStep('confirm');
  }

  function confirmBooking() {
    const newId = `bkg-${String(bookings.length + 1).padStart(3, '0')}`;
    setBookingId(newId);
    trackEvent('booking_confirmed', {
      classTypeId: selectedClass?.id ?? '',
      dayOfWeek: selectedDay ?? 0,
      slotId: selectedSlot?.id ?? '',
    });
    setStep('success');
  }

  function handleErrorRetry() {
    setStep('class');
    setSelectedClass(null);
    setSelectedDay(null);
    setSelectedSlot(null);
    setErrorMsg('');
  }

  const viewClassesLink = '/classes';

  return (
    <>
      <SEO
        title="Book a Class"
        description="Book your next fitness class at CoachKit. Choose your class, day, and time slot."
        canonical="https://coachkit.app/book"
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book a Class</h1>
            <p className="mt-1 text-gray-600">Reserve your spot in just a few steps.</p>
          </div>
          {step !== 'success' && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              {(['class', 'day', 'time', 'info', 'confirm'] as Step[]).map((s, i) => {
                const stepOrder: Step[] = ['class', 'day', 'time', 'info', 'confirm'];
                const currentIdx = stepOrder.indexOf(step);
                const thisIdx = stepOrder.indexOf(s);
                return (
                  <div key={s} className="flex items-center gap-1">
                    {i > 0 && <span className="text-gray-300">—</span>}
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        thisIdx <= currentIdx
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {step === 'class' && (
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Choose a Class Type</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeTypes.map((ct) => {
                const intensity = classTypeToIntensity(ct);
                return (
                  <button
                    key={ct.id}
                    onClick={() => selectClassType(ct)}
                    className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <div className="mb-3 h-2 rounded-full" style={{ backgroundColor: ct.color }} />
                    <h3 className="font-semibold text-gray-900">{ct.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{ct.durationMinutes} min</p>
                    <Badge
                      color={
                        intensity === 'beginner'
                          ? 'green'
                          : intensity === 'intermediate'
                            ? 'warm'
                            : 'accent'
                      }
                      className="mt-2"
                    >
                      {intensity}
                    </Badge>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{ct.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">
              Not sure what to choose?{' '}
              <Link to={viewClassesLink} className="text-primary-600 hover:text-primary-700">
                View all classes
              </Link>
            </p>
          </section>
        )}

        {step === 'day' && selectedClass && (
          <section>
            <button
              onClick={() => setStep('class')}
              className="mb-4 text-sm text-primary-600 hover:text-primary-700"
            >
              &larr; Change class type
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Select a Day — {selectedClass.name}
            </h2>
            <p className="mb-6 text-sm text-gray-500">Pick a day that works for you.</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {availableDays.map((day) => {
                const slots = activeSchedule.filter(
                  (s) => s.classTypeId === selectedClass.id && s.dayOfWeek === day,
                );
                const totalCapacity = slots.reduce((sum, s) => sum + s.maxCapacity, 0);
                const existingBookings = bookings.filter(
                  (b) =>
                    b.classTypeId === selectedClass.id &&
                    b.status !== 'cancelled' &&
                    b.status !== 'no-show',
                ).length;
                const occupancy = Math.round((existingBookings / Math.max(totalCapacity, 1)) * 100);
                const isFull = occupancy >= 100;

                return (
                  <button
                    key={day}
                    onClick={() => (isFull ? null : selectDay(day))}
                    disabled={isFull}
                    className={`rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isFull
                        ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{DAY_LABELS[day]}</h3>
                    <p className="mt-1 text-sm text-gray-500">{slots.length} time slot(s)</p>
                    {isFull ? (
                      <Badge color="accent" className="mt-2">
                        Full
                      </Badge>
                    ) : (
                      <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${Math.min(occupancy, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          {slots.reduce((sum, s) => sum + s.maxCapacity, 0) - existingBookings}{' '}
                          spots remaining
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 'time' && selectedClass && selectedDay && (
          <section>
            <button
              onClick={() => setStep('day')}
              className="mb-4 text-sm text-primary-600 hover:text-primary-700"
            >
              &larr; Change day
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Choose a Time — {DAY_LABELS[selectedDay]}
            </h2>
            <p className="mb-6 text-sm text-gray-500">Select your preferred time slot.</p>
            <div className="space-y-3">
              {timeSlots.map((slot) => {
                const location = locations.find((l) => l.id === slot.locationId);
                const coach = coaches.find((c) => c.id === slot.coachId);
                return (
                  <button
                    key={slot.id}
                    onClick={() => selectTimeSlot(slot)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-gray-900">
                          {slot.startTime}
                        </span>
                        <span className="mx-2 text-gray-400">to</span>
                        <span className="text-lg font-semibold text-gray-900">{slot.endTime}</span>
                      </div>
                      <Badge color="green">{slot.maxCapacity} spots</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      {location && <span>{location.name}</span>}
                      {coach && <span>with {coach.name}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 'info' && (
          <section>
            <button
              onClick={() => setStep('time')}
              className="mb-4 text-sm text-primary-600 hover:text-primary-700"
            >
              &larr; Change time slot
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Your Information</h2>
            <p className="mb-6 text-sm text-gray-500">
              Enter your details to complete the booking.
            </p>
            <Card className="p-6">
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <FormField label="Full Name" required>
                  <Input
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, guestName: e.target.value }))
                    }
                    placeholder="Jane Doe"
                    required
                  />
                </FormField>
                <FormField label="Email Address" required>
                  <Input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, guestEmail: e.target.value }))
                    }
                    placeholder="jane@example.com"
                    required
                  />
                </FormField>
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  <p className="font-medium text-gray-700">First session free!</p>
                  <p className="mt-1">No credit card required. Your first class is on us.</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={!formData.guestName.trim() || !formData.guestEmail.trim()}
                  >
                    Continue to Review
                  </Button>
                </div>
              </form>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700">
                    Log in
                  </Link>
                </p>
              </div>
            </Card>
          </section>
        )}

        {step === 'confirm' && selectedClass && selectedSlot && (
          <section>
            <button
              onClick={() => setStep('info')}
              className="mb-4 text-sm text-primary-600 hover:text-primary-700"
            >
              &larr; Edit information
            </button>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Confirm Your Booking</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">Class</span>
                  <span className="font-medium text-gray-900">{selectedClass.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">Day</span>
                  <span className="font-medium text-gray-900">
                    {selectedDay ? DAY_LABELS[selectedDay] : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="font-medium text-gray-900">
                    {selectedSlot.startTime} — {selectedSlot.endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">
                    {locations.find((l) => l.id === selectedSlot.locationId)?.name ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">Instructor</span>
                  <span className="font-medium text-gray-900">
                    {coaches.find((c) => c.id === selectedSlot.coachId)?.name ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{formData.guestName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{formData.guestEmail}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={confirmBooking}>Confirm Booking</Button>
                <Button variant="outline" onClick={() => setStep('info')}>
                  Edit
                </Button>
              </div>
            </Card>
          </section>
        )}

        {step === 'success' && (
          <section className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="mt-2 text-gray-600">
              Your spot is reserved. We&apos;ve sent a confirmation to{' '}
              <span className="font-medium text-gray-900">{formData.guestEmail}</span>.
            </p>
            <Card className="mx-auto mt-8 max-w-sm p-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-mono font-medium text-gray-900">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Class</span>
                  <span className="font-medium text-gray-900">{selectedClass?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Day</span>
                  <span className="font-medium text-gray-900">
                    {selectedDay ? DAY_LABELS[selectedDay] : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-gray-900">
                    {selectedSlot?.startTime} — {selectedSlot?.endTime}
                  </span>
                </div>
              </div>
            </Card>
            <div className="mt-8 flex justify-center gap-3">
              <Button
                onClick={() => {
                  setStep('class');
                  setSelectedClass(null);
                  setSelectedDay(null);
                  setSelectedSlot(null);
                  setFormData({
                    classTypeId: '',
                    dayOfWeek: 0,
                    timeSlotId: '',
                    guestName: '',
                    guestEmail: '',
                  });
                }}
              >
                Book Another Class
              </Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </section>
        )}

        {step === 'error' && (
          <section className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Something Went Wrong</h2>
            <p className="mt-2 text-gray-600">
              {errorMsg || 'We could not complete your booking. Please try again.'}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={handleErrorRetry}>Try Again</Button>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
