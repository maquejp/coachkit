import { useState, useCallback } from 'react';
import apiClient from '@/api/client';

interface UseContactFormResult {
  submit: (payload: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => Promise<boolean>;
  submitting: boolean;
  error: string | null;
}

export function useContactForm(): UseContactFormResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: { name: string; email: string; phone?: string; message: string }) => {
      setSubmitting(true);
      setError(null);
      try {
        await apiClient.post('/contact', payload);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to send message');
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submit, submitting, error };
}
