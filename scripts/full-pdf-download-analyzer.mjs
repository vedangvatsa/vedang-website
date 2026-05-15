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

// Filter for URLs that are likely to have accessible PDFs (arXiv and DOIs)
// We shuffle to distribute load across domains
const targetReports = reports.filter(r => r.url && (r.url.includes('arxiv.org') || r.url.includes('doi.org'))).sort(() => 0.5 - Math.random());

// Concurrency of 10 to avoid overwhelming RAM and network connection
const limit = pLimit(10);

const stopWords = new Set(['this', 'that', 'with', 'from', 'they', 'have', 'which', 'were', 'their', 'what', 'about', 'some', 'would', 'could', 'should', 'there', 'because', 'other', 'when', 'been', 'more', 'also', 'such', 'than', 'into', 'only', 'most', 'these', 'used', 'using', 'based', 'artificial', 'intelligence', 'learning', 'machine', 'data', 'network', 'networks', 'models', 'model', 'approach', 'performance', 'system', 'proposed', 'results', 'method', 'paper', 'research', 'study', 'analysis', 'time', 'well', 'two', 'can', 'has', 'are', 'for', 'the', 'and', 'with', 'our', 'over', 'under', 'through', 'between', 'during', 'before', 'after']);

let completed = 0;
let failed = 0;
let pdfsParsed = 0;

// Load existing progress if any
const progressPath = path.join(__dirname, '../src/lib/nlp-massive-pdf-progress.json');
let wordFreq = {};
let bigramFreq = {};

if (fs.existsSync(progressPath)) {
  try {
    const saved = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
    wordFreq = saved.wordFreq || {};
    bigramFreq = saved.bigramFreq || {};
    completed = saved.completed || 0;
    failed = saved.failed || 0;
    pdfsParsed = saved.pdfsParsed || 0;
    console.log(`Resumed from previous state: ${completed} completed, ${failed} failed.`);
  } catch (e) {}
}

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/<[^>]*>?/gm, ' ')
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

function getPdfUrl(url) {
  if (url.includes('arxiv.org/abs/')) {
    return url.replace('/abs/', '/pdf/') + '.pdf';
  }
  return url;
}

// Function to save progress to disk periodically
function saveProgress() {
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 100);
  const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 100);
  
  const data = {
    completed,
    failed,
    pdfsParsed,
    totalTarget: targetReports.length,
    topWords,
    topBigrams,
    wordFreq, // Save raw dict to resume
    bigramFreq
  };
  fs.writeFileSync(progressPath, JSON.stringify(data));
}

async function fetchAndAnalyze(report) {
  const targetUrl = getPdfUrl(report.url);
  
  try {
    const controller = new AbortController();
    // 30-second timeout per PDF
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const res = await fetch(targetUrl, {
      redirect: 'follow',
      follow: 5,
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
    
    // We only care about PDFs for the full text analysis
    if (contentType.includes('application/pdf') || targetUrl.endsWith('.pdf')) {
      const buffer = await res.arrayBuffer();
      // Maximum PDF size ~15MB to prevent memory crash
      if (buffer.byteLength > 15000000) {
         failed++;
         return;
      }
      
      try {
        const data = await pdfParse(Buffer.from(buffer));
        if (data && data.text) {
          processWords(data.text);
          pdfsParsed++;
          completed++;
        } else {
          failed++;
        }
      } catch (e) {
        failed++;
      }
    } else {
      failed++;
    }
  } catch (err) {
    failed++;
  }
}

async function run() {
  console.log(`🚀 MASSIVE FULL-PDF ANALYZER STARTED`);
  console.log(`Targeting ${targetReports.length} documents. This will take hours/days.`);
  
  // To avoid memory overflow, we process in chunks of 100
  const CHUNK_SIZE = 100;
  for (let i = 0; i < targetReports.length; i += CHUNK_SIZE) {
    const chunk = targetReports.slice(i, i + CHUNK_SIZE);
    
    const promises = chunk.map(r => limit(() => fetchAndAnalyze(r)));
    await Promise.all(promises);
    
    saveProgress();
    console.log(`⏱  Progress: ${completed} Processed (${pdfsParsed} PDFs parsed) | ${failed} Failed/Blocked. Saved checkpoint.`);
  }
  
  console.log(`\n✅ ALL FINISHED.`);
}

run();
