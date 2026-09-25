import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, selectDue, type VizPost, readQueue, publicVideoUrl } from './viz-publishing.js';
import { buildInput, applyBufferStatus, runPlatform, PLATFORMS, chooseChannel } from './buffer-viz-scheduled-executor.js';
import { runPlatform as runNative } from './native-viz-scheduled-executor.js';
import { captionLength, validateCaption, validateConciseBufferCaption, conciseBufferCaption, LIMITS } from './viz-captions.mjs';
import { needsBufferWork } from './viz-queue-time.mjs';
import { sourceCredit } from './viz-source-credit.mjs';
import { configuredDirectPlatforms, DIRECT_PLATFORMS } from './viz-platforms.mjs';

const entry = (id: string, time = '09:00'): VizPost => ({ id, posted: false, scheduleDate: '2026-09-25', scheduleTime: time, title: 'Population', text: 'Population, 2000-2024.', description: 'Population, 2000-2024.' });

test('catch-up gate waits for the slot, recovers a missed trigger and skips completed slots', () => {
  const posts = [entry('one'), entry('two', '14:00'), entry('three', '20:00')];
  assert.equal(needsBufferWork(posts, new Date('2026-09-25T03:29:00Z')), false);
  assert.equal(needsBufferWork(posts, new Date('2026-09-25T05:00:00Z')), true);
  posts[0].posted = true;
  posts[0].attemptedSlot = '2026-09-25T09:00';
  assert.equal(needsBufferWork(posts, new Date('2026-09-25T05:10:00Z')), false);
  assert.equal(needsBufferWork(posts, new Date('2026-09-25T08:30:00Z')), true);
});

test('catch-up gate reconciles submitted posts without creating a second post', () => {
  const posts = [{ ...entry('one'), state: 'submitted' as const, bufferPostId: 'remote' }];
  assert.equal(needsBufferWork(posts, new Date('2026-09-25T05:00:00Z')), true);
  assert.throws(() => selectDue(posts, new Date('2026-09-25T05:00:00Z')), /reconcile/);
});

test('all Buffer payloads publish now without dueAt or a Buffer queue mode', () => {
  for (const p of PLATFORMS) {
    const input = buildInput(p.service, entry('one'), 'channel', 'https://cdn.example/video.mp4');
    assert.equal(input.mode, 'shareNow');
    assert.equal(input.schedulingType, 'automatic');
    assert.equal('dueAt' in input, false);
    assert.equal(input.assets[0].video.url, 'https://cdn.example/video.mp4');
  }
});

test('IST boundary and repeated runs permit one publication per campaign slot', () => {
  const posts = [entry('one'), entry('two', '14:00'), entry('three', '20:00')];
  assert.equal(selectDue(posts, new Date('2026-09-25T03:29:59Z')).post, undefined);
  const due = selectDue(posts, new Date('2026-09-25T03:30:00Z'));
  assert.equal(due.post?.id, 'one');
  posts[0].posted = true;
  posts[0].attemptedSlot = due.slot;
  assert.equal(selectDue(posts, new Date('2026-09-25T03:31:00Z')).post, undefined);
  assert.equal(selectDue(posts, new Date('2026-09-25T08:30:00Z')).post?.id, 'two');
});

test('Buffer captions can link directly to hosted notes when the website deployment is unavailable', () => {
  const old = process.env.VIZ_NOTES_BASE_URL;
  process.env.VIZ_NOTES_BASE_URL = 'https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/public';
  const p = { ...entry('one'), notesUrl: 'https://veda.ng/viz-notes/01.txt', description: 'Population. Credits https://veda.ng/viz-notes/01.txt' };
  try {
    const input = buildInput('youtube', p, 'channel', 'https://cdn.example/video.mp4');
    assert.ok(input.text.includes('https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/public/viz-notes/01.txt'));
    assert.ok(!input.text.includes('https://veda.ng/viz-notes/'));
  } finally {
    if (old) process.env.VIZ_NOTES_BASE_URL = old; else delete process.env.VIZ_NOTES_BASE_URL;
  }
});

test('late runs take oldest due entry but do not drain backlog; backlog continues after final date', () => {
  const posts = [entry('one'), entry('two', '14:00'), entry('three', '20:00')];
  const due = selectDue(posts, new Date('2026-09-26T08:30:00Z'));
  assert.equal(due.post?.id, 'one');
  posts[0].posted = true;
  posts[0].attemptedSlot = due.slot;
  assert.equal(selectDue(posts, new Date('2026-09-26T08:31:00Z')).post, undefined);
  assert.equal(selectDue(posts, new Date('2026-09-26T14:30:00Z')).post?.id, 'two');
});

