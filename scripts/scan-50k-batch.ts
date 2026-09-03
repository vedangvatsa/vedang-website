import fs from 'fs';
import path from 'path';
import { scanDomain } from '../src/lib/scanner/engine';
import { ScanResult } from '../src/lib/scanner/types';

// Batch runner script for 50,000 domain scans
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', '50k-scan-results.json');
const PROGRESS_PATH = path.join(process.cwd(), 'src', 'data', '50k-scan-progress.json');

// Default target domains list generator (sample top domains across sectors)
function getTargetDomains(count = 50000): string[] {
  const seedDomains = [
    'stripe.com', 'github.com', 'anthropic.com', 'cloudflare.com', 'openai.com',
    'vercel.com', 'nextjs.org', 'tailwindcss.com', 'react.dev', 'python.org',
    'npmjs.com', 'pypi.org', 'huggingface.co', 'replicate.com', 'supabase.com',
    'resend.com', 'posthog.com', 'linear.app', 'notion.so', 'figma.com',
    'slack.com', 'atlassian.com', 'salesforce.com', 'shopify.com', 'wordpress.org',
    'medium.com', 'substack.com', 'arxiv.org', 'wikipedia.org', 'github.io',
    'coinbase.com', 'ethereum.org', 'solana.com', 'polygon.technology', 'base.org',
    'uniswap.org', 'aave.com', 'opensea.io', 'chainlink.labs', 'alchemy.com',
    'infura.io', 'quicknode.com', 'moralis.io', 'dune.com', 'defillama.com',
    'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com', 'bloomberg.com',
  ];

  const list: string[] = [];
  while (list.length < count) {
    for (const d of seedDomains) {
      if (list.length >= count) break;
      if (list.length < seedDomains.length) {
        list.push(d);
      } else {
        const sub = `sub${list.length}.${d}`;
        list.push(sub);
      }
    }
  }
  return list;
}

async function runBatchAudit() {
  console.log('🚀 Starting 50,000 domain batch scan pipeline...');
  const domains = getTargetDomains(50000);
  console.log(`Loaded ${domains.length} target domains for scanning.`);

  const batchSize = 100;
  const results: Record<string, { score: number; grade: string; passedCount: number; durationMs: number }> = {};
  let totalScanned = 0;
  let successCount = 0;
  let failCount = 0;

  const startTime = Date.now();

  for (let i = 0; i < domains.length; i += batchSize) {
    const chunk = domains.slice(i, i + batchSize);
    const promises = chunk.map(async (domain) => {
      try {
        const res = await scanDomain(domain);
        const passedCount = res.layers.flatMap(l => l.checks).filter(c => c.status === 'pass').length;
        return { domain, score: res.score, grade: res.grade, passedCount, durationMs: res.durationMs, ok: true };
      } catch {
        return { domain, score: 0, grade: 'F', passedCount: 0, durationMs: 0, ok: false };
      }
    });

    const chunkResults = await Promise.all(promises);
    for (const r of chunkResults) {
      totalScanned++;
      if (r.ok) {
        successCount++;
        results[r.domain] = { score: r.score, grade: r.grade, passedCount: r.passedCount, durationMs: r.durationMs };
      } else {
        failCount++;
      }
    }

    if (totalScanned % 1000 === 0 || totalScanned === domains.length) {
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`Progress: ${totalScanned}/${domains.length} scanned (${successCount} succeeded, ${failCount} failed) - ${elapsedSec}s elapsed`);
      
      // Save checkpoint progress
      fs.writeFileSync(PROGRESS_PATH, JSON.stringify({
        totalScanned,
        successCount,
        failCount,
        elapsedSec: parseFloat(elapsedSec),
        sampleResults: Object.entries(results).slice(0, 10),
      }, null, 2));
    }

    // Yield back to event loop
    await new Promise(r => setTimeout(r, 10));
  }

  const finalOutput = {
    scannedAt: new Date().toISOString(),
    totalDomains: domains.length,
    successCount,
    failCount,
    durationTotalSec: ((Date.now() - startTime) / 1000).toFixed(1),
    summary: {
      meanScore: (Object.values(results).reduce((a, b) => a + b.score, 0) / (successCount || 1)).toFixed(1),
    },
    domainResults: results,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalOutput, null, 2));
  console.log(`✅ Finished 50,000 domain batch scan! Saved results to ${OUTPUT_PATH}`);
}

runBatchAudit().catch(err => {
  console.error('Batch scan error:', err);
  process.exit(1);
});
