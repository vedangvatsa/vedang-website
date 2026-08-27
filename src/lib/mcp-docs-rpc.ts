import { MCP_DOCS_TOOLS, DOCS_TOOL_HANDLERS } from '@/lib/agent-docs-tools';
import { SITE_NAME, SITE_URL, LLMSTXT_URL, OPENAPI_URL } from '@/lib/site';
import {
  LATEST_PROTOCOL_VERSION,
  DEFAULT_PROTOCOL_VERSION,
  SUPPORTED_PROTOCOL_VERSIONS,
  negotiateProtocolVersion,
  PARSE_ERROR,
  INVALID_REQUEST,
  METHOD_NOT_FOUND,
  INVALID_PARAMS,
  RpcResponse,
  McpHttpResult,
} from '@/lib/mcp-rpc';

export const DOCS_SERVER_INFO = {
  name: 'veda-docs-mcp',
  title: `${SITE_NAME} Documentation & Knowledge Hub`,
  version: '1.0.0',
};

export const DOCS_SERVER_INSTRUCTIONS = [
  `Tools for searching and fetching the technical documentation, OpenAPI specifications, architecture guides, and course curricula of ${SITE_NAME}.`,
  `Use search_documentation or get_api_documentation first, then get_course_curriculum, get_openapi_specification, or get_auth_guide for full references.`,
  `Full site index: ${LLMSTXT_URL}. Interactive developer portal: ${SITE_URL}/developers.`,
].join(' ');

const DOCS_MCP_ENDPOINT = `${SITE_URL}/.well-known/mcp/docs`;

function failure(id: string | number | null, code: number, message: string): RpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function success(id: string | number | null, result: unknown): RpcResponse {
  return { jsonrpc: '2.0', id, result };
}

function isValidId(id: unknown): id is string | number | null {
  return typeof id === 'string' || typeof id === 'number' || id === null;
}

async function dispatchDocs(method: string, params: Record<string, unknown> | undefined): Promise<unknown> {
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
        serverInfo: DOCS_SERVER_INFO,
        instructions: DOCS_SERVER_INSTRUCTIONS,
      };
    case 'notifications/initialized':
      return {};
    case 'ping':
      return {};
    case 'tools/list':
      return { tools: MCP_DOCS_TOOLS };
    case 'resources/list':
      return {
        resources: [
          {
            uri: `${SITE_URL}/llms.txt`,
            name: 'llms.txt',
            description: 'Structured index of veda.ng documentation and research for LLMs.',
            mimeType: 'text/markdown',
          },
          {
            uri: `${SITE_URL}/openapi.json`,
            name: 'openapi.json',
            description: 'OpenAPI 3.1 specification for veda.ng public APIs.',
            mimeType: 'application/json',
          },
          {
            uri: `${SITE_URL}/auth.md`,
            name: 'auth.md',
            description: 'Keyless authentication and API access guide.',
            mimeType: 'text/markdown',
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
          textContent = '# Vedang Vatsa - Documentation & Research (veda.ng)\n\nhttps://veda.ng';
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
          /* fallback */
        }
        if (!specText) {
          try {
            const fs = await import('fs');
            const path = await import('path');
            specText = fs.readFileSync(path.join(process.cwd(), 'public', 'openapi.json'), 'utf8');
          } catch {
            specText = JSON.stringify({ openapi: '3.1.0', info: { title: 'Veda API', version: '1.1.0' } });
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
      if (uri.endsWith('/auth.md') || uri === 'auth.md') {
        let authText = '';
        try {
          const fs = await import('fs');
          const path = await import('path');
          authText = fs.readFileSync(path.join(process.cwd(), 'public', 'auth.md'), 'utf8');
        } catch {
          authText = '# Authentication Guide\n\nAll endpoints on veda.ng are public and keyless.';
        }
        return {
          contents: [
            {
              uri: `${SITE_URL}/auth.md`,
              mimeType: 'text/markdown',
              text: authText,
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
      if (!name || !DOCS_TOOL_HANDLERS[name]) {
        throw { rpcCode: INVALID_PARAMS, message: `Unknown docs tool: ${name || '(missing name)'}` };
      }
      const args = (params?.arguments ?? {}) as Record<string, unknown>;
      return await DOCS_TOOL_HANDLERS[name](args);
    }
    default:
      throw { rpcCode: METHOD_NOT_FOUND, message: `Method not found: ${method}` };
  }
}

export async function handleDocsMcpPost(rawBody: string | null): Promise<McpHttpResult> {
  if (!rawBody || rawBody.trim() === '') {
    return { status: 200, body: JSON.stringify(failure(null, PARSE_ERROR, 'Parse error: empty request body')) };
  }

  let message: unknown;
  try {
    message = JSON.parse(rawBody);
  } catch {
    return { status: 200, body: JSON.stringify(failure(null, PARSE_ERROR, 'Parse error: invalid JSON')) };
  }

  if (Array.isArray(message)) {
    const results = await Promise.all(
      message.map(async (msg) => {
        if (!msg || typeof msg !== 'object') return failure(null, INVALID_REQUEST, 'Invalid Request');
        const { method, id, params } = msg as { method?: unknown; id?: unknown; params?: unknown };
        if (typeof method !== 'string') return failure(isValidId(id) ? id : null, INVALID_REQUEST, 'Invalid Request');
        if (method.startsWith('notifications/')) return null;
        const effectiveId = isValidId(id) ? id : 1;
        try {
          const res = await dispatchDocs(method, params as Record<string, unknown> | undefined);
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
    const result = await dispatchDocs(method, (params ?? undefined) as Record<string, unknown> | undefined);
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

export function docsMcpEndpointDescriptor(): string {
  return JSON.stringify(
    {
      endpoint: DOCS_MCP_ENDPOINT,
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
      serverInfo: DOCS_SERVER_INFO,
      instructions: DOCS_SERVER_INSTRUCTIONS,
      tools: MCP_DOCS_TOOLS.map((t) => t.name),
      tool_definitions: MCP_DOCS_TOOLS,
      usage: `Send POST ${DOCS_MCP_ENDPOINT} with JSON-RPC 2.0`,
      docs: `${SITE_URL}/developers`,
    },
    null,
    2
  );
}
