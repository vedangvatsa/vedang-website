import { MCP_TOOLS, TOOL_HANDLERS } from '@/lib/agent-tools';
import { SITE_NAME, SITE_URL, LLMSTXT_URL, MCP_ENDPOINT } from '@/lib/site';

export const SUPPORTED_PROTOCOL_VERSIONS = [
  '2025-06-18',
  '2025-03-26',
  '2024-11-05',
  '2024-10-07',
  '1.0',
  'latest',
] as const;

export const LATEST_PROTOCOL_VERSION = '2025-06-18';
export const DEFAULT_PROTOCOL_VERSION = '2024-11-05';

export const SERVER_INFO = {
  name: 'veda.ng',
  title: `${SITE_NAME} Research Hub`,
  version: '1.0.0',
};

export const SERVER_INSTRUCTIONS = [
  `Tools for searching and reading the published research of ${SITE_NAME}: essays on AI agents and Web3, a 100+ term glossary, and a 233,000-paper academic index.`,
  `Use search_essays or search_glossary first, then get_essay or get_glossary_term for full text. Use search_reports for peer-reviewed literature.`,
  `Official SDKs: JavaScript/TypeScript SDK package on NPM (npm install vedang) and Python SDK package on PyPI (pip install vedang-cli).`,
  `Content is educational; it is not financial, legal, or medical advice. Full site index: ${LLMSTXT_URL}. Human-readable docs: ${SITE_URL}/developers. Contact: ${SITE_URL}/contact.`,
].join(' ');

type JsonRpcId = string | number | null;

interface RpcSuccess {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result: unknown;
}

interface RpcFailure {
  jsonrpc: '2.0';
  id: JsonRpcId;
  error: { code: number; message: string; data?: unknown };
}

export type RpcResponse = RpcSuccess | RpcFailure;

export const PARSE_ERROR = -32700;
export const INVALID_REQUEST = -32600;
export const METHOD_NOT_FOUND = -32601;
export const INVALID_PARAMS = -32602;

function failure(id: JsonRpcId, code: number, message: string): RpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function success(id: JsonRpcId, result: unknown): RpcResponse {
  return { jsonrpc: '2.0', id, result };
}

function isValidId(id: unknown): id is JsonRpcId {
  return typeof id === 'string' || typeof id === 'number' || id === null;
}

export function negotiateProtocolVersion(requested: unknown): string {
  if (typeof requested === 'string') {
    const clean = requested.trim().toLowerCase();
    if (clean === '2024-11-05' || clean === '2024-10-07') return '2024-11-05';
    if (clean === '2025-03-26') return '2025-03-26';
    if (clean === '2025-06-18' || clean === 'latest' || clean === '1.0') return '2025-06-18';
    return clean;
  }
  return LATEST_PROTOCOL_VERSION;
}

async function dispatch(method: string, params: Record<string, unknown> | undefined): Promise<unknown> {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: negotiateProtocolVersion(params?.protocolVersion),
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false },
          logging: {},
        },
        serverInfo: SERVER_INFO,
        instructions: SERVER_INSTRUCTIONS,
      };
    case 'notifications/initialized':
      return {};
    case 'ping':
      return {};
    case 'tools/list':
      return { tools: MCP_TOOLS };
    case 'resources/list':
      return {
        resources: [
          {
            uri: `${SITE_URL}/llms.txt`,
            name: 'llms.txt',
            description: 'Structured index of veda.ng research and essays for LLMs.',
            mimeType: 'text/markdown',
          },
          {
            uri: `${SITE_URL}/openapi.json`,
            name: 'openapi.json',
            description: 'OpenAPI 3.1 specification for veda.ng public APIs.',
            mimeType: 'application/json',
          },
        ],
      };
    case 'resources/read': {
      const uri = typeof params?.uri === 'string' ? params.uri.trim() : '';
      if (!uri) {
        throw { rpcCode: INVALID_PARAMS, message: 'uri parameter is required for resources/read' };
      }
      if (uri.endsWith('/llms.txt') || uri === 'llms.txt') {
        let textContent = '';
        try {
          const fs = await import('fs');
          const path = await import('path');
          textContent = fs.readFileSync(path.join(process.cwd(), 'public', 'llms.txt'), 'utf8');
        } catch {
          textContent = '# Vedang Vatsa - Personal Website (veda.ng)\n\nhttps://veda.ng';
        }
        return {
          contents: [
            {
              uri: `${SITE_URL}/llms.txt`,
              mimeType: 'text/markdown',
              text: textContent,
            },
          ],
        };
      }
      if (uri.endsWith('/openapi.json') || uri === 'openapi.json') {
        let specText = '';
        try {
          const specRes = await fetch(`${SITE_URL}/api/openapi`, { headers: { Accept: 'application/json' } });
          specText = specRes.ok ? await specRes.text() : '';
        } catch {
          /* fallback below */
        }
        if (!specText) {
          try {
            const fs = await import('fs');
            const path = await import('path');
            specText = fs.readFileSync(path.join(process.cwd(), 'public', 'openapi.json'), 'utf8');
          } catch {
            specText = JSON.stringify({
              openapi: '3.1.0',
              info: { title: 'Veda Developer API', version: '1.0.0', description: 'OpenAPI 3.1 spec for veda.ng' },
              servers: [{ url: SITE_URL }],
            });
          }
        }
        return {
          contents: [
            {
              uri: `${SITE_URL}/openapi.json`,
              mimeType: 'application/json',
              text: specText,
            },
          ],
        };
      }
      throw { rpcCode: INVALID_PARAMS, message: `Resource not found: ${uri}` };
    }
    case 'prompts/list':
      return { prompts: [] };
    case 'tools/call': {
      const name = typeof params?.name === 'string' ? params.name : '';
      if (!name || !TOOL_HANDLERS[name]) {
        throw { rpcCode: INVALID_PARAMS, message: `Unknown tool: ${name || '(missing name)'}` };
      }
      const args = (params?.arguments ?? {}) as Record<string, unknown>;
      return await TOOL_HANDLERS[name](args);
    }
    default:
      throw { rpcCode: METHOD_NOT_FOUND, message: `Method not found: ${method}` };
  }
}

