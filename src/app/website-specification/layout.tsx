import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: {
    absolute: 'The Website Specification - HTML, Accessibility, Security, SEO, Agent Readiness',
  },
  description: 'A complete, platform-agnostic specification of every technical feature a modern website needs. Covers HTML foundations, SEO, accessibility, security, well-known URIs, AI agent readiness, performance, privacy, resilience, and internationalisation. 120+ requirements, sourced and categorized.',
  keywords: [
    'website specification',
    'web standards',
    'HTML best practices',
    'WCAG accessibility',
    'web security headers',
    'CSP content security policy',
    'Core Web Vitals',
    'SEO checklist',
    'robots.txt',
    'structured data JSON-LD',
    'well-known URIs',
    'AI agent readiness',
    'llms.txt',
    'MCP server',
    'web performance',
    'privacy compliance',
    'GDPR',
    'hreflang',
    'internationalisation',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/website-specification' },
  openGraph: {
    title: 'The Website Specification',
    description: '120+ requirements across 10 categories. Everything a modern website needs, from doctype to agent readiness.',
    url: '/website-specification',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Website Specification',
    description: '120+ requirements across 10 categories. Everything a modern website needs.',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  name: 'The Website Specification',
  headline: 'The Website Specification',
  description: 'A complete, platform-agnostic specification of every technical feature a modern website needs. 120+ requirements across 10 categories.',
  url: 'https://veda.ng/website-specification',
  author: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  publisher: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  datePublished: '2026-05-31',
  dateModified: '2026-05-31',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the must-have HTML elements for every web page?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every HTML page requires: <!doctype html> to trigger standards mode, <html lang="en"> for language declaration, <meta charset="utf-8"> for character encoding, <meta name="viewport"> for mobile rendering, a <title> element, and a <meta name="description">. These six elements are non-negotiable foundations.',
      },
    },
    {
      '@type': 'Question',
      name: 'What security headers should every website set?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At minimum: Strict-Transport-Security (HSTS) for HTTPS enforcement, Content-Security-Policy (CSP) to prevent XSS, X-Content-Type-Options: nosniff to block MIME sniffing, Referrer-Policy for URL privacy, and Permissions-Policy to disable unused browser APIs like camera and geolocation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are Core Web Vitals and what scores should I target?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Core Web Vitals measure real-user experience: LCP (Largest Contentful Paint) should be under 2.5 seconds, INP (Interaction to Next Paint) under 200ms, and CLS (Cumulative Layout Shift) under 0.1. These are measured at the 75th percentile of real user data.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I make my website readable by AI agents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Serve /llms.txt with a structured content index, use JSON-LD structured data on every page, maintain stable URLs, expose machine-readable formats (JSON, RSS, Markdown), configure robots.txt with explicit rules for AI crawlers (GPTBot, ClaudeBot, PerplexityBot), and consider MCP server endpoints for tool discovery.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://veda.ng' },
    { '@type': 'ListItem', position: 2, name: 'Website Specification', item: 'https://veda.ng/website-specification' },
  ],
};

export default function WebsiteSpecificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
        <div className="max-w-4xl mx-auto py-12">
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </PageLayout>
    </>
  );
}
