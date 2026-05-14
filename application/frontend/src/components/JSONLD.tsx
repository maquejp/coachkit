import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

export default function JSONLD() {
  const { t } = useTranslation();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: t('jsonld.businessName'),
    description: t('jsonld.description'),
    url: 'https://coachkit.app',
    telephone: t('jsonld.telephone'),
    email: t('jsonld.email'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('jsonld.streetAddress'),
      addressLocality: t('jsonld.city'),
      addressRegion: t('jsonld.region'),
      postalCode: t('jsonld.postalCode'),
      addressCountry: t('jsonld.country'),
    },
    sameAs: [t('jsonld.facebookUrl'), t('jsonld.instagramUrl'), t('jsonld.twitterUrl')],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
