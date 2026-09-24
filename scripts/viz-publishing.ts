import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export type VizPost = {
  id: string; scheduleDate: string; scheduleTime: string; posted: boolean;
  video?: string; videoPath?: string; publicVideoUrl?: string;
  text?: string; title?: string; description?: string; tags?: string[];
  postedAt?: string | null; error?: string | null; postUrl?: string;
  state?: 'publishing' | 'submitted' | 'sent' | 'failed' | 'uncertain';
  attemptedSlot?: string; attemptedAt?: string; bufferPostId?: string;
  bufferStatus?: string; platformPostId?: string;
  [key: string]: unknown;
};

export function isMain(url: string) {
  return Boolean(process.argv[1]) && url === pathToFileURL(path.resolve(process.argv[1])).href;
}

export function readQueue(file: string): VizPost[] {
  const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(posts)) throw new Error(`Invalid queue ${file}`);
  const ids = new Set<string>();
  for (const p of posts) {
    if (!p.id || ids.has(p.id)) throw new Error(`Missing/duplicate queue ID ${p.id}`);
    ids.add(p.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.scheduleDate) || !/^\d{2}:\d{2}$/.test(p.scheduleTime)) {
      throw new Error(`Missing schedule for ${p.id}`);
    }
    if (!Number.isFinite(Date.parse(`${p.scheduleDate}T${p.scheduleTime}:00+05:30`))) {
      throw new Error(`Invalid schedule for ${p.id}`);
    }
  }
  return posts;
}

export function saveQueue(file: string, posts: VizPost[]) {
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(posts, null, 2) + '\n');
  fs.renameSync(temp, file);
}

// Repeated/manual runs in a campaign slot must not drain the backlog.
export function selectDue(posts: VizPost[], now = new Date()): { post?: VizPost; slot?: string } {
  const due = posts.filter(p => Date.parse(`${p.scheduleDate}T${p.scheduleTime}:00+05:30`) <= now.getTime())
    .sort((a, b) => `${a.scheduleDate} ${a.scheduleTime}`.localeCompare(`${b.scheduleDate} ${b.scheduleTime}`));
  const latest = due.at(-1);
  if (!latest) return {};
  const ist = new Date(now.getTime() + 5.5 * 3600000);
  let day = ist.toISOString().slice(0, 10);
  const time = ist.toISOString().slice(11, 16);
  const times = [...new Set(posts.map(p => p.scheduleTime))].sort();
  let slotTime = times.filter(t => t <= time).at(-1);
  if (!slotTime) {
    day = new Date(ist.getTime() - 86400000).toISOString().slice(0, 10);
    slotTime = times.at(-1)!;
  }
  const slot = `${day}T${slotTime}`;
  const blocked = posts.find(p => !p.posted && ['publishing', 'uncertain', 'failed', 'submitted'].includes(p.state || ''));
  if (blocked) throw new Error(`${blocked.id} is ${blocked.state}; reconcile it before sending another video`);
  if (posts.some(p => p.attemptedSlot === slot)) return { slot };
  return { slot, post: due.find(p => !p.posted) };
}

export function localVideo(post: VizPost): string {
  const value = post.video || post.videoPath;
  if (!value) throw new Error(`${post.id} has no video`);
  const absolute = path.resolve(ROOT, value);
  if (!absolute.startsWith(`${ROOT}${path.sep}`) || !/\.mp4$/i.test(absolute)) throw new Error(`Invalid video path for ${post.id}`);
  if (!fs.statSync(absolute).isFile() || !fs.statSync(absolute).size) throw new Error(`Missing/empty video for ${post.id}`);
  return absolute;
}

export function publicVideoUrl(post: VizPost): string {
  if (post.publicVideoUrl) {
    if (new URL(post.publicVideoUrl).protocol !== 'https:') throw new Error('Video URL must use HTTPS');
    return post.publicVideoUrl;
  }
  const base = process.env.VIZ_MEDIA_BASE_URL;
  if (!base) throw new Error('Set VIZ_MEDIA_BASE_URL to a public host serving repository-relative media paths');
  if (new URL(base).protocol !== 'https:') throw new Error('Media host must use HTTPS');
  const rel = path.relative(ROOT, localVideo(post)).split(path.sep).map(encodeURIComponent).join('/');
  return `${base.replace(/\/$/, '')}/${rel}`;
}

export async function checkPublicVideo(url: string) {
  const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Public video returned HTTP ${res.status}`);
  if (!/^(video\/mp4|application\/octet-stream)(;|$)/i.test(res.headers.get('content-type') || '')) {
    throw new Error('Public video URL does not serve MP4/binary content');
  }
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
