import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth';
import { loginApi } from '@/api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
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
        setError(res.error ?? 'Login failed');
      }
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title="Log In" description="Log in to your CoachKit account." />
      <div className="mx-auto max-w-md px-4 py-20">
        <Card className="p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mb-6 text-sm text-gray-500">Log in to your CoachKit account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </FormField>
            <FormField label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </FormField>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in…' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/password-reset" className="text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
