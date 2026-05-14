import { locationHandlers } from './handlers/locations';
import { authHandlers } from './handlers/auth';
import { coachHandlers } from './handlers/coaches';
import { classTypeHandlers } from './handlers/classTypes';
import { scheduleHandlers } from './handlers/schedule';
import { subscriptionHandlers } from './handlers/subscriptions';
import { bookingHandlers } from './handlers/bookings';
import { attendanceHandlers } from './handlers/attendance';
import { waitlistHandlers } from './handlers/waitlist';
import { paymentHandlers } from './handlers/payments';
import { dashboardHandlers } from './handlers/dashboard';
import { guestHandlers } from './handlers/guest';
import { customerHandlers } from './handlers/customers';
import { attendanceAdminHandlers } from './handlers/attendanceAdmin';
import { waitlistAdminHandlers } from './handlers/waitlistAdmin';
import { reportsAdminHandlers } from './handlers/reportsAdmin';
import { analyticsHandlers } from './handlers/analytics';
import { instructorHandlers } from './handlers/instructor';

export const handlers = [
  ...locationHandlers,
  ...authHandlers,
  ...coachHandlers,
  ...classTypeHandlers,
  ...scheduleHandlers,
  ...subscriptionHandlers,
  ...bookingHandlers,
  ...attendanceHandlers,
  ...waitlistHandlers,
  ...paymentHandlers,
  ...dashboardHandlers,
  ...guestHandlers,
  ...customerHandlers,
  ...attendanceAdminHandlers,
  ...waitlistAdminHandlers,
  ...reportsAdminHandlers,
  ...analyticsHandlers,
  ...instructorHandlers,
];
