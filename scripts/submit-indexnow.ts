import fs from 'fs';
import path from 'path';

const HOST = 'veda.ng';
const KEY = 'efeb4c9b344b48a9819cd02571aab0ed';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow'
];

async function main() {
  console.log('🌐 Starting IndexNow Submission for vedang-website...\n');

  // 1. Gather all URLs from essays and static pages
  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  const essayFiles = fs.existsSync(essaysDir)
    ? fs.readdirSync(essaysDir).filter((f) => f.endsWith('.mdx'))
    : [];

  const essayUrls = essayFiles.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    return `https://${HOST}/${slug}`;
  });

  const staticUrls = [
    `https://${HOST}/`,
    `https://${HOST}/essays`,
    `https://${HOST}/profile`,
    `https://${HOST}/glossary`,
    `https://${HOST}/consulting`
  ];

  const allUrls = Array.from(new Set([...staticUrls, ...essayUrls]));

  console.log(`📋 Total URLs collected: ${allUrls.length} (${essayUrls.length} essays + ${staticUrls.length} main pages)`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: allUrls
  };

  // 2. Submit payload to IndexNow endpoints
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      console.log(`\n📡 Submitting to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok || response.status === 202) {
        console.log(`  ✅ Successfully submitted ${allUrls.length} URLs (HTTP ${response.status})`);
      } else {
        const text = await response.text();
        console.log(`  ⚠️ Failed (HTTP ${response.status}): ${text || response.statusText}`);
      }
    } catch (err: any) {
      console.error(`  ❌ Network error submitting to ${endpoint}:`, err.message || err);
    }
  }

  console.log('\n✨ IndexNow submission finished!');
}

main().catch((err) => {
  console.error('Fatal error in IndexNow script:', err);
  process.exit(1);
});
