#!/usr/bin/env node
/** Account/permission checks only. Never uploads media or creates a social post. */
import dotenv from 'dotenv';
import path from 'node:path';
import { TwitterApi } from 'twitter-api-v2';
import OAuth from 'oauth';
import { ROOT, isMain, readQueue } from './viz-publishing.js';
import { channels, chooseChannel, gql, buildInput, PLATFORMS, POST_FIELDS } from './buffer-viz-scheduled-executor.js';

dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });

export const REQUIRED: Record<string, string[]> = {
  linkedin: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_PERSON_URN'],
  x: ['X_API_KEY', 'X_API_KEY_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'],
  bluesky: ['BLUESKY_HANDLE', 'BLUESKY_APP_PASSWORD'],
  facebook: ['FACEBOOK_PAGE_ID', 'FACEBOOK_PAGE_TOKEN'],
  threads: ['THREADS_USER_ID', 'THREADS_ACCESS_TOKEN'],
  tumblr: ['TUMBLR_CONSUMER_KEY', 'TUMBLR_CONSUMER_SECRET', 'TUMBLR_ACCESS_TOKEN', 'TUMBLR_ACCESS_SECRET', 'TUMBLR_BLOG_NAME'],
  mastodon: ['MASTODON_INSTANCE', 'MASTODON_ACCESS_TOKEN'],
  farcaster: ['NEYNAR_API_KEY', 'NEYNAR_SIGNER_UUID'],
};

export function requireCredentials(platform: string) {
  const missing = REQUIRED[platform].filter(k => !process.env[k]);
  if (missing.length) throw new Error(`Missing ${missing.join(', ')}`);
}

async function json(url: string, init: RequestInit = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(30000) });
  const data = await res.json() as any;
  if (!res.ok) {
    // Do not print request URLs/headers, tokens, or arbitrary server bodies.
    let message = String(data.error?.message || '').slice(0, 400);
    for (const [key, value] of Object.entries(process.env)) {
      if (/TOKEN|SECRET|PASSWORD|KEY/.test(key) && value && value.length > 8) message = message.replaceAll(value, '[redacted]');
    }
    throw new Error(`HTTP ${res.status}${data.error?.code ? `, API code ${data.error.code}` : ''}${message ? `: ${message}` : ''}`);
  }
  return data;
}

