import { Metadata } from 'next';
import LinkedInTranslator from './translator';

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const inputText = params.t || '';

  const ogImageUrl = inputText
    ? `/api/og/linkedin?input=${encodeURIComponent(inputText)}`
    : '/api/og/linkedin';

  return {
    title: 'English to LinkedIn Translator | Turn Honest Words into LinkedIn Speak',
    description:
      'Free English to LinkedIn translator. Type any honest sentence and watch it transform into over-the-top LinkedIn-speak. "I got fired" becomes "Thrilled to announce I\'m exploring new opportunities." AI-powered, instant results.',
    alternates: { canonical: '/lit' },
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
    openGraph: {
      title: 'English to LinkedIn Translator | Turn Honest Words into LinkedIn Speak',
      description:
        'Free English to LinkedIn translator. Type any honest sentence and watch it transform into over-the-top LinkedIn-speak.',
      url: '/lit',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'English to LinkedIn Translator',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'English to LinkedIn Translator',
      description:
        'Type any honest sentence and watch it transform into LinkedIn-speak.',
      images: [ogImageUrl],
    },
  };
}

export default function LinkedInTranslatorPage() {
  return <LinkedInTranslator />;
}
