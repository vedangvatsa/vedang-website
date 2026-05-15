import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import pLimit from 'p-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/lib/ai-reports-data-generated.json');
const reports = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// We shuffle to hit different domains so we don't instantly get IP banned by a single publisher
reports.sort(() => 0.5 - Math.random());

const MAX_CONCURRENCY = 1000; // User requested 1000s of parallel workers
const limit = pLimit(MAX_CONCURRENCY);

const stopWords = new Set(['this', 'that', 'with', 'from', 'they', 'have', 'which', 'were', 'their', 'what', 'about', 'some', 'would', 'could', 'should', 'there', 'because', 'other', 'when', 'been', 'more', 'also', 'such', 'than', 'into', 'only', 'most', 'these', 'used', 'using', 'based', 'artificial', 'intelligence', 'learning', 'machine', 'data', 'network', 'networks', 'models', 'model', 'approach', 'performance', 'system', 'proposed', 'results', 'method', 'paper', 'research', 'study', 'analysis', 'time', 'well', 'two', 'can', 'has', 'are', 'for', 'the', 'and', 'with', 'our', 'over', 'under', 'through', 'between', 'during', 'before', 'after']);

let completed = 0;
let failed = 0;
let pdfsParsed = 0;
let htmlsParsed = 0;

let wordFreq = {};
let bigramFreq = {};

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/<[^>]*>?/gm, ' ') // Strip HTML
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopWords.has(w));
}

function processWords(text) {
  const words = tokenize(text);
  words.forEach((w, i) => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
    if (i < words.length - 1) {
      const bigram = `${w} ${words[i+1]}`;
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  });
}

// Convert arxiv abstract page to pdf link automatically since arxiv abstract is just HTML
function getRealDownloadUrl(url) {
  if (url.includes('arxiv.org/abs/')) {
    return url.replace('/abs/', '/pdf/') + '.pdf';
  }
  return url;
}

async function fetchAndAnalyze(report) {
  if (!report.url || report.url.length < 5) {
    failed++;
    return;
  }
  
  const targetUrl = getRealDownloadUrl(report.url);
  
  try {
    // 5 second timeout to try and finish in 2 minutes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(targetUrl, {
      redirect: 'follow', // Crucial: Follow DOIs to the actual PDF publisher
      follow: 5, // max redirects
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      failed++;
      return;
    }
    
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/pdf') || targetUrl.endsWith('.pdf')) {
      // It's a PDF. Download it and parse it.
      const buffer = await res.arrayBuffer();
      try {
        const data = await pdfParse(Buffer.from(buffer));
        processWords(data.text);
        pdfsParsed++;
        completed++;
      } catch (e) {
        failed++;
      }
    } else if (contentType.includes('text/html') || contentType.includes('text/plain')) {
      // It's a webpage
      const text = await res.text();
      processWords(text);
      htmlsParsed++;
      completed++;
    } else {
      failed++;
    }
    
  } catch (err) {
    failed++;
  }
}

async function run() {
  console.log(`🚀 EXTREME SCRAPE: Launching ${MAX_CONCURRENCY} parallel workers to parse full PDFs and HTML...`);
  
  const promises = reports.map(r => limit(() => fetchAndAnalyze(r)));
  
  // Create an interval to print progress
  const interval = setInterval(() => {
    console.log(`⏱  Progress: ${completed} Success (${pdfsParsed} PDFs, ${htmlsParsed} HTML) | ${failed} Failed/Timed Out`);
  }, 3000);
  
  // The user said "finish all in 2 mins", so we race against a 110-second timer
  const timer = new Promise(resolve => setTimeout(resolve, 110000));
  
  await Promise.race([
    Promise.all(promises),
    timer
  ]);
  
  clearInterval(interval);
  
  console.log(`\n🛑 SCRAPE FINISHED (Time Limit Reached or All Processed)`);
  console.log(`✅ Total Full Documents Parsed: ${completed} (${pdfsParsed} PDFs, ${htmlsParsed} HTML)`);
  
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);
  const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);

  console.log('\n🔥 EXTREME FULL-TEXT TOP 20 KEYWORDS 🔥');
  topWords.slice(0,20).forEach(([w, c], i) => console.log(`${i+1}. ${w}: ${c}`));

  console.log('\n🚀 EXTREME FULL-TEXT TOP 20 BIGRAMS 🚀');
  topBigrams.slice(0,20).forEach(([b, c], i) => console.log(`${i+1}. ${b}: ${c}`));
  
  const analysisObj = {
    documentsScraped: completed,
    pdfsParsed: pdfsParsed,
    htmlsParsed: htmlsParsed,
    failedOrTimeout: failed,
    topKeywords: topWords.slice(0, 10),
    topBigrams: topBigrams.slice(0, 10)
  };
  fs.writeFileSync(path.join(__dirname, '../src/lib/nlp-fullbody-extreme.json'), JSON.stringify(analysisObj, null, 2));
}

run();
