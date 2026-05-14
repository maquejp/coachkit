import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthLayout from '@/components/AuthLayout';
import AuthGuard from '@/components/AuthGuard';
import RoleGuard from '@/components/RoleGuard';
import HomePage from '@/public/HomePage';
import ClassesPage from '@/public/ClassesPage';
import PricingPage from '@/public/PricingPage';
import AboutPage from '@/public/AboutPage';
import ContactPage from '@/public/ContactPage';
import BookingPage from '@/public/BookingPage';
import LoginPage from '@/public/LoginPage';
import RegisterPage from '@/public/RegisterPage';
import PasswordResetPage from '@/public/PasswordResetPage';
import DashboardPage from '@/customer/DashboardPage';
import BookingsPage from '@/customer/BookingsPage';
import SubscriptionPage from '@/customer/SubscriptionPage';
import ProfilePage from '@/customer/ProfilePage';
import AdminDashboardPage from '@/admin/DashboardPage';
import AdminSchedulePage from '@/admin/SchedulePage';
import AdminClassesPage from '@/admin/ClassesPage';
import AdminPricingPage from '@/admin/PricingPage';
import AdminLocationsPage from '@/admin/LocationsPage';
import AdminLocationDetailPage from '@/admin/LocationDetailPage';
import AdminCustomersPage from '@/admin/CustomersPage';
import AdminCustomerDetailPage from '@/admin/CustomerDetailPage';
import Placeholder from '@/components/ui/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'classes', element: <ClassesPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'book', element: <BookingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'password-reset', element: <PasswordResetPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AuthLayout />
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'dashboard/bookings', element: <BookingsPage /> },
      { path: 'dashboard/subscription', element: <SubscriptionPage /> },
      { path: 'dashboard/profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '/',
    element: (
      <RoleGuard role="admin">
        <AuthLayout />
      </RoleGuard>
    ),
    children: [
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'admin/classes', element: <AdminClassesPage /> },
      { path: 'admin/schedule', element: <AdminSchedulePage /> },
      { path: 'admin/pricing', element: <AdminPricingPage /> },
      { path: 'admin/locations', element: <AdminLocationsPage /> },
      { path: 'admin/locations/:id', element: <AdminLocationDetailPage /> },
      { path: 'admin/customers', element: <AdminCustomersPage /> },
      { path: 'admin/customers/:id', element: <AdminCustomerDetailPage /> },
      { path: 'admin/analytics', element: <Placeholder title="Admin Analytics" /> },
      { path: 'admin/settings', element: <Placeholder title="Admin Settings" /> },
    ],
  },
]);
