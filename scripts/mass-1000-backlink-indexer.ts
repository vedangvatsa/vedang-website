import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const HOST = 'veda.ng';

// 50+ Global Open Web XML-RPC & HTTP Ping Gateways
const PING_GATEWAYS = [
  'http://rpc.pingomatic.com/',
  'http://rpc.weblogs.com/RPC2',
  'http://ping.blogs.yandex.ru/RPC2',
  'http://ping.blo.gs/',
  'http://ping.twingly.com/',
  'http://ping.feedburner.com',
  'http://blogsearch.google.com/ping/RPC2',
  'http://blogsearch.google.co.in/ping/RPC2',
  'http://blogsearch.google.co.uk/ping/RPC2',
  'http://blogsearch.google.de/ping/RPC2',
  'http://blogsearch.google.fr/ping/RPC2',
  'http://blogsearch.google.jp/ping/RPC2',
  'http://blogsearch.google.es/ping/RPC2',
  'http://blogsearch.google.ca/ping/RPC2',
  'http://blogsearch.google.com.au/ping/RPC2',
  'http://blogsearch.google.com.br/ping/RPC2',
  'http://blogsearch.google.it/ping/RPC2',
  'http://blogsearch.google.nl/ping/RPC2',
  'http://blogsearch.google.se/ping/RPC2',
  'http://blogsearch.google.ru/ping/RPC2',
  'http://blogsearch.google.ch/ping/RPC2',
  'http://blogsearch.google.at/ping/RPC2',
  'http://blogsearch.google.be/ping/RPC2',
  'http://blogsearch.google.dk/ping/RPC2',
  'http://blogsearch.google.no/ping/RPC2',
  'http://blogsearch.google.fi/ping/RPC2',
  'http://api.my.yahoo.com/RPC2',
  'http://api.my.yahoo.com/rss/ping',
  'http://rpc.technorati.com/rpc/ping',
  'http://ping.syndic8.com/xmlrpc.php',
  'http://www.blogdigger.com/RPC2',
  'http://ping.bloggers.jp/rpc/',
  'http://ping.fc2.com/',
  'http://ping.myblog.jp/',
  'http://ping.exblog.jp/xmlrpc',
  'http://ping.cocolog-nifty.com/xmlrpc',
  'http://rpc.reader.livedoor.com/ping',
  'http://ping.weblog.to/',
  'http://www.bitacoras.com/agregador/ping',
  'http://ping.wordblog.de/',
  'http://rcs.dataskills.no/rcs/ping',
  'http://www.blogshares.com/rpc.pt',
  'http://www.blogsnow.com/ping',
  'http://www.blogstreet.com/xrbin/xmlrpc.cgi',
  'http://bulkfeeds.net/rpc',
  'http://ping.amagle.com/',
  'http://ping.gogo.moo.jp/',
  'http://rpc.blogrolling.com/pinger/',
  'http://topic-exchange.com/RPC2',
  'http://trackback.bakeira.jp/xmlrpc',
  'http://www.blogoon.net/ping/',
  'http://www.newsisfree.com/xmlrpccs.php',
  'http://ping.sitegoo.com/',
  'http://www.blogoole.com/ping/',
  'http://ping.infrangible.org/'
];

async function sendPing(serviceUrl: string, title: string, url: string): Promise<boolean> {
  const xmlPayload = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</value></param>
    <param><value>${url}</value></param>
  </params>
</methodCall>`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(serviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xmlPayload,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🚀 Launching 1,000+ Backlink & Open Web Ping Submissions (Non-IndexNow)...\n');

  // Load essays
  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  const files = fs.readdirSync(essaysDir).filter(f => f.endsWith('.mdx'));

  const essayList = files.map(f => {
    const content = fs.readFileSync(path.join(essaysDir, f), 'utf-8');
    const parsed = matter(content);
    const slug = f.replace(/\.mdx$/, '');
    return {
      slug,
      title: parsed.data.title || slug,
      url: `https://${HOST}/${slug}`
    };
  });

  console.log(`📋 Total Essays Loaded: ${essayList.length}`);
  console.log(`📡 Ping Gateways Configured: ${PING_GATEWAYS.length}`);
  const targetSubmissions = essayList.length * PING_GATEWAYS.length;
  console.log(`🎯 Total Target Submissions: ${targetSubmissions} (Goal: 1,000+ Submissions)\n`);

  let totalAttempts = 0;
  let totalSuccessful = 0;
  const essayResults: Record<string, { attempted: number; successful: number }> = {};

  for (let i = 0; i < essayList.length; i++) {
    const essay = essayList[i];
    let essaySuccess = 0;
    let essayAttempt = 0;

    for (const gateway of PING_GATEWAYS) {
      totalAttempts++;
      essayAttempt++;
      const ok = await sendPing(gateway, essay.title, essay.url);
      if (ok) {
        essaySuccess++;
        totalSuccessful++;
      }
    }

    essayResults[essay.slug] = { attempted: essayAttempt, successful: essaySuccess };
    console.log(`[${i + 1}/${essayList.length}] "${essay.title}" -> ${essayAttempt} pings sent (${essaySuccess} live responses). Total progress: ${totalAttempts}/${targetSubmissions}`);
    
    // Slight pause every 5 essays
    if (i % 5 === 0) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Save report
  const summaryReport = {
    timestamp: new Date().toISOString(),
    totalEssays: essayList.length,
    pingGatewaysCount: PING_GATEWAYS.length,
    totalAttemptedSubmissions: totalAttempts,
    totalSuccessfulResponses: totalSuccessful,
    liveResponseRate: `${((totalSuccessful / totalAttempts) * 100).toFixed(1)}%`,
    essayResults
  };

  const reportPath = path.join(process.cwd(), 'scripts', 'mass-1000-ping-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(summaryReport, null, 2), 'utf-8');

  console.log('\n=====================================================');
  console.log('🎉 1,000+ MASS BACKLINK & OPEN WEB PING COMPLETED');
  console.log('=====================================================');
  console.log(`- Total Programmatic Submissions Executed: ${totalAttempts}`);
  console.log(`- Total Live Successful Responses: ${totalSuccessful}`);
  console.log(`- Detailed Submission Report Saved To: ${reportPath}\n`);
}

main().catch(console.error);
