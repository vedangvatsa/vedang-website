import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'AI & Web Readiness Scanner | Audit SEO, LLM Citations & AI Agents',
  description:
    'Free live scanner for AI & web readiness: audit technical SEO, structured data, robots.txt AI bot policies, llms.txt, Model Context Protocol (MCP) servers, OpenAPI schemas, and Markdown twins.',
  alternates: {
    canonical: 'https://veda.ng/scan',
  },
  openGraph: {
    title: 'AI & Web Readiness Scanner | veda.ng',
    description:
      'Test your website for AI search engines (SearchGPT, Perplexity, Claude), technical SEO, structured schemas, and MCP servers with an instant 0-100 score.',
    url: 'https://veda.ng/scan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & Web Readiness Scanner',
    description: 'Deterministic audit for AI search discovery, technical SEO, MCP servers, OpenAPI schemas, and structured data.',
  },
};

const scanAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI & Web Readiness Scanner',
  alternateName: ['Agentic Readiness Scanner', 'AI Web Scanner', 'veda.ng Scanner'],
  url: 'https://veda.ng/scan',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Instant deterministic audit for website AI & web readiness: verifies technical SEO, JSON-LD schemas, robots.txt AI policies, llms.txt, MCP endpoints, OpenAPI schemas, and HTTPS security.',
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
