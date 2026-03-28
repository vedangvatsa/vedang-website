import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/Users/vedang/vedang-website/public/images/essays';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function shot(html, filename) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `${OUT_DIR}/${filename}`, type: 'png' });
  await page.close();
  console.log(`✅ ${filename}`);
}

// 1. Chart / Data Visual for Agentic Web
const agenticWebChartHtml = `
<!DOCTYPE html>
<html>
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: 'Inter', sans-serif;
  background: #fff;
  width: 1080px;
  height: 1080px;
  padding: 88px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.headline {
  font-size: 62px;
  font-weight: 900;
  color: #111;
  line-height: 1.15;
  margin-bottom: 72px;
}
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.bar-row {
  display: flex;
  align-items: center;
}
.label {
  width: 280px;
  font-size: 24px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.bar-wrapper {
  flex: 1;
  height: 64px;
  background: #f0f0f0;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: #111;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  color: #fff;
  font-weight: 900;
  font-size: 28px;
}
.bar-fill.accent {
  background: #3b82f6; /* Blue accent for contrast */
}
.sub {
  font-size: 22px;
  font-weight: 400;
  color: #888;
  margin-top: auto;
  margin-bottom: 40px;
  line-height: 1.5;
}
.handle {
  position: absolute;
  bottom: 52px;
  left: 0; right: 0;
  text-align: center;
  font-size: 20px;
  color: #ccc;
}
</style>
</head>
<body>
<div class="headline">The infrastructure for<br>the Agentic Web is built.</div>
<div class="chart-container">
  <div class="bar-row">
    <div class="label">Major AI Platforms<br><span style="font-size:16px;color:#aaa">OpenAI, Google, MSFT, Anthropic</span></div>
    <div class="bar-wrapper"><div class="bar-fill" style="width: 100%;">100% Adopted MCP</div></div>
  </div>
  <div class="bar-row">
    <div class="label">MCP Servers<br><span style="font-size:16px;color:#aaa">As of early 2026</span></div>
    <div class="bar-wrapper"><div class="bar-fill accent" style="width: 85%;">6,400+</div></div>
  </div>
  <div class="bar-row">
    <div class="label">A2A Protocol<br><span style="font-size:16px;color:#aaa">Adoption scale</span></div>
    <div class="bar-wrapper"><div class="bar-fill" style="width: 60%;">150+ Orgs</div></div>
  </div>
</div>
<div class="sub">The missing piece was the autonomous software that could use the rails.<br>That piece now exists.</div>
<div class="handle">@vedangvatsa</div>
</body>
</html>
`;

// 2. Grid / Columns visual for AI Economy
const agenticCommerceHtml = `
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
    padding: 88px;
    position: relative;
  }
  .headline {
    font-size: 62px;
    font-weight: 900;
    color: #111;
    line-height: 1.15;
    margin-bottom: 60px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }
  .card {
    background: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    flex-direction: column;
  }
  .card-title {
    font-size: 16px;
    font-weight: 800;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 24px;
  }
  .card-big {
    font-size: 42px;
    font-weight: 900;
    color: #111;
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .card-text {
    font-size: 22px;
    color: #555;
    line-height: 1.5;
  }
  .sub {
    font-size: 24px;
    font-weight: 600;
    color: #3b82f6; /* Accent */
    margin-top: auto;
    margin-bottom: 40px;
    text-align: center;
  }
  .handle {
    position: absolute;
    bottom: 52px;
    left: 0; right: 0;
    text-align: center;
    font-size: 20px;
    color: #ccc;
  }
</style>
</head>
<body>
  <div class="headline">Agents don't scroll.<br>They execute.</div>
  
  <div class="grid">
    <div class="card">
      <div class="card-title">Traditional E-Commerce</div>
      <div class="card-big">Optimized for Attention</div>
      <div class="card-text">Relies on display ads, SEO keywords, clickbait, and manipulative UX loops to force you to buy.</div>
    </div>
    <div class="card">
      <div class="card-title">Agentic Commerce</div>
      <div class="card-big">Optimized for Intent</div>
      <div class="card-text">Relies on structured APIs, real-time inventory feeds, machine-readable specs, and logic.</div>
    </div>
  </div>

  <div class="sub">The business model shifts from capturing clicks to fulfilling logic.</div>
  <div class="handle">@vedangvatsa</div>
</body>
</html>
`;

await shot(agenticWebChartHtml, 'agentic-web-chart.png');
await shot(agenticCommerceHtml, 'agentic-commerce-grid.png');

await browser.close();
console.log('✅ Generated 2 custom charts to /public/images/essays');
