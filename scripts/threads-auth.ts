#!/usr/bin/env node
/**
 * Threads OAuth Setup
 * Spins up a local server to handle the redirect, then exchanges the code.
 * Run once to get a long-lived token.
 */
import http from 'http';
import { URL } from 'url';
import open from 'open';

const THREADS_APP_ID = '929865946702224';
const THREADS_APP_SECRET = '***REDACTED_THREADS_SECRET***';
const REDIRECT_URI = 'https://veda.ng/api/auth/threads/callback';
const PORT = 3847;

// Try localhost redirect instead
const LOCAL_REDIRECT = `http://localhost:${PORT}/callback`;

async function exchangeCode(code: string): Promise<any> {
  const params = new URLSearchParams({
    client_id: THREADS_APP_ID,
    client_secret: THREADS_APP_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: LOCAL_REDIRECT,
    code,
  });

  const res = await fetch('https://graph.threads.net/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  return res.json();
}

async function getLongLivedToken(shortToken: string): Promise<any> {
  const res = await fetch(
    `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${THREADS_APP_SECRET}&access_token=${shortToken}`
  );
  return res.json();
}

async function getUserInfo(token: string): Promise<any> {
  const res = await fetch(
    `https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${token}`
  );
  return res.json();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);
  
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error_message');

    if (error) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>Error</h1><p>${error}</p>`);
      console.log(`\n❌ Error: ${error}`);
      process.exit(1);
    }

    if (code) {
      console.log(`\n🔑 Got code: ${code.substring(0, 20)}...`);
      
      // Exchange for short-lived token
      console.log('📤 Exchanging for token...');
      const tokenData = await exchangeCode(code);
      
      if (tokenData.error) {
        console.log(`❌ Token exchange failed: ${JSON.stringify(tokenData)}`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Token Error</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`);
        process.exit(1);
      }

      console.log(`✅ Short-lived token: ${tokenData.access_token?.substring(0, 20)}...`);
      console.log(`   User ID: ${tokenData.user_id}`);

      // Exchange for long-lived token
      console.log('📤 Getting long-lived token...');
      const llToken = await getLongLivedToken(tokenData.access_token);
      
      if (llToken.error) {
        console.log(`⚠️ Long-lived exchange failed, using short-lived`);
      }

      const finalToken = llToken.access_token || tokenData.access_token;
      const userId = tokenData.user_id;

      // Get user info
      const userInfo = await getUserInfo(finalToken);
      console.log(`\n👤 Threads user: @${userInfo.username} (${userId})`);

      console.log('\n=== ADD THESE TO .env.local ===');
      console.log(`THREADS_USER_ID=${userId}`);
      console.log(`THREADS_ACCESS_TOKEN=${finalToken}`);
      console.log('================================\n');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>✅ Threads Connected!</h1>
        <p>User: @${userInfo.username} (${userId})</p>
        <p>Token saved. You can close this tab.</p>`);
      
      setTimeout(() => process.exit(0), 1000);
    }
  }
});

server.listen(PORT, () => {
  const authUrl = `https://threads.net/oauth/authorize?client_id=${THREADS_APP_ID}&redirect_uri=${encodeURIComponent(LOCAL_REDIRECT)}&scope=threads_basic,threads_content_publish&response_type=code&state=threads_auth`;
  
  console.log('🌐 Threads OAuth Server running on port', PORT);
  console.log('\nOpen this URL in your browser:');
  console.log(authUrl);
  console.log('\nWaiting for callback...');
});
