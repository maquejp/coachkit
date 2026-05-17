/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthLayout from '@/components/AuthLayout';
import AuthGuard from '@/components/AuthGuard';
import RoleGuard from '@/components/RoleGuard';
import ErrorPage from '@/components/ErrorPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';

const HomePage = lazy(() => import('@/public/HomePage'));
const ClassesPage = lazy(() => import('@/public/ClassesPage'));
const PricingPage = lazy(() => import('@/public/PricingPage'));
const AboutPage = lazy(() => import('@/public/AboutPage'));
const ContactPage = lazy(() => import('@/public/ContactPage'));
const BookingPage = lazy(() => import('@/public/BookingPage'));
const LoginPage = lazy(() => import('@/public/LoginPage'));
const RegisterPage = lazy(() => import('@/public/RegisterPage'));
const PasswordResetPage = lazy(() => import('@/public/PasswordResetPage'));
const DashboardPage = lazy(() => import('@/customer/DashboardPage'));
const BookingsPage = lazy(() => import('@/customer/BookingsPage'));
const SubscriptionPage = lazy(() => import('@/customer/SubscriptionPage'));
const ProfilePage = lazy(() => import('@/customer/ProfilePage'));
const AdminDashboardPage = lazy(() => import('@/admin/DashboardPage'));
const AdminSchedulePage = lazy(() => import('@/admin/SchedulePage'));
const AdminClassesPage = lazy(() => import('@/admin/ClassesPage'));
const AdminPricingPage = lazy(() => import('@/admin/PricingPage'));
const AdminLocationsPage = lazy(() => import('@/admin/LocationsPage'));
const AdminLocationDetailPage = lazy(() => import('@/admin/LocationDetailPage'));
const AdminCustomersPage = lazy(() => import('@/admin/CustomersPage'));
const AdminCustomerDetailPage = lazy(() => import('@/admin/CustomerDetailPage'));
const AdminAttendancePage = lazy(() => import('@/admin/AttendancePage'));
const AdminInstructorsPage = lazy(() => import('@/admin/InstructorsPage'));
const AdminInstructorDetailPage = lazy(() => import('@/admin/InstructorDetailPage'));
const AdminWaitlistPage = lazy(() => import('@/admin/WaitlistPage'));
const AdminReportsPage = lazy(() => import('@/admin/ReportsPage'));
const AdminAnalyticsPage = lazy(() => import('@/admin/AnalyticsPage'));
const AdminSettingsPage = lazy(() => import('@/admin/SettingsPage'));
const InstructorDashboardPage = lazy(() => import('@/instructor/DashboardPage'));
const InstructorSchedulePage = lazy(() => import('@/instructor/SchedulePage'));
const InstructorAttendancePage = lazy(() => import('@/instructor/AttendancePage'));
const InstructorProfilePage = lazy(() => import('@/instructor/ProfilePage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Spinner centered size="lg" />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'classes',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <ClassesPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pricing',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <PricingPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AboutPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'contact',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <ContactPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'book',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <BookingPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <LoginPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <RegisterPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'password-reset',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <PasswordResetPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <AuthGuard>
        <AuthLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <DashboardPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard/bookings',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <BookingsPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard/subscription',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <SubscriptionPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard/profile',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <RoleGuard role="admin">
        <AuthLayout />
      </RoleGuard>
    ),
    children: [
      {
        path: 'admin',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminDashboardPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/classes',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminClassesPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/schedule',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminSchedulePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/pricing',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminPricingPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/locations',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminLocationsPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/locations/:id',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminLocationDetailPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/customers',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminCustomersPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/customers/:id',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminCustomerDetailPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/attendance',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminAttendancePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/instructors',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminInstructorsPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/instructors/:id',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminInstructorDetailPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/waitlist',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminWaitlistPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/reports',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminReportsPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/analytics',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminAnalyticsPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <AdminSettingsPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <RoleGuard role="instructor">
        <AuthLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        path: 'instructor',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <InstructorDashboardPage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'instructor/schedule',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <InstructorSchedulePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'instructor/attendance',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <InstructorAttendancePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'instructor/profile',
        element: (
          <SuspenseWrapper>
            <ErrorBoundary>
              <InstructorProfilePage />
            </ErrorBoundary>
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
