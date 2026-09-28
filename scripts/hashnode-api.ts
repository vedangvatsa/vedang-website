export const HASHNODE_API_URL = 'https://gql-beta.hashnode.com/';

export async function hashnodeGraphql<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
  token = process.env.HASHNODE_TOKEN,
  fetcher: typeof fetch = globalThis.fetch,
): Promise<T> {
  const secret = token?.trim().replace(/^Bearer\s+/i, '');
  if (!secret) throw new Error('Missing HASHNODE_TOKEN');
  const res = await fetcher(HASHNODE_API_URL, {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(30000),
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      'x-hashnode-client': 'vedang-website',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!(res.headers.get('content-type') || '').includes('json')) {
    throw new Error(`Hashnode returned a non-JSON response (HTTP ${res.status}); check API access and publication billing`);
  }
  const data = await res.json() as { data?: T; errors?: Array<{ message?: string; extensions?: { code?: string } }> };
  if (data.errors?.length) {
    const message = data.errors.map(e => `${e.extensions?.code || 'API_ERROR'}: ${e.message || 'Request failed'}`).join('; ');
    throw new Error(message.replaceAll(secret, '[redacted]'));
  }
  if (!res.ok) throw new Error(`Hashnode HTTP ${res.status}`);
  if (!data.data) throw new Error('Hashnode returned no data');
  return data.data;
}
