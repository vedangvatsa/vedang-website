import { NextRequest, NextResponse } from 'next/server';

const THREADS_APP_ID = '929865946702224';
const THREADS_APP_SECRET = process.env.THREADS_APP_SECRET || '';
const REDIRECT_URI = 'https://veda.ng/api/auth/threads/callback';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error_message');

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for short-lived token
    const tokenRes = await fetch('https://graph.threads.net/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: THREADS_APP_ID,
        client_secret: THREADS_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: 'Token exchange failed', details: tokenData }, { status: 500 });
    }

    // Exchange for long-lived token
    const llRes = await fetch(
      `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${THREADS_APP_SECRET}&access_token=${tokenData.access_token}`
    );
    const llData = await llRes.json();

    const finalToken = llData.access_token || tokenData.access_token;
    const userId = tokenData.user_id;

    // Get user info
    const userRes = await fetch(
      `https://graph.threads.net/v1.0/me?fields=id,username&access_token=${finalToken}`
    );
    const userInfo = await userRes.json();

    // Return the token info as a simple page
    const html = `
<!DOCTYPE html>
<html>
<head><title>Threads Connected</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
  .token { background: #f0f0f0; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; margin: 8px 0; }
  .success { color: #22c55e; }
</style>
</head>
<body>
  <h1 class="success">✅ Threads Connected!</h1>
  <p><b>User:</b> @${userInfo.username} (${userId})</p>
  <p><b>Add these to .env.local:</b></p>
  <div class="token">THREADS_USER_ID=${userId}</div>
  <div class="token">THREADS_ACCESS_TOKEN=${finalToken}</div>
  <p>You can close this tab.</p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
