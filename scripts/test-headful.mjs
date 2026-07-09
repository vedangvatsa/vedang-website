import { chromium } from 'playwright';

async function run() {
  console.log('Launching headful browser...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const urls = [
    'https://www.linkedin.com/posts/williamhgates_ratan-tata-was-a-visionary-leader-whose-dedication-activity-7249921884190859264-vqWz',
    'https://www.linkedin.com/posts/williamhgates_life-is-more-fun-when-you-have-a-friend-like-activity-6970421818629234689-5JIC',
    'https://www.linkedin.com/posts/melindagates_when-our-daughter-jenn-was-in-preschool-activity-6594559614749069313-wcTl',
    'https://www.linkedin.com/posts/rbranson_unity22-activity-6819966769667555329-mipB',
    'https://www.linkedin.com/posts/adammgrant_in-toxic-cultures-people-get-promoted-for-activity-6909171601515110400-syCO'
  ];
  
  for (let i = 0; i < urls.length; i++) {
    console.log(`[${i+1}/${urls.length}] Navigating to:`, urls[i]);
    try {
      await page.goto(urls[i], { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(4000);
      
      // Extract image sources
      const imgUrls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => img.src);
      });
      
      const mainImgUrl = imgUrls.find(src => 
        src.includes('media.licdn.com/dms/image') && 
        !src.includes('profile-') && 
        !src.includes('shrink_200_200') &&
        !src.includes('shrink_100_100')
      );
      
      if (mainImgUrl) {
        console.log(`  -> Found image: ${mainImgUrl.substring(0, 100)}...`);
      } else {
        console.log(`  -> No main image found in ${imgUrls.length} images`);
      }
    } catch (err) {
      console.log(`  -> Error:`, err.message);
    }
    await page.waitForTimeout(2000);
  }
  
  await browser.close();
}

run().catch(console.error);
