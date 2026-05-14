#!/usr/bin/env node
/**
 * LinkedIn feed discovery - find real posts from network to comment on
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN!;
const TARGETS_FILE = path.resolve(__dirname, 'linkedin-targets.json');
const LOG_FILE = path.resolve(__dirname, 'linkedin-comment-log.json');

const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'X-Restli-Protocol-Version': '2.0.0',
  'LinkedIn-Version': '202604',
  'Content-Type': 'application/json',
};

interface Target {
  activityId: string;
  author: string;
  topic: string;
  posted?: boolean;
}

async function tryEndpoint(name: string, url: string) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    const body = await res.text();
    console.log(`${name}: ${res.status}`);
    if (res.ok) console.log(body.substring(0, 500));
    else console.log(body.substring(0, 200));
  } catch (e: any) {
    console.log(`${name}: ERROR ${e.message}`);
  }
}

async function main() {
  console.log('🔍 Probing LinkedIn API endpoints...\n');

  // Try various endpoints to find what works
  await tryEndpoint('Posts (own)', `https://api.linkedin.com/rest/posts?author=${encodeURIComponent('urn:li:person:g40zkLPKoR')}&q=author&count=5`);
  console.log('---');
  
  await tryEndpoint('Network updates', `https://api.linkedin.com/v2/networkUpdates?count=5`);
  console.log('---');
  
  await tryEndpoint('UGC Posts', `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${encodeURIComponent('urn:li:person:g40zkLPKoR')})&count=5`);
  console.log('---');

  await tryEndpoint('Shares', `https://api.linkedin.com/v2/shares?q=owners&owners=${encodeURIComponent('urn:li:person:g40zkLPKoR')}&count=5`);
  console.log('---');
}

main().catch(console.error);
