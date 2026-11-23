#!/usr/bin/env npx tsx
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const manifestPath = path.join(root, 'scripts/essay-chart-manifest.json');
const outDir = path.join(root, 'public/images/essays/charts');
const metaPath = path.join(root, 'scripts/essay-chart-capture-meta.json');

const baseUrl = process.env.CHART_EXPORT_URL ?? 'http://localhost:3000/chart-export';
const singleBase = process.env.CHART_EXPORT_SINGLE_URL ?? 'http://localhost:3000/chart-export';

async function main() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Run: node scripts/generate-chart-export-bundle.mjs');
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Array<{ name: string; slug: string }>;
  if (manifest.length === 0) {
    console.log('No chart components in essays.');
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 920, height: 1200 } });

  const meta: Record<string, { width: number; height: number; slug: string }> = {};

  for (const { name, slug } of manifest) {
    const webp = path.join(outDir, `${slug}.webp`);
    const pngFallback = path.join(outDir, `${slug}.png`);
    if (fs.existsSync(webp) || fs.existsSync(pngFallback)) {
      console.log('skip existing', slug);
      const existing = fs.existsSync(webp) ? webp : pngFallback;
      const dims = await import('node:child_process').then(({ execSync }) => {
        try {
          const out = execSync(`sips -g pixelWidth -g pixelHeight "${existing}"`, { encoding: 'utf8' });
          const w = Number(out.match(/pixelWidth: (\d+)/)?.[1] ?? 800);
          const h = Number(out.match(/pixelHeight: (\d+)/)?.[1] ?? 400);
          return { width: w, height: h };
        } catch {
          return { width: 800, height: 400 };
        }
      });
      meta[name] = { slug, ...dims };
      continue;
    }

    const locator = page.locator(`#chart-${name}`);
    try {
      await page.goto(`${singleBase}/${name}`, { waitUntil: 'networkidle', timeout: 90_000 });
      await locator.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {
        /* StateOfAiBigramsChart returns null */
      });
      await page.waitForTimeout(300);
      const png = path.join(outDir, `${slug}.png`);
      await locator.screenshot({ path: png, type: 'png', timeout: 60_000 });
      try {
        const { execSync } = await import('node:child_process');
        execSync(`cwebp -q 88 "${png}" -o "${webp}"`, { stdio: 'ignore' });
        fs.unlinkSync(png);
      } catch {
        fs.renameSync(png, pngFallback);
      }
      const box = await locator.boundingBox();
      meta[name] = {
        slug,
        width: Math.round(box?.width ?? 800),
        height: Math.round(box?.height ?? 400),
      };
      console.log('captured', slug);
    } catch (err) {
      console.error('FAILED', name, err instanceof Error ? err.message : err);
    }
  }

  await browser.close();
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log(`wrote ${manifest.length} images to public/images/essays/charts/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});