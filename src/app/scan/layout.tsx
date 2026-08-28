import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'Agentic Readiness Scanner | Audit AI Agents & LLM Discovery',
  description:
    'Free live scanner for AI agent-readiness and machine discovery: audit robots.txt AI bot policies, llms.txt, Model Context Protocol (MCP) servers, OpenAPI schemas, and Markdown twins.',
  alternates: {
    canonical: 'https://veda.ng/scan',
  },
  openGraph: {
    title: 'Agentic Readiness Scanner | veda.ng',
    description:
      'Test your website for AI agents, LLM search engines, and MCP servers with an instant 0-100 score and actionable fix snippets.',
    url: 'https://veda.ng/scan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentic Readiness Scanner',
    description: 'Deterministic audit for AI agent discovery, MCP servers, OpenAPI schemas, and structured data.',
  },
};

const scanAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Agentic Readiness Scanner',
  url: 'https://veda.ng/scan',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Instant deterministic audit for website AI agent readiness: verifies robots.txt crawler policies, llms.txt, MCP endpoints, OpenAPI schemas, HTTPS security, and structured data.',
  author: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scanAppSchema) }}
      />
      <BreadcrumbSchema items={[{ name: 'Agentic Scanner', url: 'https://veda.ng/scan' }]} />
      {children}
    </>
  );
}
