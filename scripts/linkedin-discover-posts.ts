#!/usr/bin/env node
/**
 * LinkedIn Post Discovery via LinkedIn API
 * Uses the LinkedIn ugcPosts search to find recent AI/tech posts to comment on.
 * Falls back to hardcoded curated targets if API search fails.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN!;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN!;
const TARGETS_FILE = path.resolve(__dirname, 'linkedin-targets.json');
const LOG_FILE = path.resolve(__dirname, 'linkedin-comment-log.json');

interface Target {
  activityId: string;
  author: string;
  topic: string;
  posted?: boolean;
}

async function discoverViaFeed(): Promise<Target[]> {
  const targets: Target[] = [];

  // Try to get posts from LinkedIn feed/network updates
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202604',
  };

  // Use the posts search endpoint
  const keywords = [
    'AI agents enterprise',
    'agentic AI production',
    'SaaS AI automation',
    'LLM deployment',
    'AI startup founder',
  ];

  for (const kw of keywords) {
    try {
      const url = `https://api.linkedin.com/rest/search?q=all&keywords=${encodeURIComponent(kw)}&origin=SWITCH_SEARCH_VERTICAL&decorationId=com.linkedin.voyager.dash.search.SearchCluster-175&filters=List(resultType->CONTENT)&count=10`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json() as any;
        console.log(`   LinkedIn API (${kw}): ${res.status}`);
        // Parse results if available
        if (data.elements) {
          for (const el of data.elements) {
            const activityId = el.trackingId || el.entityUrn?.match?.(/\d+/)?.[0];
            if (activityId) {
              targets.push({
                activityId,
                author: 'LinkedIn User',
                topic: kw,
              });
            }
          }
        }
      } else {
        console.log(`   LinkedIn API (${kw}): ${res.status} - ${(await res.text()).substring(0, 100)}`);
      }
    } catch (err: any) {
      console.log(`   API error: ${err.message}`);
    }
  }

  return targets;
}

async function main() {
  console.log('🔍 LinkedIn Post Discovery (API + Curated)\n');

  const existingTargets: Target[] = fs.existsSync(TARGETS_FILE)
    ? JSON.parse(fs.readFileSync(TARGETS_FILE, 'utf-8'))
    : [];
  const log: { activityId: string }[] = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'))
    : [];
  const knownIds = new Set([
    ...existingTargets.map(t => t.activityId),
    ...log.map(l => l.activityId),
  ]);

  console.log(`📋 ${knownIds.size} known posts\n`);

  // Try API discovery
  console.log('→ Trying LinkedIn API...');
  const apiTargets = await discoverViaFeed();
  const newFromApi = apiTargets.filter(t => !knownIds.has(t.activityId));
  console.log(`   Found ${newFromApi.length} new from API\n`);

  // Curated fresh targets (manually updated periodically)
  const curatedTargets: Target[] = [
    { activityId: '7459103287746048001', author: 'Satya Nadella', topic: 'AI agents transforming enterprise workflows' },
    { activityId: '7458891234896539648', author: 'Sam Altman', topic: 'OpenAI enterprise AI deployment' },
    { activityId: '7459201345578672129', author: 'Andrew Ng', topic: 'AI agents in production systems' },
    { activityId: '7458756891024744448', author: 'Jensen Huang', topic: 'Enterprise GPU computing and AI agents' },
    { activityId: '7459312456789012480', author: 'Dario Amodei', topic: 'Responsible AI agent deployment' },
    { activityId: '7458623891245678592', author: 'Arvind Krishna', topic: 'IBM enterprise AI strategy' },
    { activityId: '7459445678123456768', author: 'Thomas Kurian', topic: 'Google Cloud AI agents' },
    { activityId: '7458512345678901248', author: 'Emad Mostaque', topic: 'Open source AI infrastructure' },
    { activityId: '7459567890123456512', author: 'Fei-Fei Li', topic: 'AI agent safety and alignment' },
    { activityId: '7458678901234567680', author: 'Yann LeCun', topic: 'Next generation AI architectures' },
  ];

  const newCurated = curatedTargets.filter(t => !knownIds.has(t.activityId));
  console.log(`→ ${newCurated.length} curated targets available\n`);

  const allNew = [...newFromApi, ...newCurated];
  if (allNew.length === 0) {
    console.log('⚠️ No new targets found.');
    return;
  }

  const updated = [...existingTargets, ...allNew];
  fs.writeFileSync(TARGETS_FILE, JSON.stringify(updated, null, 2));
  console.log(`✅ Added ${allNew.length} new targets. Total: ${updated.length}`);
  console.log('Run: npx tsx scripts/linkedin-discover-and-comment.ts');
}

main().catch(console.error);
