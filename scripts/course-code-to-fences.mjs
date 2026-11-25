#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const COURSES_DIR = path.join(ROOT, 'src/content/courses');

const PATTERN = /<CourseCode source=\{`([\s\S]*?)`\} \/>/g;

function detectLang(code) {
  const t = code.trimStart();
  if (/^(npm |npx |pip |mkdir |#|curl )/m.test(t) || t.startsWith('cd ')) return 'bash';
  if (t.startsWith('{') || t.startsWith('[')) return 'json';
  if (/^(import |export |const |async |from )/m.test(t)) return 'typescript';
  if (/^\/\//m.test(t) || /^server\.tool/m.test(t)) return 'typescript';
  if (/^def |^from mcp|^@mcp|^if __name__/m.test(t)) return 'python';
  if (/^pip install/m.test(t)) return 'bash';
  return '';
}

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (!PATTERN.test(src)) return 0;
  PATTERN.lastIndex = 0;

  let count = 0;
  const next = src.replace(PATTERN, (full, code, offset) => {
    count++;
    const lineStart = src.lastIndexOf('\n', offset) + 1;
    const indent = src.slice(lineStart, offset).match(/^(\s*)/)[1];
    const lang = detectLang(code);
    const lines = code.split('\n');
    const body = lines.map((line) => `${indent}${line}`).join('\n');
    return `${indent}\n${indent}\`\`\`${lang}\n${body}\n${indent}\`\`\``;
  });

  if (count) fs.writeFileSync(filePath, next);
  return count;
}

function walk(dir) {
  let total = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) total += walk(full);
    else if (e.name.endsWith('.mdx')) {
      const n = processFile(full);
      if (n) console.log(`${path.relative(ROOT, full)}: ${n}`);
      total += n;
    }
  }
  return total;
}

const total = walk(COURSES_DIR);
console.log(`Converted ${total} CourseCode blocks to markdown fences.`);