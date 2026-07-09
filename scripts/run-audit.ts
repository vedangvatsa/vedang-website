import { chromium, ConsoleMessage, Request } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_HOST = 'http://localhost:3000';
const ROUTES = [
  '/',
  '/profile',
  '/essays',
  '/ai-reports',
  '/web3-reports',
  '/community',
  '/seo',
  '/admin',
];

interface AuditResult {
  route: string;
  status: number;
  loadTimeMs: number;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  metadata: {
    title: string;
    description: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
  };
}

async function run() {
  console.log('🚀 Starting dynamic website audit...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const auditResults: AuditResult[] = [];

  for (const route of ROUTES) {
    const url = `${TARGET_HOST}${route}`;
    console.log(`\n🔍 Auditing route: ${route} (${url})`);

    const page = await context.newPage();
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    // Listen for console errors
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    // Listen for unhandled page errors
    page.on('pageerror', (err: Error) => {
      pageErrors.push(`[Page Error] ${err.message}\n${err.stack || ''}`);
    });

    // Listen for failed network requests
    page.on('requestfailed', (req: Request) => {
      failedRequests.push(`[Failed Request] ${req.method()} ${req.url()} - ${req.failure()?.errorText || 'Unknown Error'}`);
    });

    page.on('response', (res) => {
      const status = res.status();
      if (status >= 400 && res.url().startsWith(TARGET_HOST)) {
        failedRequests.push(`[HTTP ${status}] ${res.url()}`);
      }
    });

    let loadTimeMs = 0;
    let status = 200;

    try {
      const startTime = Date.now();
      const response = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
      loadTimeMs = Date.now() - startTime;
      status = response?.status() || 200;
      
      // Allow dynamic content to load
      await page.waitForTimeout(1000);
    } catch (err: any) {
      status = 500;
      pageErrors.push(`[Navigation Timeout/Error] ${err.message}`);
    }

    let metadata = {
      title: '',
      description: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
    };

    if (status < 400) {
      try {
        const title = await page.title();
        const description = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '') || '';
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href').catch(() => '') || '';
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content').catch(() => '') || 
                          await page.locator('meta[name="og:title"]').getAttribute('content').catch(() => '') || '';
        const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content').catch(() => '') || 
                                await page.locator('meta[name="og:description"]').getAttribute('content').catch(() => '') || '';
        metadata = {
          title,
          description,
          canonical,
          ogTitle,
          ogDescription,
        };
      } catch (err: any) {
        console.error('Failed to extract metadata:', err.message);
      }
    }

    auditResults.push({
      route,
      status,
      loadTimeMs,
      consoleErrors,
      pageErrors,
      failedRequests,
      metadata,
    });

    await page.close();
  }

  await browser.close();

  // Generate markdown report
  const reportPath = '/Users/vedang/.gemini/antigravity/brain/037cadf9-cedd-4bd3-b15d-2fc7f7b22ba1/deep_audit_report.md';
  let report = `# Deep Website Audit Report\n\n`;
  report += `*Generated automatically using Playwright dynamic route scanner.*\n`;
  report += `*Timestamp: ${new Date().toISOString()}*\n\n`;

  report += `## Summary of Audited Routes\n\n`;
  report += `| Route | HTTP Status | Load Time (ms) | Console Errors | Page Exceptions | Failed Network Req |\n`;
  report += `|---|---|---|---|---|---|\n`;

  for (const res of auditResults) {
    report += `| \`${res.route}\` | ${res.status} | ${res.loadTimeMs} | ${res.consoleErrors.length} | ${res.pageErrors.length} | ${res.failedRequests.length} |\n`;
  }
  report += `\n---\n\n`;

  report += `## Detailed Page Findings\n\n`;

  for (const res of auditResults) {
    report += `### Route \`${res.route}\`\n\n`;
    report += `* **HTTP Status**: ${res.status}\n`;
    report += `* **Load Time**: ${res.loadTimeMs} ms\n\n`;

    report += `#### SEO & Metadata\n`;
    report += `* **Title**: \`${res.metadata.title}\`\n`;
    report += `* **Description**: \`${res.metadata.description}\`\n`;
    report += `* **Canonical URL**: \`${res.metadata.canonical}\`\n`;
    report += `* **OG Title**: \`${res.metadata.ogTitle}\`\n`;
    report += `* **OG Description**: \`${res.metadata.ogDescription}\`\n\n`;

    if (res.pageErrors.length > 0) {
      report += `> [!CAUTION]\n`;
      report += `> **Unhandled Page Exceptions**:\n`;
      for (const err of res.pageErrors) {
        report += `> * \`${err.replace(/\n/g, ' ')}\`\n`;
      }
      report += `\n`;
    }

    if (res.consoleErrors.length > 0) {
      report += `> [!WARNING]\n`;
      report += `> **Console Errors**:\n`;
      for (const err of res.consoleErrors) {
        report += `> * \`${err}\`\n`;
      }
      report += `\n`;
    }

    if (res.failedRequests.length > 0) {
      report += `> [!IMPORTANT]\n`;
      report += `> **Failed Network Requests**:\n`;
      for (const req of res.failedRequests) {
        report += `> * \`${req}\`\n`;
      }
      report += `\n`;
    }

    if (res.pageErrors.length === 0 && res.consoleErrors.length === 0 && res.failedRequests.length === 0) {
      report += `> [!NOTE]\n`;
      report += `> Page loaded cleanly with zero console warnings, unhandled exceptions, or network failures.\n\n`;
    }

    report += `---\n\n`;
  }

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n🎉 Audit report written successfully to: ${reportPath}`);
}

run().catch(console.error);