export async function checkNative(platform: string) {
  requireCredentials(platform);
  const e = process.env;
  const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
  if (platform === 'linkedin') {
    // userinfo requires openid; 403 is inconclusive, 401 means reauthorization is needed.
    await json('https://api.linkedin.com/v2/userinfo', { headers: bearer(e.LINKEDIN_ACCESS_TOKEN!) });
    return 'identity authorized; video/write permission still needs a publish test';
  }
  if (platform === 'x') {
    const client = new TwitterApi({ appKey: e.X_API_KEY!, appSecret: e.X_API_KEY_SECRET!, accessToken: e.X_ACCESS_TOKEN!, accessSecret: e.X_ACCESS_TOKEN_SECRET! });
    await client.v2.me();
    return 'identity authorized; media and write tier not tested';
  }
  if (platform === 'bluesky') {
    const session = await json('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: e.BLUESKY_HANDLE, password: e.BLUESKY_APP_PASSWORD }),
    });
    if (!session.emailConfirmed) throw new Error('Bluesky requires verified email for video');
    return 'login authorized and email verified; video quota/upload not tested';
  }
  if (platform === 'facebook') {
    const data = await json(`https://graph.facebook.com/v23.0/${e.FACEBOOK_PAGE_ID}?fields=id,name`, { headers: bearer(e.FACEBOOK_PAGE_TOKEN!) });
    if (data.id !== e.FACEBOOK_PAGE_ID) throw new Error('Facebook page identity mismatch');
    const pending = readQueue(path.join(ROOT, 'scripts/viz-facebook-posts.json')).find(p => p.state === 'uncertain');
    const videoId = pending?.error?.match(/Facebook video (\d+)/)?.[1];
    if (videoId) {
      try {
        const video = await json(`https://graph.facebook.com/v23.0/${videoId}?fields=id,status,description,permalink_url`, { headers: bearer(e.FACEBOOK_PAGE_TOKEN!) });
        console.log(`Facebook existing upload ${JSON.stringify({ id: video.id, status: video.status, permalink: video.permalink_url, captionMatches: video.description === pending?.text })}`);
      } catch (err) {
        console.log(`Facebook existing upload status lookup: ${(err as Error).message}`);
        const video = await json(`https://graph.facebook.com/v23.0/${videoId}?fields=id,description,permalink_url,created_time`, { headers: bearer(e.FACEBOOK_PAGE_TOKEN!) });
        console.log(`Facebook existing upload metadata ${JSON.stringify({ id: video.id, permalink: video.permalink_url, createdAt: video.created_time, captionMatches: video.description === pending?.text })}`);
      }
    }
    return 'page token accepted; video publishing permission not tested';
  }
  if (platform === 'threads') {
    const data = await json('https://graph.threads.net/v1.0/me?fields=id,username', { headers: bearer(e.THREADS_ACCESS_TOKEN!) });
    if (data.id !== e.THREADS_USER_ID) throw new Error('Threads account identity mismatch');
    return 'account token accepted; publishing not tested';
  }
  if (platform === 'mastodon') {
    await json(`${e.MASTODON_INSTANCE}/api/v1/accounts/verify_credentials`, { headers: bearer(e.MASTODON_ACCESS_TOKEN!) });
    const instance = await json(`${e.MASTODON_INSTANCE}/api/v2/instance`);
    return `account token accepted; instance video limit ${instance.configuration?.media_attachments?.video_size_limit || 'unknown'} bytes`;
  }
  if (platform === 'farcaster') {
    const data = await json(`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${encodeURIComponent(e.NEYNAR_SIGNER_UUID!)}`, { headers: { 'x-api-key': e.NEYNAR_API_KEY! } });
    if (data.status !== 'approved') throw new Error('Neynar signer is not approved');
    return 'Neynar signer approved; video embed playback not tested';
  }
  if (platform === 'tumblr') {
    const oauth = new OAuth.OAuth('https://www.tumblr.com/oauth/request_token', 'https://www.tumblr.com/oauth/access_token', e.TUMBLR_CONSUMER_KEY!, e.TUMBLR_CONSUMER_SECRET!, '1.0A', null, 'HMAC-SHA1');
    const raw = await new Promise<string>((resolve, reject) => oauth.get('https://api.tumblr.com/v2/user/info', e.TUMBLR_ACCESS_TOKEN!, e.TUMBLR_ACCESS_SECRET!, (err: any, data: any) => err ? reject(new Error(`Tumblr HTTP ${err.statusCode}`)) : resolve(String(data))));
    const blogs = JSON.parse(raw).response?.user?.blogs || [];
    const name = e.TUMBLR_BLOG_NAME!.replace(/\.tumblr\.com$/, '');
    if (!blogs.some((b: any) => b.name === name)) throw new Error('Tumblr target blog is not authorized');
    const pending = readQueue(path.join(ROOT, 'scripts/viz-tumblr-posts.json')).find(p => p.state === 'uncertain');
    if (pending) {
      const recent = await new Promise<string>((resolve, reject) => oauth.get(`https://api.tumblr.com/v2/blog/${encodeURIComponent(e.TUMBLR_BLOG_NAME!)}/posts?limit=20&npf=true`, e.TUMBLR_ACCESS_TOKEN!, e.TUMBLR_ACCESS_SECRET!, (err: any, data: any) => err ? reject(new Error(`Tumblr recent posts HTTP ${err.statusCode}`)) : resolve(String(data))));
      const posts = JSON.parse(recent).response?.posts || [];
      const matches = posts.filter((p: any) => (p.content || []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('\n\n') === pending.text);
      console.log(`Tumblr duplicate check ${JSON.stringify({ checked: posts.length, matches: matches.map((p: any) => ({ id: p.id_string || String(p.id), url: p.post_url })) })}`);
    }
    return 'OAuth accepted and target blog authorized; video publishing not tested';
  }
}

export async function main() {
  let failures = 0;
  const only = process.argv.find(a => a.startsWith('--only='))?.slice(7);
  if (only && only !== 'buffer' && only !== 'direct' && !(only in REQUIRED)) throw new Error(`Unknown preflight target ${only}`);
  if (!only || only === 'buffer') {
    try {
      const available = await channels();
      for (const platform of PLATFORMS) {
        const channel = chooseChannel(platform.service, platform.channelEnv, available);
        const entry = { id: 'preflight', posted: false, scheduleDate: '2099-01-01', scheduleTime: '09:00', title: 'Video check', text: 'Video check', description: 'Video check' };
        // GraphQL validates the input and selection but @skip prevents resolver execution.
        await gql(`mutation ValidateOnly($input: CreatePostInput!) {
          createPost(input: $input) @skip(if: true) {
            ... on PostActionSuccess { post { ${POST_FIELDS} } }
            ... on MutationError { message }
          }
        }`, { input: buildInput(platform.service, entry, channel.id, 'https://example.invalid/not-uploaded.mp4') });
        console.log(`PASS ${platform.service}: channel connected/unlocked; shareNow schema accepted (no post created)`);
      }
    } catch (err) { failures++; console.error(`FAIL buffer: ${(err as Error).message}`); }
  }
  for (const platform of Object.keys(REQUIRED).filter(p => !only || only === 'direct' || p === only)) {
    try { console.log(`PASS ${platform}: ${await checkNative(platform)}`); }
    catch (err) { failures++; console.error(`FAIL ${platform}: ${(err as Error).message}`); }
  }
  if (failures) process.exitCode = 1;
}

if (isMain(import.meta.url)) main().catch(() => { console.error('Preflight failed'); process.exitCode = 1; });
