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
    'application/json': { schema: { $ref: '#/components/schemas/ApiError' } },
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
    externalDocs: {
      description: 'Veda Developer Documentation & Agent Guides',
      url: `${SITE_URL}/developers`,
    },
    servers: [
      { url: SITE_URL, description: 'Latest stable version' },
      { url: `${SITE_URL}/api/v1`, description: 'Version-pinned v1 (stable, additive-only changes)' },
    ],
    versioning: {
      policy: 'URL path versioning: /api/v1/* is pinned to major version 1. Unversioned paths always track the latest stable major.',
      deprecation_policy: `${SITE_URL}/developers#versioning`,
      sunset_date: '2028-03-01T00:00:00Z',
    },
    tags: [
      { name: 'Search', description: 'Research paper search and query interfaces' },
      { name: 'Essays', description: 'Published research essays catalog' },
      { name: 'Glossary', description: 'AI and Web3 technical glossary' },
      { name: 'Directory', description: 'API root directories and discovery manifests' },
      { name: 'MCP', description: 'Model Context Protocol server' },
    ],
    paths: {
      '/api': {
        get: {
          operationId: 'getApiRoot',
          summary: 'Root API directory and service discovery.',
          description: 'Returns available endpoints, documentation links, OpenAPI specification URL, and rate limit policies.',
          tags: ['Directory'],
          responses: {
            '200': {
              description: 'API root service discovery directory.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiDirectoryResponse' } } },
            },
          },
        },
      },
      '/api/v1': {
        get: {
          operationId: 'getApiV1Root',
          summary: 'Version 1 root API directory.',
          description: 'Returns endpoints available in version 1 of the veda.ng REST API.',
          tags: ['Directory'],
          responses: {
            '200': {
              description: 'Version 1 API directory.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiV1DirectoryResponse' } } },
            },
          },
        },
      },
      '/api/reports/search': {
        get: {
          operationId: 'searchReports',
          summary: 'Search 233,000+ indexed AI/Web3 academic papers (OpenAlex-backed).',
          description: 'Performs full-text keyword search across 233,000+ indexed academic papers in AI or Web3 corpora, sorted by citation count.',
          tags: ['Search'],
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 2 }, description: 'Search keywords.' },
            { name: 'corpus', in: 'query', schema: { type: 'string', enum: ['ai', 'web3'], default: 'ai' }, description: 'Target research corpus.' },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Page number.' },
            { name: 'per_page', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 200, default: 50 }, description: 'Results per page.' },
            { name: 'Idempotency-Key', in: 'header', required: false, schema: { type: 'string' }, description: 'Optional client idempotency identifier.' },
          ],
          responses: {
            '200': {
              description: 'Search results sorted by citation count.',
              headers: {
                'RateLimit-Limit': { schema: { type: 'integer' }, description: 'Requests allowed per minute window.' },
                'RateLimit-Remaining': { schema: { type: 'integer' }, description: 'Requests left in current window.' },
                'RateLimit-Reset': { schema: { type: 'integer' }, description: 'Seconds until window resets.' },
                'Idempotency-Key': { schema: { type: 'string' }, description: 'Echoed when client sends Idempotency-Key.' },
                'Sunset': { schema: { type: 'string' }, description: 'RFC 8594 Sunset date.' },
                'Deprecation': { schema: { type: 'string' }, description: 'Draft deprecation date.' },
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SearchReportsResponse' } } },
            },
            '400': errorResponse('Invalid parameters or missing query string.'),
            '502': errorResponse('Upstream OpenAlex error. Returns Retry-After header; body is retryable JSON error.'),
          },
        },
      },
      '/api/v1/reports/search': {
        get: {
          operationId: 'searchReportsV1',
          summary: 'Search 233,000+ indexed academic papers (v1 stable).',
          description: 'Version 1 pinned endpoint for searching academic research literature in AI and Web3.',
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
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SearchReportsResponse' } } },
            },
            '400': errorResponse('Invalid parameters.'),
            '502': errorResponse('Upstream database error.'),
          },
        },
      },
      '/api/v1/essays': {
        get: {
          operationId: 'listEssaysV1',
          summary: 'List all published research essays.',
          description: 'Retrieves the complete catalog of long-form research essays with URLs, slugs, dates, tags, and Markdown links.',
          tags: ['Essays'],
          parameters: [
            { name: 'tag', in: 'query', required: false, schema: { type: 'string' }, description: 'Filter essays by topic tag (e.g. AI, Web3, Agents).' },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 50 }, description: 'Max items to return.' },
          ],
          responses: {
            '200': {
              description: 'List of research essays.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/EssaysListResponse' } } },
            },
          },
        },
      },
      '/api/v1/glossary': {
        get: {
          operationId: 'listGlossaryV1',
          summary: 'List AI and Web3 glossary definitions.',
          description: 'Retrieves technical glossary terms with category classifications, plain-language definitions, and Markdown paths.',
          tags: ['Glossary'],
          parameters: [
            { name: 'category', in: 'query', required: false, schema: { type: 'string' }, description: 'Filter by category (e.g. AI, Web3, Agents).' },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 100 }, description: 'Max terms to return.' },
          ],
          responses: {
            '200': {
              description: 'List of glossary definitions.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/GlossaryListResponse' } } },
            },
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
          summary: 'Endpoint descriptor (HTTP 200 with JSON metadata).',
          description: 'Fetches metadata and transport capabilities for the veda.ng MCP Streamable HTTP server.',
          tags: ['MCP'],
          responses: {
            '200': {
              description: 'Server descriptor and tools summary.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/McpDescriptor' } } },
            },
          },
        },
      },
      '/ask': {
        get: {
          operationId: 'askGet',
          summary: 'Natural language search query interface (NLWeb GET).',
          description: 'Executes a natural language search query across essays and glossary entries, returning JSON with _meta headers.',
          tags: ['Search'],
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Natural language query string.' },
          ],
          responses: {
            '200': {
              description: 'NLWeb search results.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AskResponse' } } },
            },
            '400': errorResponse('Missing query parameter.'),
          },
        },
        post: {
          operationId: 'askPost',
          summary: 'Natural language search query interface (NLWeb POST & SSE).',
          description: 'Executes a natural language search query with optional SSE streaming (prefer.streaming: true).',
          tags: ['Search'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string', description: 'Query text' },
                    prefer: { type: 'object', properties: { streaming: { type: 'boolean' } } },
                  },
                  required: ['query'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'NLWeb search results or text/event-stream.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AskResponse' } } },
            },
            '400': errorResponse('Invalid request body.'),
          },
        },
      },
    },
    components: {
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                status: { type: 'integer' },
                resolution: { type: 'string' },
              },
              required: ['code', 'message', 'status'],
            },
          },
          required: ['error'],
        },
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
        ApiDirectoryResponse: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' },
            description: { type: 'string' },
            documentation: { type: 'string' },
            openapi: { type: 'string' },
            mcp: { type: 'string' },
            auth: { type: 'string' },
            endpoints: {
              type: 'object',
              properties: {
                search: { type: 'string' },
                essays: { type: 'string' },
                glossary: { type: 'string' },
                ask: { type: 'string' },
              },
              required: ['search', 'essays', 'glossary'],
            },
          },
          required: ['name', 'version', 'documentation', 'openapi', 'endpoints'],
        },
        ApiV1DirectoryResponse: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' },
            description: { type: 'string' },
            documentation: { type: 'string' },
            openapi: { type: 'string' },
            endpoints: {
              type: 'object',
              properties: {
                search: { type: 'string' },
                essays: { type: 'string' },
                glossary: { type: 'string' },
              },
              required: ['search', 'essays', 'glossary'],
            },
          },
          required: ['name', 'version', 'documentation', 'openapi', 'endpoints'],
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
            protocolVersion: { type: 'string', enum: ['2025-06-18', '2025-03-26', '2024-11-05'] },
            capabilities: { type: 'object' },
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
            corpus: { type: 'string' },
          },
          required: ['results', 'total', 'page', 'perPage'],
        },
        EssaysListResponse: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            limit: { type: 'integer' },
            essays: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  slug: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  date: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  url: { type: 'string' },
                  markdownUrl: { type: 'string' },
                },
                required: ['slug', 'title', 'description', 'date', 'tags', 'url', 'markdownUrl'],
              },
            },
          },
          required: ['total', 'limit', 'essays'],
        },
        GlossaryListResponse: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            limit: { type: 'integer' },
            terms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  slug: { type: 'string' },
                  term: { type: 'string' },
                  definition: { type: 'string' },
                  category: { type: 'string' },
                  url: { type: 'string' },
                  markdownUrl: { type: 'string' },
                },
                required: ['slug', 'term', 'definition', 'category', 'url', 'markdownUrl'],
              },
            },
          },
          required: ['total', 'limit', 'terms'],
        },
        AskResultItem: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            url: { type: 'string' },
            snippet: { type: 'string' },
            type: { type: 'string', enum: ['essay', 'glossary', 'report'] },
            score: { type: 'number' },
          },
          required: ['title', 'url', 'snippet', 'type'],
        },
        AskResponse: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: { $ref: '#/components/schemas/AskResultItem' },
            },
            query_id: { type: 'string' },
            total: { type: 'integer' },
          },
          required: ['results'],
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
      },
    },
    'x-sdks': {
      pypi: {
        package: 'vedang-cli',
        url: 'https://pypi.org/project/vedang-cli/',
        install: 'pip install vedang-cli',
        description: 'Official Python CLI & SDK for veda.ng research and essay APIs',
      },
      repository: 'https://github.com/vedangvatsa/vedang-website',
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
