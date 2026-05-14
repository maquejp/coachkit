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

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export type CustomerUser = import('@/types').CustomerUser;

export async function fetchAdminCustomers(params: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}) {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<CustomerUser> }>(
    '/admin/customers',
    { params },
  );
  return data.data;
}

export async function fetchAdminCustomer(id: string) {
  const { data } = await apiClient.get<{ success: boolean; data: CustomerUser }>(
    `/admin/customers/${id}`,
  );
  return data.data;
}

export interface CustomerSubscriptionDetail {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string | null;
  trialEnd: string | null;
  sessionsUsed: number;
  sessionsLimit: number | null;
  planName: string;
}

export async function fetchCustomerSubscriptions(id: string) {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CustomerSubscriptionDetail[];
  }>(`/admin/customers/${id}/subscriptions`);
  return data.data;
}

export interface CustomerPointCardDetail {
  id: string;
  userId: string;
  planId: string;
  sessionsRemaining: number;
  expiresAt: string;
  purchasedAt: string;
  planName: string;
}

export async function fetchCustomerPointCards(id: string) {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CustomerPointCardDetail[];
  }>(`/admin/customers/${id}/point-cards`);
  return data.data;
}

export interface CustomerBookingDetail {
  id: string;
  userId: string;
  classTypeId: string;
  date: string;
  status: string;
  className: string;
  classColor: string;
}

export async function fetchCustomerBookings(id: string) {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CustomerBookingDetail[];
  }>(`/admin/customers/${id}/bookings`);
  return data.data;
}

export interface CustomerAttendanceDetail {
  id: string;
  bookingId: string;
  userId: string;
  date: string;
  checkInTime: string;
}

export async function fetchCustomerAttendance(id: string) {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CustomerAttendanceDetail[];
  }>(`/admin/customers/${id}/attendance`);
  return data.data;
}

export interface CustomerPaymentDetail {
  id: string;
  userId: string;
  amountCents: number;
  currency: string;
  status: string;
  provider: string;
  description: string;
  createdAt: string;
}

export async function fetchCustomerPayments(id: string) {
  const { data } = await apiClient.get<{
    success: boolean;
    data: CustomerPaymentDetail[];
  }>(`/admin/customers/${id}/payments`);
  return data.data;
}

export async function impersonateCustomer(userId: string) {
  const { data } = await apiClient.post<{
    success: boolean;
    data: { user: CustomerUser; token: string };
  }>('/admin/impersonate', { userId });
  return data.data;
}

/* ─── Attendance ─── */

export interface CheckInBooking {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  classTypeId: string;
  date: string;
  status: string;
  customerName: string;
  className: string;
  classColor: string;
  checkInTime: string | null;
}

export async function fetchCheckInBookings(date: string) {
  const { data } = await apiClient.get<{ success: boolean; data: CheckInBooking[] }>(
    '/admin/attendance/check-in',
    { params: { date } },
  );
  return data.data;
}

export async function checkInBooking(bookingId: string) {
  const { data } = await apiClient.post<{
    success: boolean;
    data: { id: string; checkInTime: string };
  }>('/admin/attendance/check-in', { bookingId });
  return data.data;
}

export interface AttendanceReportRecord {
  id: string;
  bookingId: string;
  userId: string;
  date: string;
  checkInTime: string;
  customerName: string;
  className: string;
  classColor: string;
}

export async function fetchAttendanceReport(from: string, to: string) {
  const { data } = await apiClient.get<{
    success: boolean;
    data: { total: number; records: AttendanceReportRecord[] };
  }>('/admin/attendance/report', { params: { from, to } });
  return data.data;
}

export interface SessionUsageEntry {
  userId: string;
  customerName: string;
  subscription: {
    planName: string;
    sessionsUsed: number;
    sessionsLimit: number | null;
    status: string;
  } | null;
  pointCards: {
    planName: string;
    sessionsRemaining: number;
    totalSessions: number;
    expiresAt: string;
  }[];
}

export async function fetchSessionUsage() {
  const { data } = await apiClient.get<{ success: boolean; data: SessionUsageEntry[] }>(
    '/admin/session-usage',
  );
  return data.data;
}

/* ─── Instructors / Coaches ─── */

export type Coach = import('@/types').Coach;

export async function createCoach(item: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data } = await apiClient.post<{ success: boolean; data: Coach }>('/coaches', item);
  return data.data;
}

export async function updateCoach(
  id: string,
  item: Partial<Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const { data } = await apiClient.put<{ success: boolean; data: Coach }>(`/coaches/${id}`, item);
  return data.data;
}

export async function deleteCoach(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>(`/coaches/${id}`);
  return data.data;
}

/* ─── Waitlist ─── */

export interface EnrichedWaitlistEntry {
  id: string;
  userId: string;
  scheduleId: string;
  date: string;
  position: number;
  status: string;
  customerName: string;
  className: string;
  classColor: string;
  createdAt: string;
}

export async function fetchAdminWaitlist(scheduleId?: string, date?: string) {
  const params: Record<string, string> = {};
  if (scheduleId) params.scheduleId = scheduleId;
  if (date) params.date = date;
  const { data } = await apiClient.get<{ success: boolean; data: EnrichedWaitlistEntry[] }>(
    '/admin/waitlist',
    { params },
  );
  return data.data;
}

