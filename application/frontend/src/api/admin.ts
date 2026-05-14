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

export type Location = import('@/types').Location;

export async function fetchAllLocations() {
  const { data } = await apiClient.get<{ success: boolean; data: Location[] }>('/locations');
  return data.data;
}

export async function createLocation(item: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data } = await apiClient.post<{ success: boolean; data: Location }>('/locations', item);
  return data.data;
}

export async function updateLocation(
  id: string,
  item: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: Location }>(
    `/locations/${id}`,
    item,
  );
  return data.data;
}

export async function deleteLocation(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(`/locations/${id}`);
  return data.data;
}

export type ClassType = import('@/types').ClassType;

export async function createClassType(item: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data } = await apiClient.post<{ success: boolean; data: ClassType }>(
    '/class-types',
    item,
  );
  return data.data;
}

export async function updateClassType(
  id: string,
  item: Partial<Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: ClassType }>(
    `/class-types/${id}`,
    item,
  );
  return data.data;
}

export async function deleteClassType(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(`/class-types/${id}`);
  return data.data;
}

export type SubscriptionPlan = import('@/types').SubscriptionPlan;
export type PointCardPlan = import('@/types').PointCardPlan;

export async function fetchSubscriptionPlans() {
  const { data } = await apiClient.get<{ success: boolean; data: SubscriptionPlan[] }>(
    '/subscription-plans',
  );
  return data.data;
}

export async function createSubscriptionPlan(
  item: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const { data } = await apiClient.post<{ success: boolean; data: SubscriptionPlan }>(
    '/admin/subscription-plans',
    item,
  );
  return data.data;
}

export async function updateSubscriptionPlan(
  id: string,
  item: Partial<Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: SubscriptionPlan }>(
    `/admin/subscription-plans/${id}`,
    item,
  );
  return data.data;
}

export async function deleteSubscriptionPlan(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(
    `/admin/subscription-plans/${id}`,
  );
  return data.data;
}

export async function fetchPointCardPlans() {
  const { data } = await apiClient.get<{ success: boolean; data: PointCardPlan[] }>(
    '/point-card-plans',
  );
  return data.data;
}

export async function createPointCardPlan(
  item: Omit<PointCardPlan, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const { data } = await apiClient.post<{ success: boolean; data: PointCardPlan }>(
    '/admin/point-card-plans',
    item,
  );
  return data.data;
}

export async function updatePointCardPlan(
  id: string,
  item: Partial<Omit<PointCardPlan, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: PointCardPlan }>(
    `/admin/point-card-plans/${id}`,
    item,
  );
  return data.data;
}

export async function deletePointCardPlan(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(
    `/admin/point-card-plans/${id}`,
  );
  return data.data;
}
