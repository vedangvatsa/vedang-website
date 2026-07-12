import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://veda.ng',
  'https://www.veda.ng',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  if (origin) {
    return ALLOWED_ORIGINS.has(origin);
  }

  if (referer) {
    try {
      const url = new URL(referer);
      return ALLOWED_ORIGINS.has(url.origin);
    } catch {
      return false;
    }
  }

  // No Origin/Referer: block browser-less abuse of public APIs
  return false;
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function tooManyRequests(message = 'Rate limit exceeded'): NextResponse {
  return NextResponse.json({ error: message }, { status: 429 });
}

export function requireAdminSecret(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    return NextResponse.json(
      { error: 'Admin API is not configured' },
      { status: 503 }
    );
  }

  const header =
    req.headers.get('x-admin-secret') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!header || header !== secret) {
    return unauthorized('Invalid or missing admin secret');
  }

  return null;
}

type RateEntry = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateEntry>();

export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(key);

  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > maxRequests;
}

// Periodic cleanup to avoid unbounded memory growth
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateBuckets) {
      if (now > entry.resetAt) rateBuckets.delete(key);
    }
  }, 5 * 60_000).unref?.();
}
