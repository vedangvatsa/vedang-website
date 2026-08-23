import { NextResponse } from 'next/server';
import { getStandardApiHeaders } from '@/lib/api-response';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export async function GET() {
  const headers = getStandardApiHeaders({ cacheSeconds: 3600 });

  return NextResponse.json(
    {
      name: 'veda.ng Public API',
      version: '1.1.0',
      description: 'Public, open, and keyless REST API for academic paper search, published essays, and technical glossaries.',
      documentation: `${SITE_URL}/developers`,
      openapi: `${SITE_URL}/openapi.json`,
      mcp: `${SITE_URL}/.well-known/mcp`,
      auth: 'none',
      endpoints: {
        search: `${SITE_URL}/api/v1/reports/search?q={keyword}&corpus={ai|web3}`,
        essays: `${SITE_URL}/api/v1/essays`,
        glossary: `${SITE_URL}/api/v1/glossary`,
        ask: `${SITE_URL}/ask?q={query}`,
      },
    },
    { headers }
  );
}
