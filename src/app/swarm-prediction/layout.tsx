import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Swarm Intelligence Prediction',
    template: '%s | Swarm Prediction | Vedang Vatsa',
  },
  description: 'Run multi-agent AI debates to forecast outcomes from any document, URL, or pasted text. Supports 8 LLM providers via BYOK. Built by Vedang Vatsa.',
  keywords: [
    'swarm intelligence',
    'AI prediction',
    'multi-agent debate',
    'LLM forecasting',
    'AI agents',
    'prediction engine',
    'swarm prediction',
    'knowledge graph',
    'consensus prediction',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/swarm-prediction' },
  openGraph: {
    title: 'Swarm Intelligence Prediction',
    description: 'Multi-agent AI debate engine that forecasts outcomes from any data source. Supports Anthropic, OpenAI, Gemini, and 5 more providers.',
    url: '/swarm-prediction',
    type: 'website',
    siteName: 'Vedang Vatsa',
    images: [
      {
        url: '/images/swarm/swarm.webp',
        width: 1200,
        height: 630,
        alt: 'Swarm Intelligence Prediction Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swarm Intelligence Prediction',
    description: 'Multi-agent AI debate engine that forecasts outcomes from any data source.',
    images: ['/images/swarm/swarm.webp'],
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Swarm Intelligence Prediction Engine',
  description: 'A multi-agent AI debate engine that creates diverse cognitive personas from any document and runs a structured debate to produce consensus forecasts with confidence bounds.',
  url: 'https://veda.ng/swarm-prediction',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
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
  featureList: [
    'Multi-agent AI debate simulation',
    'Knowledge graph extraction',
    'Support for 8 LLM providers (BYOK)',
    'Configurable depth: 10–100 agents, 4–16 rounds',
    'Consensus report with confidence bounds',
    'Follow-up Q&A on simulation results',
    'Force-directed graph visualisation',
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://veda.ng' },
    { '@type': 'ListItem', position: 2, name: 'Swarm Prediction', item: 'https://veda.ng/swarm-prediction' },
  ],
};

export default function SwarmPredictionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

