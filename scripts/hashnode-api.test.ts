import test from 'node:test';
import assert from 'node:assert/strict';
import { HASHNODE_API_URL, hashnodeGraphql } from './hashnode-api.js';

test('Hashnode uses the current endpoint and normalizes Bearer authentication', async () => {
  for (const token of ['sample-token', 'Bearer sample-token']) {
    const data = await hashnodeGraphql('query { me { id } }', {}, token, async (url, init) => {
      assert.equal(url, HASHNODE_API_URL);
      assert.equal(HASHNODE_API_URL, 'https://gql-beta.hashnode.com/');
      assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer sample-token');
      assert.equal(init?.redirect, 'error');
      return Response.json({ data: { me: { id: 'user' } } });
    });
    assert.equal(data.me.id, 'user');
  }
});

test('Hashnode reports non-JSON responses rather than exposing an HTML parse error', async () => {
  await assert.rejects(hashnodeGraphql('query { me { id } }', {}, 'sample-token', async () =>
    new Response('<!DOCTYPE html>', { status: 403, headers: { 'Content-Type': 'text/html' } })), /non-JSON response \(HTTP 403\)/);
});

test('Hashnode preserves access-denial details and redacts credentials', async () => {
  await assert.rejects(hashnodeGraphql('query { me { id } }', {}, 'sample-token', async () =>
    Response.json({ errors: [{ message: 'Pro required; token sample-token', extensions: { code: 'FORBIDDEN' } }] })), err => {
      assert.match((err as Error).message, /FORBIDDEN: Pro required/);
      assert.ok(!(err as Error).message.includes('sample-token'));
      return true;
    });
});
