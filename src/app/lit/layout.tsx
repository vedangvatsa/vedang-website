const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'English to LinkedIn Translator',
  description: 'Translate honest human language into perfect LinkedIn-speak. AI-powered parody translator that turns everyday sentences into corporate LinkedIn posts.',
  url: 'https://veda.ng/lit',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
};

export default function LinkedInTranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
