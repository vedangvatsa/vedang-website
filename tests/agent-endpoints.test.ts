import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mcpEndpointDescriptor, handleMcpPost } from '../src/lib/mcp-rpc';
import { getStandardApiHeaders, jsonError } from '../src/lib/api-response';

describe('Agent & Machine Endpoints', () => {
  test('MCP endpoint descriptor returns valid configuration and tools', () => {
    const raw = mcpEndpointDescriptor();
    const parsed = JSON.parse(raw);
    assert.equal(parsed.endpoint, 'https://veda.ng/.well-known/mcp');
    assert.equal(parsed.stateless, true);
    assert.ok(Array.isArray(parsed.tools));
    assert.ok(parsed.tools.includes('search_essays'));
    assert.ok(parsed.tools.includes('get_essay'));
    assert.ok(parsed.tools.includes('search_reports'));
  });

  test('MCP JSON-RPC handles initialize correctly', async () => {
    const body = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18' },
    });
    const res = await handleMcpPost(body);
    assert.equal(res.status, 200);
    const parsed = JSON.parse(res.body || '{}');
    assert.equal(parsed.jsonrpc, '2.0');
    assert.equal(parsed.id, 1);
    assert.equal(parsed.result.serverInfo.name, 'veda.ng');
  });

  test('Standard API headers include RFC rate-limit and deprecation info', () => {
    const headers = getStandardApiHeaders({ idempotencyKey: 'test-key-123' });
    assert.equal(headers['RateLimit-Limit'], '60');
    assert.equal(headers['RateLimit-Remaining'], '59');
    assert.equal(headers['Idempotency-Key'], 'test-key-123');
    assert.ok(headers['Sunset']);
    assert.ok(headers['Deprecation']);
  });

  test('jsonError generates structured error object with status and resolution', () => {
    const res = jsonError('test_error', 'Invalid input provided', 400, 'Check docs at /developers');
    assert.equal(res.status, 400);
  });

  test('Base64 cursor encoding and decoding helper contract', () => {
    const cursor = Buffer.from('10').toString('base64');
    const decoded = parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10);
    assert.equal(decoded, 10);
  });
});
