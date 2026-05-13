import apiClient from './client';

export interface Kpis {
  totalBookings: number;
  confirmedBookings: number;
  revenueCents: number;
  activeMembers: number;
  occupancyRate: number;
}

export interface ChartsData {
  bookingsByDay: { date: string; count: number }[];
  revenueByMonth: { month: string; amountCents: number }[];
  classPopularity: { className: string; bookings: number }[];
}

export interface OccupancyData {
  averageOccupancy: number;
  peakDay: string;
  peakTime: string;
  byClass: { className: string; occupancy: number }[];
}

export async function fetchDashboardKpis() {
  const { data } = await apiClient.get<{ success: boolean; data: Kpis }>('/dashboard/kpis');
  return data.data;
}

export async function fetchDashboardCharts() {
  const { data } = await apiClient.get<{ success: boolean; data: ChartsData }>('/dashboard/charts');
  return data.data;
}

export async function fetchDashboardOccupancy() {
  const { data } = await apiClient.get<{ success: boolean; data: OccupancyData }>(
    '/dashboard/occupancy',
  );
  return data.data;
}

export interface WeeklyScheduleItem {
  id: string;
  dayOfWeek: number;
  classTypeId: string;
  coachId: string;
  locationId: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleExceptionItem {
  id: string;
  date: string;
  locationId: string;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchWeeklySchedule(day?: number) {
  const params = day !== undefined ? `?day=${day}` : '';
  const { data } = await apiClient.get<{ success: boolean; data: WeeklyScheduleItem[] }>(
    `/weekly-schedule${params}`,
  );
  return data.data;
}

export async function createWeeklySchedule(
  item: Omit<WeeklyScheduleItem, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const { data } = await apiClient.post<{ success: boolean; data: WeeklyScheduleItem }>(
    '/weekly-schedule',
    item,
  );
  return data.data;
}

export async function updateWeeklySchedule(
  id: string,
  item: Partial<Omit<WeeklyScheduleItem, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: WeeklyScheduleItem }>(
    `/weekly-schedule/${id}`,
    item,
  );
  return data.data;
}

export async function deleteWeeklySchedule(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(
    `/weekly-schedule/${id}`,
  );
  return data.data;
}

export async function fetchScheduleExceptions(locationId?: string) {
  const params = locationId ? `?locationId=${locationId}` : '';
  const { data } = await apiClient.get<{ success: boolean; data: ScheduleExceptionItem[] }>(
    `/schedule-exceptions${params}`,
  );
  return data.data;
}

export async function createScheduleException(
  item: Omit<ScheduleExceptionItem, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const { data } = await apiClient.post<{ success: boolean; data: ScheduleExceptionItem }>(
    '/schedule-exceptions',
    item,
  );
  return data.data;
}

export async function updateScheduleException(
  id: string,
  item: Partial<Omit<ScheduleExceptionItem, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: ScheduleExceptionItem }>(
    `/schedule-exceptions/${id}`,
    item,
  );
  return data.data;
}

export async function deleteScheduleException(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(
    `/schedule-exceptions/${id}`,
  );
  return data.data;
}

export async function fetchAllClassTypes() {
  const { data } = await apiClient.get<{ success: boolean; data: import('@/types').ClassType[] }>(
    '/class-types',
  );
  return data.data;
}

export async function fetchAllCoaches() {
  const { data } = await apiClient.get<{ success: boolean; data: import('@/types').Coach[] }>(
    '/coaches',
  );
  return data.data;
}

export async function fetchAllLocations() {
  const { data } = await apiClient.get<{ success: boolean; data: import('@/types').Location[] }>(
    '/locations',
  );
  return data.data;
}
