import { NextRequest, NextResponse } from 'next/server';
import { essays, Essay } from '@/lib/essays';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const cursor = searchParams.get('cursor');
    const idempotencyKey = request.headers.get('Idempotency-Key');

    let startIndex = 0;
    if (cursor) {
      const decodedIndex = parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10);
      if (!isNaN(decodedIndex) && decodedIndex >= 0 && decodedIndex < essays.length) {
        startIndex = decodedIndex;
      }
    }

    const endIndex = Math.min(startIndex + limit, essays.length);
    const pageItems = essays.slice(startIndex, endIndex);
    const hasMore = endIndex < essays.length;
    const nextCursor = hasMore ? Buffer.from(String(endIndex)).toString('base64') : null;

    const items = pageItems.map((e: Essay) => ({
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
        has_more: hasMore,
        next_cursor: nextCursor,
        pagination: {
          total: essays.length,
          limit,
          has_more: hasMore,
          cursor: cursor || null,
          next_cursor: nextCursor,
        },
        essays: items,
      },
      { headers }
    );
  } catch {
    return jsonError('server_error', 'Failed to retrieve essay catalog.', 500);
  }
}
