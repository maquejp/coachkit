import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';

interface ValidationErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export function extractFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<ValidationErrorResponse> | undefined;
  if (!axiosError?.response) return {};

  const data = axiosError.response.data;
  if (!data?.errors) return {};

  const result: Record<string, string> = {};
  for (const [field, msgs] of Object.entries(data.errors)) {
    result[field] = msgs[0] ?? 'Invalid value';
  }
  return result;
}

export function useFieldErrors() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFromApi = useCallback((error: unknown) => {
    const extracted = extractFieldErrors(error);
    if (Object.keys(extracted).length > 0) {
      setFieldErrors(extracted);
    }
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setFieldErrors({}), []);

  return { fieldErrors, setFromApi, clearFieldError, clearAll };
}
