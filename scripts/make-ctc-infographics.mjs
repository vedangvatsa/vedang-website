import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">`;

const BASE = `* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',sans-serif; background:#fff; width:1080px; height:1080px; padding:80px 88px 64px; display:flex; flex-direction:column; }
.handle { margin-top:auto; text-align:center; font-size:17px; color:#ccc; padding-top:28px; }`;

// ─── INFOGRAPHIC 1: The Arc ─────────────────────────────────────────────────
const html1 = `<!DOCTYPE html><html><head>${FONT}<style>
${BASE}
.headline { font-size:50px; font-weight:900; color:#111; line-height:1.15; margin-bottom:10px; }
.sub { font-size:13px; font-weight:700; color:#e44; letter-spacing:.1em; text-transform:uppercase; margin-bottom:40px; }
.row { display:flex; align-items:stretch; border-top:1px solid #eee; padding:18px 0; gap:0; }
.country { font-size:15px; font-weight:700; color:#111; width:80px; flex-shrink:0; padding-top:2px; }
.before { flex:1; font-size:14px; color:#bbb; padding-right:16px; line-height:1.5; }
.arrow { font-size:20px; color:#ccc; flex-shrink:0; padding:0 14px; align-self:center; }
.after { flex:1; font-size:14px; font-weight:700; color:#111; line-height:1.5; }
.india-after { color:#999; font-weight:400; font-style:italic; }
.caption { font-size:15px; color:#aaa; margin-top:28px; line-height:1.6; border-top:1px solid #eee; padding-top:20px; }
</style></head><body>
<div class="headline">Every country starts cheap.<br>Then it doesn't.</div>
<div class="sub">Japan. Korea. China. India.</div>
<div class="row">
  <div class="country">Japan</div>
  <div class="before">1965. Transistor radios that broke.</div>
  <div class="arrow">→</div>
  <div class="after">1985. 25% of the US car market.</div>
</div>
<div class="row">
  <div class="country">Korea</div>
  <div class="before">1986. Cheapest car in the US at $4,995.</div>
  <div class="arrow">→</div>
  <div class="after">2012. Samsung overtakes Apple globally.</div>
</div>
<div class="row">
  <div class="country">China</div>
  <div class="before">2000. "Made in China" meant cheap.</div>
  <div class="arrow">→</div>
  <div class="after">2023. DJI owns 70% of the drone market. BYD is the largest EV maker by volume.</div>
</div>
<div class="row">
  <div class="country">India</div>
  <div class="before">2023. $2,730 GDP per capita.</div>
  <div class="arrow">→</div>
  <div class="india-after after">2035 onward.</div>
</div>
<div class="caption">The perception always trails the reality. By 15 to 20 years. In every case.</div>
<div class="handle">@vedangvatsa</div>
</body></html>`;

// ─── INFOGRAPHIC 2: India's Bifurcated Story ───────────────────────────────
const html2 = `<!DOCTYPE html><html><head>${FONT}<style>
${BASE}
.headline { font-size:48px; font-weight:900; color:#111; line-height:1.15; margin-bottom:40px; }
.section-label { font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; margin-bottom:14px; }
.done-label { color:#e44; }
.next-label { color:#aaa; }
.stat { font-size:17px; color:#111; line-height:1.7; margin-bottom:4px; }
.stat span { color:#aaa; font-weight:400; }
.divider { width:100%; height:1px; background:#eee; margin:28px 0; }
.kicker { font-size:16px; color:#111; line-height:1.7; margin-top:8px; font-weight:600; }
.caption { font-size:15px; color:#aaa; margin-top:28px; line-height:1.6; }
</style></head><body>
<div class="headline">India has already crossed over.<br>In two sectors.</div>
<div class="section-label done-label">Done</div>
<div class="stat">Software exports went from <span>$6B in 2001</span> to <strong>$194B in 2023.</strong></div>
<div class="stat">Pharma covers <strong>40% of US generic drug approvals.</strong> <span>Same FDA standards as Switzerland.</span></div>
<div class="divider"></div>
<div class="section-label next-label">In progress</div>
<div class="stat">Consumer manufacturing is early stage.</div>
<div class="stat">Apple now assembles iPhones in Tamil Nadu and Karnataka.</div>
<div class="divider"></div>
<div class="kicker">Japan flipped through cars. Korea through smartphones.<br>China through EVs. India through consumer electronics, next.</div>
<div class="caption">The reputation follows the reality. In every case examined, it always did.</div>
<div class="handle">@vedangvatsa</div>
</body></html>`;

// ─── INFOGRAPHIC 3: The Lag ─────────────────────────────────────────────────
const html3 = `<!DOCTYPE html><html><head>${FONT}<style>
${BASE}
.headline { font-size:48px; font-weight:900; color:#111; line-height:1.15; margin-bottom:36px; }
.row { display:flex; align-items:baseline; border-top:1px solid #eee; padding:16px 0; gap:16px; }
.year-from { font-size:13px; color:#bbb; width:200px; flex-shrink:0; line-height:1.5; }
.arrow { font-size:18px; color:#ccc; flex-shrink:0; }
.year-to { font-size:14px; font-weight:700; color:#111; flex:1; line-height:1.5; }
.lag-box { background:#f5f5f5; border-radius:6px; padding:12px 18px; margin:8px 0 4px; display:inline-block; font-size:13px; color:#999; }
.divider { width:100%; height:1px; background:#eee; margin:24px 0; }
.kicker { font-size:22px; font-weight:900; color:#111; margin-top:4px; }
.caption { font-size:15px; color:#aaa; margin-top:20px; }
</style></head><body>
<div class="headline">The lag is consistent.<br>It has never not resolved.</div>
<div class="row">
  <div class="year-from">"Made in Japan" was a joke.<br>1955.</div>
  <div class="arrow">→</div>
  <div class="year-to">Precision engineering.<br>1980.</div>
</div>
<div class="row">
  <div class="year-from">"Made in Korea" meant cheap.<br>1986.</div>
  <div class="arrow">→</div>
  <div class="year-to">Samsung number one globally.<br>2012.</div>
</div>
<div class="row">
  <div class="year-from">"Made in China" meant low quality.<br>2000.</div>
  <div class="arrow">→</div>
  <div class="year-to">DJI owns 70% of the drone market. BYD is the largest EV maker by volume.<br>2023. Still underrated in surveys.</div>
</div>
<div style="margin-top:6px;"><span class="lag-box">Gap in every case: 15 to 20 years</span></div>
<div class="divider"></div>
<div class="kicker">India is at the start of that curve.</div>
<div class="caption">$2,730 GDP per capita. Software and pharma have already crossed.<br>Consumer manufacturing has not.</div>
<div class="handle">@vedangvatsa</div>
</body></html>`;

const images = [
  { html: html1, out: 'scripts/thread-assets/ctc_arc.png' },
  { html: html2, out: 'scripts/thread-assets/ctc_india.png' },
  { html: html3, out: 'scripts/thread-assets/ctc_lag.png' },
];

for (const { html, out } of images) {
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `/Users/vedang/vedang-website/${out}`, type: 'png' });
  console.log('Done:', out);
}

await browser.close();
