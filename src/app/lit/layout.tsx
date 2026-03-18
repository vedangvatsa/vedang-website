import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'English to LinkedIn Translator | Turn Honest Words into LinkedIn Speak',
  description:
    'Free English to LinkedIn translator. Type any honest sentence and watch it transform into over-the-top LinkedIn-speak. "I got fired" becomes "Thrilled to announce I\'m exploring new opportunities." AI-powered, instant results.',
  url: '/lit',
  ogImage: '/api/og/linkedin',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the English to LinkedIn Translator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is a free AI-powered tool that takes any honest sentence and rewrites it in over-the-top LinkedIn corporate speak. For example, "I got fired" becomes "Thrilled to announce I\'m exploring new opportunities."',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the LinkedIn Translator free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is completely free. No sign-up required. Just type a sentence and hit Translate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the English to LinkedIn Translator work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The tool uses AI to analyze your input and rewrite it using common LinkedIn patterns: corporate euphemisms, humble-brag framing, and overly earnest language. It works for negative, positive, and neutral inputs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share my LinkedIn translations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can share directly to X (Twitter), LinkedIn, WhatsApp, and Reddit. You can also download a branded screenshot or copy a shareable link that pre-fills the input.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it produce the same output every time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The AI generates a different translation each time, even for the same input. This makes it fun to try the same sentence multiple times.',
      },
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Use the English to LinkedIn Translator',
  description: 'Turn any honest sentence into LinkedIn-speak in 3 steps.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Type your sentence',
      text: 'Enter any honest sentence in the input box. For example: "I got fired last week."',
    },
    {
      '@type': 'HowToStep',
      name: 'Click Translate',
      text: 'Press the Translate button or click an example prompt. The AI will generate a LinkedIn-style version.',
    },
    {
      '@type': 'HowToStep',
      name: 'Share or copy',
      text: 'Copy the result, download a branded image, or share directly to social media.',
    },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {children}
    </>
  );
}
