import { useState, useCallback } from 'react';
import { updateProfileApi, changePasswordApi, deleteAccountApi } from '@/api/customer';

interface UseProfileResult {
  updateProfile: (payload: Record<string, unknown>) => Promise<void>;
  changePassword: (current: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  saving: boolean;
  error: string | null;
}

export function useProfile(): UseProfileResult {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (payload: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await updateProfileApi(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update profile');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  const changePassword = useCallback(async (current: string, newPassword: string) => {
    setSaving(true);
    setError(null);
    try {
      await changePasswordApi(current, newPassword);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to change password');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await deleteAccountApi();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete account');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { updateProfile, changePassword, deleteAccount, saving, error };
}
