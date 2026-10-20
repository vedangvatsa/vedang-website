import test from 'node:test';
import assert from 'node:assert/strict';
import { farcasterVideoUrl, serveSocialVideo, socialVideoSource, HLS_CONTENT_TYPE } from '../src/lib/social-video';

const asset = 'scripts/viz-batch2-assets/no-attribution/74-cotton-lint-2000-2023.mp4';
const url = `https://veda.ng/api/social-video/${asset}`;
const hls = 'scripts/viz-batch2-assets/no-attribution/hls/74-cotton-lint-2000-2023.m3u8';

test('Farcaster gets an HLS embed and pinned playlists keep their relative media pinned', () => {
  assert.equal(farcasterVideoUrl(socialVideoSource(asset)), `https://veda.ng/api/social-video/${hls}`);
  const sha = 'a'.repeat(40);
  const pinned = farcasterVideoUrl(socialVideoSource(asset, sha));
  assert.equal(pinned, `https://veda.ng/api/social-video/${sha}/${hls}`);
  assert.equal(new URL('74-cotton-lint-2000-2023.mp4', pinned).pathname, `/api/social-video/${sha}/${hls.replace('.m3u8', '.mp4')}`);
  assert.equal(farcasterVideoUrl(socialVideoSource(hls)), `https://veda.ng/api/social-video/${hls}`);
  assert.equal(farcasterVideoUrl('https://media.example/clip.m3u8?signature=123'), 'https://media.example/clip.m3u8?signature=123');
  assert.throws(() => farcasterVideoUrl('http://example.com/video.mp4'), /HTTPS/);
  assert.throws(() => farcasterVideoUrl('https://raw.githubusercontent.com/other/repo/main/file.mp4'), /Unsupported/);
  assert.throws(() => farcasterVideoUrl(socialVideoSource(asset), 'http://example.com/proxy'), /HTTPS/);
});

test('HLS playlists use their own MIME type and keep relative byte-range media references', async () => {
  const sha = 'b'.repeat(40);
  const text = '#EXTM3U\n#EXT-X-MAP:URI="74-cotton-lint-2000-2023.mp4",BYTERANGE="16@0"\n#EXTINF:30,\n#EXT-X-BYTERANGE:100@16\n74-cotton-lint-2000-2023.mp4\n#EXT-X-ENDLIST\n';
  const response = await serveSocialVideo(new Request(`https://veda.ng/api/social-video/${sha}/${hls}`), [sha, ...hls.split('/')], async input => {
    assert.equal(input, socialVideoSource(hls, sha));
    return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), HLS_CONTENT_TYPE);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  assert.equal(await response.text(), text);
  const invalid = await serveSocialVideo(new Request(`https://veda.ng/api/social-video/${hls}?ref=${sha}`), hls.split('/'), async () => { throw new Error('Must not fetch a mixed-revision playlist'); });
  assert.equal(invalid.status, 404);
  const html = await serveSocialVideo(new Request(`https://veda.ng/api/social-video/${hls}`), hls.split('/'), async () => new Response('<html>Error</html>', { headers: { 'Content-Type': 'text/html' } }));
  assert.equal(html.status, 502);
});

test('the media endpoint cannot read arbitrary repository paths or origins', async () => {
  let fetched = false;
  const request: typeof fetch = async () => { fetched = true; throw new Error('Must not fetch'); };
  for (const path of ['.env.local', 'scripts/viz-assets/videos/../../secret.mp4', 'https://internal/video.mp4', 'scripts/viz-assets/videos/file.mp4/extra']) {
    const response = await serveSocialVideo(new Request(url), path.split('/'), request);
    assert.equal(response.status, 404);
  }
  assert.equal((await serveSocialVideo(new Request(`${url}?ref=../../private`), asset.split('/'), request)).status, 404);
  assert.equal(fetched, false);
});

test('full and ranged videos keep their bytes while receiving video MIME and CORS headers', async () => {
  const bytes = new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112]);
  for (const ranged of [false, true]) {
    const request: typeof fetch = async (input, init) => {
      assert.equal(input, socialVideoSource(asset));
      assert.equal(init?.redirect, 'manual');
      const incoming = new Headers(init?.headers);
      assert.equal(incoming.get('authorization'), null);
      assert.equal(incoming.get('cookie'), null);
      assert.equal(incoming.get('range'), ranged ? 'bytes=0-7' : null);
      assert.equal(incoming.get('accept-encoding'), 'identity');
      return new Response(bytes, { status: ranged ? 206 : 200, headers: {
        'Content-Type': 'application/octet-stream', 'Content-Length': '8',
        ...(ranged ? { 'Content-Range': 'bytes 0-7/100' } : {}),
      } });
    };
    const response = await serveSocialVideo(new Request(url, { headers: {
      Authorization: 'not-forwarded', Cookie: 'not-forwarded', ...(ranged ? { Range: 'bytes=0-7' } : {}),
    } }), asset.split('/'), request);
    assert.equal(response.status, ranged ? 206 : 200);
    assert.equal(response.headers.get('content-type'), 'video/mp4');
    assert.equal(response.headers.get('content-disposition'), 'inline');
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.equal(response.headers.get('accept-ranges'), 'bytes');
    assert.equal(response.headers.get('content-range'), ranged ? 'bytes 0-7/100' : null);
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
  }
});

test('HEAD keeps video metadata without a response body', async () => {
  const response = await serveSocialVideo(new Request(url, { method: 'HEAD' }), asset.split('/'), async (_url, init) => {
    assert.equal(init?.method, 'HEAD');
    return new Response(null, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': '3975444' } });
  });
  assert.equal(response.headers.get('content-type'), 'video/mp4');
  assert.equal(response.headers.get('content-length'), '3975444');
  assert.equal(await response.text(), '');
});

test('origin failures and non-media responses cannot become cacheable fake MP4s', async () => {
  for (const upstream of [new Response('not found', { status: 404 }), new Response('error', { status: 503 }), new Response(null, { status: 302, headers: { Location: 'https://other.example/video.mp4' } }), new Response('<html>error</html>', { headers: { 'Content-Type': 'text/html' } })]) {
    const response = await serveSocialVideo(new Request(url), asset.split('/'), async () => upstream);
    assert.ok([404, 502].includes(response.status));
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.notEqual(response.headers.get('content-type'), 'video/mp4');
  }
  const unavailable = await serveSocialVideo(new Request(url), asset.split('/'), async () => { throw new Error('timeout'); });
  assert.equal(unavailable.status, 502);
});

test('invalid or unsatisfiable ranges fail without serving an entire video', async () => {
  const invalid = await serveSocialVideo(new Request(url, { headers: { Range: 'bytes=0-2,6-8' } }), asset.split('/'), async () => { throw new Error('Must not fetch'); });
  assert.equal(invalid.status, 400);
  const outside = await serveSocialVideo(new Request(url, { headers: { Range: 'bytes=999-' } }), asset.split('/'), async () => new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */100' } }));
  assert.equal(outside.status, 416);
  assert.equal(outside.headers.get('content-range'), 'bytes */100');
});
