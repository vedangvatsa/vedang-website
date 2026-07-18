import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: {
    absolute: 'AI Discovery Standards: Reference and Auto-Implementer for AI Web Discoverability',
  },
  description:
    'Landing page for the open-source AI Discovery Standards project: what to publish for AI crawlers and agents, why training differs from search, and how to auto-implement with one npx command.',
  keywords: [
    'AI Discovery Standards',
    'llms.txt',
    'robots.txt AI crawlers',
    'agents.txt',
    'agent-card.json',
    'A2A protocol',
    'TDMRep',
    'npx ai-discovery-standards',
    'GPTBot',
    'OAI-SearchBot',
    'ClaudeBot',
    'PerplexityBot',
    'AEO',
    'GEO',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/aistandards' },
  openGraph: {
    title: 'AI Discovery Standards',
    description:
      'Reference and full auto-implementer for AI discovery files. One command to scan a project and wire robots, llms.txt, agents, and schema.',
    url: '/aistandards',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Discovery Standards',
    description: 'Reference and auto-implementer for AI web discoverability files.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'AI Discovery Standards',
  description:
    'Open-source reference and CLI that auto-implements AI discovery files (robots.txt, llms.txt, agents.txt, TDMRep, schema) for websites.',
  url: 'https://veda.ng/aistandards',
  codeRepository: 'https://github.com/vedangvatsa/ai-discovery-standards',
  programmingLanguage: 'JavaScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
  dateModified: '2026-07-19',
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
      name: 'What is AI Discovery Standards?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An open-source reference of files and crawler tokens for AI web discoverability, plus a CLI that scans a project and writes discovery files (robots.txt, llms.txt, agents.txt, TDMRep, security.txt, schema, and more) and wires layout head tags when safe.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install AI discovery files on my site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'From your website project root run: npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com. Pass --deny-training to block training crawlers. Existing files are not overwritten unless you pass --force.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between agents.json and agent-card.json?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Root /agents.json is the agents-txt.com capability catalog. The A2A Protocol Agent Card is at /.well-known/agent-card.json and is only needed if you run an A2A agent.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does blocking GPTBot remove me from ChatGPT search?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. GPTBot is for training-related crawling. ChatGPT search indexing is controlled separately via OAI-SearchBot. These are independent decisions in OpenAI documentation.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://veda.ng' },
    { '@type': 'ListItem', position: 2, name: 'AI Discovery Standards', item: 'https://veda.ng/aistandards' },
  ],
};

export default function AiDiscoveryStandardsLayout({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageLayout>{children}</PageLayout>
    </>
  );
}
