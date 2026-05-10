#!/usr/bin/env node
/**
 * Delete all reply posts from Bluesky account
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const HANDLE = process.env.BLUESKY_HANDLE!;
const APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD!;
const PDS = 'https://bsky.social';

let session: { did: string; accessJwt: string };

async function login() {
  const res = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: HANDLE, password: APP_PASSWORD }),
  });
  session = await res.json() as any;
  console.log(`✅ Logged in as ${session.did}\n`);
}

async function listAndDeleteReplies() {
  let cursor: string | undefined;
  let deleted = 0;
  
  while (true) {
    const params = new URLSearchParams({ 
      repo: session.did, 
      collection: 'app.bsky.feed.post', 
      limit: '100' 
    });
    if (cursor) params.set('cursor', cursor);
    
    const res = await fetch(`${PDS}/xrpc/com.atproto.repo.listRecords?${params}`, {
      headers: { Authorization: `Bearer ${session.accessJwt}` },
    });
    const data = await res.json() as any;
    
    for (const record of data.records || []) {
      // Only delete replies (posts with reply field)
      if (record.value?.reply) {
        const rkey = record.uri.split('/').pop();
        console.log(`🗑️ Deleting reply to ${record.value.reply.parent.uri.substring(0, 60)}...`);
        
        await fetch(`${PDS}/xrpc/com.atproto.repo.deleteRecord`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessJwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repo: session.did,
            collection: 'app.bsky.feed.post',
            rkey,
          }),
        });
        deleted++;
        
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 200));
      }
    }
    
    if (!data.cursor) break;
    cursor = data.cursor;
  }
  
  console.log(`\n✅ Deleted ${deleted} reply posts`);
}

async function main() {
  await login();
  await listAndDeleteReplies();
  
  // Clear the dedup log
  const logFile = path.resolve(__dirname, 'bluesky-comment-log.json');
  fs.writeFileSync(logFile, '[]');
  console.log('📝 Cleared dedup log');
}

main().catch(console.error);
