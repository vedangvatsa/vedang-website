import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LINKEDIN_FILE = path.resolve(__dirname, 'linkedin-posts.json');
const BLUESKY_FILE = path.resolve(__dirname, 'bluesky-posts.json');

function main() {
  if (!fs.existsSync(LINKEDIN_FILE)) {
    console.error(`❌ LinkedIn posts file not found: ${LINKEDIN_FILE}`);
    process.exit(1);
  }
  if (!fs.existsSync(BLUESKY_FILE)) {
    console.error(`❌ Bluesky posts file not found: ${BLUESKY_FILE}`);
    process.exit(1);
  }

  const linkedinPosts = JSON.parse(fs.readFileSync(LINKEDIN_FILE, 'utf-8'));
  const blueskyPosts = JSON.parse(fs.readFileSync(BLUESKY_FILE, 'utf-8'));

  const existingBskyIds = new Set(blueskyPosts.map(p => p.id));
  const unpostedLinkedin = linkedinPosts.filter(p => !p.posted);

  console.log(`📋 Total unposted LinkedIn posts: ${unpostedLinkedin.length}`);

  let addedCount = 0;
  for (const post of unpostedLinkedin) {
    if (existingBskyIds.has(post.id)) {
      continue;
    }

    const bskyPost = {
      id: post.id,
      scheduleDate: post.scheduleDate,
      scheduleTime: post.scheduleTime,
      posted: false,
      text: post.text,
      ...(post.image && { image: post.image }),
    };

    blueskyPosts.push(bskyPost);
    existingBskyIds.add(post.id);
    addedCount++;
  }

  if (addedCount > 0) {
    fs.writeFileSync(BLUESKY_FILE, JSON.stringify(blueskyPosts, null, 2) + '\n');
    console.log(`✅ Successfully added ${addedCount} posts to bluesky-posts.json`);
  } else {
    console.log(`ℹ️ No new posts to add. All unposted LinkedIn posts are already in the Bluesky queue.`);
  }
}

main();
