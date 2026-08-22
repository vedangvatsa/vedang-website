import { NextResponse } from 'next/server';
import { MCP_TOOLS } from '@/lib/agent-tools';
import { CONTACT_EMAIL, LLMSTXT_URL, MCP_ENDPOINT, RSS_URL, SITE_NAME, SITE_URL, SITEMAP_URL } from '@/lib/site';

export const dynamic = 'force-static';

function toolToOpenApiOperation(toolName: string) {
  const tool = MCP_TOOLS.find((t) => t.name === toolName);
  return {
    summary: tool?.description,
    description: `MCP tool exposed via JSON-RPC 2.0 tools/call at ${MCP_ENDPOINT}.`,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              jsonrpc: { type: 'string', const: '2.0' },
              id: { type: ['string', 'number'] },
              method: { type: 'string', const: 'tools/call' },
              params: {
                type: 'object',
                properties: {
                  name: { type: 'string', const: toolName },
                  arguments: tool?.inputSchema,
                },
                required: ['name'],
              },
            },
            required: ['jsonrpc', 'id', 'method', 'params'],
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'JSON-RPC response containing tool output as text content.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                jsonrpc: { type: 'string' },
                id: { type: ['string', 'number'] },
                result: { type: 'object' },
              },
            },
          },
        },
      },
    },
  };
}

export function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: `${SITE_NAME} Research Hub API (veda.ng)`,
      version: '1.0.0',
      description:
        'Public machine interfaces for veda.ng: research paper search backed by OpenAlex, an MCP server over Streamable HTTP, and syndication feeds. No authentication required.',
      contact: { name: SITE_NAME, email: CONTACT_EMAIL, url: `${SITE_URL}/meeting` },
    },
    servers: [{ url: SITE_URL }],
    paths: {
      '/api/reports/search': {
        get: {
          operationId: 'searchReports',
          summary: 'Search 233,000+ indexed AI/Web3 academic papers (OpenAlex-backed).',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 2 }, description: 'Search keywords.' },
            { name: 'corpus', in: 'query', schema: { type: 'string', enum: ['ai', 'web3'], default: 'ai' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
            { name: 'per_page', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 200, default: 50 } },
          ],
          responses: {
            '200': {
              description: 'Search results with citation counts.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            title: { type: 'string' },
                            source: { type: 'string' },
                            url: { type: 'string' },
                            date: { type: 'string' },
                            category: { type: 'string' },
                            type: { type: 'string' },
                            citations: { type: 'integer' },
                          },
                        },
                      },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      perPage: { type: 'integer' },
                    },
                  },
                },
              },
            },
            '502': { description: 'Upstream OpenAlex error.' },
          },
        },
      },
      '/feed.xml': {
        get: {
          operationId: 'getRssFeed',
          summary: 'RSS feed of essays.',
          responses: { '200': { description: 'RSS 2.0 XML document.', content: { 'application/rss+xml': {} } } },
        },
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          summary: 'Sitemap of every public URL.',
          responses: { '200': { description: 'XML sitemap.', content: { 'application/xml': {} } } },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          summary: 'Structured content index for LLMs.',
          responses: { '200': { description: 'Plain text index.', content: { 'text/plain': {} } } },
        },
      },
      '/.well-known/mcp': {
        post: {
          operationId: 'mcpRpc',
          summary: 'MCP Streamable HTTP endpoint (JSON-RPC 2.0): initialize, tools/list, tools/call.',
          description: `Stateless MCP server supporting protocol versions 2025-06-18, 2025-03-26, 2024-11-05. Site index: ${LLMSTXT_URL}`,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jsonrpc: { type: 'string', const: '2.0' },
                    id: { type: ['string', 'number'] },
                    method: { type: 'string', enum: ['initialize', 'ping', 'tools/list', 'tools/call', 'notifications/initialized'] },
                    params: { type: 'object' },
                  },
                  required: ['jsonrpc', 'method'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'JSON-RPC result or error.', content: { 'application/json': {} } },
            '202': { description: 'Notification accepted; no body.' },
            '400': { description: 'Unsupported Mcp-Protocol-Version.' },
            '405': { description: 'GET/DELETE not supported for this stateless server.' },
            '406': { description: 'Accept header must include application/json or text/event-stream.' },
            '415': { description: 'Content-Type must be application/json.' },
          },
        },
        get: {
          operationId: 'mcpDescriptor',
          summary: 'Endpoint descriptor (HTTP 405 with JSON metadata; use POST for JSON-RPC).',
          responses: {
            '405': { description: 'Server descriptor explaining POST usage.', content: { 'application/json': {} } },
          },
        },
      },
    },
    'x-mcp-tools': Object.fromEntries(MCP_TOOLS.map((t) => [t.name, toolToOpenApiOperation(t.name)])),
    'x-discovery': {
      llms_txt: LLMSTXT_URL,
      sitemap: SITEMAP_URL,
      rss: RSS_URL,
      mcp_endpoint: MCP_ENDPOINT,
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      Vary: 'Accept, Accept-Encoding',
    },
  });
}
