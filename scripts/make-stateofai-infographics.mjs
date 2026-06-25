import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'linkedin-infographics');

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

// Shared base — matches agentic infographics exactly: Inter font, same padding, same structure
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

// ── Image 1: Trust Gap ────────────────────────────────────────────────────────
await shot(base(
  'People use AI agents.<br>They don't trust them to pay.',
  'USE AI ASSISTANTS',
  ['54% of adults use them regularly', 'Up from near zero in 2023', 'Covers search, tasks, shopping'],
  'TRUST AGENTS TO BUY',
  ['Only 24% would let an agent pay', '30-point gap between use and trust', 'Money is where people draw the line'],
), 'trust_gap.png');

// ── Image 2: LLM Paper Explosion ─────────────────────────────────────────────
await shot(base(
  'LLM research papers.<br>29.9× in seven years.',
  'THE NUMBERS',
  ['3,248 papers in 2018', '96,984 papers in 2025', '29.9× total growth'],
  'THE POST-2022 SPIKE',
  ['12.2× growth after ChatGPT', 'Most growth in 3 years', 'No sign of slowing down'],
), 'llm_explosion.png');

// ── Image 3: Citation Power Law ──────────────────────────────────────────────
await shot(base(
  '944,000 AI papers a year.<br>Half go unread.',
  'VOLUME',
  ['944,000+ papers published in 2025', 'Across all AI subfields', 'Growing every quarter'],
  'IMPACT',
  ['48.9% get zero citations', 'A small fraction drives the field', 'More papers ≠ more progress'],
), 'citation_power_law.png');

await browser.close();
console.log('\nAll 3 done.');
