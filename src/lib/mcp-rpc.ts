import { MCP_TOOLS, TOOL_HANDLERS } from '@/lib/agent-tools';
import { SITE_NAME, SITE_URL, LLMSTXT_URL, MCP_ENDPOINT } from '@/lib/site';

export const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'] as const;
export const LATEST_PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];

export const SERVER_INFO = {
  name: 'veda.ng',
  title: `${SITE_NAME} Research Hub`,
  version: '1.0.0',
};

export const SERVER_INSTRUCTIONS = [
  `Tools for searching and reading the published research of ${SITE_NAME}: essays on AI agents and Web3, a 100+ term glossary, and a 233,000-paper academic index.`,
  `Use search_essays or search_glossary first, then get_essay or get_glossary_term for full text. Use search_reports for peer-reviewed literature.`,
  `Content is educational; it is not financial, legal, or medical advice. Full site index: ${LLMSTXT_URL}. Human-readable docs: ${SITE_URL}/developers. Contact: ${SITE_URL}/meeting.`,
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

function negotiateProtocolVersion(requested: unknown): string {
  if (typeof requested === 'string' && (SUPPORTED_PROTOCOL_VERSIONS as readonly string[]).includes(requested)) {
    return requested;
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
        },
        serverInfo: SERVER_INFO,
        instructions: SERVER_INSTRUCTIONS,
      };
    case 'ping':
      return {};
    case 'tools/list':
      return { tools: MCP_TOOLS };
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
}

export async function handleMcpPost(rawBody: string | null): Promise<McpHttpResult> {
  let message: unknown;
  try {
    message = JSON.parse(rawBody ?? '');
  } catch {
    return { status: 200, body: JSON.stringify(failure(null, PARSE_ERROR, 'Parse error')) };
  }

  if (message === null || typeof message !== 'object' || Array.isArray(message)) {
    return { status: 200, body: JSON.stringify(failure(null, INVALID_REQUEST, 'Invalid Request')) };
  }

  const { method, id, params } = message as { method?: unknown; id?: unknown; params?: unknown };

  if (typeof method !== 'string') {
    return { status: 200, body: JSON.stringify(failure(isValidId(id) ? id : null, INVALID_REQUEST, 'Invalid Request')) };
  }

  if (id === undefined || id === null) {
    return { status: 202, body: null };
  }

  if (!isValidId(id)) {
    return { status: 200, body: JSON.stringify(failure(null, INVALID_REQUEST, 'Invalid Request: invalid id')) };
  }

  try {
    const result = await dispatch(method, (params ?? undefined) as Record<string, unknown> | undefined);
    return { status: 200, body: JSON.stringify(success(id, result)) };
  } catch (err) {
    const rpcErr = err as { rpcCode?: number; message?: string };
    if (rpcErr && typeof rpcErr.rpcCode === 'number') {
      return { status: 200, body: JSON.stringify(failure(id, rpcErr.rpcCode, rpcErr.message ?? 'Tool error')) };
    }
    return { status: 200, body: JSON.stringify(failure(id, INVALID_REQUEST, 'Internal error while handling request.')) };
  }
}

export function mcpEndpointDescriptor(): string {
  return JSON.stringify(
    {
      endpoint: MCP_ENDPOINT,
      transport: 'Streamable HTTP (JSON-RPC 2.0 over POST)',
      protocol_versions: SUPPORTED_PROTOCOL_VERSIONS,
      stateless: true,
      authentication: 'none',
      tools: MCP_TOOLS.map((t) => t.name),
      usage: `Send POST ${MCP_ENDPOINT} with Content-Type: application/json and body {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"${LATEST_PROTOCOL_VERSION}","capabilities":{},"clientInfo":{"name":"your-client","version":"1.0"}}}`,
      docs: `${SITE_URL}/developers`,
    },
    null,
    2
  );
}
