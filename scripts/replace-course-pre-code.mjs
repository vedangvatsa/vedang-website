#!/usr/bin/env node
/**
 * Legacy helper: replaced <pre><code>{`...`}</code></pre> with CourseCode (did not work with next-mdx-remote).
 * For course MDX use markdown fences instead — see scripts/course-code-to-fences.mjs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const COURSES_DIR = path.join(ROOT, 'src/content/courses');

const PATTERN = /<pre><code>\{`([\s\S]*?)`\}<\/code><\/pre>/g;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.mdx')) processFile(full);
  }
}

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const matches = [...src.matchAll(PATTERN)];
  if (matches.length === 0) return;

  const next = src.replace(PATTERN, (_, code) => `<CourseCode code={\`${code}\`} />`);
  if (next === src) return;

  fs.writeFileSync(filePath, next);
  console.log(`${path.relative(ROOT, filePath)}: ${matches.length} block(s)`);
}

walk(COURSES_DIR);

const remaining = walkCount();
console.log(`Remaining <pre><code> blocks: ${remaining}`);

function walkCount() {
  let n = 0;
  function c(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) c(full);
      else if (e.name.endsWith('.mdx')) {
        const s = fs.readFileSync(full, 'utf8');
        n += [...s.matchAll(PATTERN)].length;
      }
    }
  }
  c(COURSES_DIR);
  return n;
}