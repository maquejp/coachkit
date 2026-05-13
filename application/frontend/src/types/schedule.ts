export interface WeeklySchedule {
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

export interface ScheduleException {
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
