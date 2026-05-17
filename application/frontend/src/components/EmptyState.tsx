import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = '📭', title, message, action }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="mb-3 text-3xl">{icon}</span>
      <h3 className="mb-1 text-sm font-medium text-gray-900">{title ?? t('emptyState.title')}</h3>
      <p className="mb-4 max-w-xs text-sm text-gray-400">{message ?? t('emptyState.message')}</p>
      {action}
    </div>
  );
}
