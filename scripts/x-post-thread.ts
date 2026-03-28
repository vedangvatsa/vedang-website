#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
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

const ARTIFACTS = '/Users/vedang/.gemini/antigravity/brain/516b7176-e1e4-4ac5-8db3-f9940e86ed61';

const thread = [
  {
    text: `Remote jobs in 2026 are not hard to find. They're hard to get noticed for.\n\nFive things that actually change that. 🧵`,
    image: `${ARTIFACTS}/thread_1_infographic_1774393551515.png`,
  },
  {
    text: `1/ The wrong job board wastes your time.\n\nGeneral boards pool every industry together. If you're in Web3, you're competing next to people who've never touched a wallet.\n\nFind boards built for your market. hashtagweb3.com is one I've seen people get real traction from.`,
    image: `${ARTIFACTS}/thread_2_job_boards_1774393665345.png`,
  },
  {
    text: `2/ A PDF resume is invisible on the internet.\n\nNobody Googles a file. Your resume needs a URL.\n\ncvin.bio turns your CV into a website. When a recruiter searches your name, you show up instead of a blank page.`,
    image: `${ARTIFACTS}/thread_3_pdf_vs_url_1774393614123.png`,
  },
  {
    text: `3/ Timezone is the first filter.\n\nRemote companies don't care where you are. They care whether your hours overlap with their team.\n\nSay it plainly in your first message. Most applicants don't. It makes you easier to hire immediately.`,
    image: `${ARTIFACTS}/thread_4_timezone_1774393630892.png`,
  },
  {
    text: `4/ The best remote jobs are filled before they're posted.\n\nMessage the hiring manager directly. Short and specific.\n\nNot "I'd love to connect." Just: what you do, what problem you solve, why now.\n\nThat's it.`,
    image: `${ARTIFACTS}/thread_5_apply_early_1774393643635.png`,
  },
];

async function postThread() {
  console.log(`\n🚀 Posting thread with images (${thread.length} tweets)...\n`);

  let previousId: string | undefined;

  for (let i = 0; i < thread.length; i++) {
    const { text, image } = thread[i];

    try {
      // Upload image first
      console.log(`  📤 Uploading image for tweet ${i + 1}...`);
      const mediaId = await client.v1.uploadMedia(image, { mimeType: 'image/png' });
      console.log(`  ✅ Image uploaded (media_id: ${mediaId})`);

      // Build tweet params
      const params: Record<string, unknown> = {
        text,
        media: { media_ids: [mediaId] },
      };
      if (previousId) {
        params.reply = { in_reply_to_tweet_id: previousId };
      }

      const { data } = await client.v2.tweet(params as Parameters<typeof client.v2.tweet>[0]);
      previousId = data.id;
      console.log(`  ✅ Tweet ${i + 1}/${thread.length} posted (ID: ${data.id})\n`);

      if (i < thread.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error(`  ❌ Failed on tweet ${i + 1}: ${msg}`);
      process.exit(1);
    }
  }

  console.log('✨ Thread posted successfully!');
}

postThread();
