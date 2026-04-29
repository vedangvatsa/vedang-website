import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'AI Discovery Standards, Open-Source Reference for AI Web Discoverability',
  },
  description: 'Complete reference of every file, protocol, and technique used to make websites discoverable by AI systems. Includes robots.txt, llms.txt, ai.txt, brand.txt, agents.json, structured data, AEO, and GEO. One-command setup via npx.',
  keywords: [
    'AI discovery standards',
    'llms.txt',
    'ai.txt',
    'brand.txt',
    'robots.txt AI crawlers',
    'AEO answer engine optimization',
    'GEO generative engine optimization',
    'AI SEO',
    'GPTBot',
    'ClaudeBot',
    'PerplexityBot',
    'agents.json',
    'ai-plugin.json',
    'structured data JSON-LD',
    'schema.org',
    'AI visibility',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/ai-discovery-standards' },
  openGraph: {
    title: 'AI Discovery Standards',
    description: 'Every file, protocol, and technique for AI web discoverability. One command to set up all 13 discovery files.',
    url: '/ai-discovery-standards',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Discovery Standards',
    description: 'Every file, protocol, and technique for AI web discoverability.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'AI Discovery Standards',
  description: 'A comprehensive reference of every file, protocol, and technique used to make websites discoverable by AI systems, search engines, and autonomous agents. Includes ready-to-use templates and a CLI tool.',
  url: 'https://veda.ng/ai-discovery-standards',
  codeRepository: 'https://github.com/vedangvatsa/ai-discovery-standards',
  programmingLanguage: 'JavaScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
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
        text: 'llms.txt is a Markdown file placed at the root of a website (/llms.txt) that provides LLMs a curated summary of the site content. It includes an H1 title, a blockquote description, and organized links to key pages. Created by Jeremy Howard (Answer.AI) in 2024, it is widely adopted by companies like Anthropic, Stripe, and Vercel but is not an IETF or W3C standard.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the difference between AEO and GEO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AEO (Answer Engine Optimization) focuses on structuring content so AI-powered answer engines like ChatGPT, Perplexity, and Google AI Overviews cite your site when generating responses. GEO (Generative Engine Optimization) extends this to focus on appearing in AI-generated summaries across all platforms. AEO targets question-answer extraction; GEO targets topical authority and citation rate across the entire AI ecosystem.'
      }
    },
    {
      '@type': 'Question',
      name: 'What AI crawlers should I allow in robots.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As of 2026, the major AI crawlers are: GPTBot, OAI-SearchBot, ChatGPT-User (OpenAI), ClaudeBot, Claude-SearchBot, Claude-User (Anthropic), Google-Extended (Gemini), PerplexityBot, Perplexity-User, meta-externalagent, Applebot-Extended, Amazonbot, CCBot, Bytespider, and cohere-ai. Search/retrieval bots cite your content in AI answers, while training bots absorb content into model weights.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is brand.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'brand.txt is a plain-text file placed at the root of a website that provides AI systems with explicit instructions on how to represent a brand. It defines the canonical brand name with exact capitalization, preferred and prohibited terminology, product names, tone guidance, and competitor disambiguation. It reduces AI hallucinations about your brand identity.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is ai.txt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ai.txt is a plain-text file that declares permissions for AI use of website content. While robots.txt controls crawl access, ai.txt specifies what AI systems may do with the content: training, indexing, citation, or summarization. It includes owner contact information and links to other discovery files like llms.txt and sitemap.xml.'
      }
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://veda.ng' },
    { '@type': 'ListItem', position: 2, name: 'AI Discovery Standards', item: 'https://veda.ng/ai-discovery-standards' },
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
      {children}
    </>
  );
}
