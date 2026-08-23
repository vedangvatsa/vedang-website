import { NextRequest } from 'next/server';
import { handleMcpPost, mcpEndpointDescriptor, DEFAULT_PROTOCOL_VERSION, negotiateProtocolVersion } from '@/lib/mcp-rpc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization, X-Requested-With, Idempotency-Key',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version, Location, Retry-After',
};

function withCors(headers: Record<string, string>): Record<string, string> {
  return { ...headers, ...CORS_HEADERS };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: withCors({ Allow: 'POST, GET, DELETE, OPTIONS, HEAD' }) });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: withCors({
      'Content-Type': 'application/json; charset=utf-8',
      'Mcp-Protocol-Version': DEFAULT_PROTOCOL_VERSION,
      'Cache-Control': 'public, max-age=86400',
    }),
  });
}

export async function GET() {
  return new Response(mcpEndpointDescriptor(), {
    status: 200,
    headers: withCors({
      'Content-Type': 'application/json; charset=utf-8',
      'Mcp-Protocol-Version': DEFAULT_PROTOCOL_VERSION,
      'Cache-Control': 'public, max-age=86400',
    }),
  });
}

export async function DELETE() {
  return new Response(
    JSON.stringify({ error: 'This server is stateless and does not issue sessions to delete.' }),
    {
      status: 200,
      headers: withCors({ 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST, GET, OPTIONS' }),
    }
  );
}

export async function POST(request: NextRequest) {
  const protocolHeader = request.headers.get('mcp-protocol-version');
  const requestedVersion = protocolHeader || DEFAULT_PROTOCOL_VERSION;
  const protocolVersion = negotiateProtocolVersion(requestedVersion);

  const accept = (request.headers.get('accept') ?? '').toLowerCase();
  const isExplicitlyIncompatible =
    accept !== '' &&
    !accept.includes('*/*') &&
    !accept.includes('application/*') &&
    !accept.includes('application/json') &&
    !accept.includes('text/event-stream') &&
    !accept.includes('text/*');

  if (isExplicitlyIncompatible) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Not Acceptable: client must accept application/json or text/event-stream' },
      }),
      { status: 406, headers: withCors({ 'Content-Type': 'application/json; charset=utf-8' }) }
    );
  }

  let rawBody: string | null = null;
  try {
    rawBody = await request.text();
  } catch {
    rawBody = null;
  }

  const result = await handleMcpPost(rawBody);
  const activeVersion = result.negotiatedVersion || protocolVersion;

  const headers = withCors({
    'Content-Type': 'application/json; charset=utf-8',
    'Mcp-Protocol-Version': activeVersion,
  });

  if (result.body === null) {
    return new Response(null, { status: 202, headers });
  }
  return new Response(result.body, { status: result.status, headers });
}
