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
  <div style="font-size:50px;font-weight:900;color:#111;line-height:1.2;margin-bottom:60px;">
    Six companies.<br>Six different bets<br>on who owns the wallet.
  </div>
  <div style="width:100%;display:flex;flex-direction:column;gap:0;">
    ${[
      ['Google', 'Controls search + where agents discover products'],
      ['OpenAI', 'Controls the conversation where you express intent'],
      ['Coinbase', 'Wants agents to pay each other directly, no bank needed'],
      ['Stripe', 'Wants to be the payment layer for every agent transaction'],
      ['Mastercard', 'Tokenized cards so agents can pay like humans'],
      ['Visa', 'Same — already blocking 500 fraudulent agent transactions per minute'],
    ].map(([name, desc]) => `
      <div style="display:flex;align-items:center;gap:24px;padding:18px 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-size:20px;font-weight:800;color:#111;width:120px;flex-shrink:0;">${name}</span>
        <span style="font-size:19px;color:#555;">${desc}</span>
      </div>
    `).join('')}
  </div>
  <div class="handle">@vedangvatsa</div>
</body></html>`, { waitUntil: 'networkidle0' });

await page.screenshot({ path: `${OUT}/agentic_3.png`, type: 'png' });
await browser.close();
console.log('✅ agentic_3.png regenerated');
