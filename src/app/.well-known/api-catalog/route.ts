import { NextResponse } from 'next/server';
import { OPENAPI_URL, SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${SITE_URL}/api/reports/search`,
        service: [
          {
            href: OPENAPI_URL,
            type: 'application/openapi+json',
            title: `${SITE_NAME} Research Paper Search API (OpenAPI 3.1)`,
          },
          {
            href: `${SITE_URL}/developers`,
            type: 'text/html',
            title: 'Developer documentation',
          },
          {
            href: `${SITE_URL}/auth.md`,
            type: 'text/markdown',
            title: 'Authentication guide (no auth required)',
          },
        ],
        describedby: [
          {
            href: `${SITE_URL}/.well-known/ai-catalog.json`,
            type: 'application/json',
            title: 'Agentic Resource Discovery catalog',
          },
        ],
      },
      {
        anchor: `${SITE_URL}/.well-known/mcp`,
        service: [
          {
            href: `${SITE_URL}/.well-known/mcp/server-card.json`,
            type: 'application/json',
            title: 'MCP server card',
          },
        ],
      },
    ],
  };

  return NextResponse.json(linkset, {
    headers: {
      'Content-Type': 'application/linkset+json;profile="https://www.rfc-editor.org/info/rfc9727"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
