import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');

const slug = 'ai-agent-economy';
const filePath = path.resolve(ESSAYS_DIR, `${slug}.mdx`);

console.log("__dirname:", __dirname);
console.log("REPO_ROOT:", REPO_ROOT);
console.log("ESSAYS_DIR:", ESSAYS_DIR);
console.log("filePath:", filePath);
console.log("existsSync:", fs.existsSync(filePath));

const raw = fs.readFileSync(filePath, 'utf-8');
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
console.log("fmMatch found?:", !!fmMatch);
if (!fmMatch) {
  console.log("Starts with ---\n?", raw.startsWith('---\n'));
  console.log("First 20 chars:", JSON.stringify(raw.substring(0, 20)));
}

