import { NextRequest, NextResponse } from 'next/server';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';
import { essays, Essay } from '@/lib/essays';
import { glossaryTerms, GlossaryTerm } from '@/lib/glossary';

export const dynamic = 'force-dynamic';

interface BatchSubRequest {
  id?: string;
  method?: string;
  path: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requests: BatchSubRequest[] = body.requests;

    if (!Array.isArray(requests) || requests.length === 0) {
      return jsonError('invalid_batch', 'The requests field must be a non-empty array.', 400);
    }

    if (requests.length > 20) {
      return jsonError('batch_limit_exceeded', 'Maximum 20 operations allowed per batch request.', 400);
    }

    const responses = requests.map((req, index) => {
      const id = req.id || `req-${index + 1}`;
      const path = req.path || '';

      if (path.includes('/essays')) {
        return {
          id,
          status: 200,
          body: {
            total: essays.length,
            essays: essays.slice(0, 10).map((e: Essay) => ({
              slug: e.slug,
              title: e.title,
              url: `https://veda.ng/${e.slug}`,
            })),
          },
        };
      }

      if (path.includes('/glossary')) {
        return {
          id,
          status: 200,
          body: {
            total: glossaryTerms.length,
            terms: glossaryTerms.slice(0, 10).map((t: GlossaryTerm) => ({
              slug: t.slug,
              term: t.term,
              definition: t.definition,
              url: `https://veda.ng/glossary/${t.slug}`,
            })),
          },
        };
      }

      return {
        id,
        status: 200,
        body: {
          path,
          status: 'ok',
          message: 'Operation executed in batch.',
        },
      };
    });

    const idempotencyKey = request.headers.get('Idempotency-Key');
    const headers = getStandardApiHeaders({ idempotencyKey, cacheSeconds: 0 });

    return NextResponse.json(
      {
        total_operations: requests.length,
        idempotency_key: idempotencyKey || undefined,
        responses,
      },
      { headers }
    );
  } catch {
    return jsonError('invalid_json', 'Failed to parse JSON body for batch request.', 400);
  }
}
