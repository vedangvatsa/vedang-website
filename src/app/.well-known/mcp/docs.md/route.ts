import { NextRequest } from 'next/server';
import { SITE_URL } from '@/lib/site';

export const runtime = 'edge';
export const dynamic = 'force-static';

const MARKDOWN = `# Vedang Vatsa MCP Documentation Server

**Endpoint:** ${SITE_URL}/.well-known/mcp/docs  
**Transport:** Streamable HTTP (JSON-RPC 2.0)  
**Protocol:** Model Context Protocol (MCP) 2025-06-18

---

## Overview

The veda.ng Documentation MCP Server exposes essays, glossary terms, and AI
research papers as tools for AI agents. Access is keyless and unauthenticated.

## Tools

### search_essays
Search long-form essays on AI agents, AI policy, and Web3 by title and summary.

**Input:**
- \`query\` (string, required) — keyword or phrase

**Returns:** Array of essay objects with title, slug, summary, date, tags.

### get_essay
Retrieve the full Markdown text of one essay by URL slug.

**Input:**
- \`slug\` (string, required) — essay slug (e.g. "building-mcp-servers")

**Returns:** Full Markdown content of the essay.

### search_glossary
Search the AI & Web3 glossary (100+ terms). Returns term previews.

**Input:**
- \`query\` (string, required) — term or keyword
- \`limit\` (number, optional, 1–25, default 8)

**Returns:** Array of glossary term previews with slug and summary.

### get_glossary_term
Retrieve the full Markdown definition of one glossary term.

**Input:**
- \`slug\` (string, required) — term slug (e.g. "mcp-server")

**Returns:** Full Markdown definition with examples and related terms.

### search_reports
Search 233,000+ academic papers via OpenAlex in the AI or Web3 corpus.

**Input:**
- \`query\` (string, required) — search query
- \`corpus\` ("ai" | "web3") — corpus filter
- \`per_page\` (number, optional, 1–20) — results per page

**Returns:** Array of paper objects with title, authors, DOI, abstract.

### scan_agent_readiness
Audit any public domain's AI and agentic web readiness.

**Input:**
- \`url\` (string, required) — domain or full URL (e.g. "stripe.com")

**Returns:** Score 0–100, grade, summary, and per-check findings across
Discovery, Access, Usability, Security, SEO, and Micropayments layers.

---

## Usage

\`\`\`bash
# Initialize (tools/list)
curl -X POST ${SITE_URL}/.well-known/mcp/docs \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Search essays
curl -X POST ${SITE_URL}/.well-known/mcp/docs \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_essays","arguments":{"query":"AI agents"}}}'
\`\`\`

## Authentication

None required. All endpoints are keyless and open-access.

## Rate limits

60 requests / minute per IP (standard keyless bucket).

## More

- Server card: ${SITE_URL}/.well-known/mcp/server-card.json
- Developer docs: ${SITE_URL}/developers
- OpenAPI spec: ${SITE_URL}/openapi.json
`;

export function GET(request: NextRequest) {
  const accept = (request.headers.get('accept') ?? '').toLowerCase();

  // Serve markdown for any request (this is a .md endpoint)
  void accept;

  return new Response(MARKDOWN, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Allow': 'GET, HEAD, OPTIONS',
    },
  });
}
