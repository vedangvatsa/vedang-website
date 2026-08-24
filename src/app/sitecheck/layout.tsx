import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: {
    absolute: 'The Site Checklist - HTML, Accessibility, Security, SEO, Agent Readiness',
  },
  description: 'Actionable checklist for building modern websites. Covers HTML foundations, SEO, accessibility, security, AI agent readiness, performance, privacy, resilience, and internationalisation. Code examples, verification commands, and a master prompt to audit any site.',
  keywords: [
    'web standards checklist',
    'site audit checklist',
    'HTML best practices',
    'WCAG accessibility',
    'web security headers',
    'CSP content security policy',
    'Core Web Vitals',
    'SEO checklist',
    'robots.txt',
    'structured data JSON-LD',
    'AI agent readiness',
    'llms.txt',
    'web performance',
    'privacy compliance',
    'Vedang Vatsa',
  ],
  alternates: { canonical: '/sitecheck' },
  openGraph: {
    title: 'The Site Checklist',
    description: 'Actionable requirements for modern websites. Code examples, verification commands, and a master AI prompt to audit your site.',
    url: '/sitecheck',
    type: 'website',
    siteName: 'Vedang Vatsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Site Checklist',
    description: 'Actionable requirements for modern websites. Code, verification, and a master AI audit prompt.',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  name: 'The Site Checklist',
  headline: 'The Site Checklist',
  description: 'Actionable checklist for building modern websites. Code examples, verification commands, and a master prompt to audit any site.',
  url: 'https://veda.ng/sitecheck',
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

import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export default function SiteChecklistLayout({
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
      <BreadcrumbSchema items={[{ name: 'Site Checklist', url: 'https://veda.ng/sitecheck' }]} />
      <PageLayout>
        <div className="py-8">
          {children}
        </div>
      </PageLayout>
    </>
  );
}
