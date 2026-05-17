#!/usr/bin/env node
/**
 * Meta Unified Auth
 * Handles:
 *   - Facebook/Instagram: Uses client-side token flow (response_type=token)
 *   - Threads: Uses server-side code exchange (has app secret)
 * 
 * Run: npx tsx scripts/meta-auth.ts
 */
import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.resolve(REPO_ROOT, '.env.local');
dotenv.config({ path: ENV_PATH });

const FB_APP_ID = '2103439746897018';
const THREADS_APP_ID = process.env.THREADS_APP_ID || '929865946702224';
const THREADS_APP_SECRET = process.env.THREADS_APP_SECRET || '';
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';

const PORT = 3847;

// Facebook uses client-side token flow (no app secret needed)
const FB_REDIRECT = `http://localhost:${PORT}/fb-callback`;
// Threads uses server-side code exchange  
const THREADS_REDIRECT = `http://localhost:${PORT}/threads-callback`;

// Only valid scopes — instagram_basic is deprecated
const FB_SCOPES = [
  'pages_show_list',
  'pages_manage_posts',
  'pages_read_engagement',
  'pages_read_user_content',
  'instagram_content_publish',
  'instagram_manage_comments',
  'public_profile',
].join(',');

const THREADS_SCOPES = 'threads_basic,threads_content_publish';

