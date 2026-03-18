import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'English to LinkedIn Translator - Free Parody Tool',
  description:
    'Translate honest human language into perfect LinkedIn-speak. Turn "I got fired" into "Excited to announce I\'m exploring new opportunities." Free, fun, and 100% client-side.',
  url: '/linkedin-translator',
  keywords: [
    'LinkedIn Translator',
    'LinkedIn Language',
    'Corporate Speak',
    'LinkedIn Parody',
    'LinkedIn Post Generator',
    'Corporate Jargon',
    'LinkedIn Humor',
    'Business Language Translator',
  ],
});

export default function LinkedInTranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
