import { NextResponse } from 'next/server';
import { getStandardApiHeaders } from '@/lib/api-response';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export async function GET() {
  const headers = getStandardApiHeaders({ cacheSeconds: 3600 });

  return NextResponse.json(
    {
      name: 'Vedang Vatsa Public API (veda.ng)',
      version: '1.1.0',
      description: 'Official public, open, and keyless REST API for academic paper search, published essays, and technical glossaries by Vedang Vatsa.',
      documentation: `${SITE_URL}/developers`,
      openapi: `${SITE_URL}/openapi.json`,
      mcp: `${SITE_URL}/.well-known/mcp`,
      mcp_docs: `${SITE_URL}/.well-known/mcp/docs`,
      mcp_manifest: `${SITE_URL}/.well-known/mcp.json`,
      pypi: 'https://pypi.org/project/vedang-cli/',
      npm: 'https://www.npmjs.com/package/vedang',
      auth: 'none',
      endpoints: {
        search: `${SITE_URL}/api/v1/reports/search?q={keyword}&corpus={ai|web3}`,
        essays: `${SITE_URL}/api/v1/essays`,
        glossary: `${SITE_URL}/api/v1/glossary`,
        batch: `${SITE_URL}/api/v1/batch`,
        jobs: `${SITE_URL}/api/v1/jobs/{jobId}`,
        ask: `${SITE_URL}/ask?q={query}`,
      },
    },
    { headers }
  );
}
