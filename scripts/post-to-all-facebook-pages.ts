#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const API_VERSION = 'v21.0';
const DELAY_MS = 60_000; // 1 minute between posts

const BASE_MESSAGE = `120k+ laid off this year already.

We're supporting job-seekers by sharing profiles with our partner recruiters this Friday.

Drop your CV here - https://cvin.bio/fb`;

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

function getMessageVariation(index: number): string {
  const variations = [
    BASE_MESSAGE,
    BASE_MESSAGE.replace('Drop your CV here', 'Send your CV here'),
    BASE_MESSAGE.replace('Drop your CV here', 'Drop the CV here'),
    BASE_MESSAGE.replace('supporting', 'helping'),
    BASE_MESSAGE.replace('profiles', 'resumes'),
  ];
  return variations[index % variations.length];
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPages(userToken: string): Promise<FacebookPage[]> {
  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/me/accounts?access_token=${userToken}&limit=100`
  );
  const data = await res.json() as any;
  if (data.error) {
    throw new Error(`Failed to fetch pages: ${JSON.stringify(data.error)}`);
  }
  return data.data || [];
}

async function postToPage(page: FacebookPage, message: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${page.id}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, access_token: page.access_token }),
    });
    const data = await res.json() as any;
    if (data.error) {
      return { success: false, error: JSON.stringify(data.error) };
    }
    return { success: true, postId: data.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function main() {
  const userToken = process.env.META_USER_ACCESS_TOKEN || '';
  const singlePageId = process.env.FACEBOOK_PAGE_ID || '';
  const singlePageToken = process.env.FACEBOOK_PAGE_TOKEN || '';

  let pages: FacebookPage[] = [];

  if (userToken) {
    console.log('🔑 Using META_USER_ACCESS_TOKEN to fetch all pages...');
    pages = await fetchPages(userToken);
    if (pages.length === 0) {
      console.log('⚠️ No pages found via user token. Falling back to single page config.');
    }
  }

  if (pages.length === 0) {
    if (!singlePageId || !singlePageToken) {
      console.error('❌ No pages to post to. Set either META_USER_ACCESS_TOKEN (recommended) or FACEBOOK_PAGE_ID + FACEBOOK_PAGE_TOKEN in .env.local');
      process.exit(1);
    }
    pages = [{ id: singlePageId, name: 'Configured Page', access_token: singlePageToken }];
  }

  console.log(`\n📘 Found ${pages.length} page(s) to post to:`);
  for (const page of pages) {
    console.log(`   - ${page.name} (${page.id})`);
  }
  console.log('');

  const results: { page: FacebookPage; success: boolean; postId?: string; error?: string }[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const message = getMessageVariation(i);
    console.log(`[${i + 1}/${pages.length}] Posting to ${page.name}...`);
    const result = await postToPage(page, message);
    results.push({ page, ...result });

    if (result.success) {
      console.log(`   ✅ Posted: ${result.postId}`);
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
    }

    if (i < pages.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s before next post...`);
      await sleep(DELAY_MS);
    }
  }

  console.log('\n📊 Summary:');
  const succeeded = results.filter(r => r.success).length;
  const failed = results.length - succeeded;
  console.log(`   Success: ${succeeded}, Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed pages:');
    for (const r of results.filter(r => !r.success)) {
      console.log(`   - ${r.page.name}: ${r.error}`);
    }
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
