import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { platform, postId, text, scheduleDate, scheduleTime } = await req.json();
    
    if (!platform || !postId) {
      return NextResponse.json({ error: 'Missing platform or postId' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'scripts', `${platform}-posts.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Platform file not found' }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const isObject = !Array.isArray(data);
    const posts = isObject ? data.posts || [] : data;

    const postIndex = posts.findIndex((p: any) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update the post fields
    if (text !== undefined) posts[postIndex].text = text;
    if (scheduleDate !== undefined) posts[postIndex].scheduleDate = scheduleDate;
    if (scheduleTime !== undefined) posts[postIndex].scheduleTime = scheduleTime;

    // Save back to the filesystem
    if (isObject) {
      data.posts = posts;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } else {
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error saving post:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
