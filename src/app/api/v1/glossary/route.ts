import { NextRequest, NextResponse } from 'next/server';
import { glossaryTerms, GlossaryTerm } from '@/lib/glossary';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);
    const cursor = searchParams.get('cursor');
    const idempotencyKey = request.headers.get('Idempotency-Key');

    let terms = glossaryTerms;
    if (category) {
      terms = terms.filter((t: GlossaryTerm) => t.category?.toLowerCase() === category.toLowerCase());
    }

    let startIndex = 0;
    if (cursor) {
      const decodedIndex = parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10);
      if (!isNaN(decodedIndex) && decodedIndex >= 0 && decodedIndex < terms.length) {
        startIndex = decodedIndex;
      }
    }

    const endIndex = Math.min(startIndex + limit, terms.length);
    const pageItems = terms.slice(startIndex, endIndex);
    const hasMore = endIndex < terms.length;
    const nextCursor = hasMore ? Buffer.from(String(endIndex)).toString('base64') : null;

    const items = pageItems.map((t: GlossaryTerm) => ({
      slug: t.slug,
      term: t.term,
      definition: t.definition,
      category: t.category || 'General',
      url: `https://veda.ng/glossary/${t.slug}`,
      markdownUrl: `https://veda.ng/glossary/${t.slug}.md`,
    }));

    const headers = getStandardApiHeaders({ idempotencyKey, cacheSeconds: 3600 });

    return NextResponse.json(
      {
        total: terms.length,
        limit,
        has_more: hasMore,
        next_cursor: nextCursor,
        pagination: {
          total: terms.length,
          limit,
          has_more: hasMore,
          cursor: cursor || null,
          next_cursor: nextCursor,
        },
        terms: items,
      },
      { headers }
    );
  } catch {
    return jsonError('server_error', 'Failed to retrieve glossary terms.', 500);
  }
}