function updateEnvVar(key: string, value: string) {
  let content = fs.readFileSync(ENV_PATH, 'utf-8');
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}`;
  }
  fs.writeFileSync(ENV_PATH, content);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);
  
  if (url.pathname === '/') {
    // Facebook: use response_type=token for client-side flow
    const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(FB_REDIRECT)}&scope=${FB_SCOPES}&response_type=token`;
    const threadsAuthUrl = `https://threads.net/oauth/authorize?client_id=${THREADS_APP_ID}&redirect_uri=${encodeURIComponent(THREADS_REDIRECT)}&scope=${THREADS_SCOPES}&response_type=code&state=threads_auth`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html><head><title>Meta Auth</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #fafafa; }
  h1 { margin-bottom: 8px; }
  .subtitle { color: #666; margin-bottom: 32px; }
  a.btn { display: block; padding: 18px; margin: 12px 0; border-radius: 10px; color: white; text-decoration: none; text-align: center; font-size: 16px; font-weight: 600; transition: transform 0.1s; }
  a.btn:hover { transform: scale(1.02); }
  .fb { background: linear-gradient(135deg, #1877F2, #0d65d9); }
  .threads { background: linear-gradient(135deg, #000, #333); }
  .note { font-size: 13px; color: #999; margin-top: 24px; padding: 12px; background: #f0f0f0; border-radius: 8px; }
</style></head>
<body>
  <h1>🔐 Meta Auth Setup</h1>
  <p class="subtitle">Click each button to authorize. Tokens save automatically.</p>
  
  <a class="btn fb" href="${fbAuthUrl}">
    📸 Authorize Facebook + Instagram
  </a>
  
  <a class="btn threads" href="${threadsAuthUrl}">
    🧵 Authorize Threads
  </a>
  
  <div class="note">
    After clicking each button, you'll be redirected to Meta to log in and grant permissions.
    The tokens will be saved to .env.local automatically.
  </div>
</body></html>`);
    return;
  }

  // Facebook callback — client-side token flow puts token in URL fragment (#access_token=...)
  // Browsers don't send fragments to the server, so we need a client-side redirect
  if (url.pathname === '/fb-callback') {
    // Check if this is the hash-relay (POST with token in body)
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      req.on('end', async () => {
        const params = new URLSearchParams(body);
        const userToken = params.get('access_token') || '';
        
        if (!userToken) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ No token received</h1>');
          return;
        }

        console.log(`\n🔑 Facebook: Got user access token`);
        
        // Exchange user token for page token
        console.log('📤 Getting page token...');
        const pagesRes = await fetch(
          `https://graph.facebook.com/v21.0/me/accounts?access_token=${userToken}`
        );
        const pagesData = await pagesRes.json() as any;
        
        if (pagesData.error) {
          console.log(`❌ Pages fetch failed: ${JSON.stringify(pagesData.error)}`);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<h1>❌ Error</h1><pre>${JSON.stringify(pagesData.error, null, 2)}</pre>`);
          return;
        }

        const page = pagesData.data?.find((p: any) => p.id === FB_PAGE_ID) || pagesData.data?.[0];
        if (!page) {
          console.log('❌ No pages found');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ No Facebook pages found</h1>');
          return;
        }

        const pageToken = page.access_token;
        const pageName = page.name;
        console.log(`✅ Page: ${pageName} (${page.id})`);

        // Get IG account
        const igRes = await fetch(
          `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account,page_backed_instagram_accounts{id,username}&access_token=${pageToken}`
        );
        const igData = await igRes.json() as any;
        const igAccount = igData.instagram_business_account?.id || 
                          igData.page_backed_instagram_accounts?.data?.[0]?.id;
        const igUsername = igData.page_backed_instagram_accounts?.data?.[0]?.username || '';

        // Save to .env.local
        updateEnvVar('FACEBOOK_PAGE_TOKEN', pageToken);
        updateEnvVar('FACEBOOK_PAGE_ID', page.id);
        if (igAccount) {
          updateEnvVar('INSTAGRAM_ACCOUNT_ID', igAccount);
        }

        console.log(`\n✅ Saved to .env.local:`);
        console.log(`   FACEBOOK_PAGE_TOKEN (${pageName})`);
        console.log(`   FACEBOOK_PAGE_ID=${page.id}`);
        if (igAccount) {
          console.log(`   INSTAGRAM_ACCOUNT_ID=${igAccount} ${igUsername ? `(@${igUsername})` : ''}`);
        }

        // Verify instagram_content_publish permission
        const debugRes = await fetch(
          `https://graph.facebook.com/v21.0/debug_token?input_token=${pageToken}&access_token=${pageToken}`
        );
        const debugData = await debugRes.json() as any;
        const scopes = debugData.data?.scopes || [];
        const hasIG = scopes.includes('instagram_content_publish');
        console.log(`   instagram_content_publish: ${hasIG ? '✅ YES' : '❌ NO'}`);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>✅ Facebook + Instagram Connected!</h1>
          <p><b>Page:</b> ${pageName} (${page.id})</p>
          ${igAccount ? `<p><b>Instagram:</b> ${igAccount} ${igUsername ? `(@${igUsername})` : ''}</p>` : '<p>⚠️ No Instagram account linked to this page</p>'}
          <p><b>instagram_content_publish:</b> ${hasIG ? '✅ Yes' : '❌ No'}</p>
          <p>Tokens saved to .env.local automatically.</p>
          <p><a href="/">← Back to authorize Threads</a></p>`);
      });
      return;
    }

    // Initial redirect from Facebook — extract token from URL hash client-side
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html><head><title>Processing...</title></head>
<body>
<h2>⏳ Processing Facebook token...</h2>
<script>
  // Facebook puts the token in the URL fragment (#access_token=...)
  const hash = window.location.hash.substring(1);
  if (hash) {
    fetch('/fb-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: hash
    }).then(r => r.text()).then(html => {
      document.body.innerHTML = html;
    });
  } else {
    document.body.innerHTML = '<h1>❌ No token in URL. Try again.</h1><p><a href="/">← Back</a></p>';
  }
</script>
</body></html>`);
    return;
  }

  // Threads callback — server-side code exchange
  if (url.pathname === '/threads-callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error_message');
    
    if (error) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>❌ Threads Error</h1><p>${error}</p><p><a href="/">← Back</a></p>`);
      return;
    }
    
    if (code) {
      console.log(`\n🔑 Threads: Got auth code, exchanging...`);
      
      const params = new URLSearchParams({
        client_id: THREADS_APP_ID,
        client_secret: THREADS_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: THREADS_REDIRECT,
        code,
      });

      const tokenRes = await fetch('https://graph.threads.net/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const tokenData = await tokenRes.json() as any;
      
      if (tokenData.error) {
        console.log(`❌ Threads token exchange failed: ${JSON.stringify(tokenData)}`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>❌ Token Error</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre><p><a href="/">← Back</a></p>`);
        return;
      }

      console.log(`✅ Threads short-lived token received`);
      
      // Get long-lived token
      const llRes = await fetch(
        `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${THREADS_APP_SECRET}&access_token=${tokenData.access_token}`
      );
      const llData = await llRes.json() as any;
      
      const finalToken = llData.access_token || tokenData.access_token;
      const userId = tokenData.user_id;
      
      // Get user info
      const userRes = await fetch(
        `https://graph.threads.net/v1.0/me?fields=id,username&access_token=${finalToken}`
      );
      const userInfo = await userRes.json() as any;
      
      console.log(`\n👤 Threads user: @${userInfo.username} (${userId})`);
      
      // Save to .env.local
      updateEnvVar('THREADS_USER_ID', userId);
      updateEnvVar('THREADS_ACCESS_TOKEN', finalToken);
      
      console.log(`✅ Saved THREADS_USER_ID and THREADS_ACCESS_TOKEN to .env.local\n`);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>✅ Threads Connected!</h1>
        <p><b>User:</b> @${userInfo.username} (${userId})</p>
        <p>Token saved to .env.local automatically.</p>
        <p><a href="/">← Back</a></p>`);
    }
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n🌐 Meta Auth Server running on http://localhost:${PORT}`);
  console.log(`\nOpen this URL in your browser:`);
  console.log(`  http://localhost:${PORT}\n`);
});
