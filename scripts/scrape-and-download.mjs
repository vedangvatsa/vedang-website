import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';

const jsonPath = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/top_100_source.json';
const assetsDir = '/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/linkedin-assets/clean';

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function scrapePost(page, post, idx) {
  const destName = `li-viral-image-${idx + 1}.jpg`;
  const destPath = path.join(assetsDir, destName);
  
  // Skip if already exists and is non-empty
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`[${idx + 1}/100] Already downloaded, skipping: ${destName}`);
    return destName;
  }
  
  console.log(`[${idx + 1}/100] Scraping (Headful): ${post.post_url}`);
  
  try {
    await page.goto(post.post_url, { waitUntil: 'load', timeout: 30000 });
    
    // Wait for initial load
    await page.waitForTimeout(4000);
    
    // Attempt to dismiss cookie banner
    try {
      const button = page.locator('button:has-text("Accept"), button:has-text("Agree"), [data-control-name="ga-cookie-consent-accept"]');
      if (await button.count() > 0) {
        await button.first().click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}

    // Scroll down to trigger lazy loading of image
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(3000);
    
    // Extract image sources
    const imgUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => img.src);
    });
    
    // Find main post image
    const mainImgUrl = imgUrls.find(src => 
      src.includes('media.licdn.com/dms/image') && 
      !src.includes('profile-') && 
      !src.includes('shrink_200_200') &&
      !src.includes('shrink_100_100') &&
      !src.includes('shrink_400_400')
    );
    
    if (mainImgUrl) {
      console.log(`  Found image URL: ${mainImgUrl.substring(0, 100)}...`);
      await downloadImage(mainImgUrl, destPath);
      console.log(`  Downloaded: ${destName}`);
      return destName;
    } else {
      console.log(`  No main image found in:`, imgUrls.length, `images`);
      return null;
    }
  } catch (err) {
    console.error(`  Error scraping ${post.post_url}:`, err.message);
    return null;
  }
}

async function run() {
  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded ${posts.length} posts to scrape.`);
  
  // Launch headful browser to bypass Cloudflare/PerimeterX bot detection
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const results = [];
  
  for (let i = 0; i < posts.length; i++) {
    const imageFile = await scrapePost(page, posts[i], i);
    
    results.push({
      ...posts[i],
      index: i + 1,
      local_image: imageFile ? `scripts/linkedin-assets/clean/${imageFile}` : null
    });
    
    // Delay between pages if we actually scraped
    const destPath = path.join(assetsDir, `li-viral-image-${i + 1}.jpg`);
    if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 1000) {
      const delay = 4000 + Math.random() * 3000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  await browser.close();
  
  const outPath = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/scraped_posts.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Scraping complete. Saved meta to: ${outPath}`);
}

run().catch(console.error);
