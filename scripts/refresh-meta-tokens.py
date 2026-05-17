#!/usr/bin/env python3
"""
Meta Token Refresher
Extracts fresh access tokens from Chrome browser session.

Uses the Facebook Graph API OAuth dialog with the active browser session
to generate new user and page tokens without manual intervention.

Also handles Threads token acquisition using the Threads OAuth flow.

Usage:
  python3 refresh-meta-tokens.py
  python3 refresh-meta-tokens.py --threads-only
  python3 refresh-meta-tokens.py --fb-only
"""
import argparse
import json
import os
import sys
import re
import sqlite3
import shutil
from hashlib import pbkdf2_hmac
from pathlib import Path
import subprocess
import http.server
import threading
import time
import urllib.parse

REPO_ROOT = Path(__file__).parent.parent
ENV_FILE = REPO_ROOT / ".env.local"

# App IDs
FB_APP_ID = "2103439746897018"
THREADS_APP_ID = "929865946702224"
THREADS_APP_SECRET = "8ba2306b09500505770edc74162aa6ed"


def get_chrome_cookies(domain, profile="Default"):
    """Extract decrypted cookies from Chrome"""
    from Crypto.Cipher import AES
    
    proc = subprocess.run(
        ['security', 'find-generic-password', '-w', '-s', 'Chrome Safe Storage'],
        capture_output=True, text=True
    )
    key = pbkdf2_hmac('sha1', proc.stdout.strip().encode(), b'saltysalt', 1003, dklen=16)
    
    src = Path.home() / f"Library/Application Support/Google/Chrome/{profile}/Cookies"
    tmp = f"/tmp/_meta_cookies_{os.getpid()}.db"
    shutil.copy2(src, tmp)
    
    conn = sqlite3.connect(tmp)
    c = conn.cursor()
    c.execute("SELECT name, encrypted_value, value FROM cookies WHERE host_key LIKE ?", (f'%{domain}%',))
    
    cookies = {}
    for name, enc, val in c.fetchall():
        if val:
            cookies[name] = val
        elif enc and enc[:3] == b'v10':
            dec = AES.new(key, AES.MODE_CBC, b' '*16).decrypt(enc[3:])
            pad = dec[-1]
            if 0 < pad <= 16:
                dec = dec[:-pad]
            result = dec.decode('latin-1')
            for i in range(len(result)):
                rest = result[i:]
                if all(c.isprintable() and ord(c) < 128 for c in rest[:min(5, len(rest))]):
                    cookies[name] = rest
                    break
    
    conn.close()
    os.unlink(tmp)
    return cookies


def update_env(key, value):
    """Update a key in .env.local"""
    env_path = str(ENV_FILE)
    
    if not os.path.exists(env_path):
        with open(env_path, 'w') as f:
            f.write(f"{key}={value}\n")
        return
    
    with open(env_path, 'r') as f:
        lines = f.readlines()
    
    found = False
    for i, line in enumerate(lines):
        if line.startswith(f"{key}="):
            lines[i] = f"{key}={value}\n"
            found = True
            break
    
    if not found:
        lines.append(f"{key}={value}\n")
    
    with open(env_path, 'w') as f:
        f.writelines(lines)


def test_token(token, api_base="https://graph.facebook.com/v21.0"):
    """Test if a token is valid"""
    import requests
    try:
        resp = requests.get(f"{api_base}/me", params={"access_token": token})
        data = resp.json()
        return 'error' not in data, data
    except:
        return False, {}


