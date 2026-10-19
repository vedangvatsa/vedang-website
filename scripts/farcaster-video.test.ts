import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { prepareVideoEmbed } from './farcaster-scheduled-executor.js';
import { runPlatform } from './native-viz-scheduled-executor.js';
import { ROOT } from './viz-publishing.js';

const raw = 'https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/scripts/viz-assets/videos/01-population-2000-2024.mp4';
const hosted = 'https://veda.ng/api/social-video/scripts/viz-assets/videos/01-population-2000-2024.mp4';
const resolved = { metadata: { _status: 'RESOLVED', content_type: 'video/mp4', video: { duration_s: 30, stream: [{ width_px: 1080, height_px: 1920 }] } } };

test('Farcaster waits for video metadata and never treats binary download headers as video', async () => {
  const key = process.env.NEYNAR_API_KEY;
  const proxy = process.env.FARCASTER_MEDIA_PROXY_BASE_URL;
  process.env.NEYNAR_API_KEY = 'test-key';
  process.env.FARCASTER_MEDIA_PROXY_BASE_URL = '';
  try {
    let calls = 0;
    const request: typeof fetch = async (url, init) => {
      calls++;
      if (calls === 1) {
        assert.equal(url, hosted);
        assert.equal(init?.method, 'HEAD');
        return new Response(null, { headers: { 'Content-Type': 'video/mp4' } });
      }
      assert.equal(new URL(String(url)).searchParams.get('url'), hosted);
      assert.equal(new Headers(init?.headers).get('x-api-key'), 'test-key');
      return Response.json(calls === 2 ? { metadata: { _status: 'PENDING' } } : resolved);
    };
    assert.equal(await prepareVideoEmbed(raw, request, async () => {}), hosted);
    assert.equal(calls, 3);
    await assert.rejects(prepareVideoEmbed(raw, async () => new Response(null, { headers: { 'Content-Type': 'application/octet-stream' } })), /video\/mp4/);
    await assert.rejects(prepareVideoEmbed(raw, async () => new Response(null, { status: 404 })), /deploy the media endpoint/);
    for (const metadata of [{ _status: 'RESOLVED', content_type: 'text/html' }, { _status: 'PENDING' }, { _status: 'ERROR' }]) {
      await assert.rejects(prepareVideoEmbed(raw, async (_url, init) => init?.method === 'HEAD'
        ? new Response(null, { headers: { 'Content-Type': 'video/mp4' } }) : Response.json({ metadata }), async () => {}), /no cast was sent/);
    }
  } finally {
    if (key === undefined) delete process.env.NEYNAR_API_KEY; else process.env.NEYNAR_API_KEY = key;
    if (proxy === undefined) delete process.env.FARCASTER_MEDIA_PROXY_BASE_URL; else process.env.FARCASTER_MEDIA_PROXY_BASE_URL = proxy;
  }
});

test('scheduler validates the embed before claiming a slot, then publishes the validated URL', async () => {
  const dir = fs.mkdtempSync(path.join(ROOT, 'tests/.farcaster-video-'));
  const file = path.join(dir, 'queue.json');
  const video = path.join(dir, 'sample.mp4');
  fs.writeFileSync(video, new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112]));
  const originalFetch = globalThis.fetch;
  const env = { NEYNAR_API_KEY: process.env.NEYNAR_API_KEY, NEYNAR_SIGNER_UUID: process.env.NEYNAR_SIGNER_UUID };
  process.env.NEYNAR_API_KEY = 'test-key';
  process.env.NEYNAR_SIGNER_UUID = 'test-signer';
  const queue = [{ id: 'video', text: 'Population, 2000-2024.', posted: false, scheduleDate: '2020-01-01', scheduleTime: '09:00', video: path.relative(ROOT, video), publicVideoUrl: raw }];
  const contents = JSON.stringify(queue);
  try {
    fs.writeFileSync(file, contents);
    const requests: RequestInit[] = [];
    globalThis.fetch = async (_url, init = {}) => { requests.push(init); return new Response(null, { headers: { 'Content-Type': 'application/octet-stream' } }); };
    await assert.rejects(runPlatform('farcaster', false, file), /video\/mp4/);
    assert.equal(fs.readFileSync(file, 'utf8'), contents);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, 'HEAD');
    globalThis.fetch = async (url, init = {}) => {
      if (init.method === 'HEAD') return new Response(null, { headers: { 'Content-Type': 'video/mp4' } });
      if (String(url).includes('/embed/crawl/')) return Response.json(resolved);
      assert.equal(init.method, 'POST');
      assert.equal(new Headers(init.headers).get('x-api-key'), 'test-key');
      assert.equal(JSON.parse(String(init.body)).signer_uuid, 'test-signer');
      assert.deepEqual(JSON.parse(String(init.body)).embeds, [{ url: hosted }]);
      return Response.json({ cast: { hash: `0x${'1'.repeat(40)}`, author: { username: 'vedangvatsa' } } });
    };
    await runPlatform('farcaster', false, file);
    const [receipt] = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(receipt.posted, true);
    assert.equal(receipt.state, 'sent');
    assert.equal(receipt.videoEmbedUrl, hosted);
    assert.equal(receipt.postUrl, 'https://farcaster.xyz/vedangvatsa/0x11111111');
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