export async function promoteWaitlistEntry(id: string) {
  const { data } = await apiClient.post<{ success: boolean; data: EnrichedWaitlistEntry }>(
    `/admin/waitlist/${id}/promote`,
  );
  return data.data;
}

export async function removeWaitlistEntry(id: string) {
  const { data } = await apiClient.post<{ success: boolean; data: null }>(
    `/admin/waitlist/${id}/remove`,
  );
  return data.data;
}

export async function notifyAllWaitlist(scheduleId: string, date: string) {
  const { data } = await apiClient.post<{
    success: boolean;
    data: { notified: number; message: string };
  }>('/admin/waitlist/notify-all', { scheduleId, date });
  return data.data;
}

/* ─── Reports ─── */

export interface CustomerReportRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  subscriptionPlan: string | null;
  sessionsUsed: number;
  sessionsLimit: number | null;
  totalBookings: number;
  lastBookingDate: string | null;
  createdAt: string;
}

export interface AttendanceReportRow {
  date: string;
  totalCheckIns: number;
  uniqueCustomers: number;
  byClass: { className: string; count: number }[];
}

export interface SubscriptionReport {
  totalActive: number;
  totalCancelled: number;
  totalExpired: number;
  monthlyRevenueCents: number;
  annualRevenueCents: number;
  churnRate: number;
  byPlan: { planName: string; active: number; cancelled: number }[];
}

export interface OccupancyReportRow {
  className: string;
  totalSlots: number;
  totalBookings: number;
  averageOccupancy: number;
  peakDay: string;
  peakTime: string;
}

export interface RevenueReportRow {
  month: string;
  revenueCents: number;
  subscriptionCents: number;
  pointCardCents: number;
  bookingsCents: number;
  transactions: number;
}

export async function fetchCustomerReport(params: { from?: string; to?: string }) {
  const { data } = await apiClient.get<{ success: boolean; data: CustomerReportRow[] }>(
    '/admin/reports/customers',
    { params },
  );
  return data.data;
}

export async function fetchAttendanceReportAdmin(params: { from: string; to: string }) {
  const { data } = await apiClient.get<{ success: boolean; data: AttendanceReportRow[] }>(
    '/admin/reports/attendance',
    { params },
  );
  return data.data;
}

export async function fetchSubscriptionReport() {
  const { data } = await apiClient.get<{ success: boolean; data: SubscriptionReport }>(
    '/admin/reports/subscriptions',
  );
  return data.data;
}

export async function fetchOccupancyReport(params: { from?: string; to?: string }) {
  const { data } = await apiClient.get<{ success: boolean; data: OccupancyReportRow[] }>(
    '/admin/reports/occupancy',
    { params },
  );
  return data.data;
}

export async function fetchRevenueReport() {
  const { data } = await apiClient.get<{ success: boolean; data: RevenueReportRow[] }>(
    '/admin/reports/revenue',
  );
  return data.data;
}

export async function exportReportCsv(reportType: string, params?: Record<string, string>) {
  const { data } = await apiClient.get<string>(`/admin/reports/${reportType}/export`, {
    params,
    responseType: 'blob',
  });
  return data;
}

export async function exportReportPdf(reportType: string, params?: Record<string, string>) {
  const { data } = await apiClient.get<string>(`/admin/reports/${reportType}/export-pdf`, {
    params,
    responseType: 'blob',
  });
  return data;
}

/* ─── Analytics ─── */

export interface AnalyticsData {
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
  totalPageViews: number;
  uniqueVisitors: number;
  popularClasses: { className: string; bookings: number; revenueCents: number }[];
  peakBookingTimes: { timeSlot: string; count: number; percentage: number }[];
  referralSources: { source: string; count: number; percentage: number }[];
}

export async function fetchAnalytics() {
  const { data } = await apiClient.get<{ success: boolean; data: AnalyticsData }>(
    '/admin/analytics',
  );
  return data.data;
}

/* ─── Settings ─── */

export interface BusinessHoursEntry {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface AdminSettings {
  studioName: string;
  studioEmail: string;
  studioPhone: string;
  studioAddress: string;
  studioCity: string;
  timezone: string;
  defaultCurrency: string;
  businessHours: Record<number, BusinessHoursEntry>;
  bookingLeadTimeMinutes: number;
  cancellationWindowMinutes: number;
  maxBookingsPerCustomer: number;
  defaultEmailSender: string;
  notifyOnBooking: boolean;
  notifyOnCancellation: boolean;
  notifyOnWaitlist: boolean;
  notifyOnReminder: boolean;
  taxRate: number;
}

export async function fetchSettings() {
  const { data } = await apiClient.get<{ success: boolean; data: AdminSettings }>(
    '/admin/settings',
  );
  return data.data;
}

export async function updateSettings(settings: Partial<AdminSettings>) {
  const { data } = await apiClient.put<{ success: boolean; data: AdminSettings }>(
    '/admin/settings',
    settings,
  );
  return data.data;
}
