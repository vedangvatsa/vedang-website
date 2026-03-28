const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  page.on('requestfailed', request => console.log('NETWORK_ERROR:', request.url(), request.failure().errorText));

  console.log("Navigating to http://localhost:3000/towards-the-agentic-web ...");
  await page.goto('http://localhost:3000/towards-the-agentic-web', { waitUntil: 'networkidle2' });
  console.log("Done waiting.");
  
  await browser.close();
})();
