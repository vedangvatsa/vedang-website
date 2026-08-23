
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

import { Toaster } from '@/components/ui/toaster';
import { ClarityAnalytics } from '@/components/clarity-analytics';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://veda.ng'),
  title: {
    default: 'Vedang Vatsa - AI & Web3 Thought Leader, Founder of Hashtag Web3',
    template: '%s | Vedang Vatsa',
  },
  description:
    'Essays, free courses, and research on AI agents and Web3 by Vedang Vatsa, founder of Hashtag Web3 and Fellow of the Royal Society of Arts (FRSA).',
  keywords: ['Vedang Vatsa', 'AI', 'Blockchain', 'Web3', 'Growth Marketing', 'Founder', 'AI Researcher', 'DeFi'],
  openGraph: {
    title: 'Vedang Vatsa - AI & Web3 Thought Leader, Founder of Hashtag Web3',
    description: 'Essays, free courses, and research on AI agents and Web3 by Vedang Vatsa, founder of Hashtag Web3 and Fellow of the Royal Society of Arts (FRSA).',
    url: '/',
    siteName: 'Vedang Vatsa',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Vedang Vatsa - AI & Web3 Thought Leader',
      },
    ]
  },
  authors: [{ name: 'Vedang Vatsa', url: 'https://veda.ng' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 300,
    },
  },
  twitter: {
    title: 'Vedang Vatsa - AI & Web3 Thought Leader, Founder of Hashtag Web3',
    card: 'summary_large_image',
    images: ['/images/og-homepage.png'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vedang Vatsa',
  url: 'https://veda.ng',
  description: 'Official website of Vedang Vatsa - AI & Web3 thought leader, founder of Hashtag Web3.',
  publisher: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://veda.ng/glossary?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Vedang Vatsa - AI & Web3 Thought Leader',
  url: 'https://veda.ng',
  description: 'Essays, free courses, and research on AI agents and Web3 by Vedang Vatsa, founder of Hashtag Web3 and Fellow of the Royal Society of Arts (FRSA).',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  about: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  mainEntity: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.text-4xl', 'h1'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hashtag Web3',
  url: 'https://hashtagweb3.com',
  logo: 'https://veda.ng/images/icon.png',
  description: 'A global community of 120,000+ professionals in AI and Web3.',
  sameAs: [
    'https://linkedin.com/company/hashtag-web3',
    'https://x.com/hashtagweb3',
    'https://github.com/vedangvatsa',
  ],
  founder: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'vatsvedang@gmail.com',
    contactType: 'customer support',
    url: 'https://veda.ng/contact',
    availableLanguage: ['English'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SG',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vedang Vatsa',
  url: 'https://veda.ng',
  image: 'https://veda.ng/images/icon.png',
  jobTitle: 'Founder & AI Researcher',
  description: 'Founder of Hashtag Web3, a 100,000+ member community of AI & Web3 professionals. Fellow of the Royal Society of Arts.',
  affiliation: {
    '@type': 'Organization',
    name: 'Hashtag Web3',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Indian Institute of Technology, Kanpur',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Royal Society of Arts',
    url: 'https://www.thersa.org',
  },
  award: 'Fellow of the Royal Society of Arts',
  sameAs: [
    'https://linkedin.com/in/vedangvatsa',
    'https://github.com/vedangvatsa',
    'https://www.youtube.com/@vedangvatsa',
    'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en',
    'https://x.com/vedangvatsa',
  ],
  knowsAbout: ['Artificial Intelligence', 'Web3', 'Blockchain', 'Cryptocurrency', 'Community Building'],
};

const coursesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free AI & Web3 Courses by Vedang Vatsa',
  url: 'https://veda.ng',
  itemListElement: [
    {
      '@type': 'Course',
      name: 'Vibe Coding 101',
      description: 'Build real apps with AI using Firebase Studio, Replit, Cursor, and Lovable.',
      url: 'https://veda.ng/vibecoding',
      provider: { '@type': 'Organization', name: 'Hashtag Web3' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    },
    {
      '@type': 'Course',
      name: 'Web3 101',
      description: 'Blockchain fundamentals, smart contracts, dApps, NFTs, DAOs, and DeFi.',
      url: 'https://veda.ng/web3',
      provider: { '@type': 'Organization', name: 'Hashtag Web3' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    },
    {
      '@type': 'Course',
      name: 'Prompt Engineering 101',
      description: 'Master prompt engineering fundamentals for LLMs and AI assistants.',
      url: 'https://veda.ng/prompt',
      provider: { '@type': 'Organization', name: 'Hashtag Web3' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    },
    {
      '@type': 'Course',
      name: 'The Agentic Web',
      description: 'Autonomous AI agents, MCP, A2A protocols, and agentic systems.',
      url: 'https://veda.ng/agentic',
      provider: { '@type': 'Organization', name: 'Hashtag Web3' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    },
    {
      '@type': 'Course',
      name: 'MCP Development 101',
      description: 'Build MCP servers to connect AI to databases, APIs, and any data source.',
      url: 'https://veda.ng/mcp',
      provider: { '@type': 'Organization', name: 'Hashtag Web3' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    },
    {
      '@type': 'Course',
      name: 'AI Automation 101',
      description: 'Automate workflows with APIs, MCP servers, AI agents, n8n, and no-code tools.',
      url: 'https://veda.ng/automation',
      provider: { '@type': 'Organization', name: 'Hashtag Web3' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    },
  ].map((course, i) => ({ ...course, position: i + 1 })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable} overflow-x-hidden`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9LJSZF8BGZ"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9LJSZF8BGZ');
            `,
          }}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesSchema) }}
        />
        <link rel="alternate" type="application/json" href="/deeprank.json" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly content index" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM full content" />
        <link rel="alternate" type="application/json" href="/ai.json" title="AI discovery manifest" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI permissions" />
        <link rel="help" href="/developers" title="Developer resources and API documentation" />
        <link rel="service" href="/.well-known/mcp" title="MCP server (Streamable HTTP)" />
      </head>
      <body className="font-sans overflow-x-hidden">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium">Skip to main content</a>
          <a href="/developers" className="sr-only">Developer Resources & API</a>
          {children}
          <ClarityAnalytics />
          <Toaster />
      </body>
    </html>
  );
}
