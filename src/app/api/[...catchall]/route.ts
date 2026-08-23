import { jsonError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  return jsonError('not_found', 'The requested API endpoint was not found.', 404, 'See https://veda.ng/openapi.json or https://veda.ng/developers');
}

export async function POST() {
  return jsonError('not_found', 'The requested API endpoint was not found.', 404, 'See https://veda.ng/openapi.json or https://veda.ng/developers');
}

export async function PUT() {
  return jsonError('not_found', 'The requested API endpoint was not found.', 404, 'See https://veda.ng/openapi.json or https://veda.ng/developers');
}

export async function DELETE() {
  return jsonError('not_found', 'The requested API endpoint was not found.', 404, 'See https://veda.ng/openapi.json or https://veda.ng/developers');
}

export async function PATCH() {
  return jsonError('not_found', 'The requested API endpoint was not found.', 404, 'See https://veda.ng/openapi.json or https://veda.ng/developers');
}
