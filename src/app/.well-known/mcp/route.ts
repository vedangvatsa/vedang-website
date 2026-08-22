import { NextRequest } from 'next/server';
import { handleMcpPost, mcpEndpointDescriptor, SUPPORTED_PROTOCOL_VERSIONS, LATEST_PROTOCOL_VERSION } from '@/lib/mcp-rpc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
};

function withCors(headers: Record<string, string>): Record<string, string> {
  return { ...headers, ...CORS_HEADERS };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: withCors({ Allow: 'POST, GET, DELETE, OPTIONS' }) });
}

export async function GET() {
  return new Response(mcpEndpointDescriptor(), {
    status: 405,
    headers: withCors({
      'Content-Type': 'application/json; charset=utf-8',
      Allow: 'POST, DELETE, OPTIONS',
    }),
  });
}

export async function DELETE() {
  return new Response(
    JSON.stringify({ error: 'This server is stateless and does not issue sessions to delete.' }),
    {
      status: 405,
      headers: withCors({ 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST, GET, OPTIONS' }),
    }
  );
}

export async function POST(request: NextRequest) {
  const accept = request.headers.get('accept') ?? '';
  const acceptsJson = accept.includes('application/json');
  const acceptsSse = accept.includes('text/event-stream');
  if (!acceptsJson && !acceptsSse) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Not Acceptable: client must accept application/json or text/event-stream' },
      }),
      { status: 406, headers: withCors({ 'Content-Type': 'application/json; charset=utf-8' }) }
    );
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Unsupported Media Type: Content-Type must be application/json' },
      }),
      { status: 415, headers: withCors({ 'Content-Type': 'application/json; charset=utf-8' }) }
    );
  }

  const protocolHeader = request.headers.get('mcp-protocol-version');
  if (
    protocolHeader &&
    !(SUPPORTED_PROTOCOL_VERSIONS as readonly string[]).includes(protocolHeader) &&
    protocolHeader !== LATEST_PROTOCOL_VERSION
  ) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
          message: `Unsupported Mcp-Protocol-Version: ${protocolHeader}. Supported: ${SUPPORTED_PROTOCOL_VERSIONS.join(', ')}`,
        },
      }),
      { status: 400, headers: withCors({ 'Content-Type': 'application/json; charset=utf-8' }) }
    );
  }

  let rawBody: string | null = null;
  try {
    rawBody = await request.text();
  } catch {
    rawBody = null;
  }

  const result = await handleMcpPost(rawBody);
  const headers = withCors({
    'Content-Type': 'application/json; charset=utf-8',
    'Mcp-Protocol-Version': LATEST_PROTOCOL_VERSION,
  });

  if (result.body === null) {
    return new Response(null, { status: result.status === 202 ? 202 : result.status, headers });
  }
  return new Response(result.body, { status: result.status, headers });
}
