import { NextRequest, NextResponse } from 'next/server';
import { developersSummaryLines } from '@/lib/agent-md';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  if (accept.includes('application/json')) {
    return NextResponse.json({
      name: 'Veda Developer Resources',
      url: 'https://veda.ng/developers',
      documentation: 'https://veda.ng/developers',
      openapi: 'https://veda.ng/openapi.json',
      mcp: 'https://veda.ng/.well-known/mcp',
      endpoints: {
        search: 'https://veda.ng/api/v1/reports/search',
        essays: 'https://veda.ng/api/v1/essays',
        glossary: 'https://veda.ng/api/v1/glossary',
        batch: 'https://veda.ng/api/v1/batch',
        jobs: 'https://veda.ng/api/v1/jobs/{jobId}',
      },
      pypi: 'https://pypi.org/project/vedang-cli/',
      npm: 'https://www.npmjs.com/package/vedang',
      auth: 'https://veda.ng/auth.md',
      webhooks: 'https://veda.ng/webhooks.json',
    });
  }

  if (accept.includes('text/markdown')) {
    const md = `# Veda Developer Resources & API Documentation\n\n${developersSummaryLines().join('\n')}\n\nFull documentation: https://veda.ng/developers\nOpenAPI 3.1 Spec: https://veda.ng/openapi.json\nMCP Server: https://veda.ng/.well-known/mcp\nAuth: https://veda.ng/auth.md\nWebhooks: https://veda.ng/webhooks.json\n`;
    return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
  }

  return NextResponse.redirect(new URL('/developers', request.url), 308);
}
