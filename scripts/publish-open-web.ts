import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const KEY = 'efeb4c9b344b48a9819cd02571aab0ed';
const HOST = 'veda.ng';

async function submitIndexNow(urls: string[]): Promise<boolean> {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls
  };

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return res.status === 200 || res.status === 202;
  } catch (err: any) {
    console.error(`IndexNow submission error: ${err.message}`);
    return false;
  }
}

async function pingPingomatic(title: string, url: string): Promise<boolean> {
  try {
    const xmlPayload = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</value></param>
    <param><value>${url}</value></param>
  </params>
</methodCall>`;

    const res = await fetch('http://rpc.pingomatic.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xmlPayload
    });
    return res.ok;
  } catch (err: any) {
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Zero-Involvement Open Web Programmatic Publishing & Indexing...\n');

  // Step 1: Read all essays
  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  const files = fs.readdirSync(essaysDir).filter(f => f.endsWith('.mdx'));

  const essayList = files.map(f => {
    const content = fs.readFileSync(path.join(essaysDir, f), 'utf-8');
    const parsed = matter(content);
    const slug = f.replace(/\.mdx$/, '');
    return {
      slug,
      title: parsed.data.title || slug,
      url: `https://${HOST}/${slug}`
    };
  });

  const allUrls = essayList.map(e => e.url);
  console.log(`📋 Loaded ${essayList.length} essays (${allUrls.length} URLs).\n`);

  // Step 2: IndexNow API Submission
  console.log('📡 Submitting all essay URLs to IndexNow API (Bing, Yandex, Seznam, Naver)...');
  const indexNowSuccess = await submitIndexNow(allUrls);
  if (indexNowSuccess) {
    console.log(`✅ IndexNow successfully accepted ${allUrls.length} URLs! (HTTP 200/202)\n`);
  } else {
    console.log(`⚠️ IndexNow submission encountered an issue.\n`);
  }

  // Step 3: Pingomatic Pings for Top Essays
  console.log('🔔 Pinging Pingomatic XML-RPC for major essay publications...');
  let pingSuccessCount = 0;
  for (const essay of essayList.slice(0, 15)) {
    const success = await pingPingomatic(essay.title, essay.url);
    if (success) {
      pingSuccessCount++;
      console.log(`  ✓ Pinged: "${essay.title}" -> ${essay.url}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log(`\n✅ Successfully pinged ${pingSuccessCount} essays to Pingomatic RSS/blog indexers.`);

  console.log(`\n🎉 Programmatic Open Web Publishing & Submission Completed Successfully!`);
}

main().catch(console.error);
