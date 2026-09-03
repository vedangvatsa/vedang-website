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

  test('MCP JSON-RPC handles tools/list, resources/read, and batch calls', async () => {
    const batch = JSON.stringify([
      { jsonrpc: '2.0', id: 10, method: 'tools/list' },
      { jsonrpc: '2.0', id: 20, method: 'ping' },
      { jsonrpc: '2.0', id: 30, method: 'resources/read', params: { uri: 'https://veda.ng/llms.txt' } },
    ]);
    const res = await handleMcpPost(batch);
    assert.equal(res.status, 200);
    const parsed = JSON.parse(res.body || '[]');
    assert.equal(parsed.length, 3);
    assert.equal(parsed[0].id, 10);
    assert.ok(Array.isArray(parsed[0].result.tools));
    assert.equal(parsed[1].id, 20);
    assert.equal(parsed[2].id, 30);
    assert.ok(Array.isArray(parsed[2].result.contents));
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

  test('Docs MCP server handles tools/list with annotations and resources/read', async () => {
    const { handleDocsMcpPost, docsMcpEndpointDescriptor } = await import('../src/lib/mcp-docs-rpc');
    const desc = JSON.parse(docsMcpEndpointDescriptor());
    assert.equal(desc.serverInfo.name, 'veda-docs-mcp');
    assert.ok(desc.tools.includes('get_api_documentation'));

    const listRes = await handleDocsMcpPost(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }));
    assert.equal(listRes.status, 200);
    const parsed = JSON.parse(listRes.body || '{}');
    assert.ok(Array.isArray(parsed.result.tools));
    assert.ok(parsed.result.tools.every((t: any) => t.annotations && t.annotations.readOnlyHint === true));
  });

  test('Markdown negotiation resolves .md twins for API and content pages', async () => {
    const { isMarkdownUrl, markdownUrlToPath, shouldSkipNegotiation, wantsMarkdown } = await import('../src/lib/agent-negotiation');
    assert.equal(isMarkdownUrl('/api/v1/essays.md'), true);
    assert.equal(isMarkdownUrl('/api.md'), true);
    assert.equal(markdownUrlToPath('/api/v1/essays.md'), '/api/v1/essays');
    assert.equal(shouldSkipNegotiation('/api/v1/essays.md', 'GET'), false);
    assert.equal(shouldSkipNegotiation('/api.md', 'GET'), false);
    assert.equal(wantsMarkdown(null, 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'), true);
    assert.equal(wantsMarkdown(null, 'Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)'), true);
    assert.equal(wantsMarkdown('text/markdown'), true);

    const { getMarkdownForPath } = await import('../src/lib/agent-md');
    const mcpDocsMd = getMarkdownForPath('/.well-known/mcp/docs');
    assert.ok(mcpDocsMd);
    assert.ok(mcpDocsMd.includes('# Vedang Vatsa Documentation MCP Server'));

    const mcpProdMd = getMarkdownForPath('/.well-known/mcp');
    assert.ok(mcpProdMd);
    assert.ok(mcpProdMd.includes('# Vedang Vatsa Product MCP Server'));
  });
});

