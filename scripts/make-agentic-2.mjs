import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = '/Users/vedang/vedang-website/scripts/thread-assets';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

await page.setContent(`<!DOCTYPE html><html><head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, 'Helvetica Neue', sans-serif;
    background: #fff;
    width: 1080px; height: 1080px;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 80px;
  }
  .handle { position: absolute; bottom: 48px; left: 0; right: 0; text-align: center; font-size: 22px; color: #aaa; }
</style>
</head><body>
  <div style="font-size:50px;font-weight:900;color:#111;line-height:1.2;margin-bottom:64px;">
    1 in 5 holiday orders<br>involved an AI agent.<br>Only 24% trust them<br>to spend money.
  </div>

  <div style="margin-bottom:24px;width:100%;">
    <div style="font-size:16px;color:#999;letter-spacing:.06em;margin-bottom:8px;">AI INFLUENCED ORDERS — CYBER WEEK 2025 (SALESFORCE)</div>
    <div style="height:36px;background:#111;width:100%;border-radius:3px;display:flex;align-items:center;padding-left:16px;">
      <span style="color:#fff;font-size:20px;font-weight:700;">20% — 1 in 5 orders</span>
    </div>
  </div>

  <div style="margin-bottom:56px;width:100%;">
    <div style="font-size:16px;color:#999;letter-spacing:.06em;margin-bottom:8px;">TRUST AGENTS TO MAKE PURCHASES — FORRESTER, MAR 2025</div>
    <div style="height:36px;background:#bbb;width:24%;border-radius:3px;display:flex;align-items:center;padding-left:16px;">
      <span style="color:#fff;font-size:20px;font-weight:700;">24%</span>
    </div>
  </div>

  <div style="border-top:2px solid #111;padding-top:28px;width:100%;">
    <div style="font-size:34px;font-weight:800;color:#111;">The gap is the opportunity.</div>
  </div>

  <div class="handle">@vedangvatsa</div>
</body></html>`, { waitUntil: 'networkidle0' });

await page.screenshot({ path: `${OUT}/agentic_2.png`, type: 'png' });
await browser.close();
console.log('✅ agentic_2.png updated with correct facts');
