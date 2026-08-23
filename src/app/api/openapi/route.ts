import { NextResponse } from 'next/server';
import { MCP_TOOLS } from '@/lib/agent-tools';
import { CONTACT_EMAIL, CONTACT_URL, LLMSTXT_URL, LLMSFULLTXT_URL, MCP_ENDPOINT, RSS_URL, SITE_NAME, SITE_URL, SITEMAP_URL } from '@/lib/site';

export const dynamic = 'force-static';

const rpcEnvelope = (resultSchemaName: string) => ({
  type: 'object',
  properties: {
    jsonrpc: { type: 'string', const: '2.0' },
    id: { type: ['string', 'number'] },
    result: { $ref: `#/components/schemas/${resultSchemaName}` },
  },
  required: ['jsonrpc', 'id', 'result'],
});

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': { schema: { $ref: '#/components/schemas/JsonRpcError' } },
  },
});

export function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: `${SITE_NAME} Research Hub API (veda.ng)`,
      version: '1.1.0',
      description:
        'Public machine interfaces for veda.ng: research paper search backed by OpenAlex, an MCP server over Streamable HTTP, syndication feeds, and agent discovery files. No authentication required.',
      contact: { name: SITE_NAME, email: CONTACT_EMAIL, url: CONTACT_URL },
    },
    servers: [
      { url: SITE_URL, description: 'Latest stable version' },
      { url: `${SITE_URL}/api/v1`, description: 'Version-pinned v1 (stable, additive-only changes)' },
    ],
    versioning: {
      policy: 'URL path versioning: /api/v1/* is pinned to major version 1. Unversioned paths always track the latest stable major.',
    },
    tags: [
      { name: 'Search', description: 'Research paper search' },
      { name: 'MCP', description: 'Model Context Protocol server' },
      { name: 'Feeds', description: 'Syndication and discovery files' },
    ],
    paths: {
      '/api/reports/search': {
        get: {
          operationId: 'searchReports',
          summary: 'Search 233,000+ indexed AI/Web3 academic papers (OpenAlex-backed).',
          tags: ['Search'],
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 2 }, description: 'Search keywords.' },
            { name: 'corpus', in: 'query', schema: { type: 'string', enum: ['ai', 'web3'], default: 'ai' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
            { name: 'per_page', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 200, default: 50 } },
          ],
          responses: {
            '200': {
              description: 'Search results sorted by citation count.',
              headers: {
                'X-RateLimit-Limit': { schema: { type: 'string' }, description: 'Requests allowed per window.' },
                'X-RateLimit-Remaining': { schema: { type: 'string' }, description: 'Requests left in current window.' },
                'X-RateLimit-Reset': { schema: { type: 'string' }, description: 'Unix seconds when the window resets.' },
                'Idempotency-Key': { schema: { type: 'string' }, description: 'Echoed when the client sends an Idempotency-Key header.' },
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SearchReportsResponse' } } },
            },
            '502': errorResponse('Upstream OpenAlex error. Returns Retry-After header; body is retryable JSON error.'),
          },
        },
      },
      '/.well-known/mcp': {
        post: {
          operationId: 'mcpRpc',
          summary: 'MCP Streamable HTTP endpoint (JSON-RPC 2.0): initialize, tools/list, tools/call.',
          description: `Stateless MCP server supporting protocol versions 2025-06-18, 2025-03-26, and 2024-11-05. Tool catalog also discoverable via GET (descriptor). Site index: ${LLMSTXT_URL}`,
          tags: ['MCP'],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/McpRequest' } },
            },
          },
          responses: {
            '200': {
              description: 'JSON-RPC result for initialize, ping, tools/list, or tools/call; or a JSON-RPC error.',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { $ref: '#/components/schemas/McpInitializeResponse' },
                      { $ref: '#/components/schemas/McpToolsListResponse' },
                      { $ref: '#/components/schemas/McpToolCallResponse' },
                      { $ref: '#/components/schemas/McpPingResponse' },
                      { $ref: '#/components/schemas/JsonRpcError' },
                    ],
                  },
                },
              },
            },
            '202': { description: 'Notification accepted (notifications/initialized). No response body.' },
            '400': errorResponse('Unsupported Mcp-Protocol-Version.'),
            '406': errorResponse('Accept header must include application/json or text/event-stream.'),
            '415': errorResponse('Content-Type must be application/json.'),
          },
        },
        get: {
          operationId: 'mcpDescriptor',
          summary: 'Endpoint descriptor (HTTP 405 with JSON metadata; use POST for JSON-RPC).',
          tags: ['MCP'],
          responses: {
            '405': {
              description: 'Server descriptor explaining POST usage.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/McpDescriptor' } } },
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          summary: 'Structured content index for LLMs.',
          tags: ['Feeds'],
          responses: {
            '200': {
              description: 'Plain text content index.',
              content: { 'text/plain': { schema: { $ref: '#/components/schemas/PlainTextDocument' } } },
            },
          },
        },
      },
      '/llms-full.txt': {
        get: {
          operationId: 'getLlmsFullTxt',
          summary: 'Full-text essay corpus for LLM consumption.',
          tags: ['Feeds'],
          responses: {
            '200': {
              description: 'Plain text full-content index.',
              content: { 'text/plain': { schema: { $ref: '#/components/schemas/PlainTextDocument' } } },
            },
          },
        },
      },
      '/feed.xml': {
        get: {
          operationId: 'getRssFeed',
          summary: 'RSS 2.0 feed of essays.',
          tags: ['Feeds'],
          responses: {
            '200': {
              description: 'RSS 2.0 XML document.',
              content: { 'application/rss+xml': { schema: { $ref: '#/components/schemas/XmlDocument' } } },
            },
          },
        },
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          summary: 'XML sitemap of every public URL.',
          tags: ['Feeds'],
          responses: {
            '200': {
              description: 'Sitemap XML document.',
              content: { 'application/xml': { schema: { $ref: '#/components/schemas/XmlDocument' } } },
            },
          },
        },
      },
      '/.well-known/agents.json': {
        get: {
          operationId: 'getAgentsManifest',
          summary: 'Agent capabilities manifest with when-to-use guidance.',
          tags: ['Feeds'],
          responses: {
            '200': {
              description: 'Agent instruction manifest.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AgentsManifest' } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        JsonRpcError: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', const: '2.0' },
            id: { type: ['string', 'number', 'null'] },
            error: {
              type: 'object',
              properties: {
                code: { type: 'integer', description: 'JSON-RPC error code, e.g. -32700, -32600, -32601, -32602.' },
                message: { type: 'string' },
              },
              required: ['code', 'message'],
            },
          },
          required: ['jsonrpc', 'id', 'error'],
        },
        McpRequest: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', const: '2.0' },
            id: { type: ['string', 'number'], description: 'Omit for notifications.' },
            method: { type: 'string', enum: ['initialize', 'ping', 'tools/list', 'tools/call', 'notifications/initialized'] },
            params: { type: 'object' },
          },
          required: ['jsonrpc', 'method'],
        },
        McpServerInfo: {
          type: 'object',
          properties: {
            name: { type: 'string', examples: ['veda.ng'] },
            title: { type: 'string' },
            version: { type: 'string' },
          },
          required: ['name', 'title', 'version'],
        },
        McpInitializeResult: {
          type: 'object',
          properties: {
            protocolVersion: { type: 'string', examples: ['2025-06-18'] },
            capabilities: {
              type: 'object',
              properties: {
                tools: { type: 'object', properties: { listChanged: { type: 'boolean' } }, required: ['listChanged'] },
              },
              required: ['tools'],
            },
            serverInfo: { $ref: '#/components/schemas/McpServerInfo' },
            instructions: { type: 'string' },
          },
          required: ['protocolVersion', 'capabilities', 'serverInfo', 'instructions'],
        },
        McpToolDefinition: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            inputSchema: {
              type: 'object',
              description: 'JSON Schema object describing accepted arguments.',
              properties: {
                type: { type: 'string', const: 'object' },
                properties: { type: 'object' },
                required: { type: 'array', items: { type: 'string' } },
              },
              required: ['type'],
            },
          },
          required: ['name', 'description', 'inputSchema'],
        },
        McpToolsListResult: {
          type: 'object',
          properties: {
            tools: { type: 'array', items: { $ref: '#/components/schemas/McpToolDefinition' } },
          },
          required: ['tools'],
        },
        McpTextContent: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['text'] },
            text: { type: 'string' },
          },
          required: ['type', 'text'],
        },
        McpToolCallResult: {
          type: 'object',
          properties: {
            content: { type: 'array', items: { $ref: '#/components/schemas/McpTextContent' } },
            isError: { type: 'boolean', description: 'True when the tool failed; message is in content[0].text.' },
          },
          required: ['content'],
        },
        McpPingResult: {
          type: 'object',
          properties: {},
        },
        McpInitializeResponse: rpcEnvelope('McpInitializeResult'),
        McpToolsListResponse: rpcEnvelope('McpToolsListResult'),
        McpToolCallResponse: rpcEnvelope('McpToolCallResult'),
        McpPingResponse: rpcEnvelope('McpPingResult'),
        SearchReportsResponse: {
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
                  date: { type: 'string', description: 'Publication year.' },
                  category: { type: 'string' },
                  type: { type: 'string', examples: ['Paper'] },
                  citations: { type: 'integer' },
                },
                required: ['title', 'source', 'url', 'date', 'category', 'type', 'citations'],
              },
            },
            total: { type: 'integer' },
            page: { type: 'integer' },
            perPage: { type: 'integer' },
          },
          required: ['results', 'total', 'page', 'perPage'],
        },
        McpDescriptor: {
          type: 'object',
          properties: {
            endpoint: { type: 'string' },
            transport: { type: 'string' },
            protocol_versions: { type: 'array', items: { type: 'string' } },
            stateless: { type: 'boolean' },
            authentication: { type: 'string' },
            tools: { type: 'array', items: { type: 'string' } },
            usage: { type: 'string' },
            docs: { type: 'string' },
          },
          required: ['endpoint', 'transport', 'protocol_versions', 'stateless', 'authentication', 'tools', 'usage', 'docs'],
        },
        PlainTextDocument: {
          type: 'string',
          description: 'UTF-8 plain text document.',
        },
        XmlDocument: {
          type: 'string',
          description: 'UTF-8 XML document.',
        },
        AgentsManifest: {
          type: 'object',
          properties: {
            schema_version: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            when_to_use: { type: 'array', items: { type: 'string' } },
            when_not_to_use: { type: 'array', items: { type: 'string' } },
            how_to_use: { type: 'object' },
            contact: { type: 'object' },
            developer: { type: 'object' },
          },
          required: ['schema_version', 'name', 'url', 'when_to_use'],
        },
      },
    },
    'x-mcp-tools': MCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      invoke: {
        method: 'POST',
        url: MCP_ENDPOINT,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: { name: t.name, arguments: t.inputSchema.properties ?? {} },
        },
        responseSchema: { $ref: '#/components/schemas/McpToolCallResponse' },
      },
    })),
    'x-discovery': {
      llms_txt: LLMSTXT_URL,
      llms_full_txt: LLMSFULLTXT_URL,
      sitemap: SITEMAP_URL,
      rss: RSS_URL,
      mcp_endpoint: MCP_ENDPOINT,
      ai_catalog: `${SITE_URL}/.well-known/ai-catalog.json`,
      agents_manifest: `${SITE_URL}/.well-known/agents.json`,
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      Vary: 'Accept, Accept-Encoding',
    },
  });
}
