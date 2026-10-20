#!/usr/bin/env node
import path from 'node:path';
import { prepareVideoEmbed } from './farcaster-scheduled-executor.js';
import { hlsReceipt, verifyFarcasterCast } from './farcaster-video-validation.js';
import { isMain, readQueue, ROOT } from './viz-publishing.js';
import { SOCIAL_VIDEO_ORIGIN } from '../src/lib/social-video.js';

export async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !/^--(?:url|next)=.+/.test(arg)) || args.length > 1) {
    throw new Error('Use --next=1..10 or --url=https://...');
  }
  const source = args.find(arg => arg.startsWith('--url='))?.slice(6);
  if (source) {
    console.log(JSON.stringify({ url: await prepareVideoEmbed(source), status: 'verified' }));
    return;
  }
  const count = Number(args.find(arg => arg.startsWith('--next='))?.slice(7) || 3);
  if (!Number.isInteger(count) || count < 1 || count > 10) throw new Error('Check between one and ten upcoming videos');
  const posts = readQueue(path.join(ROOT, 'scripts/viz-farcaster-posts.json'));
  const unresolved = posts.find(post => !post.posted && !post.paused && ['publishing', 'submitted', 'uncertain', 'failed'].includes(post.state || ''));
  if (unresolved) throw new Error(`Queue held by ${unresolved.id} (${unresolved.state}); reconcile its saved receipt before advancing`);
  const latest = posts.filter(post => post.posted && post.platformPostId && post.postUrl && post.videoEmbedUrl)
    .sort((a, b) => String(b.postedAt).localeCompare(String(a.postedAt)))[0];
  if (latest) {
    await verifyFarcasterCast(String(latest.platformPostId), latest.postUrl, String(latest.videoEmbedUrl), String(latest.publishedText || latest.text));
    console.log(JSON.stringify({ id: latest.id, cast: latest.postUrl, clientEmbed: 'verified' }));
  }
  const pending = posts.filter(post => !post.posted && !post.paused)
    .sort((a, b) => `${a.scheduleDate} ${a.scheduleTime}`.localeCompare(`${b.scheduleDate} ${b.scheduleTime}`)).slice(0, count);
  for (const post of pending) {
    const asset = String(post.video || post.videoPath);
    const expected = hlsReceipt(asset, post.videoSha256 ? String(post.videoSha256) : undefined);
    const base = process.env.VIZ_MEDIA_BASE_URL || `${SOCIAL_VIDEO_ORIGIN}/main`;
    const original = post.publicVideoUrl || `${base.replace(/\/$/, '')}/${asset.split('/').map(encodeURIComponent).join('/')}`;
    const url = await prepareVideoEmbed(original, fetch, undefined, { expected });
    console.log(JSON.stringify({ id: post.id, url, status: 'verified', mediaSha256: expected.mediaSha256 }));
  }
  console.log(`Verified ${pending.length} upcoming Farcaster videos; no casts sent or queue files changed.`);
}

if (isMain(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
