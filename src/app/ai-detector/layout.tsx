import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'AI Text Detector - Authenticity & Stylometrics | Vedang Vatsa',
  description: 'Verify text authenticity with real-time sentence highlights, model attribution, and calibrated perplexity/burstiness.',
  alternates: { canonical: '/ai-detector' },
  openGraph: {
    title: 'AI Text Detector - Authenticity & Stylometrics | Vedang Vatsa',
    description: 'Verify text authenticity with real-time sentence highlights, model attribution, and calibrated perplexity/burstiness.',
    url: 'https://veda.ng/ai-detector',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
