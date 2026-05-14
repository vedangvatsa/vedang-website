#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

const BRAIN = '/Users/vedang/.gemini/antigravity/brain/9e801190-e577-499f-9dba-6525f80853b3';

const thread = [
  {
    text: `10 things that changed in AI in 2026`,
    image: `${BRAIN}/ai_thread_hook_v2_1778421990525.png`,
  },
  {
    text: `1/ Every top model scores 90%+ on MMLU now

Literally cant tell them apart

New test called Humanity's Last Exam and the best AI only gets 47% on it`,
    image: `${BRAIN}/ai_thread_benchmarks_v3_1778423561766.png`,
  },
  {
    text: `2/ Falcon-H1R has 7 billion parameters and matches models 2 to 7 times its size

Transformer-Mamba hybrid from TII

The "bigger is better" era is winding down`,
    image: `${BRAIN}/ai_thread_falcon_v2_1778422018817.png`,
  },
  {
    text: `3/ Sakana AI published "The AI Scientist" in Nature, March 2026

It writes hypotheses, runs experiments, analyzes data, and writes papers

All on its own`,
    image: `${BRAIN}/ai_thread_scientist_1778422056215.png`,
  },
  {
    text: `4/ SWE-bench tests real GitHub bugs across multiple files

2024 best was 20%
2025 hit 40%
2026 Claude Opus 4.7 is at 82%

Actual production bugs not toy code`,
    image: `${BRAIN}/ai_thread_swebench_1778422068762.png`,
  },
  {
    text: `5/ A DeepMind scientist published "The Abstraction Fallacy" in March

His conclusion is that their own AI simulates reasoning but does not understand anything`,
    image: `${BRAIN}/ai_thread_consciousness_1778422081384.png`,
  },
  {
    text: `6/ GPT-5.5 scored 82.7% on Terminal-Bench 2.0

89 real sysadmin tasks done in a sandboxed Linux terminal

No human input. No hand holding. Just the model.`,
    image: `${BRAIN}/ai_thread_terminal_1778422132152.png`,
  },
  {
    text: `7/ DeepMind dropped ProEval in April 2026

It finds where a model will fail before you ship it

Testing infrastructure, not a new model`,
    image: `${BRAIN}/ai_thread_proeval_1778422149347.png`,
  },
  {
    text: `8/ GPQA Diamond has graduate level science questions

PhD experts with internet access score about 65%
Top AI models now score 94%

Its pattern matching not thinking`,
    image: `${BRAIN}/ai_thread_gpqa_1778422162429.png`,
  },
  {
    text: `9/ There were hundreds of model releases in Q1 2026

A new model stays relevant for about 8 to 12 weeks now

Hard to build a company around that`,
    image: `${BRAIN}/ai_thread_releases_1778422177256.png`,
  },
  {
    text: `10/ Labs run whatever benchmark makes their model look good and ignore the ones that dont

Independent tests keep finding hallucination rates that never make it to the blog post`,
    image: `${BRAIN}/ai_thread_gaming_1778422218338.png`,
  },
  {
    text: `More AI updates and news here

https://t.me/hashtag_ai`,
    image: null,
  },
];

async function main() {
  console.log('Posting AI thread (12 tweets with images)...\n');

  let lastTweetId: string | undefined;

  for (let i = 0; i < thread.length; i++) {
    const t = thread[i];
    try {
      let mediaId: string | undefined;

      if (t.image) {
        console.log(`  Uploading image ${i + 1}...`);
        mediaId = await client.v1.uploadMedia(t.image);
      }

      const params: any = { text: t.text };
      if (lastTweetId) {
        params.reply = { in_reply_to_tweet_id: lastTweetId };
      }
      if (mediaId) {
        params.media = { media_ids: [mediaId] };
      }

      const { data } = await client.v2.tweet(params);
      lastTweetId = data.id;
      console.log(`[${i + 1}/12] Posted (${data.id})`);
      console.log(`   "${t.text.substring(0, 50)}..."\n`);

      await new Promise(r => setTimeout(r, 3000));
    } catch (err: any) {
      console.log(`[${i + 1}] FAILED: ${err.message}`);
      if (err.data) console.log(`   ${JSON.stringify(err.data)}`);
      break;
    }
  }

  console.log('Done!');
}

main().catch(console.error);
