import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { ROOT } from './viz-publishing.js';
import { farcasterPlaylistAsset } from '../src/lib/social-video.js';

export type HlsReceipt = {
  source: string; sourceSha256: string; playlist: string; playlistSha256: string;
  media: string; mediaSha256: string; durationSeconds: number; width: number; height: number;
  streamsUnchanged: boolean;
};
type ByteRange = { offset: number; length: number };
export type DecodedVideo = { frames: number; durationSeconds: number; width: number; height: number };
export type VideoDecoder = (media: Buffer, durationSeconds: number) => Promise<DecodedVideo>;
export type MediaCommand = (program: string, args: string[], input: Buffer) => string;
const MAX_MEDIA_BYTES = 128 * 1024 * 1024;

export function hlsReceipt(source: string, sourceSha256?: string): HlsReceipt {
  const playlist = farcasterPlaylistAsset(source);
  const { assets } = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/farcaster-hls-assets.json'), 'utf8'));
  const receipt = (assets as HlsReceipt[]).find(asset => asset.source === source);
  if (!receipt || receipt.playlist !== playlist || receipt.media !== playlist.replace(/\.m3u8$/, '.mp4') ||
      receipt.streamsUnchanged !== true || (sourceSha256 && receipt.sourceSha256 !== sourceSha256) ||
      !Number.isFinite(receipt.durationSeconds) || receipt.durationSeconds <= 0 || receipt.durationSeconds > 600 ||
      !Number.isSafeInteger(receipt.width) || receipt.width <= 0 || !Number.isSafeInteger(receipt.height) || receipt.height <= 0) {
    throw new Error(`HLS package is missing or stale for ${source}; package it before publishing`);
  }
  for (const digest of [receipt.sourceSha256, receipt.playlistSha256, receipt.mediaSha256]) {
    if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error('Invalid HLS package checksum');
  }
  return receipt;
}

export function requireMediaCors(response: Response) {
  if (!['*', 'https://farcaster.xyz'].includes(response.headers.get('access-control-allow-origin') || '')) {
    throw new Error('Video delivery does not allow Farcaster cross-origin playback');
  }
}

function parseRange(value: string): ByteRange {
  const match = /^(\d+)@(\d+)$/.exec(value);
  const length = Number(match?.[1]);
  const offset = Number(match?.[2]);
  if (!match || !Number.isSafeInteger(length) || !Number.isSafeInteger(offset) || length <= 0 || offset < 0 || offset + length > MAX_MEDIA_BYTES) {
    throw new Error('Invalid or oversized HLS byte range');
  }
  return { offset, length };
}

