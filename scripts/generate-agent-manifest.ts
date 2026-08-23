import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ESSAY_SLUG_MIGRATIONS, EXTRA_REDIRECTS, UNLISTED_PATHS } from '../routes.config.mjs';
import { glossaryTerms } from '../src/lib/glossary';
import { courseConfigs } from '../src/lib/course-config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ESSAYS_DIR = path.join(REPO_ROOT, 'src', 'content', 'essays');
const OUT_FILE = path.join(REPO_ROOT, 'src', 'lib', 'agent-manifest.json');

const STATIC_PAGES = [
  '/',
  '/essays',
  '/glossary',
  '/ailib',
  '/web3lib',
  '/health-protocols',
  '/aistandards',
  '/sitecheck',
  '/swarm-prediction',
  '/swarm-prediction/wiki',
  '/about',
  '/media',
  '/contact',
  '/community',
  '/seo',
  '/lit',
  '/noslop',
  '/job-boards',
  '/privacy',
  '/developers',
];

const MARKDOWN_STATIC_PAGES = ['/', '/essays', '/glossary', '/about', '/privacy', '/contact', '/developers'];

const AGENT_INFRA_PATHS = ['/md', '/.well-known/mcp'];

function redirectSourcePaths() {
  const sources = new Set();
  for (const [source] of EXTRA_REDIRECTS) {
    sources.add(source.replace(/\/:path\*$/, ''));
  }
  for (const [from, to] of ESSAY_SLUG_MIGRATIONS) {
    if (to !== from) continue;
    sources.add(`/${from}`);
  }
  for (const [from] of ESSAY_SLUG_MIGRATIONS) {
    sources.add(`/${from}`);
    sources.add(`/essays/${from}`);
    sources.add(`/writings/${from}`);
  }
  return sources;
}

function generateManifest() {
  const validPaths = new Set(STATIC_PAGES);
  const markdownPaths = new Set(MARKDOWN_STATIC_PAGES);

  const essayFiles = fs.existsSync(ESSAYS_DIR)
    ? fs.readdirSync(ESSAYS_DIR).filter((f) => f.endsWith('.mdx'))
    : [];
  for (const file of essayFiles) {
    const slug = file.replace(/\.mdx$/, '');
    validPaths.add(`/${slug}`);
    markdownPaths.add(`/${slug}`);
  }

  for (const term of glossaryTerms) {
    validPaths.add(`/glossary/${term.slug}`);
    markdownPaths.add(`/glossary/${term.slug}`);
  }

  for (const config of Object.values(courseConfigs)) {
    validPaths.add(config.basePath);
    validPaths.add(`${config.basePath}/final-exam`);
    for (const mod of config.modules) {
      validPaths.add(`${config.basePath}/${mod.slug}`);
    }
  }

  for (const source of redirectSourcePaths()) {
    validPaths.add(source);
  }

  for (const p of AGENT_INFRA_PATHS) {
    validPaths.add(p);
  }

  for (const p of UNLISTED_PATHS) {
    validPaths.delete(p);
    markdownPaths.delete(p);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    validPaths: [...validPaths].sort(),
    markdownPaths: [...markdownPaths].sort(),
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `✅ Generated ${path.relative(REPO_ROOT, OUT_FILE)} with ${manifest.validPaths.length} valid paths and ${manifest.markdownPaths.length} markdown paths.`
  );
}

generateManifest();
