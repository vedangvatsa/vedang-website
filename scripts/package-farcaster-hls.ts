#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { farcasterPlaylistAsset } from '../src/lib/social-video.js';
import { ROOT, isMain, localVideo, readQueue } from './viz-publishing.js';

type Receipt = {
  source: string; sourceSha256: string; playlist: string; playlistSha256: string;
  media: string; mediaSha256: string; durationSeconds: number; width: number; height: number;
  streamsUnchanged: boolean;
};

const RECEIPTS = path.join(ROOT, 'scripts/farcaster-hls-assets.json');
const digest = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const streamHash = (file: string) => execFileSync('ffmpeg', [
  '-nostdin', '-v', 'error', '-i', file, '-map', '0:v:0', '-map', '0:a:0?',
  '-c', 'copy', '-f', 'streamhash', '-hash', 'sha256', '-',
], { encoding: 'utf8' }).trim();

function main() {
  const args = new Map(process.argv.slice(2).map(arg => {
    const match = /^--(batch|only|queue)=(.+)$/.exec(arg);
    if (!match) throw new Error(`Unknown argument: ${arg}`);
    return [match[1], match[2]];
  }));
  const batch = args.get('batch');
  if (!batch) throw new Error('Provide --batch=YYYY-MM-DD; optionally --only=post-id');
  const queue = path.resolve(ROOT, args.get('queue') || 'scripts/viz-farcaster-posts.json');
  const posts = readQueue(queue).filter(post => post.batchId === batch && (!args.has('only') || post.id === args.get('only')));
  if (!posts.length) throw new Error('No matching video entries');
  const receipts: Receipt[] = fs.existsSync(RECEIPTS) ? JSON.parse(fs.readFileSync(RECEIPTS, 'utf8')).assets : [];

  for (const post of posts) {
    const sourceFile = localVideo(post);
    const source = path.relative(ROOT, sourceFile).split(path.sep).join('/');
    const playlist = farcasterPlaylistAsset(source);
    const media = playlist.replace(/\.m3u8$/, '.mp4');
    const sourceSha256 = digest(sourceFile);
    const prior = receipts.find(entry => entry.source === source);
    if (prior && prior.sourceSha256 === sourceSha256 &&
        fs.existsSync(path.join(ROOT, playlist)) && fs.existsSync(path.join(ROOT, media)) &&
        digest(path.join(ROOT, playlist)) === prior.playlistSha256 && digest(path.join(ROOT, media)) === prior.mediaSha256) {
      console.log(`Already packaged: ${post.id}`);
      continue;
    }
    if (fs.existsSync(path.join(ROOT, playlist)) || fs.existsSync(path.join(ROOT, media))) {
      throw new Error(`Existing HLS files differ from their receipt: ${source}`);
    }
    const directory = path.dirname(path.join(ROOT, playlist));
    fs.mkdirSync(directory, { recursive: true });
    const temporary = fs.mkdtempSync(path.join(directory, '.package-'));
    const tempPlaylist = path.join(temporary, path.basename(playlist));
    const tempMedia = path.join(temporary, path.basename(media));
    try {
      execFileSync('ffmpeg', [
        '-nostdin', '-hide_banner', '-loglevel', 'error', '-i', sourceFile,
        '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-f', 'hls',
        '-hls_segment_type', 'fmp4', '-hls_flags', 'single_file', '-hls_time', '6',
        '-hls_playlist_type', 'vod', '-hls_segment_filename', tempMedia, tempPlaylist,
      ], { stdio: 'pipe' });
      const probe = JSON.parse(execFileSync('ffprobe', [
        '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height',
        '-of', 'json', tempPlaylist,
      ], { encoding: 'utf8' }));
      const video = probe.streams.find((stream: { codec_type: string }) => stream.codec_type === 'video');
      const durationSeconds = Number(probe.format.duration);
      if (video?.codec_name !== 'h264' || !(video.width > 0 && video.height > 0 && durationSeconds > 0)) {
        throw new Error(`Invalid HLS video metadata: ${post.id}`);
      }
      if (streamHash(sourceFile) !== streamHash(tempPlaylist)) throw new Error(`Video or audio packets changed: ${post.id}`);
      fs.renameSync(tempMedia, path.join(ROOT, media));
      fs.renameSync(tempPlaylist, path.join(ROOT, playlist));
      const receipt: Receipt = {
        source, sourceSha256, playlist, playlistSha256: digest(path.join(ROOT, playlist)),
        media, mediaSha256: digest(path.join(ROOT, media)), durationSeconds,
        width: video.width, height: video.height, streamsUnchanged: true,
      };
      const index = receipts.findIndex(entry => entry.source === source);
      if (index < 0) receipts.push(receipt); else receipts[index] = receipt;
      receipts.sort((a, b) => a.source.localeCompare(b.source));
      fs.writeFileSync(RECEIPTS, JSON.stringify({ version: 1, assets: receipts }, null, 2) + '\n');
      console.log(`Packaged ${post.id}: ${durationSeconds}s, ${video.width}x${video.height}; video and audio unchanged`);
    } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
  }
}

if (isMain(import.meta.url)) {
  try { main(); } catch (error) { console.error((error as Error).message); process.exitCode = 1; }
}
