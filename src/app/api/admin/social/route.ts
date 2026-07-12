import { NextRequest, NextResponse } from 'next/server';
import {
  forbidden,
  getClientIp,
  isAllowedOrigin,
  isRateLimited,
  requireAdminSecret,
  tooManyRequests,
} from '@/lib/api-auth';
import fs from 'fs';
import path from 'path';

const ALLOWED_PLATFORMS = new Set([
  'x',
  'twitter',
  'linkedin',
  'threads',
  'instagram',
  'youtube',
  'telegram',
]);

export async function POST(req: NextRequest) {
  const authError = requireAdminSecret(req);
  if (authError) return authError;

  if (!isAllowedOrigin(req)) {
    return forbidden('Origin not allowed');
  }

  const ip = getClientIp(req);
  if (isRateLimited(`admin-social:${ip}`, 30, 60_000)) {
    return tooManyRequests();
  }

  // Production App Hosting FS is typically read-only; refuse writes there.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_ADMIN_FS_WRITE !== '1') {
    return NextResponse.json(
      { error: 'Filesystem writes disabled in production' },
      { status: 403 }
    );
  }

  try {
    const { platform, postId, text, scheduleDate, scheduleTime } = await req.json();

    if (!platform || !postId) {
      return NextResponse.json({ error: 'Missing platform or postId' }, { status: 400 });
    }

    const platformKey = String(platform).toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!platformKey || !ALLOWED_PLATFORMS.has(platformKey)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    if (typeof postId !== 'string' || postId.length > 200) {
      return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
    }

    if (text !== undefined && (typeof text !== 'string' || text.length > 10000)) {
      return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'scripts', `${platformKey}-posts.json`);
    const scriptsDir = path.join(process.cwd(), 'scripts');
    if (!filePath.startsWith(scriptsDir) || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Platform file not found' }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const isObject = !Array.isArray(data);
    const posts = isObject ? data.posts || [] : data;

    const postIndex = posts.findIndex((p: { id?: string }) => p.id === postId);
    if (postIndex === -1) {
      // Create new post if not found
      const newPost = {
        id: postId,
        text: text ?? '',
        scheduleDate: scheduleDate ?? '',
        scheduleTime: scheduleTime ?? '',
        posted: false,
        postedAt: null,
        error: null,
      };
      posts.push(newPost);
    }
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (text !== undefined) posts[postIndex].text = text;
    if (scheduleDate !== undefined) posts[postIndex].scheduleDate = scheduleDate;
    if (scheduleTime !== undefined) posts[postIndex].scheduleTime = scheduleTime;

    if (isObject) {
      data.posts = posts;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } else {
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    }

    return NextResponse.json({ success: true, created: postIndex === -1 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error saving post:', message);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authError = requireAdminSecret(req);
  if (authError) return authError;

  if (!isAllowedOrigin(req)) {
    return forbidden('Origin not allowed');
  }

  const ip = getClientIp(req);
  if (isRateLimited(`admin-social-get:${ip}`, 60, 60_000)) {
    return tooManyRequests();
  }

  try {
    const scriptsDir = path.join(process.cwd(), 'scripts');
    let files: string[] = [];
    try {
      files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('-posts.json'));
    } catch (err) {
      console.error('Error reading scripts dir', err);
      return NextResponse.json({ error: 'Failed to read scripts directory' }, { status: 500 });
    }

    const platforms: Record<string, any[]> = {};

    for (const file of files) {
      const platformName = file.replace('-posts.json', '');
      try {
        const data = JSON.parse(fs.readFileSync(path.join(scriptsDir, file), 'utf8'));
        const posts = Array.isArray(data) ? data : data.posts || [];
        platforms[platformName] = posts.map((p: any) => ({
          id: p.id || 'Unknown',
          text: p.text || '',
          posted: !!p.posted,
          scheduleDate: p.scheduleDate || '',
          scheduleTime: p.scheduleTime || '',
          postedAt: p.postedAt || null,
          error: p.error || null,
        }));
      } catch (e) {
        console.error(`Error reading ${file}`, e);
      }
    }

    return NextResponse.json({ platforms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error loading posts:', message);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
