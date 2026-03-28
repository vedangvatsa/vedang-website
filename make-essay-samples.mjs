import puppeteer from 'puppeteer';

const OUT_DIR = '/Users/vedang/.gemini/antigravity/brain/a15e4405-09fb-4c3c-8a3f-3169722b03a2';

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
    line-height: 1.4;
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

await shot(base(
  'The web is rewiring<br>for machines.',
  'HUMAN WEB (LOSING VALUE)',
  ['Display ads', 'Clickbait headlines', 'SEO keyword stuffing', 'Manipulative UX loops'],
  'AGENTIC WEB (GAINING VALUE)',
  ['Structured data feeds', 'Clean API endpoints', 'Verifiable reputation', 'Answer engine ranking'],
  'When agents browse the web for you, the entire interface ecosystem changes.'
), 'sample-agentic-web.png');

await shot(base(
  'From interface to<br>co-cognition.',
  'PAST: THE INTERFACE',
  ['Command Line', 'Graphical UI', 'Touch Screens', 'Voice Commands'],
  'FUTURE: CO-COGNITION',
  ['Ambient Intelligence', 'Predictive Empathy', 'Continuous Learning', 'Direct Neural Translation'],
  'The evolution of technology is the gradual disappearance of the interface.'
), 'sample-intuitive-singularity.png');

await browser.close();
console.log('✅ Generated samples to brain directory');
