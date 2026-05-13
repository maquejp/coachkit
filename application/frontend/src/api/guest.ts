import apiClient from './client';
import type { FreeSessionClaim, ApiResponse, User } from '@/types';

export interface GuestCheckClaimResponse {
  success: boolean;
  data: {
    claimed: boolean;
    claim?: FreeSessionClaim;
  };
}

export interface GuestCreateClaimPayload {
  email: string;
  bookingId: string;
}

export interface GuestRegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  claimId: string;
}

export interface GuestRegisterResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export async function guestCheckClaimApi(email: string) {
  const { data } = await apiClient.get<GuestCheckClaimResponse>('/free-session-claims/check', {
    params: { email },
  });
  return data;
}

export async function guestCreateClaimApi(payload: GuestCreateClaimPayload) {
  const { data } = await apiClient.post<ApiResponse<FreeSessionClaim>>(
    '/free-session-claims',
    payload,
  );
  return data;
}

export async function guestRegisterApi(payload: GuestRegisterPayload) {
  const { data } = await apiClient.post<GuestRegisterResponse>('/guest/register', payload);
  return data;
}
