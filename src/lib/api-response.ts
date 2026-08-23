import { NextResponse } from 'next/server';

export interface StandardApiHeadersOptions {
  idempotencyKey?: string | null;
  cacheSeconds?: number;
}

export function getStandardApiHeaders(options?: StandardApiHeadersOptions): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key, Accept',
    'RateLimit': 'limit=60, remaining=59, reset=60',
    'RateLimit-Limit': '60',
    'RateLimit-Remaining': '59',
    'RateLimit-Reset': '60',
    'RateLimit-Policy': '60;w=60',
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': '59',
    'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
    'Sunset': 'Sun, 01 Mar 2028 00:00:00 GMT',
    'Deprecation': '@1835500000',
    'Link': '<https://veda.ng/developers#versioning>; rel="deprecation"',
    'Cache-Control': `public, max-age=${options?.cacheSeconds ?? 3600}`,
  };

  if (options?.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  return headers;
}

export function jsonError(
  code: string,
  message: string,
  status = 400,
  resolution?: string
): NextResponse {
  const headers = getStandardApiHeaders({ cacheSeconds: 0 });
  if (status === 429 || status >= 500) {
    headers['Retry-After'] = '60';
  }

  return NextResponse.json(
    {
      error: {
        code,
        message,
        status,
        resolution: resolution || 'Check the API documentation at https://veda.ng/developers or https://veda.ng/openapi.json',
      },
    },
    { status, headers }
  );
}
