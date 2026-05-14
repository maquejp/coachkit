import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth';
import { loginApi } from '@/api/auth';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token && user) {
      navigate(
        user.role === 'admin'
          ? '/admin'
          : user.role === 'instructor'
            ? '/instructor'
            : '/dashboard',
        { replace: true },
      );
    }
  }, [token, user, navigate]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.success) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.error ?? t('loginPage.errors.generic'));
      }
    } catch {
      setError(t('loginPage.errors.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title={t('seo.loginTitle')} description={t('seo.loginTitle')} />
      <div className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('loginPage.heading')}</h1>
          <p className="mb-6 text-sm text-gray-500">{t('loginPage.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label={t('loginPage.emailLabel')} required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('loginPage.emailPlaceholder')}
                required
              />
            </FormField>
            <FormField label={t('loginPage.passwordLabel')} required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('loginPage.passwordPlaceholder')}
                required
              />
            </FormField>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('loginPage.loggingIn') : t('loginPage.logInBtn')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/password-reset" className="text-primary-600 hover:text-primary-700">
              {t('loginPage.forgotPassword')}
            </Link>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
            {t('loginPage.noAccount')}{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              {t('loginPage.signUpLink')}
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
