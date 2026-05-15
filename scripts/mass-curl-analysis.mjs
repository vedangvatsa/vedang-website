import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/lib/ai-reports-data-generated.json');
const reports = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Randomize to sample across the whole dataset instead of clustering
reports.sort(() => 0.5 - Math.random());

const MAX_CONCURRENCY = 800; // Extreme concurrency
const TIMEOUT_MS = 3000; // 3 second timeout - fail fast

let completed = 0;
let failed = 0;
let wordFreq = {};
let bigramFreq = {};

const stopWords = new Set(['this', 'that', 'with', 'from', 'they', 'have', 'which', 'were', 'their', 'what', 'about', 'some', 'would', 'could', 'should', 'there', 'because', 'other', 'when', 'been', 'more', 'also', 'such', 'than', 'into', 'only', 'most', 'these', 'used', 'using', 'based', 'artificial', 'intelligence', 'learning', 'machine', 'data', 'network', 'networks', 'models', 'model', 'approach', 'performance', 'system', 'proposed', 'results', 'method', 'paper', 'research', 'study', 'analysis', 'time', 'well', 'two', 'can', 'has', 'are', 'for', 'the', 'and', 'with', 'our', 'over', 'under', 'through', 'between', 'during', 'before', 'after']);

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/<[^>]*>?/gm, ' ') // Strip HTML tags
    .replace(/[^\w\s-]/g, ' ') // Strip punctuation except hyphens
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
}

async function runMassivePool() {
  const agentOpts = { keepAlive: true, maxSockets: 1000, timeout: TIMEOUT_MS };
  const httpsAgent = new https.Agent(agentOpts);
  const httpAgent = new http.Agent(agentOpts);

  const fetchUrl = (url) => {
    return new Promise((resolve) => {
      try {
        const isHttp = url.startsWith('http://');
        const req = (isHttp ? http : https).get(url, {
          agent: isHttp ? httpAgent : httpsAgent,
          timeout: TIMEOUT_MS,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
          }
        }, (res) => {
          if (res.statusCode >= 300) {
            res.resume();
            return resolve(null);
          }
          const ctype = res.headers['content-type'] || '';
          if (!ctype.includes('text/')) {
            res.resume();
            return resolve(null);
          }

          let body = '';
          res.on('data', chunk => {
            body += chunk;
            // Truncate at 25KB to parse abstract/intro fast and avoid OOM
            if (body.length > 25000) {
              res.destroy();
            }
          });
          res.on('end', () => resolve(body));
          res.on('error', () => resolve(null));
        });

        req.on('error', () => resolve(null));
        req.on('timeout', () => {
          req.destroy();
          resolve(null);
        });
      } catch (e) {
        resolve(null);
      }
    });
  };

  const pool = new Set();
  let index = 0;
  
  const startTime = Date.now();
  
  // Hard stop at 100 seconds
  while (index < reports.length && Date.now() - startTime < 100000) {
    if (pool.size >= MAX_CONCURRENCY) {
      await Promise.race(pool);
    }
    
    const r = reports[index++];
    if (!r.url || r.url.length < 5 || r.url.endsWith('.pdf')) {
      failed++;
      continue;
    }

    const p = fetchUrl(r.url).then(html => {
      if (html && html.length > 100) {
        const words = tokenize(html);
        words.forEach((w, i) => {
          wordFreq[w] = (wordFreq[w] || 0) + 1;
          if (i < words.length - 1) {
            const bigram = `${w} ${words[i+1]}`;
            bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
          }
        });
        completed++;
      } else {
        failed++;
      }
      pool.delete(p);
      
      if ((completed + failed) % 1000 === 0) {
        console.log(`Progress: Processed ${completed + failed} URLs. Success: ${completed}`);
      }
    });
    pool.add(p);
  }
  
  console.log('Waiting for remaining requests to finish...');
  await Promise.all(pool);
}

console.log('🚀 Starting hyper-aggressive massive scrape. Targeting full HTML extraction...');
runMassivePool().then(() => {
  console.log(`\n✅ Massive Scrape Complete. Full HTML pages parsed: ${completed}. Failed/Timed Out: ${failed}`);
  
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);
  const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);

  console.log('\n🔥 FULL BODY TOP 20 KEYWORDS 🔥');
  topWords.slice(0,20).forEach(([w, c], i) => console.log(`${i+1}. ${w}: ${c}`));

  console.log('\n🚀 FULL BODY TOP 20 BIGRAMS 🚀');
  topBigrams.slice(0,20).forEach(([b, c], i) => console.log(`${i+1}. ${b}: ${c}`));
  
  const analysisObj = {
    documentsScraped: completed,
    topKeywords: topWords.slice(0, 10),
    topBigrams: topBigrams.slice(0, 10)
  };
  fs.writeFileSync(path.join(__dirname, '../src/lib/nlp-fullbody-analysis.json'), JSON.stringify(analysisObj, null, 2));
});