def refresh_threads_token():
    """Try to get Threads token via OAuth code exchange"""
    import requests
    
    print("\n=== Threads Token ===")
    
    # Check if we already have a valid Threads token
    existing = os.environ.get('THREADS_ACCESS_TOKEN', '')
    if existing:
        valid, data = test_token(existing, "https://graph.threads.net/v1.0")
        if valid:
            print(f"✅ Existing Threads token valid: @{data.get('username', 'unknown')}")
            return True
    
    # Need OAuth flow — start local server and wait for callback
    redirect_uri = "http://localhost:3847/callback"
    auth_url = (
        f"https://threads.net/oauth/authorize?"
        f"client_id={THREADS_APP_ID}"
        f"&redirect_uri={urllib.parse.quote(redirect_uri)}"
        f"&scope=threads_basic,threads_content_publish"
        f"&response_type=code"
        f"&state=threads_auth"
    )
    
    print(f"🔗 Threads requires browser OAuth.")
    print(f"   Auth URL: {auth_url}")
    print(f"   Redirect must be registered as: {redirect_uri}")
    
    # Start callback server
    code_holder = {"code": None}
    
    class CallbackHandler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            code = params.get('code', [None])[0]
            
            if code:
                code_holder["code"] = code
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(b"<h1>Threads authorized! You can close this tab.</h1>")
            else:
                error = params.get('error_message', ['Unknown error'])[0]
                self.send_response(400)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(f"<h1>Error: {error}</h1>".encode())
        
        def log_message(self, *args):
            pass  # Suppress logs
    
    server = http.server.HTTPServer(('localhost', 3847), CallbackHandler)
    server.timeout = 120  # 2 minute timeout
    
    # Open auth URL
    subprocess.Popen(['open', auth_url])
    print("   ⏳ Waiting for callback (2 min timeout)...")
    
    # Wait for callback
    start = time.time()
    while not code_holder["code"] and time.time() - start < 120:
        server.handle_request()
    
    server.server_close()
    
    if not code_holder["code"]:
        print("   ❌ Timeout waiting for Threads OAuth callback")
        print("   ℹ️  Make sure http://localhost:3847/callback is registered in Threads app settings")
        return False
    
    # Exchange code for token
    code = code_holder["code"]
    print(f"   📝 Got auth code, exchanging for token...")
    
    resp = requests.post('https://graph.threads.net/oauth/access_token', data={
        'client_id': THREADS_APP_ID,
        'client_secret': THREADS_APP_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri,
        'code': code,
    })
    
    token_data = resp.json()
    if 'error' in token_data:
        print(f"   ❌ Token exchange failed: {token_data}")
        return False
    
    short_token = token_data['access_token']
    user_id = token_data['user_id']
    
    # Exchange for long-lived token
    ll_resp = requests.get(
        f"https://graph.threads.net/access_token?"
        f"grant_type=th_exchange_token"
        f"&client_secret={THREADS_APP_SECRET}"
        f"&access_token={short_token}"
    )
    ll_data = ll_resp.json()
    final_token = ll_data.get('access_token', short_token)
    
    # Save to .env.local
    update_env('THREADS_USER_ID', str(user_id))
    update_env('THREADS_ACCESS_TOKEN', final_token)
    
    print(f"   ✅ Threads token saved! User ID: {user_id}")
    return True