test('ambiguous or failed publication blocks retries and duplicate next posts', () => {
  for (const state of ['publishing', 'submitted', 'uncertain', 'failed'] as const) {
    const posts = [{ ...entry('one'), state }, entry('two', '14:00')];
    assert.throws(() => selectDue(posts, new Date('2026-09-26T08:30:00Z')), /reconcile/);
  }
});

test('Buffer acceptance is not publication; only sent sets posted', () => {
  const p = entry('one');
  const remote = { id: 'remote', status: 'sending', shareMode: 'shareNow', schedulingType: 'automatic' };
  applyBufferStatus(p, remote);
  assert.equal(p.posted, false);
  assert.equal(p.state, 'submitted');
  applyBufferStatus(p, { ...remote, status: 'sent', sentAt: '2026-09-25T03:30:20Z', externalLink: 'https://example.com/post' });
  assert.equal(p.posted, true);
  assert.equal(p.postedAt, '2026-09-25T03:30:20Z');
  assert.equal(p.postUrl, 'https://example.com/post');
});

test('Buffer rejects reminder/scheduled fallback and failure states', () => {
  const p = entry('one');
  assert.throws(() => applyBufferStatus(p, { id: 'remote', status: 'scheduled', shareMode: 'customScheduled', schedulingType: 'automatic' }), /shareNow/);
  assert.equal(p.state, 'uncertain');
  assert.equal(p.bufferPostId, 'remote');
  const failed = entry('two');
  applyBufferStatus(failed, { id: 'remote2', status: 'error', shareMode: 'shareNow', schedulingType: 'automatic' });
  assert.equal(failed.posted, false);
  assert.equal(failed.state, 'failed');
});

test('channel selection rejects ambiguity and disconnected accounts', () => {
  const channel = { id: 'a', service: 'youtube', isDisconnected: false, isLocked: false };
  assert.throws(() => chooseChannel('youtube', 'UNSET_TEST_CHANNEL', [channel, { ...channel, id: 'b' }]), /Expected one/);
  assert.throws(() => chooseChannel('youtube', 'UNSET_TEST_CHANNEL', [{ ...channel, isDisconnected: true }]), /disconnected/);
});

test('all captions fit their platform; future Buffer captions follow the approved concise format', () => {
  const all = Object.keys(LIMITS).map(platform => ({ platform, posts: readQueue(path.join(ROOT, 'scripts', `viz-${platform}-posts.json`)) }));
  for (const { platform, posts } of all) {
    assert.equal(posts.length, 50);
    for (const p of posts) {
      const text = platform === 'youtube' ? p.description : p.text;
      validateCaption(platform, text);
      if (!p.posted) {
        assert.equal(p.captionStyle, 'concise-v1');
        validateConciseBufferCaption(text);
        assert.equal(p.sourceCredit, sourceCredit({ sourceOrganization: p.sourceOrganization }));
        assert.ok(text?.endsWith(`Data source: ${p.sourceCredit}.`));
      }
      const notes = new URL(String(p.notesUrl));
      assert.ok(fs.existsSync(path.join(ROOT, 'public', notes.pathname)));
    }
  }
});

test('direct publishing uses an explicit platform list and validates all selected names', () => {
  assert.deepEqual(configuredDirectPlatforms(''), []);
  assert.deepEqual(configuredDirectPlatforms('mastodon, bluesky, mastodon'), ['mastodon', 'bluesky']);
  assert.deepEqual(configuredDirectPlatforms('all'), DIRECT_PLATFORMS);
  assert.throws(() => configuredDirectPlatforms('youtube'), /Unknown direct platform/);
});

test('concise captions reproduce the requested sample without attribution or injected URLs', () => {
  const expected = 'How the largest populations changed.\n\n2000-2024. The totals count residents, regardless of citizenship. Data source: World Bank.';
  assert.equal(conciseBufferCaption('How the largest populations changed.', 'The totals count residents, regardless of citizenship.', 2000, 2024, 'World Bank'), expected);
  for (const service of ['youtube', 'instagram', 'tiktok']) {
    const p = { ...entry('one'), captionStyle: 'concise-v1', description: expected, text: expected, notesUrl: 'https://veda.ng/viz-notes/01.txt' };
    const input = buildInput(service, p, 'channel', 'https://cdn.example/video.mp4');
    assert.equal(input.text, expected);
  }
  assert.throws(() => validateConciseBufferCaption(expected + '\nMusic by Artist'), /extra notes/);
});

