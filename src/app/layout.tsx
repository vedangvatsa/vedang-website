
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
    default: 'Vedang Vatsa - Essays, Research & Profile (veda.ng)',
    template: '%s | Vedang Vatsa',
  },
  description:
    'Official personal website and research hub of Vedang Vatsa (FRSA) on veda.ng. Personal essays, research publications, profile, and free courses on AI agents and Web3.',
  keywords: ['Vedang Vatsa', 'veda.ng', 'Veda', 'Vedang', 'Essays', 'AI Thought Leader', 'Web3 Expert', 'Hashtag Web3', 'AI Researcher', 'DeFi', 'Profile'],
  openGraph: {
    title: 'Vedang Vatsa - Essays, Research & Profile (veda.ng)',
    description: 'Official personal website and research hub of Vedang Vatsa (FRSA) on veda.ng. Personal essays, research publications, profile, and free courses on AI agents and Web3.',
    url: '/',
    siteName: 'Vedang Vatsa',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://veda.ng/images/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Vedang Vatsa - Essays, Research & Profile',
      },
    ]
  },
  authors: [{ name: 'Vedang Vatsa', url: 'https://veda.ng/about' }],
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
    title: 'Vedang Vatsa - Essays, Research & Profile (veda.ng)',
    card: 'summary_large_image',
    images: ['https://veda.ng/images/og-homepage.png'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vedang Vatsa',
  alternateName: ['veda.ng', 'Vedang Vatsa Website', 'Veda'],
  url: 'https://veda.ng',
  description: 'Official website of Vedang Vatsa (veda.ng) - Personal essays, research publications, profile, and courses on AI & Web3.',
  publisher: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng/about',
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
  name: 'Vedang Vatsa',
  alternateName: ['veda.ng', 'Veda', 'CVinBio', 'Hashtag Web3', 'Veda Research Hub'],
  url: 'https://veda.ng',
  logo: 'https://veda.ng/images/icon.png',
  description: 'Official AI and Web3 research publication, developer API, and tool platform created by Vedang Vatsa.',
  founder: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng/about',
  },
  sameAs: [
    'https://cvin.bio',
    'https://hashtagweb3.com',
    'https://github.com/vedangvatsa/vedang-website',
    'https://pypi.org/project/vedang-cli/',
    'https://www.npmjs.com/package/vedang',
    'https://linkedin.com/in/vedangvatsa',
    'https://x.com/vedangvatsa',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Veda Developer Resources & SDKs',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'WebAPI',
          name: 'Veda Public REST API',
          description: 'Keyless, open-access research API indexing 233,000+ academic papers.',
          url: 'https://veda.ng/developers',
          documentation: 'https://veda.ng/developers',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SoftwareApplication',
          name: 'Veda MCP Server',
          description: 'Model Context Protocol (MCP) server over Streamable HTTP.',
          url: 'https://veda.ng/.well-known/mcp',
          applicationCategory: 'DeveloperApplication',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SoftwareApplication',
          name: 'vedang-cli (PyPI Python SDK)',
          description: 'Official Python SDK and CLI package for Veda research tools.',
          url: 'https://pypi.org/project/vedang-cli/',
          downloadUrl: 'https://pypi.org/project/vedang-cli/',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'All',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SoftwareApplication',
          name: 'vedang (NPM TypeScript SDK)',
          description: 'Official TypeScript and JavaScript SDK package for Veda developer resources.',
          url: 'https://www.npmjs.com/package/vedang',
          downloadUrl: 'https://www.npmjs.com/package/vedang',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'All',
        },
      },
    ],
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

const sdkSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'vedang-cli',
      alternateName: ['Veda Python SDK', 'Veda CLI', 'vedang-cli PyPI package'],
      operatingSystem: 'All',
      applicationCategory: 'DeveloperApplication',
      softwareVersion: '1.0.0',
      description: 'Official Python SDK and CLI package for Veda (veda.ng) research APIs and essays.',
      url: 'https://pypi.org/project/vedang-cli/',
      downloadUrl: 'https://pypi.org/project/vedang-cli/',
      installUrl: 'https://pypi.org/project/vedang-cli/',
      author: {
        '@type': 'Person',
        name: 'Vedang Vatsa',
        url: 'https://veda.ng/about',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'vedang',
      alternateName: ['Veda NPM Package', 'Veda TypeScript SDK', 'vedang npm package'],
      operatingSystem: 'All',
      applicationCategory: 'DeveloperApplication',
      softwareVersion: '1.0.0',
      description: 'Official TypeScript and JavaScript SDK package for Veda (veda.ng) developer resources.',
      url: 'https://www.npmjs.com/package/vedang',
      downloadUrl: 'https://www.npmjs.com/package/vedang',
      installUrl: 'https://www.npmjs.com/package/vedang',
      author: {
        '@type': 'Person',
        name: 'Vedang Vatsa',
        url: 'https://veda.ng/about',
      },
    },
    {
      '@type': 'WebAPI',
      name: 'Veda Developer API & MCP Server',
      alternateName: ['Veda API', 'Veda Developer Resources', 'Veda OpenAPI Specification', 'Veda MCP Server'],
      url: 'https://veda.ng/developers',
      documentation: 'https://veda.ng/developers',
      termsOfService: 'https://veda.ng/privacy',
      provider: {
        '@type': 'Organization',
        name: 'Vedang Vatsa',
        url: 'https://veda.ng',
      },
    },
  ],
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vedang Vatsa',
  url: 'https://veda.ng',
  image: 'https://veda.ng/images/icon.png',
  jobTitle: 'Founder & AI Researcher',
  description: 'Founder of CVinBio and Hashtag Web3. Fellow of the Royal Society of Arts (FRSA), IIT Kanpur alumnus.',
  affiliation: [
    {
      '@type': 'Organization',
      name: 'CVinBio',
      url: 'https://cvin.bio',
      sameAs: [
        'https://linkedin.com/company/cvinbio',
        'https://www.linkedin.com/company/cvinbio',
        'https://cvin.bio',
      ],
    },
    {
      '@type': 'Organization',
      name: 'Hashtag Web3',
      url: 'https://hashtagweb3.com',
      sameAs: [
        'https://linkedin.com/company/hashtagweb3',
        'https://www.linkedin.com/company/hashtagweb3',
        'https://hashtagweb3.com',
      ],
    },
  ],
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
    'https://x.com/vedangvatsa',
    'https://twitter.com/vedangvatsa',
    'https://www.youtube.com/@vedangvatsa',
    'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en',
    'https://www.instagram.com/vedangvatsa',
    'https://t.me/vedangvatsa',
    'https://pypi.org/project/vedang-cli/',
    'https://hashtagweb3.com',
    'https://cvin.bio',
    'https://linkedin.com/company/cvinbio',
    'https://www.linkedin.com/company/cvinbio',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What research and content does veda.ng publish?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'veda.ng publishes long-form research essays on AI agents, AI policy, and Web3 infrastructure by Vedang Vatsa, alongside free technical courses, a 100+ term glossary, and indexes of 233,000+ academic papers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can AI agents and developers access veda.ng programmatic tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI agents can query the Model Context Protocol (MCP) server at /.well-known/mcp, access the REST API at /api/reports/search, fetch OpenAPI 3.1 specs at /openapi.json, or request any page with Accept: text/markdown header. No authentication is required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is Vedang Vatsa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vedang Vatsa is an AI & Web3 researcher, Fellow of the Royal Society of Arts (FRSA), alumnus of IIT Kanpur, and the founder of Hashtag Web3, a global community of 120,000+ professionals.',
      },
    },
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'veda.ng AI & Web3 Research Hub',
  provider: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  serviceType: 'AI & Web3 Research and Advisory',
  description: 'Open research publications, AI agent interoperability tools, and executive advisory on autonomous systems and Web3 protocols.',
  url: 'https://veda.ng',
  isAccessibleForFree: true,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sdkSchema) }}
        />
        <link rel="alternate" type="application/json" href="/deeprank.json" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly content index" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM full content" />
        <link rel="alternate" type="application/json" href="/ai.json" title="AI discovery manifest" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI permissions" />
        <link rel="help" href="/developers" title="Developer resources and API documentation" />
        <link rel="documentation" href="/developers" title="Veda Developer Documentation" />
        <link rel="api" href="/api" title="Veda Public REST API" />
        <link rel="describedby" href="/openapi.json" type="application/openapi+json" title="OpenAPI 3.1 Specification" />
        <link rel="service" href="/.well-known/mcp" title="MCP server (Streamable HTTP)" />
        <link rel="mcp" href="/.well-known/mcp" title="Veda Model Context Protocol (MCP) Server" />
        <meta name="mcp:endpoint" content="https://veda.ng/.well-known/mcp" />
        <meta name="mcp:transport" content="Streamable HTTP" />
        <link rel="sdk" href="https://pypi.org/project/vedang-cli/" title="Python SDK (vedang-cli on PyPI)" />
        <link rel="sdk" href="https://www.npmjs.com/package/vedang" title="TypeScript/JavaScript SDK (vedang on NPM)" />
        <link rel="package" href="https://pypi.org/project/vedang-cli/" title="vedang-cli on PyPI" />
        <link rel="package" href="https://www.npmjs.com/package/vedang" title="vedang on NPM" />
        <meta name="sdk:pypi" content="https://pypi.org/project/vedang-cli/" />
        <meta name="sdk:npm" content="https://www.npmjs.com/package/vedang" />
        <meta name="sdk:repository" content="https://github.com/vedangvatsa/vedang-website" />
        <meta name="content-signal" content="search=yes, ai-train=yes, ai-input=yes" />
        <meta name="ai-content-signal" content="search=yes, ai-train=yes, ai-input=yes" />
        <meta name="pypi:package" content="vedang-cli" />
        <meta name="npm:package" content="vedang" />
      </head>
      <body className="font-sans overflow-x-hidden">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium">Skip to main content</a>
          <a href="/developers" className="sr-only">Veda Developer Resources & API Documentation</a>
          <a href="/docs" className="sr-only">Veda API Documentation</a>
          <a href="/api" className="sr-only">Veda Public REST API</a>
          <a href="/openapi.json" className="sr-only">OpenAPI Specification</a>
          <a href="https://pypi.org/project/vedang-cli/" rel="package sdk" className="sr-only">Veda Python SDK & CLI: vedang-cli on PyPI</a>
          <a href="https://www.npmjs.com/package/vedang" rel="package sdk" className="sr-only">Veda TypeScript & JavaScript SDK: vedang on NPM</a>
          {children}
          <ClarityAnalytics />
          <Toaster />
      </body>
    </html>
  );
}
