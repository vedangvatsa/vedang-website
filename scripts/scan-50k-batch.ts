import fs from 'fs';
import path from 'path';
import { scanDomain } from '../src/lib/scanner/engine';

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', '50k-scan-results.json');
const PROGRESS_PATH = path.join(process.cwd(), 'src', 'data', '50k-scan-progress.json');

// Real empirical domain targets across 6 sectors
const REAL_DOMAINS = [
  // AI Platforms & Research (Sector 1)
  'openai.com', 'anthropic.com', 'huggingface.co', 'replicate.com', 'mistral.ai',
  'cohere.com', 'deepseek.com', 'midjourney.com', 'stability.ai', 'langchain.com',
  'llamaindex.ai', 'crewai.com', 'modal.com', 'groq.com', 'together.ai',
  'fireworks.ai', 'baseten.co', 'pinecone.io', 'weaviate.io', 'qdrant.tech',
  
  // Developer Tools & Infrastructure (Sector 2)
  'stripe.com', 'github.com', 'cloudflare.com', 'vercel.com', 'nextjs.org',
  'tailwindcss.com', 'react.dev', 'python.org', 'npmjs.com', 'pypi.org',
  'supabase.com', 'resend.com', 'posthog.com', 'linear.app', 'notion.so',
  'figma.com', 'slack.com', 'datadoghq.com', 'sentry.io', 'grafana.com',
  'elastic.co', 'mongodb.com', 'redis.io', 'postgresql.org', 'neon.tech',
  
  // Web3 & Emerging Protocols (Sector 3)
  'ethereum.org', 'solana.com', 'polygon.technology', 'base.org', 'uniswap.org',
  'aave.com', 'opensea.io', 'alchemy.com', 'infura.io', 'quicknode.com',
  'moralis.io', 'dune.com', 'defillama.com', 'coinbase.com', 'binance.com',
  
  // Enterprise SaaS & Cloud (Sector 4)
  'salesforce.com', 'atlassian.com', 'workos.com', 'clerk.com', 'okta.com',
  'auth0.com', 'segment.com', 'mixpanel.com', 'amplitude.com', 'launchdarkly.com',
  'digitalocean.com', 'fly.io', 'railway.app', 'render.com', 'fastly.com',
  
  // E-Commerce & Retail (Sector 5)
  'shopify.com', 'wordpress.org', 'amazon.com', 'ebay.com', 'etsy.com',
  'target.com', 'walmart.com', 'bestbuy.com', 'nike.com', 'adidas.com',
  
  // Digital News & Publishers (Sector 6)
  'arxiv.org', 'wikipedia.org', 'techcrunch.com', 'theverge.com', 'wired.com',
  'arstechnica.com', 'bloomberg.com', 'nytimes.com', 'wsj.com', 'bbc.com',
  'reuters.com', 'cnbc.com', 'forbes.com', 'medium.com', 'substack.com',
];

async function runEmpiricalAudit() {
  console.log(`🚀 Starting real empirical domain scan audit across ${REAL_DOMAINS.length} target domains...`);
  
  const results: Record<string, {
    score: number;
    grade: string;
    passedCount: number;
    durationMs: number;
    hasRobotsTxt: boolean;
    hasLlmsTxt: boolean;
    hasMcpServer: boolean;
    hasOpenApi: boolean;
    hasMarkdown: boolean;
    blockedByWaf: boolean;
  }> = {};

  let totalScanned = 0;
  let successCount = 0;
  let failCount = 0;

  const startTime = Date.now();
  const batchSize = 10;

  for (let i = 0; i < REAL_DOMAINS.length; i += batchSize) {
    const chunk = REAL_DOMAINS.slice(i, i + batchSize);
    const promises = chunk.map(async (domain) => {
      try {
        const res = await scanDomain(domain);
        const allChecks = res.layers.flatMap(l => l.checks);
        const passedCount = allChecks.filter(c => c.status === 'pass').length;
        
        const hasRobotsTxt = allChecks.some(c => c.id === 'robots-txt' && c.status === 'pass');
        const hasLlmsTxt = allChecks.some(c => c.id === 'llms-txt' && c.status === 'pass');
        const hasMcpServer = allChecks.some(c => c.id === 'mcp-server' && c.status === 'pass');
        const hasOpenApi = allChecks.some(c => c.id === 'openapi-spec' && c.status === 'pass');
        const hasMarkdown = allChecks.some(c => c.id === 'markdown-negotiation' && c.status === 'pass');
        const blockedByWaf = allChecks.some(c => c.id === 'bot-ua-access' && c.status === 'fail');

        return {
          domain,
          score: res.score,
          grade: res.grade,
          passedCount,
          durationMs: res.durationMs,
          hasRobotsTxt,
          hasLlmsTxt,
          hasMcpServer,
          hasOpenApi,
          hasMarkdown,
          blockedByWaf,
          ok: true,
        };
      } catch (e) {
        return {
          domain,
          score: 0,
          grade: 'F',
          passedCount: 0,
          durationMs: 0,
          hasRobotsTxt: false,
          hasLlmsTxt: false,
          hasMcpServer: false,
          hasOpenApi: false,
          hasMarkdown: false,
          blockedByWaf: true,
          ok: false,
        };
      }
    });

    const chunkResults = await Promise.all(promises);
    for (const r of chunkResults) {
      totalScanned++;
      if (r.ok) {
        successCount++;
        results[r.domain] = r;
      } else {
        failCount++;
      }
    }

    console.log(`Progress: ${totalScanned}/${REAL_DOMAINS.length} scanned (${successCount} succeeded, ${failCount} failed)...`);
  }

  const durationTotalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  const successResults = Object.values(results);
  const totalValid = successResults.length || 1;

  const summaryStats = {
    totalScanned,
    successCount,
    failCount,
    durationTotalSec,
    meanAXScore: (successResults.reduce((a, b) => a + b.score, 0) / totalValid).toFixed(1),
    robotsTxtRate: ((successResults.filter(r => r.hasRobotsTxt).length / totalValid) * 100).toFixed(2),
    llmsTxtRate: ((successResults.filter(r => r.hasLlmsTxt).length / totalValid) * 100).toFixed(2),
    mcpServerRate: ((successResults.filter(r => r.hasMcpServer).length / totalValid) * 100).toFixed(2),
    openApiRate: ((successResults.filter(r => r.hasOpenApi).length / totalValid) * 100).toFixed(2),
    markdownRate: ((successResults.filter(r => r.hasMarkdown).length / totalValid) * 100).toFixed(2),
    wafBlockRate: ((successResults.filter(r => r.blockedByWaf).length / totalValid) * 100).toFixed(2),
  };

  const finalOutput = {
    scannedAt: new Date().toISOString(),
    summary: summaryStats,
    domainResults: results,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalOutput, null, 2));
  console.log('✅ Real empirical audit complete! Summary:', summaryStats);
}

runEmpiricalAudit().catch(err => {
  console.error('Audit error:', err);
  process.exit(1);
});
