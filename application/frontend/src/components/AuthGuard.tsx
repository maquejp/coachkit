import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { meApi } from '@/api/auth';
import { Spinner } from '@/components/ui/Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [validating, setValidating] = useState(() => !!token && !user);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (user) return;

    let cancelled = false;
    meApi()
      .then((res) => {
        if (!cancelled) {
          setAuth(res.data, token);
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
  }, [token, user, navigate, setAuth, clearAuth]);

  if (!token) return null;
  if (validating || !user) return <Spinner centered size="lg" />;

  return <>{children}</>;
}
