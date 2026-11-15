import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const postsFile = path.join(REPO_ROOT, 'scripts', 'x-posts.json');

const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));
const unposted = posts.filter(p => !p.posted && (p.type === 'thread' || (p.tweets && p.tweets.length > 1)));

console.log(`\n🔍 Validating ${unposted.length} unposted threads against strict standards...\n`);

let totalErrors = 0;

for (const thread of unposted) {
  const tid = thread.id;
  const tweets = thread.tweets || [];
  console.log(`Checking thread: ${tid} (${tweets.length} tweets)`);

  // 1. Tweet 1 check: exactly 2 lines
  const t1 = tweets[0]?.text || '';
  const t1Lines = t1.split('\n').filter(l => l.trim().length > 0);
  if (t1Lines.length !== 2) {
    console.error(`  ❌ [${tid} | Tweet 1] MUST have exactly 2 lines (found ${t1Lines.length})`);
    totalErrors++;
  }
  if (!t1.endsWith('🧵👇')) {
    console.error(`  ❌ [${tid} | Tweet 1] MUST end with 🧵👇`);
    totalErrors++;
  }

  // 2. Check each tweet
  for (let i = 0; i < tweets.length; i++) {
    const t = tweets[i];
    const text = t.text || '';
    
    // Character limit check (URLs are 23 chars on X)
    const urls = text.match(/https?:\/\/\S+/g) || [];
    let weightedLen = text.length;
    for (const u of urls) {
      weightedLen = weightedLen - u.length + 23;
    }
    if (weightedLen > 240) {
      console.error(`  ❌ [${tid} | Tweet ${i+1}] Exceeds character limit: ${weightedLen} > 240`);
      totalErrors++;
    }

    // Cross-link tweets (status links) MUST NOT have images
    const hasStatusLink = urls.some(u => u.includes('x.com/') || u.includes('twitter.com/'));
    if (hasStatusLink && t.image) {
      console.error(`  ❌ [${tid} | Tweet ${i+1}] Quote tweet has image attached. Quote tweets must be text-only!`);
      totalErrors++;
    }

    // Image file existence check
    if (t.image && t.image.startsWith('https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/')) {
      const relPath = t.image.replace('https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/', '').split('?')[0];
      const localPath = path.join(REPO_ROOT, relPath);
      if (!fs.existsSync(localPath)) {
        console.error(`  ❌ [${tid} | Tweet ${i+1}] Local image file missing: ${relPath}`);
        totalErrors++;
      }
    }
  }
}

if (totalErrors === 0) {
  console.log(`\n✅ All ${unposted.length} threads passed all strict guidelines perfectly!\n`);
} else {
  console.error(`\n❌ Found ${totalErrors} guideline violations. Fix before queuing.\n`);
  process.exit(1);
}
