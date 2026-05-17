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

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const { register, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        passwordConfirmation: password,
      });
      navigate('/dashboard');
    } catch (err) {
      setFromApi(err);
      setError(t('registerPage.errors.generic'));
    }
  }

  return (
    <>
      <SEO title={t('seo.registerTitle')} description={t('seo.registerDescription')} />
      <div className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('registerPage.heading')}</h1>
          <p className="mb-6 text-sm text-gray-500">{t('registerPage.subtitle')}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('registerPage.firstName')} required error={fieldErrors.firstName}>
                <Input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearFieldError('firstName');
                  }}
                  placeholder={t('registerPage.firstNamePlaceholder')}
                  error={!!fieldErrors.firstName}
                  required
                />
              </FormField>
              <FormField label={t('registerPage.lastName')} required error={fieldErrors.lastName}>
                <Input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearFieldError('lastName');
                  }}
                  placeholder={t('registerPage.lastNamePlaceholder')}
                  error={!!fieldErrors.lastName}
                  required
                />
              </FormField>
            </div>
            <FormField label={t('registerPage.email')} required error={fieldErrors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                placeholder={t('registerPage.emailPlaceholder')}
                error={!!fieldErrors.email}
                required
              />
            </FormField>
            <FormField label={t('registerPage.phone')} error={fieldErrors.phone}>
              <Input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearFieldError('phone');
                }}
                placeholder={t('registerPage.phonePlaceholder')}
                error={!!fieldErrors.phone}
              />
            </FormField>
            <FormField label={t('registerPage.password')} required error={fieldErrors.password}>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                placeholder={t('registerPage.passwordPlaceholder')}
                error={!!fieldErrors.password}
                required
              />
            </FormField>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" loading={isLoading}>
              {t('registerPage.registerBtn')}
            </Button>
            <p className="text-center text-sm text-gray-500">
              {t('registerPage.hasAccount')}{' '}
              <Link to="/login" className="text-primary-600 hover:underline">
                {t('registerPage.login')}
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}
