import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '@/hooks/useAuth';
import { useFieldErrors } from '@/lib/errors';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { fieldErrors, setFromApi, clearFieldError, clearAll } = useFieldErrors();

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    clearAll();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setFromApi(err);
      setError(t('loginPage.errors.invalidCredentials'));
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
            <FormField label={t('loginPage.emailLabel')} required error={fieldErrors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                placeholder={t('loginPage.emailPlaceholder')}
                error={!!fieldErrors.email}
                required
              />
            </FormField>
            <FormField label={t('loginPage.passwordLabel')} required error={fieldErrors.password}>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                placeholder={t('loginPage.passwordPlaceholder')}
                error={!!fieldErrors.password}
                required
              />
            </FormField>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" loading={isLoading}>
              {isLoading ? t('loginPage.loggingIn') : t('loginPage.logInBtn')}
            </Button>
            <p className="text-center text-sm text-gray-500">
              {t('loginPage.noAccount')}{' '}
              <Link to="/register" className="text-primary-600 hover:underline">
                {t('loginPage.signUpLink')}
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}
