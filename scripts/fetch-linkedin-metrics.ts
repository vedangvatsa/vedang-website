import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN!;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN!;

const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'linkedin-posts.json'), 'utf-8'));
const postedPosts = posts.filter((p: any) => p.posted && p.postId);

async function getShareStats(shareUrn: string) {
  // LinkedIn socialActions endpoint for likes/comments
  const encodedUrn = encodeURIComponent(shareUrn);
  
  try {
    // Get social metadata (likes, comments)
    const res = await fetch(
      `https://api.linkedin.com/v2/socialMetadata/${encodedUrn}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    
    if (res.ok) {
      return await res.json();
    }
    
    // Try socialActions instead
    const res2 = await fetch(
      `https://api.linkedin.com/v2/socialActions/${encodedUrn}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    
    if (res2.ok) {
      return await res2.json();
    }
    
    return { error: `${res.status} / ${res2.status}` };
  } catch (err) {
    return { error: String(err) };
  }
}

async function main() {
  console.log(`Fetching LinkedIn metrics for ${postedPosts.length} posts...\n`);
  console.log(`Person URN: ${PERSON_URN}`);
  console.log(`Token: ${ACCESS_TOKEN?.substring(0, 10)}...\n`);
  
  // First try: get all shares via the shares endpoint
  try {
    const sharesRes = await fetch(
      `https://api.linkedin.com/v2/shares?q=owners&owners=${encodeURIComponent(PERSON_URN)}&count=20`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    
    if (sharesRes.ok) {
      const data = await sharesRes.json() as any;
      console.log(`Found ${data.elements?.length || 0} shares via shares endpoint\n`);
    } else {
      console.log(`Shares endpoint: ${sharesRes.status} ${await sharesRes.text()}\n`);
    }
  } catch (err) {
    console.log(`Shares endpoint error: ${err}\n`);
  }
  
  // Try getting stats for each posted post
  for (const post of postedPosts) {
    const shareUrn = post.postId;
    console.log(`📊 ${post.id} (${shareUrn})`);
    
    try {
      // Try organizationalEntityShareStatistics
      const statsRes = await fetch(
        `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodeURIComponent(PERSON_URN)}&shares[0]=${encodeURIComponent(shareUrn)}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );
      
      if (statsRes.ok) {
        const data = await statsRes.json() as any;
        console.log(`   Stats: ${JSON.stringify(data).substring(0, 200)}`);
      } else {
        // Fallback: try socialActions
        const actionsRes = await fetch(
          `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(shareUrn)}`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              'X-Restli-Protocol-Version': '2.0.0',
            },
          }
        );
        
        if (actionsRes.ok) {
          const actions = await actionsRes.json() as any;
          const likes = actions.likesSummary?.totalLikes || 0;
          const comments = actions.commentsSummary?.totalFirstLevelComments || 0;
          console.log(`   Likes: ${likes} | Comments: ${comments}`);
        } else {
          console.log(`   socialActions: ${actionsRes.status}`);
          
          // Last fallback: try ugcPosts
          const ugcRes = await fetch(
            `https://api.linkedin.com/v2/ugcPosts/${encodeURIComponent(shareUrn)}`,
            {
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'X-Restli-Protocol-Version': '2.0.0',
              },
            }
          );
          console.log(`   ugcPosts: ${ugcRes.status}`);
        }
      }
    } catch (err) {
      console.log(`   Error: ${err}`);
    }
    
    console.log('');
  }
}

main().catch(console.error);
