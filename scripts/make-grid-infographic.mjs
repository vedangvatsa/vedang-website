import puppeteer from 'puppeteer';

const OUT = '/Users/vedang/vedang-website/scripts/thread-assets/ai_grid.png';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

const teams = [
  [1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0],
  [1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
  [0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,1,0,0],
];

// pooled: union of all teams = 1 wherever any team is 1, with very few gaps
const pooled = Array(20).fill(0).map((_, i) =>
  teams.some(t => t[i] === 1) ? 1 : 0
);
// force pooled to be almost all filled (only 2 gaps)
const pooledFinal = pooled.map((v, i) => [6, 17].includes(i) ? 0 : 1);

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
  font-size: 54px;
  font-weight: 900;
  color: #111;
  line-height: 1.15;
  margin-bottom: 56px;
}
.columns {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 0;
}
.col {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.col-left { padding-right: 48px; border-right: 1px solid #ddd; }
.col-right { padding-left: 48px; }
.col-header {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 20px;
}
.team-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.team-label {
  font-size: 13px;
  color: #aaa;
  width: 50px;
  flex-shrink: 0;
}
.bar-track {
  flex: 1;
  height: 42px;
  display: flex;
  gap: 3px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  padding: 5px;
}
.seg { flex: 1; border-radius: 2px; }
.seg.on  { background: #555; }
.seg.off { background: transparent; }
.util-bad {
  font-size: 15px;
  font-weight: 700;
  color: #d44;
  margin-top: 18px;
}
/* pooled grid: one tall bar the same total height as all 5 team rows */
.pooled-bar-outer {
  width: 100%;
  /* match height of 5 rows: 5 * 42px bar + 5 * 14px gap - last gap = 210 + 56 = 266px */
  height: 266px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.pooled-seg-row {
  flex: 1;
  display: flex;
  gap: 3px;
}
.pseg { flex: 1; border-radius: 2px; }
.pseg.on  { background: #111; }
.pseg.off { background: #ddd; }
.util-good {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-top: 14px;
}
.caption {
  font-size: 14px;
  color: #aaa;
  margin-top: 14px;
  line-height: 1.5;
}
.handle {
  position: absolute;
  bottom: 44px;
  left: 0; right: 0;
  text-align: center;
  font-size: 18px;
  color: #ccc;
}
</style>
</head>
<body>
<div class="headline">Small teams waste 30–40%<br>of compute. Pooling fixes this.</div>
<div class="columns">
  <div class="col col-left">
    <div class="col-header">5 independent teams</div>
    ${teams.map((t, i) => `
    <div class="team-row">
      <div class="team-label">Team ${i+1}</div>
      <div class="bar-track">
        ${t.map(s => `<div class="seg ${s ? 'on' : 'off'}"></div>`).join('')}
      </div>
    </div>`).join('')}
    <div class="util-bad">~58% avg utilization</div>
  </div>
  <div class="col col-right">
    <div class="col-header">Pooled grid</div>
    <div class="pooled-bar-outer">
      ${[0,1,2,3,4].map(() => `
      <div class="pooled-seg-row">
        ${pooledFinal.map(v => `<div class="pseg ${v ? 'on' : 'off'}"></div>`).join('')}
      </div>`).join('')}
    </div>
    <div class="util-good">~92% avg utilization</div>
    <div class="caption">When one team trains,<br>another deploys. Demand smooths out.</div>
  </div>
</div>
<div class="handle">@vedangvatsa</div>
</body>
</html>`;

await page.setContent(html, { waitUntil: 'networkidle0' });
await page.screenshot({ path: OUT, type: 'png' });
await browser.close();
console.log('Done:', OUT);
