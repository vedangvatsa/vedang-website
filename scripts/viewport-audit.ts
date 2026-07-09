import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_HOST = 'http://localhost:3000';
const ROUTES = [
  '/',
  '/profile',
  '/writings',
  '/ai-reports',
  '/web3-reports',
  '/community',
  '/seo',
  '/admin',
];

const VIEWPORTS = [
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080, isMobile: false },
  { name: 'Tablet (768x1024)', width: 768, height: 1024, isMobile: false },
  { name: 'Mobile (375x812)', width: 375, height: 812, isMobile: true },
];

async function run() {
  console.log('📱 Starting multi-viewport responsiveness audit...');
  const browser = await chromium.launch({ headless: true });

  const results: {
    route: string;
    viewport: string;
    status: number;
    consoleErrors: string[];
    pageExceptions: string[];
  }[] = [];

  for (const route of ROUTES) {
    const url = `${TARGET_HOST}${route}`;
    console.log(`\n🔍 Auditing route: ${route}`);

    for (const viewport of VIEWPORTS) {
      console.log(`   - Testing ${viewport.name}...`);
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        userAgent: viewport.isMobile
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
          : undefined,
      });

      const page = await context.newPage();
      const consoleErrors: string[] = [];
      const pageExceptions: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('pageerror', err => {
        pageExceptions.push(err.message);
      });

      try {
        const res = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
        const status = res?.status() || 200;

        results.push({
          route,
          viewport: viewport.name,
          status,
          consoleErrors,
          pageExceptions,
        });
      } catch (err: any) {
        console.error(`      ❌ Failed to load ${route} on ${viewport.name}:`, err.message);
        results.push({
          route,
          viewport: viewport.name,
          status: 500,
          consoleErrors,
          pageExceptions: [err.message],
        });
      }

      await page.close();
      await context.close();
    }
  }

  await browser.close();

  // Compile final markdown report
  const reportPath = '/Users/vedang/.gemini/antigravity/brain/037cadf9-cedd-4bd3-b15d-2fc7f7b22ba1/viewport_responsiveness_report.md';
  let md = `# 📱 Responsive Viewport Audit Report\n\n`;
  md += `*Generated automatically using Playwright responsive device emulator.*\n`;
  md += `*Timestamp: ${new Date().toISOString()}*\n\n`;

  md += `## Viewport Response Matrix\n\n`;
  md += `| Route | Viewport | Status | Console Errors | Exceptions | Result |\n`;
  md += `|---|---|---|---|---|---|\n`;

  for (const res of results) {
    const isPass = res.status === 200 && res.consoleErrors.length === 0 && res.pageExceptions.length === 0;
    const badge = isPass ? '🟢 PASS' : '🔴 FAIL';
    md += `| \`${res.route}\` | ${res.viewport} | ${res.status} | ${res.consoleErrors.length} | ${res.pageExceptions.length} | ${badge} |\n`;
  }

  md += `\n---\n\n## 📝 Detailed Findings\n\n`;
  for (const res of results) {
    const isPass = res.status === 200 && res.consoleErrors.length === 0 && res.pageExceptions.length === 0;
    if (!isPass) {
      md += `### Route \`${res.route}\` - ${res.viewport}\n`;
      if (res.status !== 200) md += `* ❌ HTTP Status: ${res.status}\n`;
      if (res.consoleErrors.length > 0) {
        md += `* **Console Errors**:\n`;
        res.consoleErrors.forEach(err => md += `  * \`${err}\`\n`);
      }
      if (res.pageExceptions.length > 0) {
        md += `* **Page Exceptions**:\n`;
        res.pageExceptions.forEach(err => md += `  * \`${err}\`\n`);
      }
      md += `\n`;
    }
  }

  if (!results.some(res => res.status !== 200 || res.consoleErrors.length > 0 || res.pageExceptions.length > 0)) {
    md += `> [!NOTE]\n`;
    md += `> **All viewports passed cleanly**: The entire route matrix loaded successfully with HTTP 200, 0 unhandled client exceptions, and 0 console errors across Desktop, Tablet, and Mobile viewport configurations.\n`;
  }

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`\n🎉 Responsive viewport audit report written to: ${reportPath}`);
}

run().catch(console.error);
