import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { OfflineBanner } from '@/components/OfflineBanner';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
