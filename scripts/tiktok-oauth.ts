#!/usr/bin/env node
/**
 * tiktok-oauth.ts — OAuth2 flow for TikTok Content Posting API
 *
 * Step 1: Run this to get the authorization URL
 * Step 2: Open the URL in browser, authorize
 * Step 3: Paste the URL you get redirected to back into this script
 *
 * Usage:
 *   npx tsx scripts/tiktok-oauth.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY!;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET!;
const REDIRECT_URI = 'https://veda.ng/api/auth/tiktok/callback';
const TOKEN_FILE = path.resolve(__dirname, '.tiktok-token.json');

const SCOPES = 'user.info.basic,video.publish,video.upload';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  // Step 1: Generate auth URL
  const csrfState = Math.random().toString(36).substring(2);
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${CLIENT_KEY}` +
    `&scope=${SCOPES}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${csrfState}`;

  console.log('\n🔗 Open this URL in your browser to authorize:\n');
  console.log(authUrl);
  console.log('\nAfter authorizing, you will be redirected to veda.ng (it might show a 404).');
  console.log('Copy the FULL URL from your browser address bar and paste it below.\n');

  rl.question('Paste the redirected URL here: ', async (redirectedUrl) => {
    rl.close();

    try {
      const url = new URL(redirectedUrl.trim());
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        console.error(`\n❌ Auth error from TikTok: ${error}`);
        return;
      }

      if (!code) {
        console.error('\n❌ Could not find "code" in the URL. Make sure you copied the whole thing.');
        return;
      }

      console.log(`\n✅ Authorization code extracted: ${code.substring(0, 10)}...`);
      console.log(`Exchanging for access token...`);

      // Step 3: Exchange code for access token
      const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: CLIENT_KEY,
          client_secret: CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
        }).toString(),
      });

      const tokenData = await tokenRes.json() as any;

      if (tokenData.access_token) {
        console.log(`\n✅ Access token obtained!`);
        console.log(`   Open ID: ${tokenData.open_id}`);
        console.log(`   Expires in: ${tokenData.expires_in}s`);

        // Save token
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
        console.log(`\n💾 Token saved to ${TOKEN_FILE}`);
        console.log(`\nAdd these to your .env.local file:`);
        console.log(`TIKTOK_ACCESS_TOKEN=${tokenData.access_token}`);
        console.log(`TIKTOK_OPEN_ID=${tokenData.open_id}`);
        if (tokenData.refresh_token) {
          console.log(`TIKTOK_REFRESH_TOKEN=${tokenData.refresh_token}`);
        }
      } else {
        console.error('\n❌ Token exchange failed:', JSON.stringify(tokenData, null, 2));
      }
    } catch (err: any) {
      console.error('\n❌ Error:', err.message);
    }
  });
}

main().catch(console.error);
