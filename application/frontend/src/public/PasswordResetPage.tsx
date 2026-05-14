import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import apiClient from '@/api/client';

type Step = 'request' | 'sent' | 'reset';

export default function PasswordResetPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/password-reset-request', { email });
      setStep('sent');
    } catch {
      setError(t('passwordResetPage.errors.sendFailed'));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/password-reset', { email, code, password });
      setStep('reset');
    } catch {
      setError(t('passwordResetPage.errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title={t('seo.resetPasswordTitle')} description={t('seo.resetPasswordTitle')} />
      <div className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8">
          {step === 'request' && (
            <>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t('passwordResetPage.heading')}
              </h1>
              <p className="mb-6 text-sm text-gray-500">{t('passwordResetPage.subtitle')}</p>
              <form onSubmit={handleRequest} className="space-y-4">
                <FormField label={t('passwordResetPage.emailLabel')} required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('passwordResetPage.emailPlaceholder')}
                    required
                  />
                </FormField>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('passwordResetPage.sending') : t('passwordResetPage.sendResetCode')}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-500">
                <Link to="/login" className="text-primary-600 hover:text-primary-700">
                  {t('passwordResetPage.backToLogin')}
                </Link>
              </div>
            </>
          )}

          {step === 'sent' && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t('passwordResetPage.checkEmail')}
              </h1>
              <p className="mb-6 text-sm text-gray-500">
                {t('passwordResetPage.resetInstructions', { email })}
              </p>
              <form onSubmit={handleReset} className="space-y-4">
                <FormField label={t('passwordResetPage.resetCode')} required>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('passwordResetPage.resetCodePlaceholder')}
                    required
                  />
                </FormField>
                <FormField label={t('passwordResetPage.newPassword')} required>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordResetPage.newPasswordPlaceholder')}
                    required
                    minLength={8}
                  />
                </FormField>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? t('passwordResetPage.resetting')
                    : t('passwordResetPage.resetPasswordBtn')}
                </Button>
              </form>
            </>
          )}

          {step === 'reset' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t('passwordResetPage.successHeading')}
              </h1>
              <p className="mb-6 text-sm text-gray-500">{t('passwordResetPage.successText')}</p>
              <Link to="/login">
                <Button>{t('passwordResetPage.backToLoginBtn')}</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
