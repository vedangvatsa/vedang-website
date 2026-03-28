import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const mdxDir = '/Users/vedang/vedang-website/src/content/essays';
const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));
const slugs = files.map(f => f.replace('.mdx', ''));

(async () => {
  console.log(`Starting Puppeteer test for ${slugs.length} essays...`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a standard viewport
  await page.setViewport({ width: 1280, height: 800 });

  let brokenPagesCount = 0;
  let totalBrokenImages = 0;

  for (const slug of slugs) {
    const url = `http://localhost:3000/${slug}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Wait a moment for Next.js to inject and load images
      await new Promise(r => setTimeout(r, 2000));
      
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter(img => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
          .map(img => img.src || img.alt || 'unknown image');
      });

      if (brokenImages.length > 0) {
        console.log(`\n❌ [${slug}] has ${brokenImages.length} broken image(s):`, brokenImages);
        brokenPagesCount++;
        totalBrokenImages += brokenImages.length;
      } else {
        process.stdout.write('.');
      }
    } catch (e) {
      console.log(`\n❌ Error loading ${slug}: ${e.message}`);
      brokenPagesCount++;
    }
  }

  await browser.close();

  console.log('\n====================================');
  if (brokenPagesCount === 0) {
    console.log(`✅ SUCCESS: All ${slugs.length} essays checked and fully rendered in Chrome. ZERO broken images found!`);
  } else {
    console.log(`🚨 FAILED: Found ${totalBrokenImages} broken images across ${brokenPagesCount} pages.`);
  }
})();
