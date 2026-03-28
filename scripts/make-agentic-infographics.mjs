import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = '/Users/vedang/vedang-website/scripts/thread-assets';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function shot(html, filename) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `${OUT}/${filename}`, type: 'png' });
  await page.close();
  console.log(`✅ ${filename}`);
}

// Shared base — matches tweet 1 exactly: Inter font, same padding, same structure
const base = (headline, leftLabel, leftItems, rightLabel, rightItems, sub = '') => `
<!DOCTYPE html>
<html>
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #fff;
    width: 1080px;
    height: 1080px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 88px;
    position: relative;
  }
  .headline {
    font-size: 62px;
    font-weight: 900;
    color: #111;
    line-height: 1.15;
    margin-bottom: 52px;
  }
  .columns {
    display: flex;
    width: 100%;
  }
  .col-left {
    flex: 1;
    padding-right: 52px;
    border-right: 1px solid #ddd;
  }
  .col-right {
    flex: 1;
    padding-left: 52px;
  }
  .col-header {
    font-size: 13px;
    font-weight: 600;
    color: #bbb;
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .item-gray {
    font-size: 26px;
    font-weight: 400;
    color: #aaa;
    margin-bottom: 16px;
    line-height: 1.3;
  }
  .item-black {
    font-size: 26px;
    font-weight: 800;
    color: #111;
    margin-bottom: 16px;
    line-height: 1.3;
  }
  .sub {
    font-size: 20px;
    font-weight: 400;
    color: #aaa;
    margin-top: 44px;
  }
  .handle {
    position: absolute;
    bottom: 52px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #ccc;
  }
</style>
</head>
<body>
  <div class="headline">${headline}</div>
  <div class="columns">
    <div class="col-left">
      <div class="col-header">${leftLabel}</div>
      ${leftItems.map(i => `<div class="item-gray">${i}</div>`).join('')}
    </div>
    <div class="col-right">
      <div class="col-header">${rightLabel}</div>
      ${rightItems.map(i => `<div class="item-black">${i}</div>`).join('')}
    </div>
  </div>
  ${sub ? `<div class="sub">${sub}</div>` : ''}
  <div class="handle">@vedangvatsa</div>
</body>
</html>`;

// ── Tweet 2: Trust Gap ────────────────────────────────────────────────────────
await shot(base(
  '1 in 5 holiday orders.<br>AI was involved.',
  'USE AI ASSISTANTS REGULARLY',
  ['49% of US adults', 'up from nearly zero in 2023', 'PYMNTS, February 2026'],
  'TRUST AGENTS TO BUY FOR THEM',
  ['Only 24% do.', 'That gap is 25 points wide.', 'Forrester, March 2025'],
  'The gap between use and trust is the opportunity.'
), 'agentic_2.png');

// ── Tweet 3: Six Companies ────────────────────────────────────────────────────
await shot(base(
  'Six companies.<br>Six bets on the wallet.',
  'COMPANY',
  ['Google', 'OpenAI', 'Coinbase', 'Stripe', 'Mastercard', 'Visa'],
  'THEIR BET',
  ['Control where agents discover products', 'Control the conversation layer', 'Agents pay with no bank needed', 'Payment layer for every transaction', 'Tokenized cards for agent checkouts', 'Secure the network against agent fraud'],
), 'agentic_3.png');

// ── Tweet 4: Ads Stop Working ─────────────────────────────────────────────────
await shot(base(
  'When the buyer is<br>an algorithm,<br>ads stop working.',
  'LOSES VALUE',
  ['Display ads', 'Brand loyalty', 'SEO keywords', 'Checkout UX'],
  'GAINS VALUE',
  ['Structured product data', 'Real-time inventory feeds', 'Machine-readable specs', 'Answer engine ranking'],
), 'agentic_4.png');

// ── Tweet 5: Built vs Missing ─────────────────────────────────────────────────
await shot(base(
  'The rails are built.<br>The protocols are live.',
  'DONE',
  ['Payment rails', 'Commerce protocols', 'Merchant tools', 'Agent wallets'],
  'STILL MISSING',
  ['Consumer trust', 'Merchant readiness', 'Legal framework', 'One dominant standard'],
  'Only 24% trust agents with their money. That is the only blocker.'
), 'agentic_5.png');

await browser.close();
console.log('\nAll 4 done.');
