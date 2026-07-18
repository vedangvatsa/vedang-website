import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: {
    absolute: 'AI Discovery Standards: Make Your Site Readable to AI Crawlers and Agents',
  },
  description:
    'Plain-language guide to robots.txt, llms.txt, agents files, and related AI discovery tools, plus a free command that adds them to your project. Training vs search explained.',
  keywords: [
    'AI Discovery Standards',
    'llms.txt',
    'robots.txt AI crawlers',
    'GPTBot vs OAI-SearchBot',
    'agents.txt',
    'agent-card.json',
    'AI visibility',
    'npx ai-discovery-standards',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/aistandards' },
  openGraph: {
    title: 'AI Discovery Standards',
    description:
      'What files make your site readable to AI systems, why training differs from search, and how to add them with one command.',
    url: '/aistandards',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Discovery Standards',
    description: 'Plain-language guide and auto-implementer for AI discovery files.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'AI Discovery Standards',
  description:
    'Open-source guide and CLI for AI discovery files that help crawlers and agents find and understand a website.',
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
        text: 'A free open-source project that explains the website files related to AI crawlers and agents, and provides a command-line tool that can add the practical set (robots.txt, llms.txt, agents files, security.txt, schema, and more) to a project automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does blocking GPTBot remove me from ChatGPT search?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. GPTBot is associated with training-related crawling. ChatGPT search indexing is controlled separately with OAI-SearchBot. These are independent choices in OpenAI documentation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I add AI discovery files to my website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'From your website project root, run: npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com. Use --deny-training if you want to block training crawlers. Review llms.txt after the tool finishes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Standard vs Adopted vs Emerging mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'These labels describe how solid the underlying rule is, not a score for your site. Standard means a formal RFC or W3C recommendation. Adopted means written down and used in practice. Emerging means a community convention with uneven support. Proposed means a draft. Legacy means low impact or superseded.',
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
