import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: {
    absolute: 'AI Discovery Standards: Make Your Site Readable to AI Crawlers and Agents',
  },
  description:
    'Catalog and installer for website files that may help AI crawlers and agents: robots.txt, llms.txt, agents files, schema, and related surfaces. Training vs search, with no guaranteed outcomes.',
  keywords: [
    'AI Discovery Standards',
    'llms.txt',
    'robots.txt AI crawlers',
    'GPTBot vs OAI-SearchBot',
    'agents.txt',
    'agent-card.json',
    'AI visibility',
    'npx aistandards',
    'npx github:vedangvatsa/aistandards',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/aistandards' },
  openGraph: {
    title: 'AI Discovery Standards',
    description:
      'Files that may help AI systems find and understand a site, how training often differs from search, and a one-command installer.',
    url: '/aistandards',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Discovery Standards',
    description: 'Plain-language guide and installer for AI discovery files. Outcomes vary by product.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'AI Discovery Standards',
  description:
    'Open-source guide and CLI for website discovery files that may help crawlers and agents find and understand a site.',
  url: 'https://veda.ng/aistandards',
  codeRepository: 'https://github.com/vedangvatsa/aistandards',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageLayout>{children}</PageLayout>
    </>
  );
}
