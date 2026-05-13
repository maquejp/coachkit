import { Helmet } from 'react-helmet-async';

export default function JSONLD() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'CoachKit',
    description:
      'Smart scheduling, member management, and analytics for fitness studios and wellness businesses.',
    url: 'https://coachkit.app',
    telephone: '+1-555-0100',
    email: 'hello@coachkit.app',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Portland',
      addressRegion: 'OR',
      postalCode: '97201',
      addressCountry: 'US',
    },
    sameAs: [
      'https://facebook.com/coachkit',
      'https://instagram.com/coachkit',
      'https://twitter.com/coachkit',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
