
import createMDX from '@next/mdx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        source: '/api/og/:slug.png',
        destination: '/api/og/:slug',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/writings',
        destination: '/essays',
        permanent: true,
      },
      {
        source: '/writings/:path*',
        destination: '/essays/:path*',
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
      // Essay slug migrations
      { source: '/agent-infrastructure-stack', destination: '/agentstack', permanent: true },
      { source: '/agentic-commerce', destination: '/agentcommerce', permanent: true },
      { source: '/agentic-state', destination: '/stateagents', permanent: true },
      { source: '/agents-eating-saas', destination: '/agentsaas', permanent: true },
      { source: '/agi-governance', destination: '/governance', permanent: true },
      { source: '/ai-agent-economy', destination: '/agenteconomy', permanent: true },
      { source: '/ai-economy', destination: '/aieconomy', permanent: true },
      { source: '/ai-implementation-playbook', destination: '/playbook', permanent: true },
      { source: '/ambient-intelligence', destination: '/ambient', permanent: true },
      { source: '/api-states', destination: '/apis', permanent: true },
      { source: '/artificial-intuition', destination: '/intuition', permanent: true },
      { source: '/asi-timeline', destination: '/asi', permanent: true },
      { source: '/attention-refinery', destination: '/attention', permanent: true },
      { source: '/blockchain-journey', destination: '/blockchain', permanent: true },
      { source: '/bureaucracy-tax', destination: '/bureaucracy', permanent: true },
      { source: '/cheap-to-competitive', destination: '/competitive', permanent: true },
      { source: '/cognitive-load', destination: '/cognition', permanent: true },
      { source: '/computational-constitutions', destination: '/constitutions', permanent: true },
      { source: '/computational-social-science', destination: '/socialscience', permanent: true },
      { source: '/dark-forest-internet', destination: '/darkforest', permanent: true },
      { source: '/digital-monasticism', destination: '/monasticism', permanent: true },
      { source: '/god-protocol', destination: '/godprotocol', permanent: true },
      { source: '/great-funding-realignment', destination: '/funding', permanent: true },
      { source: '/hustle-culture', destination: '/hustle', permanent: true },
      { source: '/in-between-state', destination: '/liminal', permanent: true },
      { source: '/infinity-economy', destination: '/infinity', permanent: true },
      { source: '/internet-of-lies', destination: '/lies', permanent: true },
      { source: '/intuitive-singularity', destination: '/instinct', permanent: true },
      { source: '/mesh-economy', destination: '/mesh', permanent: true },
      { source: '/plurality-trap', destination: '/plurality', permanent: true },
      { source: '/post-interface-internet', destination: '/postinterface', permanent: true },
      { source: '/post-scarcity-technology', destination: '/postscarcity', permanent: true },
      { source: '/programmable-trust', destination: '/trust', permanent: true },
      { source: '/pseudonymous-agency', destination: '/pseudonymity', permanent: true },
      { source: '/rationality-in-ai', destination: '/rationality', permanent: true },
      { source: '/revision-gap', destination: '/revision', permanent: true },
      { source: '/sacred-algorithms', destination: '/algorithms', permanent: true },
      { source: '/sensory-internet', destination: '/sensory', permanent: true },
      { source: '/simulation-hypothesis', destination: '/simulation', permanent: true },
      { source: '/simulation-layer', destination: '/simulayer', permanent: true },
      { source: '/singapores-arc', destination: '/singapore', permanent: true },
      { source: '/singularity-paradox', destination: '/paradox', permanent: true },
      { source: '/state-of-ai', destination: '/stateofai', permanent: true },
      { source: '/state-of-web3', destination: '/stateofweb3', permanent: true },
      { source: '/stepwise-ai', destination: '/stepwise', permanent: true },
      { source: '/substrate-shift', destination: '/substrate', permanent: true },
      { source: '/synthetic-empathy', destination: '/empathy', permanent: true },
      { source: '/towards-the-agentic-web', destination: '/agenticweb', permanent: true },
      { source: '/twilight-economy', destination: '/twilight', permanent: true },
      { source: '/universal-text-ui', destination: '/textui', permanent: true },
      { source: '/yc-landscape', destination: '/yc', permanent: true },
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
