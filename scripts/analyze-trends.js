const fs = require('fs');
const path = require('path');

console.log('🚀 Loading 19,000+ reports for NLP analysis...');
const dataPath = path.join(__dirname, '../src/lib/ai-reports-data-generated.json');
const reports = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const stopWords = new Set([
  'the', 'of', 'and', 'in', 'to', 'a', 'for', 'on', 'with', 'is', 'by', 'as', 'an', 'at', 'from',
  'that', 'this', 'are', 'it', 'be', 'or', 'which', 'will', 'can', 'has', 'was', 'their', 'we',
  'how', 'our', 'what', 'its', 'using', 'based', 'via', 'through', 'about', 'towards', 'into',
  'artificial', 'intelligence', 'ai', 'learning', 'model', 'models', 'machine', 'deep',
  '2025', '2026', 'review', 'survey', 'report', 'framework', 'analysis', 'state', 'global',
  'outlook', 'executive', 'guide', 'navigating', 'unlocking', 'strategic', 'mastering',
  'ceo', 'playbook', 'transforming', 'accelerating', 'future', 'blueprint', 'demystifying',
  'scaling', 'beyond', 'hype', 'era', 'next', 'decade', 'enterprise', 'scale', 'perspective',
  'trends', 'maturity', 'index', 'market', 'dynamics', 'assessment', 'implications',
  'application', 'challenge', 'approach', 'new', 'data', 'driven', 'system', 'systems'
]);

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Remove punctuation except hyphens
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

const wordFreq = {};
const bigramFreq = {};

console.log(`📊 Processing ${reports.length} documents...`);

reports.forEach(r => {
  const words = tokenize(r.title);
  
  // Single words
  for (const w of words) {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  
  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i+1]}`;
    bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
  }
});

// Sort
const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);
const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 50);

console.log('\n🔥 TOP 20 FREQUENT KEYWORDS 🔥');
topWords.slice(0,20).forEach(([w, c], i) => console.log(`${i+1}. ${w}: ${c}`));

console.log('\n🚀 TOP 20 EMERGING TRENDS (BIGRAMS) 🚀');
topBigrams.slice(0,20).forEach(([b, c], i) => console.log(`${i+1}. ${b}: ${c}`));

// Grouping by category to find niche trends
const categoryTrends = {};
reports.forEach(r => {
  if (!categoryTrends[r.category]) categoryTrends[r.category] = {};
  const words = tokenize(r.title);
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i+1]}`;
    categoryTrends[r.category][bigram] = (categoryTrends[r.category][bigram] || 0) + 1;
  }
});

console.log('\n📈 TOP TREND BY CATEGORY 📈');
for (const [cat, freqs] of Object.entries(categoryTrends)) {
  const top = Object.entries(freqs).sort((a, b) => b[1] - a[1])[0];
  if (top) {
    console.log(`- ${cat}: "${top[0]}" (${top[1]} mentions)`);
  }
}

// Generate the analysis artifact
const analysisObj = {
  totalAnalyzed: reports.length,
  topKeywords: topWords.slice(0, 10),
  topBigrams: topBigrams.slice(0, 10),
  categoryHighlights: Object.entries(categoryTrends).map(([cat, freqs]) => {
    return {
      category: cat,
      topTrend: Object.entries(freqs).sort((a, b) => b[1] - a[1])[0]
    };
  }).filter(c => c.topTrend)
};

fs.writeFileSync(path.join(__dirname, '../src/lib/nlp-analysis.json'), JSON.stringify(analysisObj, null, 2));
console.log('\n✅ Data science analysis complete. Saved to src/lib/nlp-analysis.json');