export interface McpHttpResult {
  status: number;
  body: string | null;
  negotiatedVersion?: string;
}

export async function handleMcpPost(rawBody: string | null): Promise<McpHttpResult> {
  if (!rawBody || rawBody.trim() === '') {
    return { status: 200, body: JSON.stringify(failure(null, PARSE_ERROR, 'Parse error: empty request body')) };
  }

  let message: unknown;
  try {
    message = JSON.parse(rawBody);
  } catch {
    return { status: 200, body: JSON.stringify(failure(null, PARSE_ERROR, 'Parse error: invalid JSON')) };
  }

  // Support JSON-RPC 2.0 batch requests
  if (Array.isArray(message)) {
    const results = await Promise.all(
      message.map(async (msg) => {
        if (!msg || typeof msg !== 'object') {
          return failure(null, INVALID_REQUEST, 'Invalid Request');
        }
        const { method, id, params } = msg as { method?: unknown; id?: unknown; params?: unknown };
        if (typeof method !== 'string') {
          return failure(isValidId(id) ? id : null, INVALID_REQUEST, 'Invalid Request');
        }
        if (method.startsWith('notifications/')) {
          return null;
        }
        const effectiveId = isValidId(id) ? id : 1;
        try {
          const res = await dispatch(method, params as Record<string, unknown> | undefined);
          return success(effectiveId, res);
        } catch (err) {
          const rpcErr = err as { rpcCode?: number; message?: string };
          return failure(effectiveId, rpcErr?.rpcCode ?? INVALID_REQUEST, rpcErr?.message ?? 'Internal error');
        }
      })
    );
    const nonNull = results.filter(Boolean);
    return {
      status: 200,
      body: nonNull.length > 0 ? JSON.stringify(nonNull) : null,
      negotiatedVersion: LATEST_PROTOCOL_VERSION,
    };
  }

  if (message === null || typeof message !== 'object') {
    return { status: 200, body: JSON.stringify(failure(null, INVALID_REQUEST, 'Invalid Request')) };
  }

  const { method, id, params } = message as { method?: unknown; id?: unknown; params?: unknown };

  if (typeof method !== 'string') {
    return { status: 200, body: JSON.stringify(failure(isValidId(id) ? id : null, INVALID_REQUEST, 'Invalid Request: method is required')) };
  }

  if (method === 'notifications/initialized' || method.startsWith('notifications/')) {
    return { status: 202, body: null };
  }

  const effectiveId = isValidId(id) ? id : 1;

  try {
    const result = await dispatch(method, (params ?? undefined) as Record<string, unknown> | undefined);
    const negotiatedVersion = method === 'initialize' ? (result as { protocolVersion?: string })?.protocolVersion : undefined;
    return {
      status: 200,
      body: JSON.stringify(success(effectiveId, result)),
      negotiatedVersion: negotiatedVersion ?? LATEST_PROTOCOL_VERSION,
    };
  } catch (err) {
    const rpcErr = err as { rpcCode?: number; message?: string };
    if (rpcErr && typeof rpcErr.rpcCode === 'number') {
      return { status: 200, body: JSON.stringify(failure(effectiveId, rpcErr.rpcCode, rpcErr.message ?? 'Tool error')) };
    }
    return { status: 200, body: JSON.stringify(failure(effectiveId, INVALID_REQUEST, 'Internal error while handling request.')) };
  }
}

export function mcpEndpointDescriptor(): string {
  return JSON.stringify(
    {
      endpoint: MCP_ENDPOINT,
      transport: 'Streamable HTTP (JSON-RPC 2.0 over POST)',
      protocol_version: LATEST_PROTOCOL_VERSION,
      protocol_versions: SUPPORTED_PROTOCOL_VERSIONS,
      stateless: true,
      authentication: 'none',
      capabilities: {
        tools: { listChanged: false },
        resources: { subscribe: false, listChanged: false },
        prompts: { listChanged: false },
        logging: {},
      },
      serverInfo: SERVER_INFO,
      instructions: SERVER_INSTRUCTIONS,
      tools: MCP_TOOLS.map((t) => t.name),
      tool_definitions: MCP_TOOLS,
      usage: `Send POST ${MCP_ENDPOINT} with Content-Type: application/json and body {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"${DEFAULT_PROTOCOL_VERSION}","capabilities":{},"clientInfo":{"name":"your-client","version":"1.0"}}}`,
      docs: `${SITE_URL}/developers`,
    },
    null,
    2
  );
}
