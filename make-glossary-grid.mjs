import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1700, height: 1200, deviceScaleFactor: 2 });
  
  const svgs = [
    'algorithmic-bias.svg', 'atomic-swap.svg', 'sequencer.svg', 
    'tokenomics.svg', 'transformer.svg', 'llm.svg', 
    'agi.svg', 'blockchain.svg', 'smart-contract.svg'
  ];
  
  let html = `<html style="margin:0; padding:0;"><body style="background: #111; margin:0; padding: 20px; display:flex; flex-wrap:wrap; gap: 20px; justify-content: center; font-family: sans-serif;">`;
  
  for(let file of svgs) {
     const svg = fs.readFileSync(`/Users/vedang/vedang-website/public/images/glossary/${file}`, 'utf8');
     html += `<div style="width: 500px; height: 500px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">${svg}</div>`;
  }
  html += `</body></html>`;
  
  await page.setContent(html);
  // Wait a moment for fonts/rendering
  await new Promise(r => setTimeout(r, 500));
  
  const outPath = '/Users/vedang/.gemini/antigravity/brain/39f43482-2e85-4586-a290-f6211d590217/glossary_examples_grid.webp';
  await page.screenshot({ path: outPath, type: 'webp', quality: 90 });
  await browser.close();
  console.log('✅ Generated grid at', outPath);
})();