export function parseHlsMedia(playlist: string, url: string) {
  const lines = playlist.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const map = lines.find(line => line.startsWith('#EXT-X-MAP:'))?.slice(11);
  const file = /(?:^|,)URI="([a-zA-Z0-9_-]+\.mp4)"(?:,|$)/.exec(map || '')?.[1];
  const init = /(?:^|,)BYTERANGE="([^"]+)"(?:,|$)/.exec(map || '')?.[1];
  const version = Number(lines.find(line => line.startsWith('#EXT-X-VERSION:'))?.slice(15));
  const target = Number(lines.find(line => line.startsWith('#EXT-X-TARGETDURATION:'))?.slice(22));
  if (lines[0] !== '#EXTM3U' || lines.at(-1) !== '#EXT-X-ENDLIST' || !lines.includes('#EXT-X-PLAYLIST-TYPE:VOD') ||
      !file || !init || !Number.isInteger(version) || version < 7 || !Number.isInteger(target) || target <= 0 ||
      lines.filter(line => line.startsWith('#EXT-X-MAP:')).length !== 1 || lines.filter(line => line === '#EXT-X-ENDLIST').length !== 1 ||
      lines.findIndex(line => line.startsWith('#EXT-X-MAP:')) > lines.findIndex(line => line.startsWith('#EXTINF:')) ||
      lines.some(line => /^#EXT-X-(?:KEY|SESSION-KEY|STREAM-INF|DISCONTINUITY)/.test(line))) {
    throw new Error('A complete, unencrypted single-file fMP4 HLS package is required');
  }
  const ranges = [parseRange(init)];
  if (ranges[0].offset !== 0 || ranges[0].length < 8) throw new Error('Invalid HLS initialization range');
  let durationSeconds = 0;
  let duration: number | undefined;
  let range: ByteRange | undefined;
  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      if (duration !== undefined) throw new Error('HLS segment is missing its media URI');
      duration = Number(line.slice(8).split(',')[0]);
      if (!Number.isFinite(duration) || duration <= 0 || Math.round(duration) > target) throw new Error('Invalid HLS segment duration');
    } else if (line.startsWith('#EXT-X-BYTERANGE:')) {
      if (range) throw new Error('Duplicate HLS segment range');
      range = parseRange(line.slice(17));
    } else if (!line.startsWith('#')) {
      if (line !== file || duration === undefined || !range) throw new Error('HLS media must use the packaged relative MP4 and byte ranges');
      const previous = ranges.at(-1)!;
      if (range.offset !== previous.offset + previous.length) throw new Error('HLS byte ranges are incomplete or overlap');
      ranges.push(range);
      durationSeconds += duration;
      duration = undefined;
      range = undefined;
    }
  }
  if (duration !== undefined || range || ranges.length < 2 || ranges.length > 128 || durationSeconds <= 0 || durationSeconds > 600) {
    throw new Error('HLS must contain a complete video of at most ten minutes');
  }
  const last = ranges.at(-1)!;
  return { mediaUrl: new URL(file, url).href, ranges, bytes: last.offset + last.length, durationSeconds };
}

