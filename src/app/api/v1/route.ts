import { NextResponse } from 'next/server';
import { getStandardApiHeaders } from '@/lib/api-response';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export async function GET() {
  const headers = getStandardApiHeaders({ cacheSeconds: 3600 });

  return NextResponse.json(
    {
      name: 'veda.ng Public API v1',
      version: '1.1.0',
      description: 'Version-pinned v1 public REST API.',
      documentation: `${SITE_URL}/developers`,
      openapi: `${SITE_URL}/openapi.json`,
      endpoints: {
        search: `${SITE_URL}/api/v1/reports/search?q={keyword}&corpus={ai|web3}`,
        essays: `${SITE_URL}/api/v1/essays`,
        glossary: `${SITE_URL}/api/v1/glossary`,
      },
    },
    { headers }
  );
}
