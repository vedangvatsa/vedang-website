#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RECEIPTS = path.join(ROOT, 'scripts/farcaster-hls-assets.json');

const digest = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

export function reencodeAndPackage(slug: string) {
  const sourceRel = `scripts/viz-assets/videos/explainer_videos/1x1/${slug}_1x1.mp4`;
  const sourceFile = path.join(ROOT, sourceRel);
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file not found: ${sourceFile}`);
  }

  const playlistRel = `scripts/viz-assets/videos/explainer_videos/1x1/hls/${slug}_1x1.m3u8`;
  const mediaRel = `scripts/viz-assets/videos/explainer_videos/1x1/hls/${slug}_1x1.mp4`;
  const playlistFile = path.join(ROOT, playlistRel);
  const mediaFile = path.join(ROOT, mediaRel);

  console.log(`Processing ${slug}...`);

  // 1. Re-encode to strict CFR 30fps with 192k stereo AAC
  const tempDir = fs.mkdtempSync(path.join('/tmp', `reencode-${slug}-`));
  const tempMp4 = path.join(tempDir, `${slug}_1x1.mp4`);

  execFileSync('ffmpeg', [
    '-y', '-nostdin', '-hide_banner', '-loglevel', 'error',
    '-i', sourceFile,
    '-f', 'lavfi', '-i', 'anoisesrc=c=pink:r=48000:a=0.0001,pan=stereo|c0=c0|c1=c0',
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
    '-r', '30', '-fps_mode', 'cfr', '-g', '60', '-keyint_min', '60', '-sc_threshold', '0',
    '-vf', 'setsar=1/1',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart',
    '-shortest',
    tempMp4
  ], { stdio: 'inherit' });

  // Overwrite the source MP4 with the cleanly encoded CFR version
  fs.copyFileSync(tempMp4, sourceFile);

  // 2. Package into single-file fMP4 HLS
  const hlsDir = path.dirname(playlistFile);
  fs.mkdirSync(hlsDir, { recursive: true });
  const packageTemp = fs.mkdtempSync(path.join(hlsDir, '.package-'));
  const tempPlaylist = path.join(packageTemp, path.basename(playlistFile));
  const tempMedia = path.join(packageTemp, path.basename(mediaFile));

  try {
    execFileSync('ffmpeg', [
      '-nostdin', '-hide_banner', '-loglevel', 'error',
      '-i', sourceFile,
      '-map', '0:v:0', '-map', '0:a:0',
      '-c', 'copy', '-f', 'hls',
      '-hls_segment_type', 'fmp4', '-hls_flags', 'single_file', '-hls_time', '6',
      '-hls_playlist_type', 'vod',
      '-hls_segment_filename', tempMedia, tempPlaylist,
    ], { stdio: 'pipe' });

    // Validate the resulting package with ffprobe
    const probe = JSON.parse(execFileSync('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height',
      '-of', 'json', tempPlaylist,
    ], { encoding: 'utf8' }));

    const video = probe.streams.find((s: { codec_type: string }) => s.codec_type === 'video');
    const durationSeconds = Number(probe.format.duration);
    if (video?.codec_name !== 'h264' || !(video.width > 0 && video.height > 0 && durationSeconds > 0)) {
      throw new Error(`Invalid HLS video metadata for ${slug}`);
    }

    // Atomically move files into place
    if (fs.existsSync(mediaFile)) fs.unlinkSync(mediaFile);
    if (fs.existsSync(playlistFile)) fs.unlinkSync(playlistFile);
    fs.renameSync(tempMedia, mediaFile);
    fs.renameSync(tempPlaylist, playlistFile);

    // Update receipts
    const receiptsData = fs.existsSync(RECEIPTS) ? JSON.parse(fs.readFileSync(RECEIPTS, 'utf8')) : { version: 1, assets: [] };
    const receipt = {
      source: sourceRel,
      sourceSha256: digest(sourceFile),
      playlist: playlistRel,
      playlistSha256: digest(playlistFile),
      media: mediaRel,
      mediaSha256: digest(mediaFile),
      durationSeconds,
      width: video.width,
      height: video.height,
      streamsUnchanged: true,
    };

    const idx = receiptsData.assets.findIndex((a: any) => a.source === sourceRel);
    if (idx >= 0) receiptsData.assets[idx] = receipt; else receiptsData.assets.push(receipt);
    receiptsData.assets.sort((a: any, b: any) => a.source.localeCompare(b.source));
    fs.writeFileSync(RECEIPTS, JSON.stringify(receiptsData, null, 2) + '\n');

    console.log(`✓ Packaged ${slug}: ${durationSeconds.toFixed(2)}s, ${video.width}x${video.height}, 30fps CFR, 192k AAC`);
  } finally {
    fs.rmSync(packageTemp, { recursive: true, force: true });
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  const target = process.argv[2];
  if (target) {
    reencodeAndPackage(target);
    return;
  }

  // If no target specified, reencode upcoming topics in queue
  const queueFile = path.join(ROOT, 'scripts/viz-farcaster-posts.json');
  const posts = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  const pending = posts.filter((p: any) => !p.posted && !p.paused && p.batchId === 'explainer-v1');

  console.log(`Re-encoding ${pending.length} pending explainer topics...`);
  for (const post of pending) {
    const slug = post.id.replace(/^explainer-farcaster-/, '');
    reencodeAndPackage(slug);
  }
  console.log('All pending explainer topics successfully processed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
