#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { humanizeAlt } from './lib/essay-chart-slug.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts/essay-chart-manifest.json'), 'utf8'));
const outDir = path.join(root, 'public/images/essays/charts');

export function writePlaceholder(slug, name) {
  const title = humanizeAlt(name);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200" role="img">
  <title>${title}</title>
  <rect width="800" height="200" fill="#ffffff" stroke="#e3e3e0"/>
  <text x="400" y="95" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#37352f">${title}</text>
  <text x="400" y="125" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#52525b">Chart data is in the prose and tables above.</text>
</svg>`;
  const file = path.join(outDir, `${slug}.svg`);
  fs.writeFileSync(file, svg);
  return file;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const slug = process.argv[2];
  const name = process.argv[3] ?? slug;
  if (!slug) {
    console.error('usage: create-placeholder-chart-svg.mjs <slug> [Name]');
    process.exit(1);
  }
  console.log(writePlaceholder(slug, name));
}