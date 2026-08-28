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
      mcp_docs: 'https://veda.ng/.well-known/mcp/docs',
      mcp_manifest: 'https://veda.ng/.well-known/mcp.json',
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
      webhooks: 'https://veda.ng/developers#webhooks',
    });
  }

  if (accept.includes('text/markdown')) {
    const md = `# Vedang Vatsa - Developer Resources & API Documentation (veda.ng)\n\n${developersSummaryLines().join('\n')}\n\n- Interactive Developer Portal: https://veda.ng/developers\n- OpenAPI 3.1 Specification: https://veda.ng/openapi.json\n- Product MCP Server: https://veda.ng/.well-known/mcp\n- Documentation MCP Server: https://veda.ng/.well-known/mcp/docs\n- Multi-server MCP Manifest: https://veda.ng/.well-known/mcp.json\n- Authentication Guide: https://veda.ng/auth.md\n- Python SDK (PyPI): https://pypi.org/project/vedang-cli/\n`;
    return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
  }

  return NextResponse.redirect(new URL('/developers', request.url), 308);
}
