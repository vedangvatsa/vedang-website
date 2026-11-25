#!/usr/bin/env node
/** Normalize ``` fence indentation inside course MDX (12-space content indent). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const COURSES_DIR = path.join(ROOT, 'src/content/courses');

function normalize(content) {
  return content.replace(
    /^( {8,20}) {12,24}```/gm,
    (m, base) => `${base}\`\`\``
  );
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.mdx')) {
      const raw = fs.readFileSync(full, 'utf8');
      const next = normalize(raw);
      if (next !== raw) {
        fs.writeFileSync(full, next);
        console.log('normalized', path.relative(ROOT, full));
      }
    }
  }
}
walk(COURSES_DIR);