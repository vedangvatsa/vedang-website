import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
dotenv.config({ path: '.env.local' });

async function check() {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_KEY_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });

  try {
    const me = await client.v2.me();
    console.log('✅ Auth working! User:', me.data.username, '| ID:', me.data.id);
  } catch(err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('❌ Error:', msg);
  }
}

check();
