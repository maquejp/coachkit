import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Placeholder from '@/components/ui/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Placeholder title="Home" /> },
      { path: 'classes', element: <Placeholder title="Classes" /> },
      { path: 'pricing', element: <Placeholder title="Pricing" /> },
      { path: 'about', element: <Placeholder title="About" /> },
      { path: 'contact', element: <Placeholder title="Contact" /> },
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
