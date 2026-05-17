import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/auth';
import { addToast } from '@/stores/toast';
import { fetchInstructorProfile, updateInstructorProfile } from '@/api/instructor';
import { useProfile } from '@/hooks/useProfile';
import type { InstructorProfile as Profile } from '@/api/instructor';
import type { InstructorUser } from '@/types';

export default function InstructorProfilePage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const coachId = (user as InstructorUser | null)?.coachId ?? null;
  const { changePassword, deleteAccount } = useProfile();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState(user?.language ?? 'en');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!coachId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const p = await fetchInstructorProfile(coachId);
        if (!cancelled) {
          setProfile(p);
          setName(p.name);
          setBio(p.bio);
          setEmail(p.email);
          setPhone(p.phone ?? '');
        }
      } catch {
        addToast('error', t('common.loadingError'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [coachId]);

  async function handleSaveProfile() {
    if (!coachId || !profile) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateInstructorProfile(coachId, { name, bio, phone: phone || null });
      setProfile(updated);
      if (user) {
        const { updateProfileApi } = await import('@/api/customer');
        await updateProfileApi({ language });
        void i18n.changeLanguage(language);
      }
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError(t('instructorProfile.errors.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t('instructorProfile.errors.passwordLength'));
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError(t('instructorProfile.errors.changeFailed'));
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await deleteAccount();
      clearAuth();
      window.location.href = '/';
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <Skeleton variant="card" />;

  return (
    <>
      <SEO
        title={t('seo.instructorProfileTitle')}
        description={t('seo.instructorProfileDescription')}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('instructorProfile.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('instructorProfile.subtitle')}</p>
      </div>
      <div className="space-y-6 max-w-2xl">
        <Card
          header={
            <span className="font-semibold text-gray-900">
              {t('instructorProfile.personalInfo')}
            </span>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-xs font-medium text-gray-600">
                {t('instructorProfile.fullName')}
              </label>
              <input
                id="fullName"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="bio" className="mb-1 block text-xs font-medium text-gray-600">
                {t('instructorProfile.biography')}
              </label>
              <textarea
                id="bio"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-600">
                {t('instructorProfile.email')}
              </label>
              <input
                id="email"
                type="email"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-xs font-medium text-gray-600">
                {t('instructorProfile.phone')}
              </label>
              <input
                id="phone"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="language" className="mb-1 block text-xs font-medium text-gray-600">
                {t('instructorProfile.language')}
              </label>
              <select
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            {saveSuccess && <p className="text-sm text-green-600">{t('common.profileUpdated')}</p>}
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} loading={saving}>
                {t('common.saveChanges')}
              </Button>
            </div>
          </div>
        </Card>

        <Card
          header={
            <span className="font-semibold text-gray-900">
              {t('instructorProfile.changePassword')}
            </span>
          }
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                {t('common.currentPassword')}
              </label>
              <input
                id="currentPassword"
                type="password"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1 block text-xs font-medium text-gray-600"
                >
                  {t('common.newPassword')}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-xs font-medium text-gray-600"
                >
                  {t('common.confirmNewPassword')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} loading={changingPassword}>
                {t('common.updatePassword')}
              </Button>
            </div>
          </div>
        </Card>

        <Card
          header={
            <span className="font-semibold text-red-600">{t('instructorProfile.dangerZone')}</span>
          }
        >
          <p className="mb-4 text-sm text-gray-500">{t('instructorProfile.dangerDesc')}</p>
          <Button variant="accent" onClick={() => setShowDelete(true)}>
            {t('instructorProfile.deleteAccount')}
          </Button>
        </Card>
      </div>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t('instructorProfile.deleteTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">{t('instructorProfile.deleteBody')}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>
            {t('common.keep')}
          </Button>
          <Button variant="accent" loading={deleting} onClick={handleDeleteAccount}>
            {t('common.yesDelete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
