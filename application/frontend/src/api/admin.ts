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
