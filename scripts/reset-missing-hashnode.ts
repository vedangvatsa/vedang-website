import fs from 'fs';
import path from 'path';

const REPO_ROOT = '/Users/vedang/vedang-website';
const POSTS_FILE = path.resolve(REPO_ROOT, 'scripts/hashnode-posts.json');

const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
const activeSlugs = new Set(['universal-text-ui', 'stepwise-ai', 'ambient-intelligence']);

let resetCount = 0;
for (const post of posts) {
  if (!activeSlugs.has(post.slug)) {
    if (post.posted) {
      post.posted = false;
      delete post.postedAt;
      delete post.hashnodeUrl;
      resetCount++;
    }
  }
}

fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
console.log(`Reset ${resetCount} posts to unposted state.`);
