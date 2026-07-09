import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TARGET_HOST = 'http://localhost:3000';
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'profile', path: '/profile' },
  { name: 'community', path: '/community' },
  { name: 'job_boards', path: '/job-boards' },
  { name: 'seo', path: '/seo' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800, isMobile: false },
  { name: 'tablet', width: 768, height: 1024, isMobile: false },
  { name: 'mobile', width: 375, height: 812, isMobile: true }
];

const SCREENSHOTS_DIR = '/Users/vedang/.gemini/antigravity/brain/037cadf9-cedd-4bd3-b15d-2fc7f7b22ba1/screenshots';

async function capture() {
  console.log('📸 Starting responsive screenshot captures...');
  
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  for (const pageInfo of PAGES) {
    console.log(`\n📄 Page: ${pageInfo.name} (${pageInfo.path})`);
    
    for (const vp of VIEWPORTS) {
      console.log(`   - Capturing ${vp.name} viewport...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        deviceScaleFactor: 2 // High-DPI screenshots for better detail
      });

      const page = await context.newPage();
      
      try {
        await page.goto(`${TARGET_HOST}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        
        // Wait an extra half second to let all animations settle
        await page.waitForTimeout(500);

        const filename = `${pageInfo.name}_${vp.name}.png`;
        const filepath = path.join(SCREENSHOTS_DIR, filename);
        
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`     Saved to: ${filepath}`);
      } catch (err: any) {
        console.error(`     ❌ Failed to capture ${pageInfo.name} on ${vp.name}:`, err.message);
      }

      await page.close();
      await context.close();
    }
  }

  await browser.close();
  console.log('\n🎉 Finished capturing all responsive screenshots!');
}

capture().catch(console.error);
