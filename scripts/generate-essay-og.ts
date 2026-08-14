import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildEssayOgImage } from '../src/lib/og-image';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ESSAYS_DIR = path.join(REPO_ROOT, 'src/content/essays');
const OUT_DIR = path.join(REPO_ROOT, 'public/og');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const slugs = fs.readdirSync(ESSAYS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));

  for (const slug of slugs) {
    const image = buildEssayOgImage(slug);
    if (!image) {
      throw new Error(`No OG image for ${slug}`);
    }
    const buf = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), buf);
    console.log(`wrote public/og/${slug}.png (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
