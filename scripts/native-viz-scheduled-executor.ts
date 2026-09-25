#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'node:path';
import { ROOT, isMain, readQueue, saveQueue, selectDue, localVideo, publicVideoUrl, checkPublicVideo, type VizPost } from './viz-publishing.js';
import { REQUIRED, requireCredentials } from './viz-platform-preflight.js';
import { validateCaption, validateConciseBufferCaption } from './viz-captions.mjs';
import { configuredDirectPlatforms } from './viz-platforms.mjs';

dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });

export async function publish(platform: string, post: VizPost, video: string, url?: string): Promise<string> {
  const text = post.text!;
  switch (platform) {
    case 'linkedin': {
      const { postToLinkedIn } = await import('./linkedin-scheduled-executor.js');
      const result = await postToLinkedIn(text, video);
      if (!result.success || !result.id) throw new Error(result.error || 'LinkedIn returned no post ID');
      return result.id;
    }
    case 'x': {
      const { postSingleTweet } = await import('./x-scheduled-executor.js');
      const result = await postSingleTweet(text, video);
      if (!result.success || !result.id) throw new Error(result.error || 'X returned no post ID');
      return result.id;
    }
    case 'bluesky': {
      const { createSession, createPost } = await import('./bluesky-scheduled-executor.js');
      return createPost(await createSession(), { id: post.id, text, video, posted: false, scheduleDate: post.scheduleDate, scheduleTime: post.scheduleTime });
    }
    case 'facebook': {
      const { uploadVideo } = await import('./facebook-scheduled-executor.js');
      return uploadVideo(video, text);
    }
    case 'threads': {
      if (!url) throw new Error('Threads requires a public MP4 URL');
      const { postViaGraphAPI } = await import('./threads-scheduled-executor.js');
      return postViaGraphAPI(text, url);
    }
    case 'tumblr': {
      const { publishVideo } = await import('./tumblr-scheduled-executor.js');
      return publishVideo(video, text, post.tags || []);
    }
    case 'mastodon': {
      const { uploadMedia, postStatus } = await import('./mastodon-scheduled-executor.js');
      const mediaId = await uploadMedia(video, String(post.altText || text));
      if (!mediaId) throw new Error('Mastodon video upload failed');
      return postStatus(text, mediaId, post.id);
    }
    case 'farcaster': {
      if (!url) throw new Error('Farcaster requires a public video embed URL');
      const { postCast } = await import('./farcaster-scheduled-executor.js');
      const result = await postCast(text, url);
      if (!result.success || !result.hash) throw new Error(result.error || 'Farcaster returned no cast hash');
      return result.hash;
    }
    default: throw new Error(`Unknown platform ${platform}`);
  }
}

export async function runPlatform(platform: string, dryRun: boolean) {
  const file = path.join(ROOT, 'scripts', `viz-${platform}-posts.json`);
  const posts = readQueue(file);
  if (dryRun) {
    for (const p of posts) { localVideo(p); validateCaption(platform, p.text); }
    console.log(`${platform}: ${posts.length} video captions validated (no requests or writes)`);
    return;
  }
  const { post, slot } = selectDue(posts);
  if (!post) { console.log(`${platform}: nothing due`); return; }
  requireCredentials(platform);
  validateCaption(platform, post.text);
  if (post.captionStyle === 'concise-v1') validateConciseBufferCaption(post.text);
  const video = localVideo(post);
  let url: string | undefined;
  if (['threads', 'farcaster'].includes(platform)) {
    url = publicVideoUrl(post);
    await checkPublicVideo(url);
  }
  post.state = 'publishing';
  post.attemptedAt = new Date().toISOString();
  post.attemptedSlot = slot;
  post.publishedText = post.text;
  saveQueue(file, posts);
  try {
    const id = await publish(platform, post, video, url);
    if (!id) throw new Error('Publisher returned no ID');
    post.platformPostId = id;
    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.state = 'sent';
    post.error = null;
    console.log(`${platform}: published ${id}`);
  } catch (err) {
    // A transport timeout can occur after a post is accepted. Never blind-retry.
    post.state = 'uncertain';
    post.error = (err as Error).message;
    throw err;
  } finally { saveQueue(file, posts); }
}

export async function main() {
  const only = process.argv.find(a => a.startsWith('--only='))?.slice(7);
  if (only && !(only in REQUIRED)) throw new Error(`Unknown platform ${only}`);
  let failures = 0;
  const selected = only ? [only] : configuredDirectPlatforms();
  if (!selected.length) console.log('No direct platforms enabled; set VIZ_DIRECT_PLATFORMS or pass --only=platform');
  for (const platform of selected) {
    try { await runPlatform(platform, process.env.DRY_RUN === '1'); }
    catch (err) { failures++; console.error(`${platform}: ${(err as Error).message}`); }
  }
  if (failures) throw new Error(`${failures} direct platform(s) failed`);
}

if (isMain(import.meta.url)) main().catch(err => { console.error(err.message); process.exitCode = 1; });
