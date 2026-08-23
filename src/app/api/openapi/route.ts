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
                jsonrpc: { type: 'string', const: '2.0' },
                id: { type: ['string', 'number'] },
                result: {
                  type: 'object',
                  properties: {
                    content: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: { type: 'string', enum: ['text'] },
                          text: { type: 'string' },
                        },
                        required: ['type', 'text'],
                      },
                    },
                    isError: { type: 'boolean' },
                  },
                  required: ['content'],
                },
              },
              required: ['jsonrpc', 'id', 'result'],
            },
          },
        },
      },
    },
  };
}

const rpcSuccessSchema = {
  type: 'object',
  properties: {
    jsonrpc: { type: 'string', const: '2.0' },
    id: { type: ['string', 'number'] },
    result: { type: 'object' },
  },
  required: ['jsonrpc', 'id', 'result'],
};

const rpcErrorSchema = {
  type: 'object',
  properties: {
    jsonrpc: { type: 'string', const: '2.0' },
    id: { type: ['string', 'number', 'null'] },
    error: {
      type: 'object',
      properties: {
        code: { type: 'integer' },
        message: { type: 'string' },
        data: { type: 'object' },
      },
      required: ['code', 'message'],
    },
  },
  required: ['jsonrpc', 'id', 'error'],
};

const searchReportsResultSchema = {
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
        required: ['title', 'source', 'url', 'date', 'category', 'type', 'citations'],
      },
    },
    total: { type: 'integer' },
    page: { type: 'integer' },
    perPage: { type: 'integer' },
  },
  required: ['results', 'total', 'page', 'perPage'],
};

const mcpToolsListSchema = {
  type: 'object',
  properties: {
    jsonrpc: { type: 'string', const: '2.0' },
    id: { type: ['string', 'number'] },
    result: {
      type: 'object',
      properties: {
        tools: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              inputSchema: { type: 'object' },
            },
            required: ['name', 'description', 'inputSchema'],
          },
        },
      },
      required: ['tools'],
    },
  },
  required: ['jsonrpc', 'id', 'result'],
};

const mcpInitializeSchema = {
  type: 'object',
  properties: {
    jsonrpc: { type: 'string', const: '2.0' },
    id: { type: ['string', 'number'] },
    result: {
      type: 'object',
      properties: {
        protocolVersion: { type: 'string' },
        capabilities: {
          type: 'object',
          properties: {
            tools: { type: 'object', properties: { listChanged: { type: 'boolean' } } },
          },
        },
        serverInfo: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            title: { type: 'string' },
            version: { type: 'string' },
          },
          required: ['name', 'title', 'version'],
        },
        instructions: { type: 'string' },
      },
      required: ['protocolVersion', 'capabilities', 'serverInfo', 'instructions'],
    },
  },
  required: ['jsonrpc', 'id', 'result'],
};

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
                'application/json': { schema: searchReportsResultSchema },
              },
            },
            '502': { description: 'Upstream OpenAlex error.', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' }, status: { type: 'integer' } } } } } },
          },
        },
      },
      '/feed.xml': {
        get: {
          operationId: 'getRssFeed',
          summary: 'RSS feed of essays.',
          responses: {
            '200': {
              description: 'RSS 2.0 XML document.',
              content: {
                'application/rss+xml': { schema: { type: 'string', format: 'xml' } },
              },
            },
          },
        },
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          summary: 'Sitemap of every public URL.',
          responses: {
            '200': {
              description: 'XML sitemap.',
              content: {
                'application/xml': { schema: { type: 'string', format: 'xml' } },
              },
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          summary: 'Structured content index for LLMs.',
          responses: {
            '200': {
              description: 'Plain text index.',
              content: {
                'text/plain': { schema: { type: 'string' } },
              },
            },
          },
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
            '200': {
              description: 'JSON-RPC result (initialize, tools/list, tools/call, ping) or error.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
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
            '202': {
              description: 'Notification accepted (notifications/initialized); no body.',
              content: {},
            },
            '400': {
              description: 'Unsupported Mcp-Protocol-Version or invalid request.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/JsonRpcError' } },
              },
            },
            '405': {
              description: 'GET/DELETE not supported for this stateless server.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/JsonRpcError' } },
              },
            },
            '406': {
              description: 'Accept header must include application/json or text/event-stream.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/JsonRpcError' } },
              },
            },
            '415': {
              description: 'Content-Type must be application/json.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/JsonRpcError' } },
              },
            },
          },
        },
        get: {
          operationId: 'mcpDescriptor',
          summary: 'Endpoint descriptor (HTTP 405 with JSON metadata; use POST for JSON-RPC).',
          responses: {
            '405': {
              description: 'Server descriptor explaining POST usage.',
              content: {
                'application/json': {
                  schema: {
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
            },
          },
        },
      },
    },
    components: {
      schemas: {
        JsonRpcError: rpcErrorSchema,
        McpInitializeResponse: mcpInitializeSchema,
        McpToolsListResponse: mcpToolsListSchema,
        McpToolCallResponse: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', const: '2.0' },
            id: { type: ['string', 'number'] },
            result: {
              type: 'object',
              properties: {
                content: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', enum: ['text'] },
                      text: { type: 'string' },
                    },
                    required: ['type', 'text'],
                  },
                },
                isError: { type: 'boolean' },
              },
              required: ['content'],
            },
          },
          required: ['jsonrpc', 'id', 'result'],
        },
        McpPingResponse: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', const: '2.0' },
            id: { type: ['string', 'number'] },
            result: { type: 'object', properties: {} },
          },
          required: ['jsonrpc', 'id', 'result'],
        },
        SearchReportsResponse: searchReportsResultSchema,
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