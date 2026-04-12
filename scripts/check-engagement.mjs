#!/usr/bin/env node
/**
 * Fetches engagement metrics for posted social media content.
 * Queries LinkedIn API for share stats and X API for tweet metrics.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env.local') });

const SCRIPTS_DIR = join(process.cwd(), 'scripts');

// ─── LinkedIn ───
async function getLinkedInMetrics() {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;
  
  if (!token) {
    console.log('❌ No LINKEDIN_ACCESS_TOKEN found');
    return;
  }

  const posts = JSON.parse(readFileSync(join(SCRIPTS_DIR, 'linkedin-posts.json'), 'utf-8'));
  const posted = posts.filter(p => p.posted && p.postId);
  
  console.log(`\n📊 LinkedIn — ${posted.length} posted posts\n`);
  
  const results = [];
  
  for (const post of posted) {
    const shareUrn = post.postId;
    const encodedUrn = encodeURIComponent(shareUrn);
    
    try {
      // Get social metadata (likes, comments, shares)
      const url = `https://api.linkedin.com/v2/socialMetadata/${encodedUrn}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        results.push({
          id: post.id,
          date: post.scheduleDate,
          likes: data.totalShareStatistics?.likeCount || data.likeCount || 0,
          comments: data.totalShareStatistics?.commentCount || data.commentCount || 0,
          shares: data.totalShareStatistics?.shareCount || data.shareCount || 0,
          total: (data.totalShareStatistics?.likeCount || data.likeCount || 0) +
                 (data.totalShareStatistics?.commentCount || data.commentCount || 0) +
                 (data.totalShareStatistics?.shareCount || data.shareCount || 0),
        });
      } else if (res.status === 403 || res.status === 401) {
        // Try organizationalEntityShareStatistics instead
        const statsUrl = `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodedUrn}`;
        // Fall back to just recording the post without metrics
        results.push({
          id: post.id,
          date: post.scheduleDate,
          likes: '?',
          comments: '?',
          shares: '?',
          total: '?',
          error: `HTTP ${res.status}`
        });
      } else {
        results.push({
          id: post.id,
          date: post.scheduleDate,
          error: `HTTP ${res.status}`
        });
      }
    } catch (err) {
      results.push({ id: post.id, error: err.message });
    }
    
    // Rate limit: small delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Try alternative: get all posts via ugcPosts
  console.log('Trying ugcPosts endpoint...');
  try {
    const ugcUrl = `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${encodeURIComponent(personUrn)})&count=50&sortBy=LAST_MODIFIED`;
    const ugcRes = await fetch(ugcUrl, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (ugcRes.ok) {
      const ugcData = await ugcRes.json();
      const elements = ugcData.elements || [];
      console.log(`Found ${elements.length} posts via ugcPosts\n`);
      
      // Get share statistics for each
      for (const el of elements.slice(0, 20)) {
        const urn = el.id || el['ugcPost'] || el['activity'];
        const shareUrn = typeof urn === 'string' ? urn : '';
        
        const text = el.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '';
        const firstLine = text.split('\n')[0].substring(0, 60);
        
        try {
          const statsUrl = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(shareUrn)}`;
          const statsRes = await fetch(statsUrl, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'X-Restli-Protocol-Version': '2.0.0'
            }
          });
          
          if (statsRes.ok) {
            const stats = await statsRes.json();
            console.log(`  ${firstLine}...`);
            console.log(`    Likes: ${stats.likesSummary?.totalLikes || 0} | Comments: ${stats.commentsSummary?.totalFirstLevelComments || 0}`);
          }
        } catch (e) {
          // skip
        }
        
        await new Promise(r => setTimeout(r, 200));
      }
    } else {
      console.log(`ugcPosts: HTTP ${ugcRes.status}`);
      const errText = await ugcRes.text();
      console.log(errText.substring(0, 200));
    }
  } catch (e) {
    console.log(`ugcPosts error: ${e.message}`);
  }
  
  // Also try shares endpoint
  console.log('\nTrying shares endpoint...');
  try {
    const sharesUrl = `https://api.linkedin.com/v2/shares?q=owners&owners=${encodeURIComponent(personUrn)}&count=50&sortBy=LAST_MODIFIED`;
    const sharesRes = await fetch(sharesUrl, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (sharesRes.ok) {
      const sharesData = await sharesRes.json();
      const elements = sharesData.elements || [];
      console.log(`Found ${elements.length} posts via shares endpoint\n`);
      
      for (const el of elements.slice(0, 30)) {
        const shareId = el.id;
        const text = el.text?.text || el.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '';
        const firstLine = text.split('\n')[0].substring(0, 60);
        
        try {
          const actionsUrl = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(`urn:li:share:${shareId}`)}`;
          const actionsRes = await fetch(actionsUrl, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'X-Restli-Protocol-Version': '2.0.0'
            }
          });
          
          if (actionsRes.ok) {
            const actions = await actionsRes.json();
            const likes = actions.likesSummary?.totalLikes || 0;
            const comments = actions.commentsSummary?.totalFirstLevelComments || 0;
            const engagement = likes + comments;
            console.log(`  [${engagement} eng] ${firstLine}...`);
            console.log(`    👍 ${likes} likes | 💬 ${comments} comments`);
          }
        } catch (e) {
          console.log(`  ${firstLine}... (error: ${e.message})`);
        }
        
        await new Promise(r => setTimeout(r, 250));
      }
    } else {
      console.log(`shares: HTTP ${sharesRes.status}`);
    }
  } catch (e) {
    console.log(`shares error: ${e.message}`);
  }
}

// ─── X / Twitter ───
async function getXMetrics() {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_KEY_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;
  
  if (!accessToken) {
    console.log('\n❌ No X_ACCESS_TOKEN found');
    return;
  }
  
  console.log('\n📊 X / Twitter\n');
  
  // X API v2 uses OAuth 1.0a — need to sign requests
  // Use Bearer token approach instead (app-only auth)
  // First get user ID
  try {
    // Try using OAuth 2.0 Bearer token
    const { createHmac, randomBytes } = await import('crypto');
    
    function generateOAuthSignature(method, url, params) {
      const sortedParams = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
      const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
      const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
      return createHmac('sha1', signingKey).update(baseString).digest('base64');
    }
    
    function getOAuthHeader(method, url, extraParams = {}) {
      const oauthParams = {
        oauth_consumer_key: apiKey,
        oauth_nonce: randomBytes(16).toString('hex'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_token: accessToken,
        oauth_version: '1.0',
        ...extraParams
      };
      
      const signature = generateOAuthSignature(method, url, oauthParams);
      oauthParams.oauth_signature = signature;
      
      const headerString = Object.keys(oauthParams)
        .filter(k => k.startsWith('oauth_'))
        .sort()
        .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
        .join(', ');
      
      return `OAuth ${headerString}`;
    }
    
    // Get user info
    const meUrl = 'https://api.twitter.com/2/users/me';
    const meRes = await fetch(meUrl, {
      headers: { 'Authorization': getOAuthHeader('GET', meUrl) }
    });
    
    if (!meRes.ok) {
      console.log(`X /users/me: HTTP ${meRes.status}`);
      const errText = await meRes.text();
      console.log(errText.substring(0, 300));
      return;
    }
    
    const meData = await meRes.json();
    const userId = meData.data.id;
    console.log(`User: @${meData.data.username} (${userId})\n`);
    
    // Get recent tweets with metrics
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets`;
    const params = {
      max_results: '30',
      'tweet.fields': 'public_metrics,created_at',
      exclude: 'retweets,replies'
    };
    const queryString = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    const fullUrl = `${tweetsUrl}?${queryString}`;
    
    const tweetsRes = await fetch(fullUrl, {
      headers: { 'Authorization': getOAuthHeader('GET', tweetsUrl, params) }
    });
    
    if (tweetsRes.ok) {
      const tweetsData = await tweetsRes.json();
      const tweets = tweetsData.data || [];
      
      // Sort by engagement (likes + retweets + replies)
      const ranked = tweets.map(t => ({
        text: t.text.split('\n')[0].substring(0, 60),
        likes: t.public_metrics.like_count,
        retweets: t.public_metrics.retweet_count,
        replies: t.public_metrics.reply_count,
        impressions: t.public_metrics.impression_count,
        engagement: t.public_metrics.like_count + t.public_metrics.retweet_count + t.public_metrics.reply_count,
        date: t.created_at?.substring(0, 10),
      })).sort((a, b) => b.engagement - a.engagement);
      
      for (const t of ranked) {
        console.log(`  [${t.engagement} eng | ${t.impressions} imp] ${t.text}...`);
        console.log(`    👍 ${t.likes} | 🔄 ${t.retweets} | 💬 ${t.replies} | 📅 ${t.date}`);
      }
    } else {
      console.log(`X tweets: HTTP ${tweetsRes.status}`);
      const errText = await tweetsRes.text();
      console.log(errText.substring(0, 300));
    }
  } catch (e) {
    console.log(`X error: ${e.message}`);
  }
}

await getLinkedInMetrics();
await getXMetrics();
