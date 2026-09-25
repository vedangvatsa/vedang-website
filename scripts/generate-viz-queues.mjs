#!/usr/bin/env node
/**
 * generate-viz-queues.mjs — build 3/day posting queues for the 50 verified
 * data-viz videos across eleven platforms. Preserves attempted/published entries.
 *
 * Usage:
 *   node scripts/generate-viz-queues.mjs \
 *     --manifest /path/to/upload-manifest.csv \
 *     --chart-dir /path/to/verified/data \
 *     --videos-dir scripts/viz-assets/videos \
 *     --previews-dir scripts/viz-assets/previews \
 *     [--start 2026-09-25] [--slots 09:00,14:00,20:00]
 *
 * Writes: scripts/viz-{platform}-posts.json (eleven platforms, 50 entries each)
 *         and public/viz-notes/{number}.txt for linked source/music notes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { makeCaptions } from './viz-captions.mjs';
import { sourceCredit } from './viz-source-credit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) {
  const m = argv[i].match(/^--([^=]+)(=(.*))?$/);
  if (!m) continue;
  if (m[3] !== undefined) args[m[1]] = m[3];
  else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) args[m[1]] = argv[++i];
  else args[m[1]] = true;
}
const MANIFEST = args.manifest;
const CHART_DIR = args['chart-dir'];
const VIDEOS_DIR = args['videos-dir'] || 'scripts/viz-assets/videos';
const PREVIEWS_DIR = args['previews-dir'] || 'scripts/viz-assets/previews';
const START = args.start || '2026-09-25';
const SLOTS = (args.slots || '09:00,14:00,20:00').split(',');
const OUTPUT_DIR = args['output-dir'] || __dirname;
const NOTES_DIR = args['notes-dir'] || path.join(REPO_ROOT, 'public/viz-notes');
if (!/^\d{4}-\d{2}-\d{2}$/.test(START) || !Number.isFinite(Date.parse(START))) throw new Error('Invalid start date');
if (SLOTS.length !== 3 || new Set(SLOTS).size !== 3 || SLOTS.some(s => !/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) || [...SLOTS].sort().join() !== SLOTS.join()) throw new Error('Supply exactly three distinct, ordered HH:MM slots');

if (!MANIFEST || !CHART_DIR) {
  console.error('Missing --manifest or --chart-dir');
  process.exit(1);
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') {
      if (row.length || field) { row.push(field); rows.push(row); }
      row = []; field = '';
    } else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (row.length || field) { row.push(field); rows.push(row); }
  if (inQuotes) throw new Error('Unclosed CSV quotation');
  return rows;
}

function slugOf(filename) {
  return filename.replace(/^\d+-/, '').replace(/-\d{4}-\d{4}\.mp4$/, '');
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const lines = parseCSV(fs.readFileSync(MANIFEST, 'utf-8'));
const header = lines[0];
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const musicByIndex = JSON.parse(fs.readFileSync(args['music-catalog'] || path.join(__dirname, 'viz-assets/music-catalog.json'), 'utf8'));
if (musicByIndex.length !== 50) throw new Error('Expected 50 music tracks');
const editorial = JSON.parse(fs.readFileSync(path.join(__dirname, 'viz-caption-copy.json'), 'utf8'));
const conciseCopy = JSON.parse(fs.readFileSync(path.join(__dirname, 'viz-concise-copy.json'), 'utf8'));
const licenseReview = JSON.parse(fs.readFileSync(path.join(__dirname, 'viz-assets/music-license-review.json'), 'utf8'));

const videos = lines.slice(1).filter(r => r.length > 1).map(r => ({
  number: r[idx.number],
  filename: r[idx.filename],
  youtube_title: r[idx.youtube_title],
  metric: r[idx.metric],
  start_year: r[idx.start_year],
  end_year: r[idx.end_year],
  source_url: r[idx.source_url],
  source_observations_checked: r[idx.source_observations_checked],
}));

const platforms = ['youtube', 'instagram', 'tiktok', 'linkedin', 'facebook', 'threads', 'bluesky', 'x', 'tumblr', 'mastodon', 'farcaster'];
const queues = Object.fromEntries(platforms.map(p => [p, []]));
const notesFiles = [];
videos.forEach((v, i) => {
  const slug = slugOf(v.filename);
  const chart = JSON.parse(fs.readFileSync(path.join(CHART_DIR, `${slug}.chart.json`), 'utf-8'));
  const { metadata } = JSON.parse(fs.readFileSync(path.join(CHART_DIR, `${slug}.json`), 'utf8'));
  const providerCredit = sourceCredit(metadata);
  if (Number(v.start_year) !== chart.startYear || Number(v.end_year) !== chart.endYear) throw new Error(`Year mismatch ${slug}`);
  const day = Math.floor(i / SLOTS.length);
  const date = addDays(START, day);
  const time = SLOTS[i % SLOTS.length];
  const idNum = String(i + 1).padStart(2, '0');
  const videoRel = `${VIDEOS_DIR}/${v.filename}`;
  const previewRel = `${PREVIEWS_DIR}/${slug}.png`;
  if (!fs.existsSync(path.resolve(REPO_ROOT, videoRel))) throw new Error(`Missing video: ${videoRel}`);
  if (!fs.existsSync(path.resolve(REPO_ROOT, previewRel))) throw new Error(`Missing preview: ${previewRel}`);

  const music = { ...musicByIndex[i], ...licenseReview.tracks[String(i + 1)] };
  if (music.topic_index !== i + 1 || !editorial[slug]) throw new Error(`Missing/misaligned caption or music ${slug}`);
  const { captions, title, notes } = makeCaptions({ copy: editorial[slug], chart, number: i + 1, music, conciseDescription: conciseCopy[slug], sourceCredit: providerCredit });
  for (const platform of platforms) {
    const prefix = { youtube: 'yt', instagram: 'ig', tiktok: 'tt' }[platform] || platform;
    queues[platform].push({
      id: `viz-${prefix}-${idNum}`, video: videoRel,
      captionStyle: 'concise-v1', sourceCredit: providerCredit, sourceOrganization: metadata.sourceOrganization,
      ...(platform === 'youtube' ? { title, description: captions[platform], thumbnail: previewRel } : { text: captions[platform] }),
      ...(platform === 'instagram' ? { cover: previewRel } : {}),
      ...(platform === 'tiktok' ? { title: captions[platform], videoPath: videoRel } : {}),
      tags: ['data visualization', slug.replace(/-/g, ' ')],
      altText: `${editorial[slug][0]}, ${chart.startYear}-${chart.endYear}. Ten highest reported values each year.`,
      notesUrl: notes,
      scheduleDate: date, scheduleTime: time, posted: false, postedAt: null, error: null,
    });
  }
  const description = fs.readFileSync(path.join(CHART_DIR, `${slug}.description.md`), 'utf8');
  // Keep source methodology and music attribution accessible from short captions.
  const license = music.licenseUrl ? `\n${music.license}\n${music.licenseUrl}\n${music.artistUrl || ''}\n` : '';
  const promotion = music.page_url.includes('chosic.com') ? 'Music promoted by https://www.chosic.com/free-music/all/\n' : '';
  const musicNote = `\n\nMusic\n${music.attribution || `${music.title} by ${music.artist}`}\n${music.page_url}\n${promotion}30-second excerpt, fades and loudness adjustment. See the track page for license terms.\n${license}`;
  notesFiles.push([`${idNum}.txt`, description.trim() + musicNote]);
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(NOTES_DIR, { recursive: true });
for (const [name, text] of notesFiles) fs.writeFileSync(path.join(NOTES_DIR, name), text);
for (const platform of platforms) {
  const file = path.join(OUTPUT_DIR, `viz-${platform}-posts.json`);
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const byId = new Map(existing.map(p => [p.id, p]));
  const updated = queues[platform].map(p => {
    const old = byId.get(p.id);
    if (old?.posted || old?.state || old?.bufferPostId || old?.attemptedAt) return old;
    return { ...old, ...p };
  });
  if (existing.some(p => !updated.some(n => n.id === p.id))) throw new Error(`Refusing to remove existing entries from ${file}`);
  fs.writeFileSync(file, JSON.stringify(updated, null, 2) + '\n');
}
const last = queues.youtube.at(-1);
console.log(`Wrote ${platforms.length} queues x ${videos.length} captions (${START} to ${last.scheduleDate} ${last.scheduleTime} IST)`);
