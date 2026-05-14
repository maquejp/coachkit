import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth';
import { registerApi } from '@/api/auth';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [firstName, setFirstName] = useState('');

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
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerApi({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
      });
      if (res.success) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.error ?? t('registerPage.errors.generic'));
      }
    } catch {
      setError(t('registerPage.errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title={t('seo.registerTitle')} description={t('seo.registerTitle')} />
      <div className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('registerPage.heading')}</h1>
          <p className="mb-6 text-sm text-gray-500">{t('registerPage.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('registerPage.firstName')} required>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('registerPage.firstNamePlaceholder')}
                  required
                />
              </FormField>
              <FormField label={t('registerPage.lastName')} required>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('registerPage.lastNamePlaceholder')}
                  required
                />
              </FormField>
            </div>
            <FormField label={t('registerPage.emailLabel')} required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('registerPage.emailPlaceholder')}
                required
              />
            </FormField>
            <FormField label={t('registerPage.phoneLabel')}>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('registerPage.phonePlaceholder')}
              />
            </FormField>
            <FormField label={t('registerPage.passwordLabel')} required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('registerPage.passwordPlaceholder')}
                required
                minLength={8}
              />
            </FormField>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('registerPage.creatingAccount') : t('registerPage.signUpBtn')}
            </Button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
            {t('registerPage.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              {t('registerPage.logInLink')}
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
