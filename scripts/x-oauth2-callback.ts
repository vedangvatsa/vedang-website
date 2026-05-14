#!/usr/bin/env node
/**
 * OAuth 2.0 PKCE flow — Step 2: Exchange code for token and test reply
 * Usage: npx tsx scripts/x-oauth2-callback.ts "FULL_REDIRECT_URL"
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const STATE_FILE = path.resolve(__dirname, '.x-oauth2-state.json');
const TOKEN_FILE = path.resolve(__dirname, '.x-oauth2-token.json');

async function main() {
  const redirectUrl = process.argv[2];
  if (!redirectUrl) {
    console.log('Usage: npx tsx scripts/x-oauth2-callback.ts "FULL_REDIRECT_URL"');
    process.exit(1);
  }

  const savedState = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  const url = new URL(redirectUrl);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    console.log('❌ No code found in URL. Error:', url.searchParams.get('error'));
    process.exit(1);
  }

  if (state !== savedState.state) {
    console.log('⚠️ State mismatch (might still work)');
  }

  console.log('🔄 Exchanging code for access token...');

  const tokenClient = new TwitterApi({ clientId: process.env.X_CLIENT_ID!, clientSecret: process.env.X_CLIENT_SECRET! });
  const { accessToken, refreshToken, expiresIn } = await tokenClient.loginWithOAuth2({
    code,
    codeVerifier: savedState.codeVerifier,
    redirectUri: savedState.callbackUrl,
  });

  console.log(`✅ Access token obtained! Expires in ${expiresIn}s`);

  // Save tokens for future use
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (expiresIn || 7200) * 1000,
  }, null, 2));
  console.log('💾 Tokens saved to .x-oauth2-token.json');

  // Test reply
  const userClient = new TwitterApi(accessToken);
  const me = await userClient.v2.me();
  console.log(`\n👤 Authenticated as @${me.data.username}`);

  console.log('\n🧪 Testing reply to @ecommerceshares...');
  try {
    const { data } = await userClient.v2.tweet({
      text: 'Interesting perspective on the AI landscape.',
      reply: { in_reply_to_tweet_id: '2052301649905905810' },
    } as any);
    console.log(`✅✅✅ REPLY WORKS! ID: ${data.id}`);
    await userClient.v2.deleteTweet(data.id);
    console.log('Test reply cleaned up.');
    console.log('\n🎉 OAuth 2.0 enables replies! Use this token for the reply engine.');
  } catch (err: any) {
    console.log(`❌ Reply still blocked: ${err.data?.detail || err.message}`);
    console.log('OAuth 2.0 does not bypass the restriction either.');
  }
}

main();
