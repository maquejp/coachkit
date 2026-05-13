import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  role: 'admin' | 'customer';
}

export default function RoleGuard({ children, role }: RoleGuardProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    } else if (user && user.role !== role) {
      navigate('/', { replace: true });
    }
  }, [token, user, role, navigate]);

  if (!token || !user || user.role !== role) return null;

  return <>{children}</>;
}
