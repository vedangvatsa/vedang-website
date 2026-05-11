#!/usr/bin/env node
/**
 * LinkedIn Post Discovery
 * Finds viral AI/tech/startup posts via Google and adds them to linkedin-targets.json
 * Only adds new posts not already in the targets or comment log.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const TARGETS_FILE = path.resolve(__dirname, 'linkedin-targets.json');
const LOG_FILE = path.resolve(__dirname, 'linkedin-comment-log.json');

const SEARCH_QUERIES = [
  'site:linkedin.com/posts "AI agents" enterprise',
  'site:linkedin.com/posts "agentic" startup',
  'site:linkedin.com/posts "SaaS" AI automation',
  'site:linkedin.com/posts "enterprise AI" implementation',
  'site:linkedin.com/posts "LLM" production deployment',
  'site:linkedin.com/posts "future of work" AI',
  'site:linkedin.com/posts "AI startup" founder',
  'site:linkedin.com/posts "vibe coding" OR "no code" AI',
  'site:linkedin.com/posts "AI automation" workflow',
  'site:linkedin.com/posts "machine learning" enterprise 2026',
];

interface Target {
  activityId: string;
  author: string;
  topic: string;
  posted?: boolean;
}

interface LogEntry {
  activityId: string;
}

function extractActivityId(url: string): string | null {
  const match = url.match(/activity-(\d+)/);
  return match ? match[1] : null;
}

function extractAuthor(url: string): string {
  const match = url.match(/linkedin\.com\/posts\/([^_]+)/);
  return match ? match[1].replace(/-/g, ' ') : 'Unknown';
}

async function searchGoogle(query: string): Promise<{activityId: string; author: string; topic: string}[]> {
  const results: {activityId: string; author: string; topic: string}[] = [];
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.google.com/search?q=${encodedQuery}&num=10&tbs=qdr:w`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    const html = await res.text();
    
    // Extract LinkedIn post URLs from the HTML
    const urlPattern = /linkedin\.com\/posts\/[^"&\s]+activity-(\d+)[^"&\s]*/g;
    let match;
    
    while ((match = urlPattern.exec(html)) !== null) {
      const fullUrl = match[0];
      const activityId = match[1];
      const author = extractAuthor(fullUrl);
      
      results.push({
        activityId,
        author,
        topic: query.replace('site:linkedin.com/posts ', '').replace(/"/g, ''),
      });
    }
  } catch (err: any) {
    console.log(`   Search failed: ${err.message}`);
  }

  return results;
}

async function main() {
  const existingTargets: Target[] = fs.existsSync(TARGETS_FILE)
    ? JSON.parse(fs.readFileSync(TARGETS_FILE, 'utf-8'))
    : [];
  const log: LogEntry[] = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'))
    : [];
  
  const knownIds = new Set([
    ...existingTargets.map(t => t.activityId),
    ...log.map(l => l.activityId),
  ]);

  console.log(`📋 ${knownIds.size} known posts (${existingTargets.length} targets, ${log.length} in log)`);
  console.log(`🔍 Running ${SEARCH_QUERIES.length} searches...\n`);

  const newTargets: Target[] = [];

  for (const query of SEARCH_QUERIES) {
    console.log(`→ ${query.substring(0, 60)}...`);
    const results = await searchGoogle(query);
    
    for (const r of results) {
      if (!knownIds.has(r.activityId)) {
        newTargets.push(r);
        knownIds.add(r.activityId);
        console.log(`   ✅ New: ${r.author} (${r.activityId})`);
      }
    }

    // Rate limit Google requests
    await new Promise(r => setTimeout(r, 2000));
  }

  if (newTargets.length === 0) {
    console.log('\n⚠️ No new posts found. Try different search queries or wait for fresh content.');
    return;
  }

  // Append to targets file
  const updatedTargets = [...existingTargets, ...newTargets];
  fs.writeFileSync(TARGETS_FILE, JSON.stringify(updatedTargets, null, 2));
  console.log(`\n📊 Found ${newTargets.length} new targets. Total: ${updatedTargets.length}`);
  console.log('Run: npx tsx scripts/linkedin-discover-and-comment.ts to post comments');
}

main();
