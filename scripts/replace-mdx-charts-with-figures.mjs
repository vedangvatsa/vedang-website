#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { humanizeAlt, isEssayChartComponent } from './lib/essay-chart-slug.mjs';

const root = path.resolve(import.meta.dirname, '..');
const metaPath = path.join(root, 'scripts/essay-chart-capture-meta.json');
const manifestPath = path.join(root, 'scripts/essay-chart-manifest.json');
const essaysDir = path.join(root, 'src/content/essays');

const meta = fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  : {};
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const slugByName = Object.fromEntries(manifest.map((m) => [m.name, m.slug]));

function figureBlock(name) {
  const slug = slugByName[name];
  const dims = meta[name];
  const width = dims?.width ?? 800;
  const height = Math.min(dims?.height ?? 500, 1200);
  const alt = humanizeAlt(name);
  const dir = path.join(root, 'public/images/essays/charts');
  const ext = fs.existsSync(path.join(dir, `${slug}.webp`))
    ? 'webp'
    : fs.existsSync(path.join(dir, `${slug}.png`))
      ? 'png'
      : 'svg';
  return `<Figure\n  src="/images/essays/charts/${slug}.${ext}"\n  alt="${alt}"\n  width={${width}}\n  height={${height}}\n  wide\n/>`;
}

let total = 0;
for (const file of fs.readdirSync(essaysDir)) {
  if (!file.endsWith('.mdx')) continue;
  const full = path.join(essaysDir, file);
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  text = text.replace(/<([A-Z][a-zA-Z0-9]+)\s*\/>/g, (match, name) => {
    if (!isEssayChartComponent(name)) return match;
    if (!slugByName[name]) {
      console.warn(`${file}: unknown chart ${name}`);
      return match;
    }
    total += 1;
    return figureBlock(name);
  });
  if (text !== before) fs.writeFileSync(full, text);
}

console.log(`Replaced ${total} chart tags with Figure images.`);