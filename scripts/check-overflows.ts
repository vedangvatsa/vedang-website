import { chromium } from 'playwright';

const TARGET_HOST = 'http://localhost:3000';
const PAGES = [
  '/',
  '/profile',
  '/community',
  '/job-boards',
  '/seo'
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

async function check() {
  console.log('🔍 Starting programmatic layout and overflow check...');
  const browser = await chromium.launch({ headless: true });

  for (const route of PAGES) {
    console.log(`\n📄 Page: ${route}`);
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height }
      });
      const page = await context.newPage();
      
      try {
        await page.goto(`${TARGET_HOST}${route}`, { waitUntil: 'networkidle', timeout: 15000 });
        
        // Execute a script in the page context to find elements that overflow horizontally
        const overflows = await page.evaluate((viewportWidth) => {
          const elements = Array.from(document.querySelectorAll('*'));
          const results: { selector: string; width: number; scrollWidth: number }[] = [];
          
          // Check if body itself overflows
          const docWidth = document.documentElement.scrollWidth;
          if (docWidth > window.innerWidth) {
            results.push({
              selector: 'html/body (Horizontal Scrollbar)',
              width: window.innerWidth,
              scrollWidth: docWidth
            });
          }

          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            // We are looking for elements wider than the viewport, or whose scrollable content exceeds their width
            if (rect.width > viewportWidth && el.tagName !== 'HTML' && el.tagName !== 'BODY') {
              // Find CSS selector
              let path = el.tagName.toLowerCase();
              if (el.id) path += `#${el.id}`;
              if (el.className) path += `.${el.className.split(' ').filter(c => c).slice(0, 2).join('.')}`;
              
              results.push({
                selector: path,
                width: rect.width,
                scrollWidth: el.scrollWidth
              });
            }
          }
          return results;
        }, vp.width);

        if (overflows.length > 0) {
          console.log(`   ⚠️ [${vp.name}] Found ${overflows.length} potential layout overflows:`);
          overflows.slice(0, 5).forEach(o => {
            console.log(`      * Element: ${o.selector} (Width: ${Math.round(o.width)}px, ScrollWidth: ${o.scrollWidth}px)`);
          });
        } else {
          console.log(`   ✅ [${vp.name}] Layout renders perfectly (no horizontal overflows).`);
        }
      } catch (err: any) {
        console.error(`   ❌ [${vp.name}] Navigation failed:`, err.message);
      }
      
      await page.close();
      await context.close();
    }
  }

  await browser.close();
  console.log('\n🎉 Finished layout overflow analysis!');
}

check().catch(console.error);
