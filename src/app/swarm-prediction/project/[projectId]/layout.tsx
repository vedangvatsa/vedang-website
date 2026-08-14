import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swarm Prediction Run',
  description:
    'A live multi-agent forecast run. This URL is a working session, not a public article. Start a new run from the Swarm Prediction page.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/swarm-prediction',
  },
  openGraph: {
    title: 'Swarm Prediction Run',
    description: 'A live multi-agent forecast session on veda.ng.',
    url: '/swarm-prediction',
    type: 'website',
  },
};

export default function SwarmProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
