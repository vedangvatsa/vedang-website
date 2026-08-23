import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AUTH_HEADERS: Record<string, string> = {
  'WWW-Authenticate': 'Bearer resource_metadata="https://veda.ng/.well-known/oauth-protected-resource"',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
};

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      error: {
        code: 'unauthorized',
        message: 'Authentication requirements are declared in RFC 9728 protected-resource metadata.',
        resource_metadata: 'https://veda.ng/.well-known/oauth-protected-resource',
      },
    }),
    { status: 401, headers: AUTH_HEADERS }
  );
}

export async function POST() {
  return new NextResponse(
    JSON.stringify({
      error: {
        code: 'unauthorized',
        message: 'Authentication requirements are declared in RFC 9728 protected-resource metadata.',
        resource_metadata: 'https://veda.ng/.well-known/oauth-protected-resource',
      },
    }),
    { status: 401, headers: AUTH_HEADERS }
  );
}
