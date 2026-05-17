import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/auth';
import { useProfile } from '@/hooks/useProfile';
import type { CustomerUser } from '@/types';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { t, i18n } = useTranslation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { updateProfile, changePassword, deleteAccount, saving } = useProfile();

  const [firstName, setFirstName] = useState((user as CustomerUser)?.firstName ?? '');
  const [lastName, setLastName] = useState((user as CustomerUser)?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState((user as CustomerUser)?.phone ?? '');
  const [language, setLanguage] = useState(user?.language ?? 'en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile() {
    setSaveSuccess(false);
    try {
      await updateProfile({ firstName, lastName, email, phone, language });
      if (user) {
        setAuth(
          { ...user, firstName, lastName, email, phone, language } as typeof user,
          localStorage.getItem('auth_token') ?? '',
        );
        void i18n.changeLanguage(language);
      }
      setSaveSuccess(true);
    } catch {
      /* error is set by hook */
    }
  }

  async function handleChangePassword() {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError(t('customerProfile.errors.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t('customerProfile.errors.passwordLength'));
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError(t('customerProfile.errors.changeFailed'));
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

  return (
    <>
      <SEO
        title={t('seo.customerProfileTitle')}
        description={t('seo.customerProfileDescription')}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('customerProfile.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('customerProfile.subtitle')}</p>
      </div>
      <div className="space-y-6 max-w-2xl">
        <Card
          header={
            <span className="font-semibold text-gray-900">{t('customerProfile.personalInfo')}</span>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-xs font-medium text-gray-600">
                  {t('customerProfile.firstName')}
                </label>
                <input
                  id="firstName"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-xs font-medium text-gray-600">
                  {t('customerProfile.lastName')}
                </label>
                <input
                  id="lastName"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-600">
                {t('customerProfile.email')}
              </label>
              <input
                id="email"
                type="email"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-xs font-medium text-gray-600">
                {t('customerProfile.phone')}
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
                {t('customerProfile.language')}
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
              {t('customerProfile.changePassword')}
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
            <span className="font-semibold text-red-600">{t('customerProfile.dangerZone')}</span>
          }
        >
          <p className="mb-4 text-sm text-gray-500">{t('customerProfile.dangerDesc')}</p>
          <Button variant="accent" onClick={() => setShowDelete(true)}>
            {t('customerProfile.deleteAccount')}
          </Button>
        </Card>
      </div>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t('customerProfile.deleteTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">{t('customerProfile.deleteBody')}</p>
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
