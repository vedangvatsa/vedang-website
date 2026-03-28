#!/usr/bin/env node
/**
 * LinkedIn OAuth helper — run once to get your access token + person URN.
 * Usage: node scripts/linkedin-oauth.mjs
 */
import http from 'http';
import { exec } from 'child_process';
import fetch from 'node-fetch';

const CLIENT_ID = '86vq79l9h9uipd';
const CLIENT_SECRET = 'WPL_AP1.rMmzsUVYNy4Y8JcB.7DXBeA==';
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPES = 'openid profile w_member_social';

const authUrl =
  `https://www.linkedin.com/oauth/v2/authorization` +
  `?response_type=code` +
  `&client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}`;

console.log('\n🔗 Opening LinkedIn authorization in your browser...\n');
exec(`open "${authUrl}"`); // macOS

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:3000`);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.end(`<h2>Error: ${error}</h2>`);
    server.close();
    return;
  }

  if (!code) {
    res.end('<h2>No code received.</h2>');
    return;
  }

  res.end('<h2>Authorization successful. You can close this tab.</h2>');

  // Exchange code for access token
  console.log('⏳ Exchanging code for access token...');
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error('❌ Token exchange failed:', JSON.stringify(tokenData, null, 2));
    server.close();
    return;
  }

  const accessToken = tokenData.access_token;
  console.log('\n✅ Access token obtained!\n');

  // Get person URN via userinfo
  const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userData = await userRes.json();
  const sub = userData.sub; // This is the person ID
  const personUrn = `urn:li:person:${sub}`;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Add these to your GitHub repository secrets:\n');
  console.log(`LINKEDIN_ACCESS_TOKEN=${accessToken}`);
  console.log(`LINKEDIN_PERSON_URN=${personUrn}`);
  console.log('\nToken expires in:', Math.round(tokenData.expires_in / 86400), 'days');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  server.close();
});

server.listen(3000, () => {
  console.log('🟢 Waiting for LinkedIn to redirect to localhost:3000...\n');
});
