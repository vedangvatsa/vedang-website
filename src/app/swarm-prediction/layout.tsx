import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swarm Intelligence Prediction',
  description: 'Run multi-agent AI debates to forecast outcomes from any document, URL, or pasted text. Built by Vedang Vatsa.',
  alternates: { canonical: '/swarm-prediction' },
  openGraph: {
    title: 'Swarm Intelligence Prediction',
    description: 'Multi-agent AI debate engine that forecasts outcomes from any data source.',
    url: '/swarm-prediction',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swarm Intelligence Prediction',
    description: 'Multi-agent AI debate engine that forecasts outcomes from any data source.',
  },
};

export default function SwarmPredictionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
