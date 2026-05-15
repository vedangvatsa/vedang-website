import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import pLimit from 'p-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/lib/ai-reports-data-generated.json');
const reports = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Extract DOIs
const dois = reports.filter(r => r.url && r.url.includes('doi.org')).map(r => r.url);
console.log(`Found ${dois.length} DOIs in the dataset.`);

const stopWords = new Set(['this', 'that', 'with', 'from', 'they', 'have', 'which', 'were', 'their', 'what', 'about', 'some', 'would', 'could', 'should', 'there', 'because', 'other', 'when', 'been', 'more', 'also', 'such', 'than', 'into', 'only', 'most', 'these', 'used', 'using', 'based', 'artificial', 'intelligence', 'learning', 'machine', 'data', 'network', 'networks', 'models', 'model', 'approach', 'performance', 'system', 'proposed', 'results', 'method', 'paper', 'research', 'study', 'analysis', 'time', 'well', 'two', 'can', 'has', 'are', 'for', 'the', 'and', 'with', 'our', 'over', 'under', 'through', 'between', 'during', 'before', 'after']);

let completed = 0;
let failed = 0;
let abstractsReconstructed = 0;

let wordFreq = {};
let bigramFreq = {};

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
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

// Function to reconstruct abstract from OpenAlex abstract_inverted_index
function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return '';
  const wordEntries = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      wordEntries.push({ word, pos });
    }
  }
  wordEntries.sort((a, b) => a.pos - b.pos);
  return wordEntries.map(entry => entry.word).join(' ');
}

// Chunk into groups of 50 for the API
const CHUNK_SIZE = 50; // We can use 50 again since the syntax will be much shorter
const chunks = [];
for (let i = 0; i < dois.length; i += CHUNK_SIZE) {
  chunks.push(dois.slice(i, i + CHUNK_SIZE));
}

const limit = pLimit(15);

async function fetchOpenAlexBatch(chunk) {
  const cleanDois = chunk.map(url => url.replace('https://doi.org/', '').trim());
  const filterStr = `doi:${cleanDois.join('|')}`;
  const url = `https://api.openalex.org/works?filter=${filterStr}&per-page=50&mailto=admin@veda.ng`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Error ${res.status}: ${res.statusText}`);
      failed += chunk.length;
      return;
    }
    const data = await res.json();
    if (data && data.results) {
      data.results.forEach(work => {
        if (work.abstract_inverted_index) {
          const text = reconstructAbstract(work.abstract_inverted_index);
          processWords(text);
          abstractsReconstructed++;
        }
      });
      completed += chunk.length;
    } else {
      failed += chunk.length;
    }
  } catch (e) {
    failed += chunk.length;
  }
}

async function run() {
  console.log(`🚀 DEEP ABSTRACT SCRAPE: Processing ${chunks.length} batches of 50 DOIs via OpenAlex...`);
  
  const promises = chunks.map(chunk => limit(() => fetchOpenAlexBatch(chunk)));
  
  const interval = setInterval(() => {
    console.log(`⏱  Progress: ${completed} DOIs Processed. Abstracts Reconstructed: ${abstractsReconstructed}. Failed: ${failed}`);
  }, 3000);
  
  await Promise.all(promises);
  clearInterval(interval);
  
  console.log(`\n🛑 DEEP SCRAPE FINISHED`);
  console.log(`✅ Total DOIs Processed: ${completed}. Abstracts Reconstructed & Analyzed: ${abstractsReconstructed}`);
  
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);
  const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);

  console.log('\n🔥 DEEP BODY TOP 20 KEYWORDS 🔥');
  topWords.slice(0,20).forEach(([w, c], i) => console.log(`${i+1}. ${w}: ${c}`));

  console.log('\n🚀 DEEP BODY TOP 20 BIGRAMS 🚀');
  topBigrams.slice(0,20).forEach(([b, c], i) => console.log(`${i+1}. ${b}: ${c}`));
  
  const analysisObj = {
    documentsAnalyzed: completed,
    abstractsReconstructed: abstractsReconstructed,
    topKeywords: topWords.slice(0, 10),
    topBigrams: topBigrams.slice(0, 10)
  };
  fs.writeFileSync(path.join(__dirname, '../src/lib/nlp-deep-analysis.json'), JSON.stringify(analysisObj, null, 2));
}

run();
