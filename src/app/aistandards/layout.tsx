import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: {
    absolute: 'AI Discovery Standards, Open-Source Reference for AI Web Discoverability',
  },
  description:
    'Verified reference of files, protocols, and crawlers for AI web discoverability: robots.txt, llms.txt, agents.txt, A2A agent-card.json, TDMRep, OpenAPI, schema.org, AEO, and GEO. One-command setup via npx.',
  keywords: [
    'AI discovery standards',
    'llms.txt',
    'agents.txt',
    'agent-card.json',
    'A2A protocol',
    'ai.txt',
    'brand.txt',
    'robots.txt AI crawlers',
    'GPTBot',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-SearchBot',
    'PerplexityBot',
    'Google-Extended',
    'TDMRep',
    'AIPREF',
    'AEO answer engine optimization',
    'GEO generative engine optimization',
    'structured data JSON-LD',
    'schema.org',
    'AI visibility',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/aistandards' },
  openGraph: {
    title: 'AI Discovery Standards',
    description:
      'Verified files, protocols, and crawlers for AI web discoverability — including correct A2A agent-card.json vs agents.txt paths.',
    url: '/aistandards',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Discovery Standards',
    description: 'Verified files, protocols, and crawlers for AI web discoverability.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'AI Discovery Standards',
  description:
    'A verified reference of files, protocols, and techniques used to make websites discoverable by AI systems, search engines, and autonomous agents. Includes templates and a CLI tool.',
  url: 'https://veda.ng/aistandards',
  codeRepository: 'https://github.com/vedangvatsa/ai-discovery-standards',
  programmingLanguage: 'JavaScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
  dateModified: '2026-07-18',
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
      name: 'What is llms.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'llms.txt is a Markdown file at the site root (/llms.txt) that gives LLMs a curated summary: an H1 title, a short description, and organized links to key pages. Created by Jeremy Howard (Answer.AI) in 2024. It is a community convention (llmstxt.org), not an IETF or W3C standard.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between AEO and GEO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AEO (Answer Engine Optimization) focuses on structuring content so AI-powered answer engines cite your site in responses. GEO (Generative Engine Optimization) emphasizes citation rate and topical authority across generative answers more broadly. Both are industry practices, not vendor ranking guarantees.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between agents.json and agent-card.json?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Root /agents.json is the agents-txt.com companion catalog for agent protocol capabilities (MCP, skills, payments, etc.). The A2A Protocol Agent Card is served at /.well-known/agent-card.json and describes an agent’s identity, transports, skills, and security. These are different files for different specs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What AI crawlers should I allow in robots.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Decide separately for training vs search. Vendor-documented tokens include OpenAI GPTBot (training), OAI-SearchBot (search), ChatGPT-User (user-triggered; robots may not apply), OAI-AdsBot (ads validation); Anthropic ClaudeBot, Claude-SearchBot, Claude-User; Googlebot and Google-Extended (Gemini train/ground control token, not Search removal); PerplexityBot and Perplexity-User (user fetcher generally ignores robots.txt). Prefer official vendor documentation and published IP lists.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is agents.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'agents.txt is a plain-text file at the site root that declares agent-interaction protocols using robots.txt-like directives (MCP, A2A Agent Card URLs, Skills, Protocols, Authorization, UCP, WebMCP). The companion /agents.json provides richer structured metadata. Spec: agents-txt.com. A2A cards themselves live at /.well-known/agent-card.json.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is ai.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ai.txt is an informal community convention for declaring AI usage preferences (training, indexing, citation, summarization). It is not a formal standard and is not uniformly honored by major model providers. Prefer robots.txt product tokens, TDMRep, and emerging AIPREF/Content-Signal mechanisms for machine-actionable policy.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is brand.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'brand.txt is an informal plain-text file for preferred brand naming, product names, tone, and competitor disambiguation. It can help agents you integrate with, but there is no evidence that major public AI products systematically load /brand.txt on every brand mention.',
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
      <PageLayout>
        {children}
      </PageLayout>
    </>
  );
}
