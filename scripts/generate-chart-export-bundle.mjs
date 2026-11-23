#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { componentToSlug, isEssayChartComponent } from './lib/essay-chart-slug.mjs';

const root = path.resolve(import.meta.dirname, '..');
const mdxDir = path.join(root, 'src/content/essays');
const mdxChartsDir = path.join(root, 'src/components/mdx');

const raw = execSync(`rg '<([A-Z][a-zA-Z0-9]+)\\s*/>' src/content/essays --no-filename -o -r '$1'`, { encoding: 'utf8', cwd: root });
const names = [...new Set(raw.trim().split('\n').filter(Boolean))].filter(isEssayChartComponent).sort();

const nameToFile = new Map();
for (const file of fs.readdirSync(mdxChartsDir)) {
  if (!file.endsWith('-charts.tsx') && file !== 'sensory-charts.tsx') continue;
  const full = path.join(mdxChartsDir, file);
  const text = fs.readFileSync(full, 'utf8');
  for (const name of names) {
    if (text.includes(`export function ${name}`)) {
      nameToFile.set(name, file.replace(/\.tsx$/, ''));
    }
  }
}

// funding-charts etc.
for (const file of fs.readdirSync(mdxChartsDir)) {
  if (!file.endsWith('.tsx') || file === 'index.tsx') continue;
  const full = path.join(mdxChartsDir, file);
  const text = fs.readFileSync(full, 'utf8');
  for (const name of names) {
    if (!nameToFile.has(name) && text.includes(`export function ${name}`)) {
      nameToFile.set(name, file.replace(/\.tsx$/, ''));
    }
  }
}

const missing = names.filter((n) => !nameToFile.has(n));
if (missing.length) {
  console.error('No chart module for:', missing.join(', '));
  process.exit(1);
}

const byModule = new Map();
for (const name of names) {
  const mod = nameToFile.get(name);
  if (!byModule.has(mod)) byModule.set(mod, []);
  byModule.get(mod).push(name);
}

const importLines = [...byModule.keys()]
  .sort()
  .map((mod) => {
    const exports = byModule.get(mod).sort().join(', ');
    return `import { ${exports} } from '@/components/mdx/${mod}';`;
  });

const registryEntries = names.map((n) => `  ${n},`).join('\n');

const outDir = path.join(root, 'src/app/chart-export');
fs.mkdirSync(outDir, { recursive: true });

const bundle = `${importLines.join('\n')}

export const essayChartComponents = {
${registryEntries}
} as const;

export const essayChartNames = ${JSON.stringify(names, null, 2)} as const;
`;

fs.writeFileSync(path.join(outDir, 'chart-bundle.tsx'), bundle);

const manifest = names.map((name) => ({
  name,
  slug: componentToSlug(name),
  module: nameToFile.get(name),
  image: `/images/essays/charts/${componentToSlug(name)}.webp`,
}));

fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
fs.writeFileSync(path.join(root, 'scripts/essay-chart-manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`chart-bundle: ${names.length} components`);