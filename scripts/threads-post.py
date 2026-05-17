#!/usr/bin/env python3
"""
Threads poster using Instagram private API session.
Uses the Barcelona (Threads) user agent with IG session cookies.

Usage:
  python3 threads-post.py --text "Hello from Threads"
  python3 threads-post.py --text "Check this image" --image /path/to/image.jpg
  python3 threads-post.py --test  # Just verify session
  
Outputs JSON: {"media_id": "...", "code": "...", "url": "..."}
"""
import argparse
import json
import sys
import os
import time
import uuid
import requests

THREADS_UA = "Barcelona 337.0.0.28.101 Android (33/13; 440dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100)"
THREADS_APP_ID = "238260118697367"


def get_threads_session():
    """Build authenticated Threads session from IG session cookies"""
    from instagrapi import Client
    
    cl = Client()
    session_path = os.path.expanduser('~/.ig_session.json')
    
    if not os.path.exists(session_path):
        raise Exception("No IG session found at ~/.ig_session.json. Run refresh-meta-tokens.py first.")
    
    cl.load_settings(session_path)
    info = cl.account_info()
    
    # Build Threads-specific request session
    session = requests.Session()
    session_cookies = dict(cl.private.cookies)
    
    for k, v in session_cookies.items():
        session.cookies.set(k, v, domain=".instagram.com")
    
    headers = {
        "User-Agent": THREADS_UA,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRFToken": session_cookies.get("csrftoken", ""),
        "X-IG-App-ID": THREADS_APP_ID,
    }
    
    return session, headers, info


def post_text(session, headers, user_pk, text, reply_to=None):
    """Post a text-only thread"""
    data = {
        "publish_mode": "text_post",
        "text_post_app_info": json.dumps({"reply_control": 0}),
        "timezone_offset": "19800",
        "source_type": "4",
        "caption": text,
        "_uid": str(user_pk),
        "_uuid": str(uuid.uuid4()),
        "device_id": "android-abc123",
    }
    
    if reply_to:
        data["text_post_app_info"] = json.dumps({
            "reply_control": 0,
            "reply_id": reply_to,
        })
    
    resp = session.post(
        "https://i.instagram.com/api/v1/media/configure_text_post_app_feed/",
        headers=headers,
        data=data,
    )
    
    result = resp.json()
    if result.get("status") != "ok":
        raise Exception(f"Post failed: {result.get('message', result)}")
    
    media = result.get("media", {})
    media_id = media.get("id", "")
    code = media.get("code", "")
    
    return {
        "media_id": media_id,
        "code": code,
        "url": f"https://www.threads.com/@vedangvatsa/post/{code}" if code else "",
        "status": "ok",
    }


def post_image(session, headers, user_pk, text, image_path):
    """Post a thread with an image"""
    # Step 1: Upload the image using rupload
    upload_id = str(int(time.time() * 1000))
    
    with open(image_path, 'rb') as f:
        image_data = f.read()
    
    # Upload photo
    upload_headers = {
        **headers,
        "Content-Type": "application/octet-stream",
        "X-Entity-Length": str(len(image_data)),
        "X-Entity-Name": f"fb_uploader_{upload_id}",
        "X-Instagram-Rupload-Params": json.dumps({
            "upload_id": upload_id,
            "media_type": "1",
            "image_compression": json.dumps({
                "lib_name": "moz",
                "lib_version": "3.1.m",
                "quality": "80"
            }),
        }),
        "Offset": "0",
    }
    
    upload_resp = session.post(
        f"https://i.instagram.com/rupload_igphoto/fb_uploader_{upload_id}",
        headers=upload_headers,
        data=image_data,
    )
    
    upload_result = upload_resp.json()
    if upload_result.get("status") != "ok":
        raise Exception(f"Image upload failed: {upload_result}")
    
    # Step 2: Configure the text post with the image
    data = {
        "publish_mode": "text_post",
        "text_post_app_info": json.dumps({"reply_control": 0}),
        "timezone_offset": "19800",
        "source_type": "4",
        "caption": text,
        "_uid": str(user_pk),
        "_uuid": str(uuid.uuid4()),
        "device_id": "android-abc123",
        "upload_id": upload_id,
        "scene_capture_type": "",
    }
    
    resp = session.post(
        "https://i.instagram.com/api/v1/media/configure_text_post_app_feed/",
        headers=headers,
        data=data,
    )
    
    result = resp.json()
    if result.get("status") != "ok":
        raise Exception(f"Post failed: {result.get('message', result)}")
    
    media = result.get("media", {})
    code = media.get("code", "")
    
    return {
        "media_id": media.get("id", ""),
        "code": code,
        "url": f"https://www.threads.com/@vedangvatsa/post/{code}" if code else "",
        "status": "ok",
    }


def main():
    parser = argparse.ArgumentParser(description='Post to Threads via Instagram private API')
    parser.add_argument('--text', help='Post text')
    parser.add_argument('--image', help='Path to image file')
    parser.add_argument('--test', action='store_true', help='Test session without posting')
    args = parser.parse_args()
    
    if not args.test and not args.text:
        parser.error("--text is required (unless --test)")
    
    try:
        session, headers, info = get_threads_session()
        
        if args.test:
            print(json.dumps({
                "status": "ok",
                "username": info.username,
                "pk": str(info.pk),
                "session": "active",
            }))
            return
        
        if args.image:
            result = post_image(session, headers, info.pk, args.text, args.image)
        else:
            result = post_text(session, headers, info.pk, args.text)
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "fail"}))
        sys.exit(1)


if __name__ == '__main__':
    main()
