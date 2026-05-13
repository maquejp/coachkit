import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/public/HomePage';
import ClassesPage from '@/public/ClassesPage';
import PricingPage from '@/public/PricingPage';
import AboutPage from '@/public/AboutPage';
import ContactPage from '@/public/ContactPage';
import BookingPage from '@/public/BookingPage';
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
      { path: 'login', element: <Placeholder title="Login" /> },
      { path: 'register', element: <Placeholder title="Register" /> },
      { path: 'admin', element: <Placeholder title="Admin Dashboard" /> },
      { path: 'admin/classes', element: <Placeholder title="Admin Classes" /> },
      { path: 'admin/schedule', element: <Placeholder title="Admin Schedule" /> },
      { path: 'admin/customers', element: <Placeholder title="Admin Customers" /> },
      { path: 'admin/analytics', element: <Placeholder title="Admin Analytics" /> },
      { path: 'admin/settings', element: <Placeholder title="Admin Settings" /> },
      { path: 'dashboard', element: <Placeholder title="Customer Dashboard" /> },
      { path: 'dashboard/bookings', element: <Placeholder title="My Bookings" /> },
      { path: 'dashboard/subscription', element: <Placeholder title="My Subscription" /> },
      { path: 'dashboard/profile', element: <Placeholder title="My Profile" /> },
    ],
  },
]);
