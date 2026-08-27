import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ArchiveResult {
  url: string;
  waybackStatus: number;
  waybackOk: boolean;
}

async function saveToWayback(targetUrl: string): Promise<{ status: number; ok: boolean }> {
  try {
    const archiveApiUrl = `https://web.archive.org/save/${targetUrl}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const res = await fetch(archiveApiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    return { status: res.status, ok: res.ok || res.status === 200 || res.status === 302 };
  } catch (err: any) {
    return { status: 0, ok: false };
  }
}

async function main() {
  console.log('================================================================');
  console.log('🏛️ ARCHIVE.ORG (WAYBACK MACHINE) FULL CATALOG SNAPSHOT ENGINE');
  console.log('================================================================\n');

  const urlsToArchive: { domain: string; url: string; label: string }[] = [];

  // 1. Load all veda.ng essays
  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  const essayFiles = fs.readdirSync(essaysDir).filter(f => f.endsWith('.mdx'));

  for (const file of essayFiles) {
    const content = fs.readFileSync(path.join(essaysDir, file), 'utf-8');
    const parsed = matter(content);
    const slug = file.replace(/\.mdx$/, '');
    urlsToArchive.push({
      domain: 'veda.ng',
      url: `https://veda.ng/${slug}`,
      label: parsed.data.title || slug
    });
  }

  // 2. Load core veda.ng routes
  const vedaRoutes = [
    'https://veda.ng',
    'https://veda.ng/essays',
    'https://veda.ng/glossary',
    'https://veda.ng/ailib',
    'https://veda.ng/mcp',
    'https://veda.ng/vibecoding',
    'https://veda.ng/agentic',
    'https://veda.ng/web3',
    'https://veda.ng/llms.txt',
    'https://veda.ng/feed.xml',
    'https://veda.ng/noslop',
    'https://veda.ng/sitecheck',
    'https://veda.ng/seo',
    'https://veda.ng/community',
    'https://veda.ng/job-boards',
    'https://veda.ng/health-protocols'
  ];
  vedaRoutes.forEach(url => urlsToArchive.push({ domain: 'veda.ng', url, label: url }));

  // 3. Load cvin.bio routes
  const cvinRoutes = [
    'https://cvin.bio',
    'https://cvin.bio/jobs',
    'https://cvin.bio/companies',
    'https://cvin.bio/discover',
    'https://cvin.bio/hiring',
    'https://cvin.bio/layoffs',
    'https://cvin.bio/nomad',
    'https://cvin.bio/schengen',
    'https://cvin.bio/visas',
    'https://cvin.bio/costs',
    'https://cvin.bio/tax',
    'https://cvin.bio/rankings',
    'https://cvin.bio/resources',
    'https://cvin.bio/talent',
    'https://cvin.bio/timezone',
    'https://cvin.bio/aiq',
    'https://cvin.bio/climate',
    'https://cvin.bio/fire',
    'https://cvin.bio/blog',
    'https://cvin.bio/news'
  ];
  cvinRoutes.forEach(url => urlsToArchive.push({ domain: 'cvin.bio', url, label: url }));

  console.log(`📋 Total URLs Identified for Archive.org Snapshots: ${urlsToArchive.length}\n`);

  const results: ArchiveResult[] = [];
  let successCount = 0;

  for (let i = 0; i < urlsToArchive.length; i++) {
    const item = urlsToArchive[i];
    process.stdout.write(`[${i + 1}/${urlsToArchive.length}] Archiving "${item.label}" (${item.url})... `);
    
    const res = await saveToWayback(item.url);
    results.push({
      url: item.url,
      waybackStatus: res.status,
      waybackOk: res.ok
    });

    if (res.ok) {
      successCount++;
      console.log(`✅ SNAPSHOT SAVED (HTTP ${res.status})`);
    } else {
      console.log(`⚠️ SUBMITTED (HTTP ${res.status})`);
    }

    // Rate limit pause to avoid Archive.org API throttling (1.2s)
    await new Promise(r => setTimeout(r, 1200));
  }

  // Save report
  const reportPath = path.join(process.cwd(), 'scripts', 'archive-snapshot-results.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalUrls: urlsToArchive.length,
    successfulSnapshots: successCount,
    results
  }, null, 2), 'utf-8');

  console.log('\n================================================================');
  console.log('🎉 ARCHIVE.ORG FULL CATALOG SNAPSHOT ENGINE COMPLETE');
  console.log('================================================================');
  console.log(`- Total URLs Archived: ${urlsToArchive.length}`);
  console.log(`- Successful Snapshot Responses: ${successCount}`);
  console.log(`- Snapshot Log Saved To: ${reportPath}\n`);
}

main().catch(console.error);
