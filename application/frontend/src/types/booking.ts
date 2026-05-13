export type BookingStatus = 'confirmed' | 'cancelled' | 'attended' | 'no-show';

export interface Booking {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  classTypeId: string;
  scheduleId: string;
  date: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FreeSessionClaim {
  id: string;
  email: string;
  userId: string | null;
  bookingId: string;
  claimedAt: string;
  activatedAt: string | null;
}

export interface Attendance {
  id: string;
  bookingId: string;
  userId: string;
  date: string;
  checkInTime: string;
  createdAt: string;
}

export type WaitlistStatus = 'waiting' | 'promoted' | 'expired';

export interface WaitlistEntry {
  id: string;
  userId: string;
  scheduleId: string;
  date: string;
  position: number;
  status: WaitlistStatus;
  createdAt: string;
  updatedAt: string;
}
