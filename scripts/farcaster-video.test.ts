import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { prepareVideoEmbed } from './farcaster-scheduled-executor.js';
import { runPlatform } from './native-viz-scheduled-executor.js';
import { ROOT } from './viz-publishing.js';
import { HLS_CONTENT_TYPE } from '../src/lib/social-video.js';
import { decodeHlsVideo, fetchHlsMedia, parseHlsMedia, verifyFarcasterCast, type MediaCommand } from './farcaster-video-validation.js';

const raw = 'https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/scripts/viz-assets/videos/01-population-2000-2024.mp4';
const hosted = 'https://veda.ng/api/social-video/scripts/viz-assets/videos/hls/01-population-2000-2024.m3u8';
const playlist = '#EXTM3U\n#EXT-X-VERSION:7\n#EXT-X-TARGETDURATION:30\n#EXT-X-PLAYLIST-TYPE:VOD\n#EXT-X-MAP:URI="01-population-2000-2024.mp4",BYTERANGE="16@0"\n#EXTINF:30,\n#EXT-X-BYTERANGE:100@16\n01-population-2000-2024.mp4\n#EXT-X-ENDLIST\n';
const hostedMedia = hosted.replace('.m3u8', '.mp4');
const bytes = Buffer.alloc(116);
bytes.write('ftyp', 4);
const cors = { 'Access-Control-Allow-Origin': '*' };
const mediaResponse = (method?: string, text = playlist) => new Response(method === 'HEAD' ? null : text, { headers: { ...cors, 'Content-Type': HLS_CONTENT_TYPE } });
function hostedResponse(url: Parameters<typeof fetch>[0], init: RequestInit = {}): Response | undefined {
  if (String(url) === hosted) return mediaResponse(init.method);
  if (String(url) !== hostedMedia) return undefined;
  const headers = { ...cors, 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Content-Length': String(bytes.length) };
  if (init.method === 'HEAD') return new Response(null, { headers });
  const range = /^bytes=(\d+)-(\d+)$/.exec(new Headers(init.headers).get('range') || '');
  assert.ok(range);
  const start = Number(range[1]);
  const end = Number(range[2]);
  return new Response(bytes.subarray(start, end + 1), { status: 206, headers: {
    ...headers, 'Content-Range': `bytes ${start}-${end}/${bytes.length}`, 'Content-Length': String(end - start + 1),
  } });
}
const decoded = { frames: 900, durationSeconds: 30, width: 1080, height: 1920 };
const decode = async () => decoded;
const prepare = (source: string, request: typeof fetch, wait = async (_ms: number) => {}) => prepareVideoEmbed(source, request, wait, { decode });
const resolved = { metadata: { _status: 'RESOLVED', content_type: HLS_CONTENT_TYPE, video: { duration_s: 30, streams: [{ width_px: 1080, height_px: 1920 }] } } };

test('Farcaster waits for video metadata and never treats binary download headers as video', async () => {
  const key = process.env.NEYNAR_API_KEY;
  const proxy = process.env.FARCASTER_MEDIA_PROXY_BASE_URL;
  process.env.NEYNAR_API_KEY = 'test-key';
  process.env.FARCASTER_MEDIA_PROXY_BASE_URL = '';
  try {
    let calls = 0;
    const request: typeof fetch = async (url, init) => {
      const response = hostedResponse(url, init);
      if (response) return response;
      calls++;
      assert.equal(new URL(String(url)).searchParams.get('url'), hosted);
      assert.equal(new Headers(init?.headers).get('x-api-key'), 'test-key');
      return Response.json(calls === 1 ? { metadata: { _status: 'PENDING' } } : resolved);
    };
    assert.equal(await prepare(raw, request), hosted);
    assert.equal(calls, 2);
    const documented = { metadata: { ...resolved.metadata, video: { duration_s: 30, stream: resolved.metadata.video.streams } } };
    assert.equal(await prepare(raw, async (url, init) => hostedResponse(url, init) || Response.json(documented)), hosted);
    await assert.rejects(prepare(raw, async () => new Response(null, { headers: { 'Content-Type': 'application/octet-stream' } })), /HLS/);
    await assert.rejects(prepare(raw, async () => new Response(null, { headers: { 'Content-Type': 'video/mp4' } })), /HLS/);
    await assert.rejects(prepare(raw, async () => new Response(null, { headers: { 'Content-Type': HLS_CONTENT_TYPE } })), /cross-origin/);
    await assert.rejects(prepare('https://cdn.example/video.mp4', async () => { throw new Error('Must reject MP4 before requesting it'); }), /HLS/);
    await assert.rejects(prepare(raw, async () => new Response(null, { status: 404 })), /deploy the media endpoint/);
    await assert.rejects(prepare(raw, async (_url, init) => mediaResponse(init?.method, '<html>Not a playlist</html>')), /playable HLS/);
    await assert.rejects(prepare(raw, async (_url, init) => mediaResponse(init?.method, 'x'.repeat(65537))), /64 KiB/);
    for (const metadata of [
      { _status: 'RESOLVED', content_type: 'text/html' },
      { ...resolved.metadata, video: { duration_s: 30, streams: [] } },
      { ...resolved.metadata, video: { duration_s: 30, streams: [{ width_px: 0, height_px: 1920 }] } },
      { _status: 'PENDING' }, { _status: 'ERROR' },
    ]) {
      await assert.rejects(prepare(raw, async (url, init) => hostedResponse(url, init) || Response.json({ metadata })), /no cast was sent/);
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
  const env = { NEYNAR_API_KEY: process.env.NEYNAR_API_KEY, NEYNAR_SIGNER_UUID: process.env.NEYNAR_SIGNER_UUID, FARCASTER_MEDIA_PROXY_BASE_URL: process.env.FARCASTER_MEDIA_PROXY_BASE_URL };
  process.env.NEYNAR_API_KEY = 'test-key';
  process.env.NEYNAR_SIGNER_UUID = 'test-signer';
  process.env.FARCASTER_MEDIA_PROXY_BASE_URL = '';
  const queue = [{ id: 'video', text: 'Population, 2000-2024.', posted: false, scheduleDate: '2020-01-01', scheduleTime: '09:00', video: path.relative(ROOT, video), publicVideoUrl: raw }];
  const contents = JSON.stringify(queue);
  try {
    fs.writeFileSync(file, contents);
    const requests: RequestInit[] = [];
    globalThis.fetch = async (_url, init = {}) => { requests.push(init); return new Response(null, { headers: { 'Content-Type': 'application/octet-stream' } }); };
    await assert.rejects(runPlatform('farcaster', false, file, { decode }), /HLS/);
    assert.equal(fs.readFileSync(file, 'utf8'), contents);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, 'HEAD');
    globalThis.fetch = async (url, init = {}) => {
      const media = hostedResponse(url, init);
      if (media) return media;
      if (String(url).includes('/embed/crawl/')) return Response.json(resolved);
      if (String(url).startsWith('https://api.farcaster.xyz/')) {
        const [saved] = JSON.parse(fs.readFileSync(file, 'utf8'));
        assert.equal(saved.state, 'submitted');
        assert.equal(saved.posted, false);
        assert.equal(saved.platformPostId, `0x${'1'.repeat(40)}`);
        assert.equal(new Headers(init.headers).get('x-api-key'), null);
        return Response.json({ result: { casts: [{ hash: saved.platformPostId, author: { username: 'vedangvatsa' }, text: queue[0].text, embeds: { videos: [{ url: hosted }], unknowns: [] } }] } });
      }
      assert.equal(init.method, 'POST');
      assert.equal(new Headers(init.headers).get('x-api-key'), 'test-key');
      assert.equal(JSON.parse(String(init.body)).signer_uuid, 'test-signer');
      assert.deepEqual(JSON.parse(String(init.body)).embeds, [{ url: hosted }]);
      return Response.json({ cast: { hash: `0x${'1'.repeat(40)}`, author: { username: 'vedangvatsa' } } });
    };
    await assert.rejects(runPlatform('farcaster', false, file, { decode: async () => { throw new Error('decode failed'); } }), /decode failed/);
    assert.equal(fs.readFileSync(file, 'utf8'), contents);
    await runPlatform('farcaster', false, file, { decode });
    const [receipt] = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(receipt.posted, true);
    assert.equal(receipt.state, 'sent');
    assert.equal(receipt.videoEmbedUrl, hosted);
    assert.equal(receipt.postUrl, 'https://farcaster.xyz/vedangvatsa/0x11111111');
    assert.ok(receipt.mediaValidatedAt);
    assert.ok(receipt.clientEmbedVerifiedAt);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('HLS validation rejects missing segments, unsafe references, and malformed ranges', () => {
  assert.equal(parseHlsMedia(playlist, hosted).bytes, bytes.length);
  for (const invalid of [
    playlist.replace('#EXT-X-ENDLIST', ''),
    playlist.replace('100@16', '100@17'),
    playlist.replace('100@16', '100@0'),
    playlist.replace('100@16', '99999999999@16'),
    playlist.replaceAll('01-population-2000-2024.mp4', '../private.mp4'),
    playlist.replace('#EXTINF:30,', '#EXTINF:NaN,'),
    playlist.replace('#EXT-X-MAP:', '#EXT-X-KEY:METHOD=AES-128,URI="key"\n#EXT-X-MAP:'),
  ]) assert.throws(() => parseHlsMedia(invalid, hosted), /HLS|fMP4/);
});

test('automated media URLs are pinned to the checked-out commit without overriding an explicit revision', async () => {
  const prior = { NEYNAR_API_KEY: process.env.NEYNAR_API_KEY, FARCASTER_MEDIA_REVISION: process.env.FARCASTER_MEDIA_REVISION };
  process.env.NEYNAR_API_KEY = 'test-key';
  process.env.FARCASTER_MEDIA_REVISION = 'a'.repeat(40);
  try {
    for (const [source, revision] of [[raw, 'a'.repeat(40)], [raw.replace('/main/', `/${'b'.repeat(40)}/`), 'b'.repeat(40)]]) {
      await assert.rejects(prepare(source, async url => {
        assert.equal(String(url), hosted.replace('/scripts/', `/${revision}/scripts/`));
        return new Response(null, { status: 404 });
      }), /deploy the media endpoint/);
    }
    process.env.FARCASTER_MEDIA_REVISION = 'not-a-commit';
    await assert.rejects(prepare(raw, async () => { throw new Error('Must not fetch'); }), /full commit SHA/);
  } finally {
    for (const [key, value] of Object.entries(prior)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('every media range is fetched and must match the approved package', async () => {
  const hash = (value: Buffer | string) => createHash('sha256').update(value).digest('hex');
  const expected = { source: 'source.mp4', sourceSha256: 'a'.repeat(64), playlist: 'video.m3u8', media: 'video.mp4',
    playlistSha256: hash(playlist), mediaSha256: hash(bytes), durationSeconds: 30, width: 1080, height: 1920, streamsUnchanged: true };
  const ranges: string[] = [];
  const request: typeof fetch = async (url, init) => {
    const range = new Headers(init?.headers).get('range');
    if (range) ranges.push(range);
    return hostedResponse(url, init)!;
  };
  assert.deepEqual((await fetchHlsMedia(hosted, playlist, request, expected)).media, bytes);
  assert.deepEqual(ranges, ['bytes=0-15', 'bytes=16-115']);
  await assert.rejects(fetchHlsMedia(hosted, playlist, request, { ...expected, playlistSha256: '0'.repeat(64) }), /playlist differs/);
  await assert.rejects(fetchHlsMedia(hosted, playlist, request, { ...expected, mediaSha256: '0'.repeat(64) }), /media differs/);
  for (const failure of ['missing', 'ignored-range', 'wrong-range', 'cors', 'truncated']) {
    await assert.rejects(fetchHlsMedia(hosted, playlist, async (url, init) => {
      const good = hostedResponse(url, init)!;
      if (init?.method === 'HEAD') return good;
      if (failure === 'missing') return new Response(null, { status: 404 });
      const headers = new Headers(good.headers);
      if (failure === 'wrong-range') headers.set('Content-Range', 'bytes 0-1/2');
      if (failure === 'cors') headers.delete('Access-Control-Allow-Origin');
      return new Response(failure === 'truncated' ? new Uint8Array() : good.body, { headers, status: failure === 'ignored-range' ? 200 : 206 });
    }), /range|cross-origin/);
  }
});

test('full decoding requires compatible codecs, decoded frames, and complete duration', async () => {
  const probe = { streams: [
    { codec_type: 'video', codec_name: 'h264', pix_fmt: 'yuv420p', width: 1080, height: 1920 },
    { codec_type: 'audio', codec_name: 'aac' },
  ] };
  const progress = 'frame=900\nout_time_us=30000000\nprogress=end\n';
  const programs: string[] = [];
  const run: MediaCommand = (program, args, input) => {
    programs.push(program);
    assert.deepEqual(input, bytes);
    assert.ok(args.includes('pipe:0'));
    if (program === 'ffmpeg') assert.ok(args.includes('-xerror'));
    return program === 'ffprobe' ? JSON.stringify(probe) : progress;
  };
  assert.deepEqual(await decodeHlsVideo(bytes, 30, run), decoded);
  assert.deepEqual(programs, ['ffprobe', 'ffmpeg']);
  for (const output of ['frame=0\nout_time_us=30000000\nprogress=end', 'frame=300\nout_time_us=10000000\nprogress=end', 'frame=900\nout_time_us=30000000']) {
    await assert.rejects(decodeHlsVideo(bytes, 30, program => program === 'ffprobe' ? JSON.stringify(probe) : output), /complete HLS video/);
  }
  for (const codec of ['hevc', 'vp9']) {
    await assert.rejects(decodeHlsVideo(bytes, 30, () => JSON.stringify({ streams: [{ ...probe.streams[0], codec_name: codec }] })), /browser-compatible/);
  }
  await assert.rejects(decodeHlsVideo(bytes, 30, program => { if (program === 'ffprobe') return JSON.stringify(probe); throw new Error('Corrupt frame'); }), /Corrupt frame/);
});

test('client verification waits for indexing and rejects unknown or different video embeds', async () => {
  const hash = `0x${'2'.repeat(40)}`;
  const castUrl = 'https://farcaster.xyz/vedangvatsa/0x22222222';
  const cast = { hash, author: { username: 'vedangvatsa' }, text: 'Video.', embeds: { videos: [{ url: hosted }], unknowns: [] } };
  let reads = 0;
  await verifyFarcasterCast(hash, castUrl, hosted, cast.text, async (url, init) => {
    assert.ok(String(url).startsWith('https://api.farcaster.xyz/'));
    assert.equal(new Headers(init?.headers).get('x-api-key'), null);
    return Response.json({ result: { casts: ++reads === 1 ? [] : [cast] } });
  }, async () => {});
  assert.equal(reads, 2);
  for (const badUrl of ['https://other.example/vedangvatsa/0x22222222', 'https://farcaster.xyz/vedangvatsa/0x']) {
    await assert.rejects(verifyFarcasterCast(hash, badUrl, hosted, cast.text, async () => { throw new Error('Must not fetch'); }), /Invalid Farcaster publication URL/);
  }
  for (const invalid of [
    { ...cast, embeds: { videos: [], unknowns: [{ source: hosted }] } },
    { ...cast, embeds: { videos: [{ url: 'https://other.example/video.m3u8' }] } },
    { ...cast, text: 'Wrong caption.' },
    { ...cast, author: { username: 'other' } },
  ]) await assert.rejects(verifyFarcasterCast(hash, castUrl, hosted, cast.text, async () => Response.json({ result: { casts: [invalid] } }), async () => {}), /unverified/);
});

test('an accepted but unverified cast keeps its receipt and blocks any second publication', async () => {
  const dir = fs.mkdtempSync(path.join(ROOT, 'tests/.farcaster-video-'));
  const file = path.join(dir, 'queue.json');
  const video = path.join(dir, 'sample.mp4');
  fs.writeFileSync(video, bytes);
  const oldFetch = globalThis.fetch;
  const env = { NEYNAR_API_KEY: process.env.NEYNAR_API_KEY, NEYNAR_SIGNER_UUID: process.env.NEYNAR_SIGNER_UUID };
  process.env.NEYNAR_API_KEY = 'test-key'; process.env.NEYNAR_SIGNER_UUID = 'test-signer';
  const hash = `0x${'3'.repeat(40)}`;
  let publications = 0;
  fs.writeFileSync(file, JSON.stringify([{ id: 'unverified', text: 'Video.', posted: false, scheduleDate: '2020-01-01', scheduleTime: '09:00', video: path.relative(ROOT, video), publicVideoUrl: raw }]));
  try {
    globalThis.fetch = async (url, init = {}) => {
      const media = hostedResponse(url, init);
      if (media) return media;
      if (String(url).includes('/embed/crawl/')) return Response.json(resolved);
      if (String(url).startsWith('https://api.farcaster.xyz/')) return Response.json({ result: { casts: [{ hash, author: { username: 'vedangvatsa' }, text: 'Video.', embeds: { videos: [], unknowns: [{ source: hosted }] } }] } });
      assert.equal(init.method, 'POST');
      publications++;
      return Response.json({ cast: { hash, author: { username: 'vedangvatsa' } } });
    };
    const checks = { decode, confirm: (h: string, link: string | undefined, media: string, text: string) => verifyFarcasterCast(h, link, media, text, fetch, async () => {}) };
    await assert.rejects(runPlatform('farcaster', false, file, checks), /unverified/);
    const [receipt] = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(receipt.posted, false);
    assert.equal(receipt.state, 'uncertain');
    assert.equal(receipt.platformPostId, hash);
    assert.ok(receipt.publicationAcceptedAt);
    await assert.rejects(runPlatform('farcaster', false, file, checks), /reconcile/);
    assert.equal(publications, 1);
  } finally {
    globalThis.fetch = oldFetch;
    for (const [name, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
