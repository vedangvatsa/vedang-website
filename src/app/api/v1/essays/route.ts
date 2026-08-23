import { NextRequest, NextResponse } from 'next/server';
import { essays, Essay } from '@/lib/essays';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const idempotencyKey = request.headers.get('Idempotency-Key');

    const items = essays.slice(0, Math.min(limit, 100)).map((e: Essay) => ({
      slug: e.slug,
      title: e.title,
      summary: e.summary || '',
      date: e.date,
      url: `https://veda.ng/${e.slug}`,
      markdownUrl: `https://veda.ng/${e.slug}.md`,
    }));

    const headers = getStandardApiHeaders({ idempotencyKey, cacheSeconds: 3600 });

    return NextResponse.json(
      {
        total: essays.length,
        limit,
        essays: items,
      },
      { headers }
    );
  } catch {
    return jsonError('server_error', 'Failed to retrieve essay catalog.', 500);
  }
}
