import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { meApi } from '@/api/auth';
import { Spinner } from '@/components/ui/Spinner';

interface RoleGuardProps {
  children: React.ReactNode;
  role: 'admin' | 'customer';
}

export default function RoleGuard({ children, role }: RoleGuardProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [validating, setValidating] = useState(() => !!token && !user);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (user) {
      if (user.role !== role) {
        navigate('/', { replace: true });
      }
      return;
    }

    let cancelled = false;
    meApi()
      .then((res) => {
        if (!cancelled) {
          setAuth(res.data, token);
          if (res.data.role !== role) {
            navigate('/', { replace: true });
          }
          setValidating(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearAuth();
          navigate('/login', { replace: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, user, role, navigate, setAuth, clearAuth]);

  if (!token) return null;
  if (validating || !user) return <Spinner centered size="lg" />;
  if (user.role !== role) return null;

  return <>{children}</>;
}
