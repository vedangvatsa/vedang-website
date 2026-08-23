 
import createMDX from '@next/mdx';
import path from 'path';
import { fileURLToPath } from 'url';
import { ESSAY_SLUG_MIGRATIONS, EXTRA_REDIRECTS } from './routes.config.mjs';

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
        source: '/og/:slug.png',
        destination: '/api/og/:slug',
      },
      {
        source: '/api/og/:slug.png',
        destination: '/api/og/:slug',
      },
      {
        source: '/contact/opengraph-image',
        destination: '/api/og/contact',
      },
      {
        source: '/contact/opengraph-image.png',
        destination: '/api/og/contact',
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
      ...EXTRA_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: true })),
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
        source: '/api/:path*',
        headers: [
          { key: 'RateLimit', value: 'limit=60, remaining=59, reset=60' },
          { key: 'RateLimit-Limit', value: '60' },
          { key: 'RateLimit-Remaining', value: '59' },
          { key: 'RateLimit-Reset', value: '60' },
          { key: 'RateLimit-Policy', value: '60;w=60' },
          { key: 'X-RateLimit-Limit', value: '60' },
          { key: 'X-RateLimit-Remaining', value: '59' },
          { key: 'Sunset', value: 'Sun, 01 Mar 2028 00:00:00 GMT' },
          { key: 'Deprecation', value: '@1835500000' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Idempotency-Key, Accept' },
        ],
      },
      {
        source: '/.well-known/mcp',
        headers: [
          { key: 'RateLimit', value: 'limit=60, remaining=59, reset=60' },
          { key: 'RateLimit-Limit', value: '60' },
          { key: 'RateLimit-Remaining', value: '59' },
          { key: 'RateLimit-Reset', value: '60' },
          { key: 'RateLimit-Policy', value: '60;w=60' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/openapi.json',
        headers: [
          { key: 'RateLimit', value: 'limit=60, remaining=59, reset=60' },
          { key: 'RateLimit-Limit', value: '60' },
          { key: 'RateLimit-Remaining', value: '59' },
          { key: 'RateLimit-Reset', value: '60' },
          { key: 'RateLimit-Policy', value: '60;w=60' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
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