async function readRange(response: Response, length: number): Promise<Buffer> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('HLS media range is empty');
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > length) { await reader.cancel(); throw new Error('HLS media returned more bytes than requested'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  if (size !== length) throw new Error('HLS media range is truncated');
  return Buffer.concat(chunks, size);
}

export async function fetchHlsMedia(url: string, playlist: string, request: typeof fetch = fetch, expected?: HlsReceipt) {
  if (expected && createHash('sha256').update(playlist).digest('hex') !== expected.playlistSha256) {
    throw new Error('Hosted HLS playlist differs from its approved package');
  }
  const info = parseHlsMedia(playlist, url);
  const origin = { Origin: 'https://farcaster.xyz', 'Accept-Encoding': 'identity' };
  const head = await request(info.mediaUrl, { method: 'HEAD', headers: origin, redirect: 'manual', signal: AbortSignal.timeout(30000) });
  if (head.status !== 200 || !/^video\/mp4(?:;|$)/i.test(head.headers.get('content-type') || '') ||
      Number(head.headers.get('content-length')) !== info.bytes || head.headers.get('accept-ranges') !== 'bytes') {
    await head.body?.cancel();
    throw new Error('HLS media is unavailable, incomplete, or does not support byte ranges');
  }
  requireMediaCors(head);
  const chunks: Buffer[] = [];
  for (const { offset, length } of info.ranges) {
    const response = await request(info.mediaUrl, {
      headers: { ...origin, Range: `bytes=${offset}-${offset + length - 1}` },
      redirect: 'manual', signal: AbortSignal.timeout(30000),
    });
    if (response.status !== 206 || response.headers.get('content-range') !== `bytes ${offset}-${offset + length - 1}/${info.bytes}` ||
        !/^video\/mp4(?:;|$)/i.test(response.headers.get('content-type') || '')) {
      await response.body?.cancel();
      throw new Error('HLS media did not return the requested byte range');
    }
    requireMediaCors(response);
    chunks.push(await readRange(response, length));
  }
  const media = Buffer.concat(chunks, info.bytes);
  if (media.subarray(4, 8).toString() !== 'ftyp') throw new Error('HLS media is not an MP4 container');
  if (expected && createHash('sha256').update(media).digest('hex') !== expected.mediaSha256) {
    throw new Error('Hosted HLS media differs from its approved package');
  }
  return { ...info, media };
}

const mediaCommand: MediaCommand = (program, args, input) => execFileSync(program, args, {
  input, encoding: 'utf8', timeout: 120000, maxBuffer: 1024 * 1024, killSignal: 'SIGKILL',
});

export async function decodeHlsVideo(media: Buffer, durationSeconds: number, run: MediaCommand = mediaCommand): Promise<DecodedVideo> {
  try {
    const probe = JSON.parse(run('ffprobe', ['-v', 'error', '-count_packets', '-protocol_whitelist', 'pipe', '-i', 'pipe:0',
      '-show_entries', 'stream=codec_type,codec_name,width,height,pix_fmt', '-of', 'json'], media));
    const video = probe.streams?.find((stream: { codec_type: string }) => stream.codec_type === 'video');
    const audio = probe.streams?.filter((stream: { codec_type: string }) => stream.codec_type === 'audio') || [];
    if (video?.codec_name !== 'h264' || !['yuv420p', 'yuvj420p'].includes(video.pix_fmt) ||
        !(video.width > 0 && video.height > 0) || audio.some((stream: { codec_name: string }) => stream.codec_name !== 'aac')) {
      throw new Error('Use browser-compatible H.264 8-bit video and AAC audio');
    }
    const progress = run('ffmpeg', ['-nostdin', '-v', 'error', '-xerror', '-err_detect', 'explode',
      '-protocol_whitelist', 'pipe', '-i', 'pipe:0', '-map', '0:v:0', '-map', '0:a:0?',
      '-progress', 'pipe:1', '-nostats', '-f', 'null', '-'], media);
    const frames = Number([...progress.matchAll(/^frame=(\d+)\s*$/gm)].at(-1)?.[1]);
    const duration = Number([...progress.matchAll(/^out_time_us=(\d+)\s*$/gm)].at(-1)?.[1]) / 1000000;
    if (!progress.includes('progress=end') || !(frames > 0 && duration > 0) || Math.abs(duration - durationSeconds) > 1) {
      throw new Error('The complete HLS video did not decode successfully');
    }
    return { frames, durationSeconds: duration, width: video.width, height: video.height };
  } catch (error) {
    const failure = error as Error & { stderr?: Buffer | string };
    throw new Error(`Farcaster playback validation failed: ${(failure.stderr?.toString().trim() || failure.message).slice(0,700)}`);
  }
}

export async function verifyFarcasterCast(hash: string, castUrl: string | undefined, videoUrl: string, text: string,
  request: typeof fetch = fetch, wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))): Promise<string> {
  if (!/^0x[a-f0-9]{40}$/i.test(hash) || !castUrl) throw new Error('A complete Farcaster publication receipt is required for verification');
  const link = new URL(castUrl);
  const parts = link.pathname.split('/').filter(Boolean);
  const [name, prefix] = parts;
  if (link.origin !== 'https://farcaster.xyz' || link.username || link.password || parts.length !== 2 ||
      !name || !prefix || prefix.length < 10 || !hash.startsWith(prefix)) {
    throw new Error('Invalid Farcaster publication URL');
  }
  const username = decodeURIComponent(name);
  const query = new URLSearchParams({ username, castHashPrefix: hash.slice(0,10), limit: '15' });
  let reason = 'cast not visible';
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await request(`https://api.farcaster.xyz/v2/user-thread-casts?${query}`, {
        cache: 'no-store', signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        await response.body?.cancel();
        reason = `client lookup returned HTTP ${response.status}`;
        if (response.status === 401 || response.status === 403) break;
      } else {
        const data = await response.json();
        const cast = data.result?.casts?.find((entry: { hash: string }) => entry.hash === hash);
        const video = cast?.embeds?.videos?.some((entry: { url?: string; sourceUrl?: string }) => entry.url === videoUrl || entry.sourceUrl === videoUrl);
        if (cast?.author?.username === username && cast.text === text && video && !cast.embeds?.unknowns?.length && data.result?.disallowed !== true) {
          return new Date().toISOString();
        }
        reason = cast ? 'client did not confirm the expected caption and video embed' : 'cast not visible';
      }
    } catch (error) { reason = (error as Error).message; }
    if (attempt < 5) await wait(5000);
  }
  throw new Error(`Farcaster cast ${hash} is unverified (${reason}); keep its receipt and hold the queue`);
}
