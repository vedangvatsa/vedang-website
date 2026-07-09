import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

const jsonPath = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/top_100_source.json';
const brainDir = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd';
const assetsDir = '/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/linkedin-assets/clean';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded ${posts.length} posts.`);
  
  fs.mkdirSync(assetsDir, { recursive: true });
  
  console.log('Launching headful browser (Google Chrome)...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  for (let i = 0; i < posts.length; i++) {
    const imageCode = `li-viral-image-${i + 1}.jpg`;
    const brainPath = path.join(brainDir, imageCode);
    const assetsPath = path.join(assetsDir, imageCode);
    
    // Check if file exists and has size
    if (fs.existsSync(brainPath) && fs.statSync(brainPath).size > 1000) {
      if (!fs.existsSync(assetsPath)) {
        fs.copyFileSync(brainPath, assetsPath);
      }
      continue;
    }
    
    console.log(`[${i + 1}/100] Scraping: ${posts[i].post_url}`);
    
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!success && attempts < maxAttempts) {
      attempts++;
      try {
        await page.goto(posts[i].post_url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(2000); // Wait for metadata
        
        // Extract og:image content
        const ogImg = await page.evaluate(() => {
          const meta = document.querySelector('meta[property="og:image"]');
          return meta ? meta.content : null;
        });
        
        if (ogImg && ogImg.startsWith('http')) {
          console.log(`  Found og:image: ${ogImg.substring(0, 80)}...`);
          await downloadFile(ogImg, brainPath);
          fs.copyFileSync(brainPath, assetsPath);
          console.log(`  Downloaded & Saved to ${imageCode}`);
          success = true;
          
          // Regenerate drafts live to include the preview of the newly downloaded image
          execSync('node /Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/generate-drafts-md.mjs');
        } else {
          console.log(`  No og:image found on page.`);
          // If loaded but no image, treat as failure to retry
          throw new Error('No og:image metadata');
        }
      } catch (err) {
        console.log(`  Attempt ${attempts}/${maxAttempts} failed: ${err.message}`);
        if (attempts < maxAttempts) {
          const sleepTime = attempts * 30000; // 30s, 60s
          console.log(`  Sleeping ${sleepTime / 1000}s before retry...`);
          await sleep(sleepTime);
        }
      }
    }
    
    await sleep(2000); // Small polite delay between posts
  }
  
  await browser.close();
  console.log('Finished headful scraping. Regenerating drafts final...');
  execSync('node /Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/generate-drafts-md.mjs');
}

run().catch(console.error);
