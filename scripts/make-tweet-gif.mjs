import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlFile = '/Users/vedang/.gemini/antigravity/brain/516b7176-e1e4-4ac5-8db3-f9940e86ed61/tweet1-animation.html';
const framesDir = path.resolve(__dirname, 'gif-frames');
const outputGif = '/Users/vedang/.gemini/antigravity/brain/516b7176-e1e4-4ac5-8db3-f9940e86ed61/tweet1.gif';

if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
fs.mkdirSync(framesDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });

console.log('Capturing frames...');

const fps = 15;
const totalDuration = 4500;
const totalFrames = Math.round((totalDuration / 1000) * fps);

for (let i = 0; i < totalFrames; i++) {
  const t = (i / fps) * 1000;
  await page.evaluate((time) => {
    document.getAnimations().forEach(a => {
      try { a.currentTime = time; a.pause(); } catch(e) {}
    });
  }, t);
  await page.screenshot({
    path: path.join(framesDir, `frame-${String(i).padStart(4, '0')}.png`),
  });
  if (i % 10 === 0) process.stdout.write(`\r  Frame ${i}/${totalFrames}`);
}

await browser.close();
console.log(`\nConverting ${totalFrames} frames to GIF...`);

execSync(
  `ffmpeg -y -framerate ${fps} -i "${framesDir}/frame-%04d.png" ` +
  `-vf "scale=540:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ` +
  `"${outputGif}"`,
  { stdio: 'inherit' }
);

console.log(`\n✅ GIF saved to: ${outputGif}`);
fs.rmSync(framesDir, { recursive: true });
