import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import apiClient from '@/api/client';

type Step = 'request' | 'sent' | 'reset';

export default function PasswordResetPage() {
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
      setError('Failed to send reset email. Try again.');
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
      setError('Reset failed. The code may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title="Reset Password" description="Reset your CoachKit account password." />
      <div className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8">
          {step === 'request' && (
            <>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Reset Your Password</h1>
              <p className="mb-6 text-sm text-gray-500">
                Enter your email address and we&apos;ll send you a reset code.
              </p>
              <form onSubmit={handleRequest} className="space-y-4">
                <FormField label="Email" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </FormField>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Code'}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-500">
                <Link to="/login" className="text-primary-600 hover:text-primary-700">
                  Back to login
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
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="mb-6 text-sm text-gray-500">
                We sent a reset code to <span className="font-medium text-gray-700">{email}</span>.
                Enter it below along with your new password.
              </p>
              <form onSubmit={handleReset} className="space-y-4">
                <FormField label="Reset Code" required>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    required
                  />
                </FormField>
                <FormField label="New Password" required>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                </FormField>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset Password'}
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
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Password Reset</h1>
              <p className="mb-6 text-sm text-gray-500">
                Your password has been successfully reset.
              </p>
              <Link to="/login">
                <Button>Back to Login</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
