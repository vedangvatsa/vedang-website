#!/usr/bin/env node
/** Our workflow owns the schedule. Buffer receives shareNow only when an entry is due. */
import dotenv from 'dotenv';
import path from 'node:path';
import { validateCaption } from './viz-captions.mjs';
import {
  ROOT, isMain, readQueue, saveQueue, selectDue, localVideo, publicVideoUrl,
  checkPublicVideo, sleep, type VizPost,
} from './viz-publishing.js';

dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });

export const PLATFORMS = [
  { service: 'youtube', prefix: 'YT', channelEnv: 'BUFFER_YOUTUBE_CHANNEL_ID' },
  { service: 'instagram', prefix: 'IG', channelEnv: 'BUFFER_INSTAGRAM_CHANNEL_ID' },
  { service: 'tiktok', prefix: 'TT', channelEnv: 'BUFFER_TIKTOK_CHANNEL_ID' },
] as const;

export const POST_FIELDS = 'id status externalLink sentAt shareMode schedulingType';
export const CREATE_POST = `mutation PublishVizNow($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess { post { ${POST_FIELDS} } }
    ... on MutationError { message }
  }
}`;

export async function gql(query: string, variables: Record<string, unknown> = {}) {
  if (!process.env.BUFFER_API_KEY) throw new Error('Missing BUFFER_API_KEY');
  const res = await fetch('https://api.buffer.com', {
    method: 'POST', signal: AbortSignal.timeout(60000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.BUFFER_API_KEY}` },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Buffer HTTP ${res.status}`);
  const data = await res.json() as any;
  if (data.errors?.length) throw new Error(`Buffer GraphQL error: ${JSON.stringify(data.errors).slice(0, 600)}`);
  return data.data;
}

export async function channels() {
  const data = await gql('query { account { organizations { id } } }');
  const result: any[] = [];
  for (const org of data.account.organizations) {
    const response = await gql(`query($id: OrganizationId!) {
      channels(input: {organizationId: $id}) {
        id name service isDisconnected isLocked allowedActions
      }
    }`, { id: org.id });
    result.push(...response.channels);
  }
  return result;
}

export function chooseChannel(service: string, envName: string, available: any[]) {
  const matches = available.filter(c => c.service === service && (!process.env[envName] || c.id === process.env[envName]));
  if (matches.length !== 1) throw new Error(`Expected one ${service} channel; set ${envName} to choose explicitly`);
  const channel = matches[0];
  if (channel.isDisconnected || channel.isLocked) throw new Error(`${service} channel is disconnected or locked`);
  return channel;
}

export function buildInput(service: string, entry: VizPost, channelId: string, videoUrl: string) {
  let text = service === 'youtube' ? entry.description : entry.text || entry.title;
  if (text && entry.notesUrl && process.env.VIZ_NOTES_BASE_URL) {
    const original = new URL(String(entry.notesUrl));
    const base = new URL(process.env.VIZ_NOTES_BASE_URL);
    if (base.protocol !== 'https:' || !/^\/viz-notes\/\d{2}\.txt$/.test(original.pathname)) throw new Error('Invalid public notes URL configuration');
    const notes = `${base.href.replace(/\/$/, '')}${original.pathname}`;
    text = text.replaceAll(String(entry.notesUrl), notes);
  }
  const limit = service === 'youtube' ? 5000 : 2200;
  if (!text || Array.from(text).length > limit) throw new Error(`${entry.id} caption missing or over ${limit} characters`);
  validateCaption(service, text);
  const metadata = service === 'youtube'
    ? { youtube: { title: entry.title, categoryId: '27', privacy: 'public', notifySubscribers: false } }
    : service === 'instagram' ? { instagram: { type: 'reel', shouldShareToFeed: true } } : undefined;
  if (service === 'youtube' && (!entry.title || Array.from(entry.title).length > 100)) throw new Error('YouTube title must be 1-100 characters');
  return {
    channelId, text, schedulingType: 'automatic', mode: 'shareNow',
    assets: [{ video: { url: videoUrl } }],
    ...(metadata ? { metadata } : {}),
  };
}

export function applyBufferStatus(entry: VizPost, remote: any) {
  if (!remote?.id) throw new Error('Buffer returned no post ID');
  entry.bufferPostId = remote.id;
  entry.bufferStatus = remote.status;
  entry.postUrl = remote.externalLink || undefined;
  if (remote.shareMode !== 'shareNow' || remote.schedulingType !== 'automatic') {
    entry.state = 'uncertain';
    throw new Error('Buffer did not confirm automatic shareNow; inspect the post before retrying');
  }
  if (remote.status === 'sent') {
    entry.posted = true;
    entry.postedAt = remote.sentAt || new Date().toISOString();
    entry.state = 'sent';
    entry.error = null;
  } else if (['error', 'draft', 'needs_approval'].includes(remote.status)) {
    entry.state = 'failed';
    entry.error = `Buffer status ${remote.status}; inspect post ${remote.id}`;
  } else {
    entry.state = 'submitted';
  }
}

async function reconcile(entry: VizPost, save: () => void) {
  for (let i = 0; i < 60; i++) {
    const data = await gql(`query($id: PostId!) { post(input: {id: $id}) { ${POST_FIELDS} } }`, { id: entry.bufferPostId });
    applyBufferStatus(entry, data.post);
    save();
    if (entry.state !== 'submitted') break;
    await sleep(5000);
  }
  if (entry.state !== 'sent') throw new Error(entry.error || `Buffer ${entry.bufferPostId} is still processing; publication not confirmed`);
}

export async function runPlatform(platform: typeof PLATFORMS[number], available: any[], dryRun: boolean) {
  const file = path.resolve(ROOT, 'scripts', process.env[`${platform.prefix}_POSTS_FILE`] || `viz-${platform.service}-posts.json`);
  const posts = readQueue(file);
  const save = () => saveQueue(file, posts);
  if (!dryRun) {
    for (const entry of posts.filter(p => p.bufferPostId && !p.posted && p.state !== 'failed')) {
      await reconcile(entry, save);
    }
  }
  // Dry-run validates every entry, even when none is due, without uploads or writes.
  if (dryRun) {
    for (const entry of posts) {
      localVideo(entry);
      buildInput(platform.service, entry, 'dry-run', 'https://example.invalid/video.mp4');
    }
    const { post } = selectDue(posts);
    console.log(`${platform.service}: ${posts.length} entries validated; ${post?.id || 'nothing'} due; shareNow only`);
    return;
  }
  const { post, slot } = selectDue(posts);
  if (!post) { console.log(`${platform.service}: nothing due`); return; }
  const channel = chooseChannel(platform.service, platform.channelEnv, available);
  localVideo(post);
  const url = publicVideoUrl(post);
  await checkPublicVideo(url);
  const input = buildInput(platform.service, post, channel.id, url);
  post.publishedText = input.text;
  // Persist before the mutation. An ambiguous response must never cause an automatic duplicate.
  post.state = 'publishing';
  post.attemptedSlot = slot;
  post.attemptedAt = new Date().toISOString();
  save();
  try {
    const data = await gql(CREATE_POST, { input });
    const result = data?.createPost;
    if (!result?.post?.id) {
      post.state = 'failed';
      throw new Error(result?.message || 'Buffer rejected the post');
    }
    applyBufferStatus(post, result.post);
    save();
    if (!post.posted) await reconcile(post, save);
    console.log(`${platform.service}: sent ${post.postUrl || post.bufferPostId}`);
  } catch (err) {
    if (post.state === 'publishing') post.state = 'uncertain';
    post.error = (err as Error).message;
    save();
    throw err;
  }
}

export async function main() {
  const dryRun = process.env.DRY_RUN === '1';
  const available = dryRun ? [] : await channels();
  let failures = 0;
  await Promise.all(PLATFORMS.map(async platform => {
    try { await runPlatform(platform, available, dryRun); }
    catch (err) { failures++; console.error(`${platform.service}: ${(err as Error).message}`); }
  }));
  if (failures) throw new Error(`${failures} Buffer platform(s) failed`);
}

if (isMain(import.meta.url)) main().catch(err => { console.error(err.message); process.exitCode = 1; });
