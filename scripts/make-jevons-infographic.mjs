import puppeteer from 'puppeteer';

const OUT = '/Users/vedang/vedang-website/scripts/thread-assets/jevons.png';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

const html = `<!DOCTYPE html>
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
  padding: 80px 88px 72px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.headline {
  font-size: 52px;
  font-weight: 900;
  color: #111;
  line-height: 1.15;
  margin-bottom: 36px;
}
.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
}
.row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 0;
}
.row-label {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  width: 120px;
  flex-shrink: 0;
  text-align: right;
  line-height: 1.3;
}
.bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.bar-group-label {
  font-size: 11px;
  color: #bbb;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar-label {
  font-size: 12px;
  color: #aaa;
  width: 52px;
  flex-shrink: 0;
}
.bar {
  height: 44px;
  border-radius: 4px;
  position: relative;
}
.bar-before { background: #ddd; }
.bar-after  { background: #111; }
.bar-value {
  position: absolute;
  right: -44px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.bar-before .bar-value { color: #aaa; }
.bar-after  .bar-value { color: #111; }
.divider {
  width: 100%;
  height: 1px;
  background: #eee;
  margin: 4px 0 20px;
}
.caption {
  font-size: 15px;
  color: #aaa;
  margin-top: 32px;
  line-height: 1.6;
}
.handle {
  margin-top: auto;
  text-align: center;
  padding-top: 32px;
  font-size: 18px;
  color: #ccc;
}
.paradox-label {
  font-size: 13px;
  font-weight: 700;
  color: #e44;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
</style>
</head>
<body>
<div class="headline">AI makes work cheaper.<br>So we do more of it.</div>
<div class="paradox-label">Jevons Paradox — 1865 → 2025</div>
<div class="chart-area">

  <!-- Photography -->
  <div class="row">
    <div class="row-label">Photography</div>
    <div class="bars">
      <div class="bar-row">
        <div class="bar-label" style="color:#bbb;font-size:11px;">Before</div>
        <div class="bar bar-before" style="width:80px;"><span class="bar-value">~1B photos/yr</span></div>
      </div>
      <div class="bar-row">
        <div class="bar-label" style="color:#111;font-size:11px;font-weight:600;">After</div>
        <div class="bar bar-after" style="width:420px;"><span class="bar-value" style="color:#fff;right:8px;">1.8T photos/yr</span></div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Legal -->
  <div class="row">
    <div class="row-label">Legal services</div>
    <div class="bars">
      <div class="bar-row">
        <div class="bar-label" style="color:#bbb;font-size:11px;">Before</div>
        <div class="bar bar-before" style="width:160px;"><span class="bar-value">few can afford</span></div>
      </div>
      <div class="bar-row">
        <div class="bar-label" style="color:#111;font-size:11px;font-weight:600;">After</div>
        <div class="bar bar-after" style="width:340px;"><span class="bar-value" style="color:#fff;right:8px;">market grew 3×</span></div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Software -->
  <div class="row">
    <div class="row-label">Software built</div>
    <div class="bars">
      <div class="bar-row">
        <div class="bar-label" style="color:#bbb;font-size:11px;">2020</div>
        <div class="bar bar-before" style="width:120px;"><span class="bar-value">baseline</span></div>
      </div>
      <div class="bar-row">
        <div class="bar-label" style="color:#111;font-size:11px;font-weight:600;">2025</div>
        <div class="bar bar-after" style="width:380px;"><span class="bar-value" style="color:#fff;right:8px;">↑ w/ fewer devs</span></div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- AI coding -->
  <div class="row">
    <div class="row-label">AI coding</div>
    <div class="bars">
      <div class="bar-row">
        <div class="bar-label" style="color:#bbb;font-size:11px;">2022</div>
        <div class="bar bar-before" style="width:90px;"><span class="bar-value">baseline</span></div>
      </div>
      <div class="bar-row">
        <div class="bar-label" style="color:#111;font-size:11px;font-weight:600;">2025</div>
        <div class="bar bar-after" style="width:420px;"><span class="bar-value" style="color:#fff;right:8px;">10× more code shipped</span></div>
      </div>
    </div>
  </div>

</div>
<div class="caption">When price falls, demand expands to fill and exceed the gap.<br>Fixed-pool thinking gets this wrong every time.</div>
<div class="handle">@vedangvatsa</div>
</body>
</html>`;

await page.setContent(html, { waitUntil: 'networkidle0' });
await page.screenshot({ path: OUT, type: 'png' });
await browser.close();
console.log('Done:', OUT);
