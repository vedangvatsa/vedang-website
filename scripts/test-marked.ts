import { marked } from 'marked';
import fs from 'fs';

const raw = fs.readFileSync('/Users/vedang/vedang-website/src/content/essays/plurality-trap.mdx', 'utf-8');
let body = raw.replace(/^---\n[\s\S]*?\n---\n*/, '');
console.log(marked.parse(body).substring(0, 1000));
