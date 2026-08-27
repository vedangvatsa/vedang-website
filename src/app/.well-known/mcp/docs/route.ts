import { NextRequest } from 'next/server';
import { handleDocsMcpPost, docsMcpEndpointDescriptor } from '@/lib/mcp-docs-rpc';
import { DEFAULT_PROTOCOL_VERSION, negotiateProtocolVersion } from '@/lib/mcp-rpc';

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

export async function GET(request: NextRequest) {
  const accept = (request.headers.get('accept') ?? '').toLowerCase();

  if (accept.includes('text/event-stream')) {
    const ssePayload = `event: endpoint\ndata: https://veda.ng/.well-known/mcp/docs\n\n`;
    return new Response(ssePayload, {
      status: 200,
      headers: withCors({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Mcp-Protocol-Version': DEFAULT_PROTOCOL_VERSION,
        'Mcp-Session-Id': 'docs-default',
      }),
    });
  }

  return new Response(docsMcpEndpointDescriptor(), {
    status: 200,
    headers: withCors({
      'Content-Type': 'application/json; charset=utf-8',
      'Mcp-Protocol-Version': DEFAULT_PROTOCOL_VERSION,
      'Cache-Control': 'public, max-age=86400',
    }),
  });
}

export async function POST(request: NextRequest) {
  const protocolHeader = request.headers.get('mcp-protocol-version');
  const requestedVersion = protocolHeader || DEFAULT_PROTOCOL_VERSION;
  const protocolVersion = negotiateProtocolVersion(requestedVersion);

  const textBody = await request.text();
  const { status, body, negotiatedVersion } = await handleDocsMcpPost(textBody);

  return new Response(body, {
    status,
    headers: withCors({
      'Content-Type': 'application/json; charset=utf-8',
      'Mcp-Protocol-Version': negotiatedVersion || protocolVersion,
      'Mcp-Session-Id': 'docs-default',
    }),
  });
}
