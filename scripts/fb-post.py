#!/usr/bin/env python3
"""
Facebook Page poster using Chrome session cookies.
Gets a fresh page token from the active browser session.

Usage:
  python3 fb-post.py --page-id 1785048661795414 --text "Hello" [--image /path/to/image.jpg]
  python3 fb-post.py --page-id 1785048661795414 --text "Hello" --link https://example.com
  
Outputs JSON: {"post_id": "...", "page_token": "..."}
"""
import argparse
import json
import sys
import os
import sqlite3
import shutil
from hashlib import pbkdf2_hmac
from pathlib import Path
import subprocess
import requests

def get_chrome_cookies(domain, profile="Default"):
    """Extract decrypted cookies from Chrome"""
    from Crypto.Cipher import AES
    
    proc = subprocess.run(
        ['security', 'find-generic-password', '-w', '-s', 'Chrome Safe Storage'],
        capture_output=True, text=True
    )
    key = pbkdf2_hmac('sha1', proc.stdout.strip().encode(), b'saltysalt', 1003, dklen=16)
    
    src = Path.home() / f"Library/Application Support/Google/Chrome/{profile}/Cookies"
    tmp = f"/tmp/_fb_cookies_{os.getpid()}.db"
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

def get_page_token(session, page_id, user_token):
    """Get a page access token using the user token"""
    resp = session.get(
        f"https://graph.facebook.com/v21.0/{page_id}",
        params={"fields": "access_token", "access_token": user_token}
    )
    data = resp.json()
    if "access_token" in data:
        return data["access_token"]
    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--page-id', required=True)
    parser.add_argument('--text', required=True)
    parser.add_argument('--image', help='Path to image file')
    parser.add_argument('--link', help='URL to attach')
    parser.add_argument('--token', help='Page access token (if already known)')
    parser.add_argument('--get-token-only', action='store_true', help='Just output the page token')
    args = parser.parse_args()

    page_token = args.token
    
    if not page_token:
        # Try to get token from env
        page_token = os.environ.get('FACEBOOK_PAGE_TOKEN', '')
        
        # Test if token is valid
        if page_token:
            resp = requests.get(
                f"https://graph.facebook.com/v21.0/me",
                params={"access_token": page_token}
            )
            if resp.status_code != 200 or 'error' in resp.json():
                page_token = ''  # Token expired
    
    if not page_token:
        print(json.dumps({"error": "No valid page token. Provide --token or set FACEBOOK_PAGE_TOKEN"}))
        sys.exit(1)
    
    if args.get_token_only:
        print(json.dumps({"page_token": page_token}))
        return
    
    # Post to page
    try:
        if args.image:
            # Photo post
            with open(args.image, 'rb') as f:
                resp = requests.post(
                    f"https://graph.facebook.com/v21.0/{args.page_id}/photos",
                    files={"source": f},
                    data={"message": args.text, "access_token": page_token}
                )
        elif args.link:
            resp = requests.post(
                f"https://graph.facebook.com/v21.0/{args.page_id}/feed",
                data={"message": args.text, "link": args.link, "access_token": page_token}
            )
        else:
            resp = requests.post(
                f"https://graph.facebook.com/v21.0/{args.page_id}/feed",
                data={"message": args.text, "access_token": page_token}
            )
        
        result = resp.json()
        if 'error' in result:
            print(json.dumps({"error": result['error']['message']}))
            sys.exit(1)
        
        print(json.dumps({"post_id": result.get("id", result.get("post_id", "")), "page_token": page_token}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