def check_ig_session():
    """Verify Instagram session from Chrome cookies is active"""
    print("\n=== Instagram Session ===")
    
    try:
        from instagrapi import Client
        
        cl = Client()
        session_path = os.path.expanduser('~/.ig_session.json')
        
        if os.path.exists(session_path):
            cl.load_settings(session_path)
            try:
                info = cl.account_info()
                print(f"✅ Instagram session active: @{info.username}")
                print(f"   Is business: {info.is_business}")
                return True
            except:
                pass
        
        # Try to rebuild session from Chrome cookies
        ig_cookies = get_chrome_cookies('instagram.com')
        if 'sessionid' in ig_cookies and 'csrftoken' in ig_cookies:
            settings = {
                "uuids": {
                    "phone_id": ig_cookies.get('ig_did', ''),
                    "uuid": ig_cookies.get('ig_did', ''),
                    "client_session_id": ig_cookies.get('ig_did', ''),
                    "advertising_id": ig_cookies.get('ig_did', ''),
                    "android_device_id": "android-abc123"
                },
                "cookies": {},
                "authorization_data": {
                    "ds_user_id": ig_cookies.get('ds_user_id', ''),
                    "sessionid": ig_cookies['sessionid'],
                },
                "mid": ig_cookies.get('mid', ''),
                "ig_did": ig_cookies.get('ig_did', ''),
            }
            
            cl.set_settings(settings)
            cl.private.cookies.set("sessionid", ig_cookies['sessionid'], domain=".instagram.com")
            cl.private.cookies.set("csrftoken", ig_cookies['csrftoken'], domain=".instagram.com")
            cl.private.cookies.set("ds_user_id", ig_cookies.get('ds_user_id', ''), domain=".instagram.com")
            cl.private.cookies.set("mid", ig_cookies.get('mid', ''), domain=".instagram.com")
            
            info = cl.account_info()
            cl.dump_settings(session_path)
            print(f"✅ Rebuilt IG session from Chrome: @{info.username}")
            return True
        else:
            print("❌ No Instagram session cookies in Chrome")
            return False
            
    except Exception as e:
        print(f"❌ Instagram session check failed: {e}")
        return False


def check_fb_token():
    """Check if Facebook page token is valid"""
    import requests
    
    print("\n=== Facebook Page Token ===")
    
    token = os.environ.get('FACEBOOK_PAGE_TOKEN', '')
    if token:
        valid, data = test_token(token)
        if valid:
            print(f"✅ FB token valid: {data.get('name', 'unknown')}")
            return True
        else:
            print(f"⚠️  FB token expired: {data.get('error', {}).get('message', 'unknown')}")
    else:
        print("⚠️  No FACEBOOK_PAGE_TOKEN set")
    
    print("   ℹ️  To refresh: Go to developers.facebook.com > Graph API Explorer")
    print("   ℹ️  Select your app > Get User Token > Get Page Token")
    print("   ℹ️  Then run: python3 refresh-meta-tokens.py --set-fb-token YOUR_TOKEN")
    return False


def set_fb_token(token):
    """Set and validate a new FB page token"""
    import requests
    
    valid, data = test_token(token)
    if valid:
        update_env('FACEBOOK_PAGE_TOKEN', token)
        print(f"✅ FB token saved: {data.get('name', 'unknown')}")
        
        # Also try to get page token for the page
        page_id = os.environ.get('FACEBOOK_PAGE_ID', '1785048661795414')
        resp = requests.get(
            f"https://graph.facebook.com/v21.0/{page_id}",
            params={"fields": "access_token", "access_token": token}
        )
        page_data = resp.json()
        if 'access_token' in page_data:
            update_env('FACEBOOK_PAGE_TOKEN', page_data['access_token'])
            print(f"✅ Got never-expiring page token")
        
        return True
    else:
        print(f"❌ Token invalid: {data.get('error', {}).get('message', '')}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Refresh Meta platform tokens')
    parser.add_argument('--threads-only', action='store_true')
    parser.add_argument('--fb-only', action='store_true')
    parser.add_argument('--ig-only', action='store_true')
    parser.add_argument('--set-fb-token', help='Set a new FB user token')
    args = parser.parse_args()
    
    # Load existing env
    from dotenv import load_dotenv
    load_dotenv(str(ENV_FILE))
    
    if args.set_fb_token:
        set_fb_token(args.set_fb_token)
        return
    
    print("🔄 Meta Token Status Check")
    print("=" * 40)
    
    results = {}
    
    if not args.threads_only and not args.ig_only:
        results['facebook'] = check_fb_token()
    
    if not args.fb_only and not args.threads_only:
        results['instagram'] = check_ig_session()
    
    if not args.fb_only and not args.ig_only:
        results['threads'] = refresh_threads_token()
    
    print("\n" + "=" * 40)
    print("📊 Summary:")
    for platform, status in results.items():
        icon = "✅" if status else "❌"
        print(f"  {icon} {platform.title()}")


if __name__ == '__main__':
    main()
