import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_HOST = 'http://localhost:3000';
const MAX_PAGES = 50; // Cap to keep the run time reasonable

async function run() {
  console.log('🔗 Starting automated internal link checker...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const visited = new Set<string>();
  const toVisit: string[] = ['/'];
  const brokenLinks: { source: string; target: string; status: number; error?: string }[] = [];
  const checkedLinksCount = { internal: 0, external: 0 };

  let pageCount = 0;

  while (toVisit.length > 0 && pageCount < MAX_PAGES) {
    const currentPath = toVisit.shift()!;
    if (visited.has(currentPath)) continue;
    visited.add(currentPath);
    pageCount++;

    const url = `${TARGET_HOST}${currentPath}`;
    console.log(`[${pageCount}/${MAX_PAGES}] Scanning page: ${currentPath}`);

    const page = await context.newPage();
    try {
      const res = await page.goto(url, { waitUntil: 'load', timeout: 10000 });
      const status = res?.status() || 200;

      if (status >= 400) {
        brokenLinks.push({ source: 'Navigation', target: currentPath, status });
        await page.close();
        continue;
      }

      // Find all anchors on the page
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.getAttribute('href'))
          .filter((href): href is string => typeof href === 'string');
      });

      for (const href of hrefs) {
        // Clean the link
        const cleanHref = href.split('#')[0].split('?')[0].trim();
        if (!cleanHref) continue;

        const isInternal = cleanHref.startsWith('/') || cleanHref.startsWith(TARGET_HOST) || cleanHref.startsWith('https://veda.ng');
        const isMailOrTel = cleanHref.startsWith('mailto:') || cleanHref.startsWith('tel:') || cleanHref.startsWith('javascript:');

        if (isMailOrTel) continue;

        if (isInternal) {
          let relativePath = cleanHref;
          if (cleanHref.startsWith(TARGET_HOST)) {
            relativePath = cleanHref.replace(TARGET_HOST, '');
          } else if (cleanHref.startsWith('https://veda.ng')) {
            relativePath = cleanHref.replace('https://veda.ng', '');
          }
          if (!relativePath.startsWith('/')) relativePath = '/' + relativePath;

          checkedLinksCount.internal++;

          if (!visited.has(relativePath) && !toVisit.includes(relativePath)) {
            toVisit.push(relativePath);
          }
        } else {
          checkedLinksCount.external++;
        }
      }
    } catch (err: any) {
      console.error(`Failed to scan page ${currentPath}:`, err.message);
      brokenLinks.push({ source: 'Crawl Loop', target: currentPath, status: 500, error: err.message });
    }

    await page.close();
  }

  await browser.close();

  // Generate markdown report
  const reportPath = '/Users/vedang/.gemini/antigravity/brain/037cadf9-cedd-4bd3-b15d-2fc7f7b22ba1/link_checker_report.md';
  let report = `# Internal Link Checker Audit Report\n\n`;
  report += `*Generated automatically using Playwright internal link scanner.*\n`;
  report += `*Timestamp: ${new Date().toISOString()}*\n\n`;

  report += `## Crawl Statistics\n`;
  report += `* **Pages Scanned (Depth Limit)**: ${pageCount}\n`;
  report += `* **Unique Internal Links Evaluated**: ${checkedLinksCount.internal}\n`;
  report += `* **External Outbound Links Seen**: ${checkedLinksCount.external}\n`;
  report += `* **Broken Links Found**: ${brokenLinks.length}\n\n`;

  if (brokenLinks.length > 0) {
    report += `## 🚨 Broken Links Findings\n\n`;
    report += `| Found On Page | Target Broken Link | Response/Error Status |\n`;
    report += `|---|---|---|\n`;
    for (const link of brokenLinks) {
      report += `| \`${link.source}\` | \`${link.target}\` | ${link.status} ${link.error ? `(${link.error})` : ''} |\n`;
    }
  } else {
    report += `> [!NOTE]\n`;
    report += `> **Link Audit Succeeded**: No broken internal links or navigation exceptions were found during the scan of the top ${pageCount} pages.\n`;
  }

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n🎉 Link check report written successfully to: ${reportPath}`);
}

run().catch(console.error);
