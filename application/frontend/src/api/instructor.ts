import apiClient from './client';

export interface InstructorProfile {
  id: string;
  name: string;
  bio: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  isActive: boolean;
}

export interface InstructorScheduleItem {
  id: string;
  classTypeId: string;
  locationId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  isActive: boolean;
}

export interface InstructorBooking {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  bookingDate: string;
  status: string;
  user?: { firstName: string; lastName: string; email: string } | null;
}

export interface InstructorStats {
  upcomingClasses: number;
  totalStudents: number;
  classesThisWeek: number;
}

export async function fetchInstructorProfile(coachId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: InstructorProfile }>(
    `/coaches/${coachId}`,
  );
  return data.data;
}

export async function updateInstructorProfile(
  coachId: string,
  payload: { name?: string; bio?: string; phone?: string | null; photoUrl?: string | null },
) {
  const { data } = await apiClient.put<{ success: boolean; data: InstructorProfile }>(
    `/coaches/${coachId}`,
    payload,
  );
  return data.data;
}

export async function fetchInstructorSchedule(coachId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: InstructorScheduleItem[] }>(
    `/instructor/schedule?coachId=${coachId}`,
  );
  return data.data;
}

export async function fetchInstructorUpcoming(coachId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: InstructorBooking[] }>(
    `/instructor/upcoming?coachId=${coachId}`,
  );
  return data.data;
}

export async function fetchInstructorStats(coachId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: InstructorStats }>(
    `/instructor/stats?coachId=${coachId}`,
  );
  return data.data;
}

export async function fetchInstructorAttendanceBookings(scheduleId: string, date: string) {
  const { data } = await apiClient.get<{ success: boolean; data: InstructorBooking[] }>(
    `/instructor/attendance?scheduleId=${scheduleId}&date=${date}`,
  );
  return data.data;
}
