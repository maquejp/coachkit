import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';

import { classTypes, weeklySchedule, coaches, locations, bookings } from '@/mocks/fixtures';
import type { ClassType, WeeklySchedule } from '@/types';
import { trackEvent } from '@/lib/analytics';
import { guestCheckClaimApi, guestCreateClaimApi, guestRegisterApi } from '@/api/guest';
import { useAuthStore } from '@/stores/auth';

type Step = 'class' | 'day' | 'time' | 'info' | 'confirm' | 'success' | 'error';

interface FormData {
  classTypeId: string;
  dayOfWeek: number;
  timeSlotId: string;
  guestName: string;
  guestEmail: string;
}

function classTypeToIntensity(ct: ClassType): 'beginner' | 'intermediate' | 'advanced' {
  const d = ct.durationMinutes;
  if (d <= 35) return 'beginner';
  if (d <= 50) return 'intermediate';
  return 'advanced';
}

export default function BookingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const DAY_LABELS: Record<number, string> = {
    1: t('bookingPage.days.monday'),
    2: t('bookingPage.days.tuesday'),
    3: t('bookingPage.days.wednesday'),
    4: t('bookingPage.days.thursday'),
    5: t('bookingPage.days.friday'),
    6: t('bookingPage.days.saturday'),
    7: t('bookingPage.days.sunday'),
  };

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
  const [claimId, setClaimId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [checkingClaim, setCheckingClaim] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activationPassword, setActivationPassword] = useState('');
  const [activationPasswordConfirm, setActivationPasswordConfirm] = useState('');
  const [activationError, setActivationError] = useState('');

  const activeTypes = classTypes.filter((ct) => ct.isActive);
  const activeSchedule = weeklySchedule.filter((s) => s.isActive);

  function selectClassType(ct: ClassType) {
    setSelectedClass(ct);
    setSelectedDay(null);
    setSelectedSlot(null);
    setFormData((prev) => ({ ...prev, classTypeId: ct.id, dayOfWeek: 0, timeSlotId: '' }));
    setErrorMsg('');
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
    setErrorMsg('');
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
    setErrorMsg('');
    if (token && user) {
      setFormData((prev) => ({ ...prev, guestName: user.fullName ?? '', guestEmail: user.email }));
      setStep('confirm');
    } else {
      setStep('info');
    }
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.guestName.trim() || !formData.guestEmail.trim()) return;

    setCheckingClaim(true);
    setErrorMsg('');
    try {
      const res = await guestCheckClaimApi(formData.guestEmail);
      if (res.data.claimed) {
        setErrorMsg(t('bookingPage.errors.freeSessionUsed'));
        return;
      }
      setStep('confirm');
    } catch {
      setErrorMsg(t('bookingPage.errors.verifyEmail'));
    } finally {
      setCheckingClaim(false);
    }
  }

  async function confirmBooking() {
    setConfirming(true);
    setErrorMsg('');
    try {
      const bookingPayload = {
        userId: null,
        guestEmail: formData.guestEmail,
        classTypeId: selectedClass?.id ?? '',
        scheduleId: selectedSlot?.id ?? '',
        date: new Date().toISOString().split('T')[0],
      };
      const { default: client } = await import('@/api/client');
      const bookingRes = await client.post('/bookings', bookingPayload);
      const newBooking = bookingRes.data.data;
      setBookingId(newBooking.id);

      const claimRes = await guestCreateClaimApi({
        email: formData.guestEmail,
        bookingId: newBooking.id,
      });
      setClaimId(claimRes.data.id);

      trackEvent('booking_confirmed', {
        classTypeId: selectedClass?.id ?? '',
        dayOfWeek: selectedDay ?? 0,
        slotId: selectedSlot?.id ?? '',
      });
      setStep('success');
    } catch {
      setErrorMsg(t('bookingPage.errors.generic'));
      setStep('error');
    } finally {
      setConfirming(false);
    }
  }

  async function handleActivationSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActivationError('');
    if (activationPassword.length < 6) {
      setActivationError(t('bookingPage.errors.passwordLength'));
      return;
    }
    if (activationPassword !== activationPasswordConfirm) {
      setActivationError(t('bookingPage.errors.passwordMismatch'));
      return;
    }
    setActivating(true);
    try {
      const res = await guestRegisterApi({
        email: formData.guestEmail,
        password: activationPassword,
        firstName: formData.guestName.split(' ')[0] || formData.guestName,
        lastName: formData.guestName.split(' ').slice(1).join(' ') || '',
        claimId,
      });
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch {
      setActivationError(t('bookingPage.errors.createAccount'));
    } finally {
      setActivating(false);
    }
  }

  function handleErrorRetry() {
    setStep('class');
    setSelectedClass(null);
    setSelectedDay(null);
    setSelectedSlot(null);
    setErrorMsg('');
  }

  function resetFlow() {
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
    setBookingId('');
    setClaimId('');
    setErrorMsg('');
  }

  const viewClassesLink = '/classes';

  return (
    <>
      <SEO
        title={t('seo.bookingTitle')}
        description={t('seo.bookingDescription')}
        canonical="https://coachkit.app/book"
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('bookingPage.heading')}</h1>
            <p className="mt-1 text-gray-600">{t('bookingPage.subtitle')}</p>
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
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t('bookingPage.chooseClassType')}
            </h2>
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
              {t('bookingPage.notSure')}{' '}
              <Link to={viewClassesLink} className="text-primary-600 hover:text-primary-700">
                {t('bookingPage.viewAllClasses')}
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
              {t('bookingPage.changeClassType')}
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {t('bookingPage.selectDay', { className: selectedClass.name })}
            </h2>
            <p className="mb-6 text-sm text-gray-500">{t('bookingPage.pickDay')}</p>
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
                    <p className="mt-1 text-sm text-gray-500">
                      {t('bookingPage.timeSlots', { count: slots.length })}
                    </p>
                    {isFull ? (
                      <Badge color="accent" className="mt-2">
                        {t('bookingPage.full')}
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
                          {t('bookingPage.spotsRemaining', {
                            count:
                              slots.reduce((sum, s) => sum + s.maxCapacity, 0) - existingBookings,
                          })}
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
              {t('bookingPage.changeDay')}
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {t('bookingPage.chooseTime', { day: DAY_LABELS[selectedDay] })}
            </h2>
            <p className="mb-6 text-sm text-gray-500">{t('bookingPage.selectTime')}</p>
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
                        <span className="mx-2 text-gray-400">{t('bookingPage.to')}</span>
                        <span className="text-lg font-semibold text-gray-900">{slot.endTime}</span>
                      </div>
                      <Badge color="green">
                        {t('bookingPage.spots', { count: slot.maxCapacity })}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      {location && (
                        <span className="flex items-center gap-1">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: location.color }}
                          />
                          {location.name}
                        </span>
                      )}
                      {coach && (
                        <span>{t('bookingPage.withInstructor', { name: coach.name })}</span>
                      )}
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
              {t('bookingPage.changeTimeSlot')}
            </button>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {t('bookingPage.yourInformation')}
            </h2>
            <p className="mb-6 text-sm text-gray-500">{t('bookingPage.enterDetails')}</p>
            <Card className="p-6">
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <FormField label={t('bookingPage.fullName')} required>
                  <Input
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, guestName: e.target.value }))
                    }
                    placeholder={t('bookingPage.namePlaceholder')}
                    required
                  />
                </FormField>
                <FormField label={t('bookingPage.emailAddress')} required error={errorMsg}>
                  <Input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, guestEmail: e.target.value }));
                      setErrorMsg('');
                    }}
                    placeholder={t('bookingPage.emailPlaceholder')}
                    error={!!errorMsg}
                    required
                  />
                </FormField>
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  <p className="font-medium text-gray-700">{t('bookingPage.firstSessionFree')}</p>
                  <p className="mt-1">{t('bookingPage.noCreditCard')}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={
                      !formData.guestName.trim() || !formData.guestEmail.trim() || checkingClaim
                    }
                  >
                    {checkingClaim ? t('bookingPage.checking') : t('bookingPage.continueToReview')}
                  </Button>
                </div>
              </form>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  {t('bookingPage.alreadyHaveAccount')}{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700">
                    {t('bookingPage.logIn')}
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
              {t('bookingPage.editInformation')}
            </button>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {t('bookingPage.confirmBooking')}
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{t('bookingPage.class')}</span>
                  <span className="font-medium text-gray-900">{selectedClass.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{t('bookingPage.day')}</span>
                  <span className="font-medium text-gray-900">
                    {selectedDay ? DAY_LABELS[selectedDay] : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{t('bookingPage.time')}</span>
                  <span className="font-medium text-gray-900">
                    {selectedSlot.startTime} — {selectedSlot.endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{t('bookingPage.location')}</span>
                  <span className="font-medium text-gray-900">
                    {locations.find((l) => l.id === selectedSlot.locationId)?.name ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{t('bookingPage.instructor')}</span>
                  <span className="font-medium text-gray-900">
                    {coaches.find((c) => c.id === selectedSlot.coachId)?.name ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{t('common.name')}</span>
                  <span className="font-medium text-gray-900">{formData.guestName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t('common.email')}</span>
                  <span className="font-medium text-gray-900">{formData.guestEmail}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={confirmBooking} disabled={confirming}>
                  {confirming ? t('bookingPage.confirming') : t('bookingPage.confirmBookingBtn')}
                </Button>
                <Button variant="outline" onClick={() => setStep('info')} disabled={confirming}>
                  {t('bookingPage.edit')}
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
            <h2 className="text-2xl font-bold text-gray-900">
              {t('bookingPage.bookingConfirmed')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('bookingPage.confirmationText', { email: formData.guestEmail })}
            </p>
            <Card className="mx-auto mt-8 max-w-sm p-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('bookingPage.bookingId')}</span>
                  <span className="font-mono font-medium text-gray-900">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('bookingPage.class')}</span>
                  <span className="font-medium text-gray-900">{selectedClass?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('bookingPage.day')}</span>
                  <span className="font-medium text-gray-900">
                    {selectedDay ? DAY_LABELS[selectedDay] : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('bookingPage.time')}</span>
                  <span className="font-medium text-gray-900">
                    {selectedSlot?.startTime} — {selectedSlot?.endTime}
                  </span>
                </div>
              </div>
            </Card>

            {!token && (
              <Card className="mx-auto mt-8 max-w-sm p-6 text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('bookingPage.createFreeAccount')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{t('bookingPage.accountSubtitle')}</p>
                <form onSubmit={handleActivationSubmit} className="mt-4 space-y-4">
                  <FormField label={t('common.password')} required error={activationError}>
                    <Input
                      type="password"
                      value={activationPassword}
                      onChange={(e) => {
                        setActivationPassword(e.target.value);
                        setActivationError('');
                      }}
                      placeholder={t('bookingPage.atLeast6Chars')}
                      error={!!activationError}
                      required
                    />
                  </FormField>
                  <FormField label={t('common.confirmPassword')} required>
                    <Input
                      type="password"
                      value={activationPasswordConfirm}
                      onChange={(e) => {
                        setActivationPasswordConfirm(e.target.value);
                        setActivationError('');
                      }}
                      placeholder={t('bookingPage.repeatPassword')}
                      required
                    />
                  </FormField>
                  {activationError && <p className="text-sm text-red-600">{activationError}</p>}
                  <Button type="submit" className="w-full" disabled={activating}>
                    {activating ? t('bookingPage.creatingAccount') : t('bookingPage.createAccount')}
                  </Button>
                </form>
                <p className="mt-4 text-center text-xs text-gray-400">
                  {t('bookingPage.accountLater')}
                </p>
              </Card>
            )}

            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={resetFlow}>{t('bookingPage.bookAnotherClass')}</Button>
              <Link to="/">
                <Button variant="outline">{t('bookingPage.backToHome')}</Button>
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
            <h2 className="text-2xl font-bold text-gray-900">
              {t('bookingPage.somethingWentWrong')}
            </h2>
            <p className="mt-2 text-gray-600">{errorMsg || t('bookingPage.errors.generic')}</p>
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={handleErrorRetry}>{t('bookingPage.tryAgain')}</Button>
              <Link to="/">
                <Button variant="outline">{t('bookingPage.backToHome')}</Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
