import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = '/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/thread-assets';

const browser = await chromium.launch({ headless: true });

async function shot(html, filename) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/${filename}`, type: 'png' });
  await page.close();
  console.log(`✅ Generated ${filename}`);
}

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

// ── Infographic 1: Trust Gap ──────────────────────────────────────────────────
await shot(base(
  '54% use AI agents.<br>Only 24% trust them to buy.',
  'USE AI ASSISTANTS REGULARLY',
  ['54% of US adults', 'Search, summaries & translation', 'Fast consumer adoption'],
  'TRUST AGENTS TO PAY',
  ['Only 24% do.', 'A 30-point trust gap.', 'The critical adoption bottleneck.'],
  'The technology is ready. The user psychology is not.'
), 'agentic_trust_gap.png');

// ── Infographic 2: LLM Explosion ──────────────────────────────────────────────
await shot(base(
  'LLM research grew 29.9x.<br>The field shifted overnight.',
  'LLM ACADEMIC PAPERS',
  ['3,248 papers in 2018', '96,984 papers in 2025', '29.9x growth in 7 years'],
  'THE POST-2022 ACCELERATION',
  ['12.2x growth after 2022.', 'Now 10.3% of all AI research.', 'DeepSeek led keyword velocity.'],
  'The entire research community shifted their focus in 36 months.'
), 'llm_paper_explosion.png');

// ── Infographic 3: Citation Power Law ──────────────────────────────────────────
await shot(base(
  'Half of all AI papers<br>receive zero citations.',
  'TOTAL AI PAPERS (2025)',
  ['944,000+ publications', '42.6% increase over 2024', '1.6M projected for 2026'],
  'CITATION POWER LAW',
  ['48.9% have zero citations.', 'Most papers are never read.', 'Volume outpaces attention.'],
  'When publishing becomes cheap, signal extraction becomes the bottleneck.'
), 'citation_power_law.png');

await browser.close();
console.log('All new infographics completed successfully.');
