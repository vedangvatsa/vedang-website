import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://www.linkedin.com/posts/williamhgates_life-is-more-fun-when-you-have-a-friend-like-activity-6970421818629234689-5JIC?utm_source=combined_share_message&utm_medium=member_desktop&rcm=ACoAAEG2asMBYTyMCoj2oTvEOdvQeW7-vSZLLEU';
  console.log('Navigating...');
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  
  const html = await page.content();
  console.log('HTML Length:', html.length);
  
  // Search for media.licdn.com/dms/image in html using native regex
  const regex = /https:\/\/media\.licdn\.com\/dms\/image\/[^\s\"\'\>]+/g;
  const matches = html.match(regex) || [];
  console.log('Found', matches.length, 'image matches in raw HTML:');
  matches.slice(0, 10).forEach((m, idx) => {
    console.log(`${idx + 1}: ${m.substring(0, 150)}`);
  });
  
  await browser.close();
}

run().catch(console.error);