test('source labels use archived provider metadata rather than a World Bank default', () => {
  assert.equal(sourceCredit({ sourceOrganization: 'World Telecommunication/ICT Indicators Database, International Telecommunication Union (ITU)' }), 'ITU');
  assert.equal(sourceCredit({ sourceOrganization: 'ILO Modelled Estimates database, International Labour Organization (ILO)' }), 'ILO');
  assert.equal(sourceCredit({ sourceOrganization: 'Food and Agriculture Organization of the United Nations (FAO)' }), 'FAO');
  assert.equal(sourceCredit({ sourceOrganization: 'Country official statistics, National Statistical Organizations and/or Central Banks; National Accounts data files, OECD; Staff estimates, World Bank (WB)' }), 'OECD, World Bank, national statistics and central banks');
  assert.throws(() => sourceCredit({}), /no source organization/);
  assert.throws(() => sourceCredit({ sourceOrganization: 'Unknown provider' }), /Unrecognized provider/);
  const caption = conciseBufferCaption('Internet use.', 'People who used the internet.', 2000, 2024, 'ITU');
  assert.ok(caption.endsWith('Data source: ITU.'));
  assert.ok(!caption.includes('World Bank'));
  validateCaption('instagram', caption);
});

test('caption limits count URLs, graphemes and Farcaster UTF-8 bytes appropriately', () => {
  assert.equal(captionLength('x', 'https://example.com/' + 'a'.repeat(400)), 23);
  assert.equal(captionLength('bluesky', 'e\u0301'), 1);
  assert.equal(captionLength('farcaster', 'é'), 2);
  assert.throws(() => validateCaption('x', 'a'.repeat(281)), /281\/280/);
  assert.throws(() => validateCaption('linkedin', 'Every value cross-checked, zero mismatches.'), /banned/);
});

test('Buffer and native dry-runs make no network requests or queue writes', async () => {
  const files = Object.keys(LIMITS).map(p => path.join(ROOT, 'scripts', `viz-${p}-posts.json`));
  const hashes = () => files.map(f => createHash('sha256').update(fs.readFileSync(f)).digest('hex'));
  const before = hashes();
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Unexpected network request'); };
  try {
    for (const p of PLATFORMS) await runPlatform(p, [], true);
    for (const p of ['linkedin', 'x', 'bluesky', 'facebook', 'threads', 'tumblr', 'mastodon', 'farcaster']) await runNative(p, true);
  } finally { globalThis.fetch = original; }
  assert.deepEqual(hashes(), before);
});

test('public media configuration rejects non-HTTPS and traversal', () => {
  assert.throws(() => publicVideoUrl({ ...entry('one'), publicVideoUrl: 'http://example.com/video.mp4' }), /HTTPS/);
  const old = process.env.VIZ_MEDIA_BASE_URL;
  process.env.VIZ_MEDIA_BASE_URL = 'https://cdn.example';
  try { assert.throws(() => publicVideoUrl({ ...entry('one'), video: '../outside.mp4' }), /Invalid video path/); }
  finally { if (old) process.env.VIZ_MEDIA_BASE_URL = old; else delete process.env.VIZ_MEDIA_BASE_URL; }
});

test('Mastodon waits for processed media and uses multipart video + idempotent status', async () => {
  process.env.MASTODON_INSTANCE = 'https://mastodon.example';
  process.env.MASTODON_ACCESS_TOKEN = 'test-token';
  const { uploadMedia, postStatus } = await import('./mastodon-scheduled-executor.js');
  const original = globalThis.fetch;
  const requests: { url: string; init: RequestInit }[] = [];
  globalThis.fetch = async (url, init: RequestInit = {}) => {
    requests.push({ url: String(url), init });
    if (requests.length === 1) {
      assert.ok(init.body instanceof FormData);
      assert.equal((init.body.get('file') as Blob).type, 'video/mp4');
      return Response.json({ id: 'media', url: null }, { status: 202 });
    }
    if (requests.length === 2) return Response.json({ id: 'media', url: 'https://cdn.example/video.mp4' });
    assert.deepEqual(JSON.parse(String(init.body)).media_ids, ['media']);
    assert.equal((init.headers as Record<string, string>)['Idempotency-Key'], 'viz-test');
    return Response.json({ id: 'status' });
  };
  try {
    const media = await uploadMedia(path.join(ROOT, 'scripts/viz-assets/videos/01-population-2000-2024.mp4'), 'Population');
    assert.equal(await postStatus('Population', media, 'viz-test'), 'status');
    assert.equal(requests.length, 3);
    assert.ok(requests[1].url.endsWith('/api/v1/media/media'));
  } finally { globalThis.fetch = original; }
});

