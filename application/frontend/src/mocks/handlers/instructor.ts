import { http, HttpResponse } from 'msw';
import { weeklySchedule } from '@/mocks/fixtures/schedule';
import { bookings } from '@/mocks/fixtures';

function getScheduleForCoach(coachId: string) {
  return weeklySchedule
    .filter((s) => s.coachId === coachId && s.isActive)
    .map((s) => ({
      id: s.id,
      classTypeId: s.classTypeId,
      locationId: s.locationId,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      maxCapacity: s.maxCapacity,
      isActive: s.isActive,
    }));
}

export const instructorHandlers = [
  http.get('/api/instructor/schedule', ({ request }) => {
    const url = new URL(request.url);
    const coachId = url.searchParams.get('coachId');
    if (!coachId)
      return HttpResponse.json({ success: false, error: 'Missing coachId' }, { status: 400 });
    return HttpResponse.json({ success: true, data: getScheduleForCoach(coachId) });
  }),

  http.get('/api/instructor/upcoming', ({ request }) => {
    const url = new URL(request.url);
    const coachId = url.searchParams.get('coachId');
    if (!coachId)
      return HttpResponse.json({ success: false, error: 'Missing coachId' }, { status: 400 });

    const coachScheduleIds = weeklySchedule.filter((s) => s.coachId === coachId).map((s) => s.id);

    const upcoming = bookings
      .filter(
        (b) =>
          coachScheduleIds.includes(b.scheduleId) &&
          b.bookingDate >= new Date().toISOString().split('T')[0],
      )
      .slice(0, 10)
      .map((b) => ({
        id: b.id,
        userId: b.userId,
        guestEmail: b.guestEmail,
        bookingDate: b.bookingDate,
        status: b.status,
        user: b.userId
          ? { firstName: 'Student', lastName: b.userId.replace('user-', ''), email: '' }
          : null,
      }));

    return HttpResponse.json({ success: true, data: upcoming });
  }),

  http.get('/api/instructor/stats', ({ request }) => {
    const url = new URL(request.url);
    const coachId = url.searchParams.get('coachId');
    if (!coachId)
      return HttpResponse.json({ success: false, error: 'Missing coachId' }, { status: 400 });

    const coachScheduleIds = weeklySchedule.filter((s) => s.coachId === coachId).map((s) => s.id);

    const today = new Date().toISOString().split('T')[0];
    const upcomingClasses = bookings.filter(
      (b) =>
        coachScheduleIds.includes(b.scheduleId) &&
        b.bookingDate >= today &&
        b.status === 'confirmed',
    ).length;

    const totalStudents = new Set(
      bookings
        .filter((b) => coachScheduleIds.includes(b.scheduleId))
        .map((b) => b.userId)
        .filter(Boolean),
    ).size;

    const classesThisWeek = getScheduleForCoach(coachId).length;

    return HttpResponse.json({
      success: true,
      data: { upcomingClasses, totalStudents, classesThisWeek },
    });
  }),

  http.get('/api/instructor/attendance', ({ request }) => {
    const url = new URL(request.url);
    const scheduleId = url.searchParams.get('scheduleId');
    const date = url.searchParams.get('date');
    if (!scheduleId || !date)
      return HttpResponse.json({ success: false, error: 'Missing params' }, { status: 400 });

    const bs = bookings
      .filter((b) => b.scheduleId === scheduleId && b.bookingDate === date)
      .map((b) => ({
        id: b.id,
        userId: b.userId,
        guestEmail: b.guestEmail,
        bookingDate: b.bookingDate,
        status: b.status,
        user: b.userId
          ? { firstName: 'Student', lastName: b.userId.replace('user-', ''), email: '' }
          : null,
      }));

    return HttpResponse.json({ success: true, data: bs });
  }),
];
