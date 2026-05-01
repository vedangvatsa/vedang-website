
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://veda.ng'),
  title: {
    default: 'Vedang Vatsa — AI & Web3 Thought Leader, Founder of Hashtag Web3',
    template: '%s | Vedang Vatsa',
  },
  description:
    'Vedang Vatsa is the founder of Hashtag Web3 (120k+ AI & Web3 professionals), a Fellow of the Royal Society of Arts, and IIT Kanpur alumnus. Explore essays, courses, and tools on AI, blockchain, and decentralized economies.',
  keywords: ['Vedang Vatsa', 'AI', 'Blockchain', 'Web3', 'Growth Marketing', 'Founder', 'AI Researcher', 'DeFi'],
  openGraph: {
    title: 'Vedang Vatsa — AI & Web3 Thought Leader, Founder of Hashtag Web3',
    description: 'Vedang Vatsa is the founder of Hashtag Web3 (120k+ AI & Web3 professionals), Fellow of the Royal Society of Arts, and IIT Kanpur alumnus. Essays, courses, and tools on AI, blockchain, and decentralized economies.',
    url: '/',
    siteName: 'Vedang Vatsa',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Vedang Vatsa — AI & Web3 Thought Leader',
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
    title: 'Vedang Vatsa — AI & Web3 Thought Leader, Founder of Hashtag Web3',
    card: 'summary_large_image',
    images: ['/images/og-homepage.png'],
  },
  alternates: {
    canonical: '/',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vedang Vatsa',
  url: 'https://veda.ng',
  description: 'Official website of Vedang Vatsa — AI & Web3 thought leader, founder of Hashtag Web3.',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hashtag Web3',
  url: 'https://veda.ng',
  logo: 'https://veda.ng/images/icon.png',
  description: 'A global community of 120,000+ professionals in AI and Web3.',
  sameAs: [
    'https://linkedin.com/company/hashtag-web3',
    'https://x.com/hashtagweb3',
  ],
  founder: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
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
    'https://www.youtube.com/@vedangvatsa',
    'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en',
    'https://x.com/vedangvatsa',
  ],
  knowsAbout: ['Artificial Intelligence', 'Web3', 'Blockchain', 'Cryptocurrency', 'Community Building'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
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
        <link rel="alternate" type="application/json" href="/deeprank.json" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly content index" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM full content" />
        <link rel="alternate" type="application/json" href="/ai.json" title="AI discovery manifest" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI permissions" />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
