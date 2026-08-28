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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url') || searchParams.get('domain') || searchParams.get('q');
  const bypassCache = searchParams.get('refresh') === 'true' || searchParams.get('force') === 'true';

  if (!targetUrl) {
    return jsonError('MISSING_URL', 'Missing required query parameter "url" (e.g. /api/v1/scan?url=example.com)', 400);
  }

  return handleScan(targetUrl, bypassCache);
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

  return handleScan(targetUrl, bypassCache);
}

async function handleScan(targetUrl: string, bypassCache: boolean) {
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
