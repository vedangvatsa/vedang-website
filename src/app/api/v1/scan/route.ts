import { NextRequest, NextResponse } from 'next/server';
import { scanDomain } from '@/lib/scanner/engine';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30 seconds max for parallel fetch

interface CacheEntry {
  result: object;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Best-effort per-IP throttle: one inbound scan fans out to ~40 outbound
// probes, so uncapped callers can turn this endpoint into an amplifier.
// Single-instance memory only; treat as a safety valve, not a quota system.
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (rateBuckets.size > 5000) rateBuckets.delete(rateBuckets.keys().next().value as string);
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url') || searchParams.get('domain') || searchParams.get('q');
  const bypassCache = searchParams.get('refresh') === 'true' || searchParams.get('force') === 'true';

  if (!targetUrl) {
    return jsonError('MISSING_URL', 'Missing required query parameter "url" (e.g. /api/v1/scan?url=example.com)', 400);
  }

  return handleScan(targetUrl, bypassCache, request);
}

export async function POST(request: NextRequest) {
  let targetUrl = '';
  let bypassCache = false;

  try {
    const body = await request.json();
    targetUrl = body.url || body.domain || body.target;
    bypassCache = body.refresh === true || body.force === true;
  } catch {
    return jsonError('INVALID_BODY', 'Invalid JSON body. Expected { "url": "example.com" }', 400);
  }

  if (!targetUrl || typeof targetUrl !== 'string') {
    return jsonError('MISSING_URL', 'Missing "url" in JSON request body', 400);
  }

  return handleScan(targetUrl, bypassCache, request);
}

async function handleScan(targetUrl: string, bypassCache: boolean, request: NextRequest) {
  if (isRateLimited(clientIp(request))) {
    return jsonError('RATE_LIMITED', 'Too many scan requests. Wait a minute and retry.', 429);
  }
  const cacheKey = targetUrl.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

  if (!bypassCache) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      const headers = getStandardApiHeaders({ cacheSeconds: 300 });
      return NextResponse.json({ ...cached.result, servedFromCache: true }, { headers });
    }
  }

  try {
    const result = await scanDomain(targetUrl);
    cache.set(cacheKey, { result, timestamp: Date.now() });

    // Prune cache if it grows too large
    if (cache.size > 200) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }

    const headers = getStandardApiHeaders({ cacheSeconds: 300 });
    return NextResponse.json({ ...result, servedFromCache: false }, { headers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to scan domain. Please ensure the URL is valid.';
    return jsonError('SCAN_FAILED', msg, 400);
  }
}
