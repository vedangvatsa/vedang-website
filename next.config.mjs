
import createMDX from '@next/mdx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Old long essay slugs -> current root slugs. */
const ESSAY_SLUG_MIGRATIONS = [
  ['agent-infrastructure-stack', 'agentstack'],
  ['agentic-commerce', 'agentcommerce'],
  ['agentic-state', 'stateagents'],
  ['agents-eating-saas', 'agentsaas'],
  ['agi-governance', 'governance'],
  ['ai-agent-economy', 'agenteconomy'],
  ['ai-economy', 'aieconomy'],
  ['ai-implementation-playbook', 'playbook'],
  ['ambient-intelligence', 'ambient'],
  ['api-states', 'apis'],
  ['artificial-intuition', 'intuition'],
  ['asi-timeline', 'asi'],
  ['attention-refinery', 'attention'],
  ['blockchain-journey', 'blockchain'],
  ['bureaucracy-tax', 'bureaucracy'],
  ['cheap-to-competitive', 'competitive'],
  ['cognitive-load', 'cognition'],
  ['computational-constitutions', 'constitutions'],
  ['computational-social-science', 'socialscience'],
  ['dark-forest-internet', 'darkforest'],
  ['digital-monasticism', 'monasticism'],
  ['god-protocol', 'godprotocol'],
  ['great-funding-realignment', 'funding'],
  ['hustle-culture', 'hustle'],
  ['in-between-state', 'liminal'],
  ['infinity-economy', 'infinity'],
  ['internet-of-lies', 'lies'],
  ['intuitive-singularity', 'instinct'],
  ['mesh-economy', 'mesh'],
  ['plurality-trap', 'plurality'],
  ['post-interface-internet', 'postinterface'],
  ['post-scarcity-technology', 'postscarcity'],
  ['programmable-trust', 'trust'],
  ['pseudonymous-agency', 'pseudonymity'],
  ['rationality-in-ai', 'rationality'],
  ['revision-gap', 'revision'],
  ['sacred-algorithms', 'algorithms'],
  ['sensory-internet', 'sensory'],
  ['simulation-hypothesis', 'simulation'],
  ['simulation-layer', 'simulayer'],
  ['singapores-arc', 'singapore'],
  ['singularity-paradox', 'paradox'],
  ['state-of-ai', 'stateofai'],
  ['state-of-web3', 'stateofweb3'],
  ['stepwise-ai', 'stepwise'],
  ['substrate-shift', 'substrate'],
  ['synthetic-empathy', 'empathy'],
  ['towards-the-agentic-web', 'agenticweb'],
  ['twilight-economy', 'twilight'],
  ['universal-text-ui', 'textui'],
  ['yc-landscape', 'yc'],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingIncludes: {
    '/*': ['./public/**/*'],
  },
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async rewrites() {
    return [
      {
        source: '/og/:slug.png',
        destination: '/api/og/:slug',
      },
      {
        source: '/api/og/:slug.png',
        destination: '/api/og/:slug',
      },
      {
        source: '/meeting/opengraph-image',
        destination: '/api/og/meeting',
      },
      {
        source: '/meeting/opengraph-image.png',
        destination: '/api/og/meeting',
      },
    ];
  },
  async redirects() {
    const essayRedirects = ESSAY_SLUG_MIGRATIONS.flatMap(([from, to]) => [
      { source: `/${from}`, destination: `/${to}`, permanent: true },
      { source: `/essays/${from}`, destination: `/${to}`, permanent: true },
      { source: `/writings/${from}`, destination: `/${to}`, permanent: true },
    ]);

    return [
      {
        source: '/who-buys',
        destination: '/receipts',
        permanent: true,
      },
      {
        source: '/writings',
        destination: '/essays',
        permanent: true,
      },
      {
        source: '/194',
        destination: '/agenticweb',
        permanent: true,
      },
      {
        source: '/158',
        destination: '/blockchain',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/profile',
        permanent: true,
      },
      // Course slug migrations
      {
        source: '/web3-101',
        destination: '/web3',
        permanent: true,
      },
      {
        source: '/web3-101/:path*',
        destination: '/web3/:path*',
        permanent: true,
      },
      {
        source: '/mcp-development',
        destination: '/mcp',
        permanent: true,
      },
      {
        source: '/mcp-development/:path*',
        destination: '/mcp/:path*',
        permanent: true,
      },
      {
        source: '/ai-automation',
        destination: '/automation',
        permanent: true,
      },
      {
        source: '/ai-automation/:path*',
        destination: '/automation/:path*',
        permanent: true,
      },
      {
        source: '/agentic-web',
        destination: '/agentic',
        permanent: true,
      },
      {
        source: '/agentic-web/:path*',
        destination: '/agentic/:path*',
        permanent: true,
      },
      {
        source: '/prompt-engineering-101',
        destination: '/prompt',
        permanent: true,
      },
      {
        source: '/prompt-engineering-101/:path*',
        destination: '/prompt/:path*',
        permanent: true,
      },
      {
        source: '/vibe-coding',
        destination: '/vibecoding',
        permanent: true,
      },
      {
        source: '/vibe-coding/:path*',
        destination: '/vibecoding/:path*',
        permanent: true,
      },
      {
        source: '/ai-reports',
        destination: '/ailib',
        permanent: true,
      },
      {
        source: '/ai-reports/:path*',
        destination: '/ailib/:path*',
        permanent: true,
      },
      {
        source: '/aireports',
        destination: '/ailib',
        permanent: true,
      },
      {
        source: '/aireports/:path*',
        destination: '/ailib/:path*',
        permanent: true,
      },
      {
        source: '/web3-reports',
        destination: '/web3lib',
        permanent: true,
      },
      {
        source: '/web3-reports/:path*',
        destination: '/web3lib/:path*',
        permanent: true,
      },
      {
        source: '/ai-discovery-standards',
        destination: '/aistandards',
        permanent: true,
      },
      {
        source: '/ai-discovery-standards/:path*',
        destination: '/aistandards/:path*',
        permanent: true,
      },
      {
        source: '/site-checklist',
        destination: '/sitecheck',
        permanent: true,
      },
      {
        source: '/site-checklist/:path*',
        destination: '/sitecheck/:path*',
        permanent: true,
      },
      // Essay slug migrations (root + /essays + /writings long forms)
      ...essayRedirects,
      // /essays/{current-slug} and leftover /writings/{slug} -> root
      { source: '/essays/:slug', destination: '/:slug', permanent: true },
      { source: '/writings/:slug', destination: '/:slug', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(self), microphone=(), camera=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://platform.twitter.com https://cdn.syndication.twimg.com https://app.cal.com https://*.cal.com https://www.clarity.ms https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: https://www.clarity.ms https://*.clarity.ms",
              "font-src 'self' data: https://basemaps.cartocdn.com https://*.cal.com",
              "frame-src https://www.youtube.com https://platform.twitter.com https://syndication.twitter.com https://app.cal.com https://*.cal.com",
              "frame-ancestors 'self'",
              "connect-src 'self' https://www.google-analytics.com https://syndication.twitter.com https://cdn.syndication.twimg.com https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://app.cal.com https://*.cal.com https://www.clarity.ms https://*.clarity.ms",
              "worker-src 'self' blob:",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/og/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add MDX options if needed
});

export default withMDX(nextConfig);
