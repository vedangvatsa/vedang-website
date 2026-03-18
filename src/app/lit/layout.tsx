import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'English to LinkedIn Translator | Turn Honest Words into LinkedIn Gold',
  description:
    'Free English to LinkedIn translator. Type any honest sentence and watch it transform into over-the-top LinkedIn-speak. "I got fired" becomes "Thrilled to announce I\'m exploring new opportunities." AI-powered, instant results.',
  url: '/lit',
  ogImage: '/images/linkedin-translator-og.png',
  ogImageAlt: 'English to LinkedIn Translator - showing a translation from human language to LinkedIn language',
  keywords: [
    'LinkedIn Translator',
    'English to LinkedIn',
    'LinkedIn Language translator',
    'Corporate Speak translator',
    'LinkedIn Parody',
    'LinkedIn Post Generator',
    'Corporate Jargon translator',
    'LinkedIn Humor',
    'Business Language Translator',
    'LinkedIn speak converter',
    'translate to LinkedIn language',
    'LinkedIn buzzword generator',
    'corporate language translator',
    'LinkedIn post writer',
  ],
});

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
