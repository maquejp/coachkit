import { useTranslation } from 'react-i18next';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import SEO from '@/components/SEO';

export default function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  let title = t('errorPage.defaultTitle');
  let message = t('errorPage.defaultMessage');

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = t('errorPage.notFoundTitle');
      message = t('errorPage.notFoundMessage');
    } else {
      title = `${error.status} ${error.statusText}`;
      message = error.data?.message ?? t('errorPage.defaultMessage');
    }
  }

  return (
    <>
      <SEO title={title} description={message} />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 text-6xl font-bold text-gray-200">!</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mb-6 max-w-md text-gray-500">{message}</p>
        <Link
          to="/"
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {t('errorPage.backHome')}
        </Link>
      </div>
    </>
  );
}
