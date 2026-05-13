import apiClient from './client';
import type {
  Booking,
  CustomerSubscription,
  PointCardPurchase,
  PaymentTransaction,
  SubscriptionPlan,
  PointCardPlan,
} from '@/types';

export interface CustomerDashboardData {
  user: import('@/types').CustomerUser;
  bookings: Booking[];
  subscriptions: CustomerSubscription[];
  subscriptionPlans: SubscriptionPlan[];
  pointCards: PointCardPurchase[];
  pointCardPlans: PointCardPlan[];
  payments: PaymentTransaction[];
}

export async function fetchMyBookingsApi(userId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: Booking[] }>('/bookings', {
    params: { userId },
  });
  return data.data;
}

export async function fetchMySubscriptionsApi(userId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: CustomerSubscription[] }>(
    '/customer-subscriptions',
    { params: { userId } },
  );
  return data.data;
}

export async function fetchMyPointCardsApi(userId: string) {
  const { data } = await apiClient.get<{ success: boolean; data: PointCardPurchase[] }>(
    '/point-card-purchases',
    { params: { userId } },
  );
  return data.data;
}

export async function fetchSubscriptionPlansApi() {
  const { data } = await apiClient.get<{ success: boolean; data: SubscriptionPlan[] }>(
    '/subscription-plans',
  );
  return data.data;
}

export async function fetchPointCardPlansApi() {
  const { data } = await apiClient.get<{ success: boolean; data: PointCardPlan[] }>(
    '/point-card-plans',
  );
  return data.data;
}

export async function cancelSubscriptionApi(subscriptionId: string) {
  const { data } = await apiClient.post<{ success: boolean; data: CustomerSubscription }>(
    `/customer-subscriptions/${subscriptionId}/cancel`,
  );
  return data.data;
}

export async function changeSubscriptionPlanApi(subscriptionId: string, planId: string) {
  const { data } = await apiClient.put<{ success: boolean; data: CustomerSubscription }>(
    `/customer-subscriptions/${subscriptionId}/change-plan`,
    { planId },
  );
  return data.data;
}

export async function cancelBookingApi(bookingId: string) {
  const { data } = await apiClient.post<{ success: boolean; data: Booking }>(
    `/bookings/${bookingId}/cancel`,
  );
  return data.data;
}

export async function rescheduleBookingApi(bookingId: string, date: string) {
  const { data } = await apiClient.post<{ success: boolean; data: Booking }>(
    `/bookings/${bookingId}/reschedule`,
    { date },
  );
  return data.data;
}

export async function updateProfileApi(payload: Record<string, unknown>) {
  const { data } = await apiClient.put<{ success: boolean; data: import('@/types').User }>(
    '/profile',
    payload,
  );
  return data.data;
}

export async function changePasswordApi(currentPassword: string, newPassword: string) {
  const { data } = await apiClient.put<{ success: boolean; data: null }>('/profile/password', {
    currentPassword,
    newPassword,
  });
  return data.data;
}

export async function deleteAccountApi() {
  const { data } = await apiClient.delete<{ success: boolean; data: null }>('/profile');
  return data.data;
}
