import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Resolve the path to the platform-specific posts JSON file
function getPostsFilePath(platform: string) {
  const fileName = `${platform}-posts.json`;
  return path.resolve(process.cwd(), 'scripts', fileName);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform');
  const auth = request.headers.get('authorization');

  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (!platform) {
    return NextResponse.json({ error: 'platform query param required' }, { status: 400 });
  }
  try {
    const filePath = getPostsFilePath(platform);
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform');
  const auth = request.headers.get('authorization');

  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (!platform) {
    return NextResponse.json({ error: 'platform query param required' }, { status: 400 });
  }
  try {
    const posts = await request.json();
    const filePath = getPostsFilePath(platform);
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write posts' }, { status: 500 });
  }
}
