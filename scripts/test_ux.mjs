import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function testUserExperience() {
  const screenshotsDir = '/Users/vedang/.gemini/antigravity/brain/db171020-e1d6-4bbb-8810-17d5007a3d08/scratch/ux_screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('🚀 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // Track console logs and errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log('\n--- 1. Testing /scan (Agentic Readiness Scanner) ---');
  await page.goto('http://localhost:3000/scan', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01_scan_initial.png'), fullPage: true });
  console.log('📸 Captured 01_scan_initial.png');

  // Verify elements on initial state
  const input = page.locator('input[placeholder*="Enter domain"]');
  await input.waitFor({ state: 'visible' });
  console.log('✅ Input box visible');

  // Click preset "veda.ng"
  console.log('🖱️ Clicking preset "veda.ng"...');
  const vedaPreset = page.locator('button:has-text("veda.ng")');
  await vedaPreset.click();

  // Wait for scan to complete and results dashboard to appear
  console.log('⏳ Waiting for scan audit results...');
  const scoreLocator = page.locator('text=/100');
  await scoreLocator.waitFor({ state: 'visible', timeout: 30000 });
  console.log('✅ Scan results rendered!');

  await page.screenshot({ path: path.join(screenshotsDir, '02_scan_results.png'), fullPage: true });
  console.log('📸 Captured 02_scan_results.png');

  // Test filter: Click "Attention" filter
  console.log('🖱️ Clicking "Attention" status filter...');
  const attentionBtn = page.locator('button:has-text("Attention (")');
  await attentionBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '03_scan_attention_filter.png') });
  console.log('📸 Captured 03_scan_attention_filter.png');

  // Test filter: Click "Discovery" layer filter
  console.log('🖱️ Clicking "Discovery" layer filter...');
  const discoveryBtn = page.locator('button:has-text("Discovery")').first();
  await discoveryBtn.click();
  await page.waitForTimeout(400);

  // Test expanding a check row
  console.log('🖱️ Testing check row expansion...');
  const firstCheck = page.locator('[role="button"]').first();
  if (await firstCheck.isVisible()) {
    await firstCheck.click();
    await page.waitForTimeout(300);
    console.log('✅ Check row expanded');
  }

  // Test copy summary button
  const copySummaryBtn = page.locator('button:has-text("Copy Summary")');
  if (await copySummaryBtn.isVisible()) {
    await copySummaryBtn.click();
    await page.waitForTimeout(300);
    console.log('✅ Copy Summary button clicked successfully');
  }

  console.log('\n--- 2. Testing /developers (Developer Portal) ---');
  await page.goto('http://localhost:3000/developers', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '04_developers.png'), fullPage: true });
  console.log('📸 Captured 04_developers.png');

  // Verify developer links
  const apiLink = page.locator('a[href="/openapi.json"]').first();
  if (await apiLink.isVisible()) {
    console.log('✅ OpenAPI link visible and clickable');
  }

  console.log('\n--- 3. Testing /aiindia (Essay) ---');
  await page.goto('http://localhost:3000/aiindia', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '05_aiindia.png'), fullPage: false });
  console.log('📸 Captured 05_aiindia.png');

  console.log('\n--- 4. Testing Homepage (/) ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '06_homepage.png'), fullPage: false });
  console.log('📸 Captured 06_homepage.png');

  console.log('\n--- 5. Testing Mobile Viewport on /scan ---');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/scan?url=veda.ng', { waitUntil: 'networkidle' });
  await page.locator('text=/100').waitFor({ state: 'visible', timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotsDir, '07_scan_mobile.png'), fullPage: true });
  console.log('📸 Captured 07_scan_mobile.png');

  console.log('\n======================================');
  console.log('UX Audit Summary:');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  } else {
    console.log('✅ 0 Console errors detected across all tested journeys.');
  }
  console.log('======================================');

  await browser.close();
}

testUserExperience().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
