#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

if (!BEARER_TOKEN) {
  console.error('❌ Error: X_BEARER_TOKEN not found in .env.local');
  console.error('Add your Bearer Token from developer.twitter.com');
  process.exit(1);
}

// Sample essays data
const essays = [
  {
    slug: 'ai-superintelligence-timeline',
    title: 'AI Superintelligence Timeline',
    description: 'Exploring when artificial superintelligence might emerge and what it means for humanity.',
  },
  {
    slug: 'intuition',
    title: 'Artificial Intuition',
    description: 'Can machines develop intuition like humans? A deep dive into the nature of intuitive reasoning.',
  },
  {
    slug: 'apis',
    title: 'API States and Governance',
    description: 'How API architectures reflect and shape power structures in AI systems.',
  },
  {
    slug: 'attention',
    title: 'The Attention Refinery',
    description: 'Understanding how attention mechanisms work and why they matter for AI.',
  },
  {
    slug: 'rationality',
    title: 'Rationality in AI',
    description: 'Examining rational decision-making in artificial systems.',
  },
];

async function postToX(text: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: JSON.stringify(error),
      };
    }

    const data = await response.json();
    return {
      success: true,
      id: data.data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log('🚀 Posting essays to X\n');

  const essayCount = essays.length;
  const toPost = essays.slice(0, 5);

  for (const essay of toPost) {
    const postText = `✨ New essay: "${essay.title}"

${essay.description.substring(0, 150)}${essay.description.length > 150 ? '...' : ''}

Read full essay: veda.ng/${essay.slug}

#AI #Writing`;

    if (postText.length > 280) {
      console.log(`⚠️  Skipped - Post too long (${postText.length} chars): "${essay.title}"`);
      continue;
    }

    const result = await postToX(postText);

    if (result.success) {
      console.log(`✅ Posted - ${essay.title}`);
      console.log(`   Tweet ID: ${result.id}\n`);
    } else {
      console.log(`❌ Failed - ${essay.title}`);
      console.log(`   Error: ${result.error}\n`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n📊 Summary: Posted ${toPost.length} of ${essayCount} essays`);
}

main().catch(console.error);
