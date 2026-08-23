import { NextRequest, NextResponse } from 'next/server';
import { glossaryTerms, GlossaryTerm } from '@/lib/glossary';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const idempotencyKey = request.headers.get('Idempotency-Key');

    let terms = glossaryTerms;
    if (category) {
      terms = terms.filter((t: GlossaryTerm) => t.category?.toLowerCase() === category.toLowerCase());
    }

    const items = terms.slice(0, Math.min(limit, 200)).map((t: GlossaryTerm) => ({
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
        terms: items,
      },
      { headers }
    );
  } catch {
    return jsonError('server_error', 'Failed to retrieve glossary terms.', 500);
  }
}
