#!/usr/bin/env node
/**
 * Adds cross-links to new essays in existing scheduled (unposted) posts
 * where they naturally fit. Only modifies X and LinkedIn posts.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCRIPTS_DIR = join(process.cwd(), 'scripts');

function loadPosts(file) {
  return JSON.parse(readFileSync(join(SCRIPTS_DIR, file), 'utf-8'));
}

function savePosts(file, data) {
  writeFileSync(join(SCRIPTS_DIR, file), JSON.stringify(data, null, 2) + '\n');
  console.log(`✅ Updated ${file}`);
}

// Cross-link additions: { postId → { append text } }
const crossLinks = {
  'agentic-commerce': {
    // "Your next customer is an algorithm" → text UI essay is the interface layer
    append: '\n\nThe interface layer is changing too — dashboards are giving way to text fields that call APIs directly: veda.ng/universal-text-ui'
  },
  'ai-agent-economy': {
    // "The corporation is dissolving" → stepwise is how you actually get there
    append: '\n\nThe hard part: getting there without blowing up. 70% of big-bang AI deployments fail. The sequencing matters: veda.ng/stepwise-ai'
  },
  'agi-governance': {
    // "How do you govern something smarter than you?" → agentic state is governments already using AI
    append: '\n\nSome governments aren\'t waiting. Estonia, Singapore, and the UAE already run AI at production scale across public services: veda.ng/agentic-state'
  },
  'ai-economy': {
    // "The entry ramp is narrowing" → stepwise approach matters for deployment
    append: '\n\nThe companies that get AI deployment right start small. One boring task. Three-month payback. Then scale: veda.ng/stepwise-ai'
  },
  'ambient-intelligence': {
    // "The best interface is no interface" → text UI is the intermediate step
    append: '\n\nBefore no interface, there\'s a simpler one. The text field is replacing the dashboard: veda.ng/universal-text-ui'
  },
  'api-states': {
    // "The nation-state as a platform" → agentic state shows who already built it
    append: '\n\nEstonia already built this. 99% of services digital. Babies born get benefits automatically. No forms: veda.ng/agentic-state'
  },
};

// Process each platform
for (const platform of ['x', 'linkedin', 'bluesky', 'facebook', 'tumblr']) {
  const file = `${platform}-posts.json`;
  const posts = loadPosts(file);
  let modified = 0;

  for (const post of posts) {
    const link = crossLinks[post.id];
    if (link && post.posted === false && post.text) {
      // Check if link already added
      const linkUrl = link.append.match(/veda\.ng\/\S+/)?.[0];
      if (linkUrl && !post.text.includes(linkUrl)) {
        post.text += link.append;
        modified++;
      }
    }
  }

  if (modified > 0) {
    savePosts(file, posts);
    console.log(`   → ${modified} posts got cross-links`);
  }
}

console.log('\n✅ Cross-links added to existing scheduled posts');
