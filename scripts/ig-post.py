#!/usr/bin/env python3
"""
Instagram poster using instagrapi (private API).
Uses saved Chrome session cookies — no username/password needed.

Usage:
  python3 ig-post.py --image /path/to/image.jpg --caption "Hello"
  python3 ig-post.py --video /path/to/video.mp4 --caption "Hello"
  
Outputs JSON: {"media_id": "...", "media_code": "...", "url": "..."}
"""
import argparse
import json
import sys
import os

def get_client():
    """Create an authenticated instagrapi client using saved session"""
    from instagrapi import Client
    
    cl = Client()
    session_path = os.path.expanduser('~/.ig_session.json')
    
    if os.path.exists(session_path):
        cl.load_settings(session_path)
        try:
            cl.account_info()  # Test session
            return cl
        except Exception:
            pass  # Session expired, try login
    
    # Fallback: use env vars if available
    username = os.environ.get('IG_USERNAME', '')
    password = os.environ.get('IG_PASSWORD', '')
    
    if username and password:
        cl.login(username, password)
        cl.dump_settings(session_path)
        return cl
    
    raise Exception("No valid session found. Run session setup script first or set IG_USERNAME/IG_PASSWORD.")

def main():
    parser = argparse.ArgumentParser(description='Post to Instagram via private API')
    parser.add_argument('--image', help='Path to image file')
    parser.add_argument('--video', help='Path to video file')
    parser.add_argument('--caption', default='', help='Post caption')
    parser.add_argument('--username', help='(Optional) IG username override')
    parser.add_argument('--password', help='(Optional) IG password override')
    args = parser.parse_args()

    # Set env vars from args if provided
    if args.username:
        os.environ['IG_USERNAME'] = args.username
    if args.password:
        os.environ['IG_PASSWORD'] = args.password

    try:
        from instagrapi import Client
    except ImportError:
        print(json.dumps({"error": "instagrapi not installed. Run: pip3 install instagrapi"}))
        sys.exit(1)

    try:
        cl = get_client()
    except Exception as e:
        print(json.dumps({"error": f"Login failed: {str(e)}"}))
        sys.exit(1)
    
    try:
        if args.image:
            media = cl.photo_upload(args.image, caption=args.caption)
        elif args.video:
            media = cl.video_upload(args.video, caption=args.caption)
        else:
            print(json.dumps({"error": "No --image or --video provided"}))
            sys.exit(1)
        
        result = {
            "media_id": str(media.id),
            "media_code": media.code,
            "media_pk": str(media.pk),
            "url": f"https://www.instagram.com/p/{media.code}/"
        }
        print(json.dumps(result))
        
        # Save updated session
        session_path = os.path.expanduser('~/.ig_session.json')
        cl.dump_settings(session_path)
        
    except Exception as e:
        print(json.dumps({"error": f"Post failed: {str(e)}"}))
        sys.exit(1)

if __name__ == '__main__':
    main()
