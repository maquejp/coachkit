import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth';
import { updateProfileApi } from '@/api/customer';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuth = !!token && !!user;

  async function handleChange(code: string) {
    await i18n.changeLanguage(code);
    if (isAuth) {
      try {
        await updateProfileApi({ language: code });
      } catch {
        // non-fatal
      }
    }
  }

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
            i18n.language === lang.code
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