test('Threads publishes a VIDEO container only after FINISHED', async () => {
  process.env.THREADS_USER_ID = 'test-user';
  process.env.THREADS_ACCESS_TOKEN = 'test-token';
  const { postViaGraphAPI } = await import('./threads-scheduled-executor.js');
  const original = globalThis.fetch;
  let step = 0;
  globalThis.fetch = async (url, init: RequestInit = {}) => {
    step++;
    const parsed = new URL(String(url));
    if (step === 1) {
      assert.equal(parsed.searchParams.get('media_type'), 'VIDEO');
      assert.equal(parsed.searchParams.get('video_url'), 'https://cdn.example/test.mp4?version=1');
      return Response.json({ id: 'container' });
    }
    if (step === 2) return Response.json({ status: 'FINISHED' });
    assert.equal(parsed.searchParams.get('creation_id'), 'container');
    assert.equal(init.method, 'POST');
    return Response.json({ id: 'published' });
  };
  try { assert.equal(await postViaGraphAPI('Test', 'https://cdn.example/test.mp4?version=1'), 'published'); }
  finally { globalThis.fetch = original; }
  assert.equal(step, 3);
});

test('Tumblr sends native NPF video multipart and preserves a 64-bit string ID', async () => {
  for (const key of ['TUMBLR_CONSUMER_KEY', 'TUMBLR_CONSUMER_SECRET', 'TUMBLR_ACCESS_TOKEN', 'TUMBLR_ACCESS_SECRET', 'TUMBLR_BLOG_NAME']) process.env[key] = 'test-value';
  const { publishVideo } = await import('./tumblr-scheduled-executor.js');
  const original = globalThis.fetch;
  globalThis.fetch = async (_url, init: RequestInit = {}) => {
    assert.ok(init.body instanceof Uint8Array);
    const multipart = Buffer.from(init.body).toString('latin1');
    assert.ok(multipart.includes('name="json"\r\nContent-Type: application/json'));
    assert.ok(!multipart.includes('name="json"; filename='));
    const data = JSON.parse(multipart.match(/name="json"\r\nContent-Type: application\/json\r\n\r\n([^\r]+)\r\n/)![1]);
    assert.equal(data.state, 'published');
    assert.equal(data.content[0].type, 'video');
    assert.equal(data.content[0].media.identifier, 'video');
    assert.ok(multipart.includes('name="video"; filename="01-population-2000-2024.mp4"'));
    assert.ok(multipart.includes('Content-Type: video/mp4'));
    return Response.json({ response: { id: '90071992547409931' } }, { status: 201 });
  };
  try { assert.equal(await publishVideo(path.join(ROOT, 'scripts/viz-assets/videos/01-population-2000-2024.mp4'), 'Test', ['data']), '90071992547409931'); }
  finally { globalThis.fetch = original; }
});

test('Farcaster includes the video embed and never downgrades to text-only in the viz adapter', async () => {
  process.env.NEYNAR_API_KEY = 'test-key';
  process.env.NEYNAR_SIGNER_UUID = 'test-signer';
  const { publish } = await import('./native-viz-scheduled-executor.js');
  const original = globalThis.fetch;
  globalThis.fetch = async (_url, init: RequestInit = {}) => {
    assert.deepEqual(JSON.parse(String(init.body)).embeds, [{ url: 'https://cdn.example/video.mp4' }]);
    return Response.json({ cast: { hash: '0x123' } });
  };
  try {
    assert.equal(await publish('farcaster', entry('one'), '/unused.mp4', 'https://cdn.example/video.mp4'), '0x123');
    await assert.rejects(publish('farcaster', entry('two'), '/unused.mp4'), /public video/);
  } finally { globalThis.fetch = original; }
});

test('Facebook retries early status visibility errors without uploading the video twice', async () => {
  const { uploadVideo } = await import('./facebook-scheduled-executor.js');
  const { Response: FetchResponse } = await import('node-fetch');
  let uploads = 0;
  let reads = 0;
  const request = async (_url: any, init: any = {}) => {
    if (init.method === 'POST') {
      uploads++;
      return new FetchResponse(JSON.stringify({ id: 'fb-video' }), { status: 200 });
    }
    reads++;
    if (reads === 1) return new FetchResponse(JSON.stringify({ error: { code: 100 } }), { status: 400 });
    return new FetchResponse(JSON.stringify({ status: { video_status: 'ready', publishing_phase: { publish_status: 'published' } } }), { status: 200 });
  };
  const id = await uploadVideo(path.join(ROOT, 'scripts/viz-assets/videos/01-population-2000-2024.mp4'), 'Population', request, async () => {});
  assert.equal(id, 'fb-video');
  assert.equal(uploads, 1);
  assert.equal(reads, 2);
});
