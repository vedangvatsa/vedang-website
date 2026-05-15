#!/usr/bin/env node
/**
 * Fetches AI-related papers & reports from public APIs and merges with curated entries.
 * Sources: arXiv, Semantic Scholar, OECD iLibrary, OpenAlex
 * Usage: node scripts/fetch-ai-reports.mjs
 */

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../src/lib/ai-reports-data-generated.json');

const CONCURRENCY = 80; // parallel fetch workers

// ── Helpers ──
async function fetchJSON(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return await r.json();
    } catch (e) {
      if (i === retries) { console.error(`  FAIL: ${url} — ${e.message}`); return null; }
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function runParallel(tasks, concurrency) {
  const results = [];
  for (const batch of chunk(tasks, concurrency)) {
    const batchResults = await Promise.allSettled(batch.map(fn => fn()));
    results.push(...batchResults.filter(r => r.status === 'fulfilled').map(r => r.value).flat().filter(Boolean));
  }
  return results;
}

// ── Category mapper ──
function categorize(title, abstract = '') {
  const t = (title + ' ' + abstract).toLowerCase();
  if (/health|medical|biotech|pharma|drug|clinical|patient|disease|genomic|protein/.test(t)) return 'Healthcare & Biotech';
  if (/ethic|bias|fair|responsible|governance|regulat|policy|transparency|accountab/.test(t)) return 'AI Ethics & Governance';
  if (/safety|alignment|jailbreak|red.?team|adversarial|guardrail|harm/.test(t)) return 'AI Safety & Alignment';
  if (/finance|bank|fintech|trading|portfolio|credit|monetary|fiscal/.test(t)) return 'Finance & Banking';
  if (/climate|energy|carbon|emission|sustainab|renewable|solar|wind|grid/.test(t)) return 'Climate & Energy';
  if (/cyber|security|attack|defense|military|weapon|warfare/.test(t)) return 'Cybersecurity & Defense';
  if (/education|learn|student|classroom|teach|tutor|curricul/.test(t)) return 'Education';
  if (/workforce|labor|employ|job|hiring|skill|wage|automat.*work/.test(t)) return 'Workforce & Labor';
  if (/legal|law|court|judici|contract|patent|copyright/.test(t)) return 'Legal & Justice';
  if (/robot|humanoid|embodi|locomot|manipulat|grasp/.test(t)) return 'Robotics & Embodied AI';
  if (/llm|language.?model|transformer|benchmark|instruct|fine.?tun|prompt|rlhf|token/.test(t)) return 'LLMs & Benchmarks';
  if (/privac|gdpr|differential|federat|synthetic.?data/.test(t)) return 'Privacy & Data Protection';
  if (/chip|semiconductor|gpu|data.?center|infra|compute|hbm/.test(t)) return 'Semiconductors & Infrastructure';
  if (/supply.?chain|manufactur|logistics|warehouse|industr/.test(t)) return 'Supply Chain & Manufacturing';
  if (/retail|e.?commerce|shop|personali|recommend/.test(t)) return 'Retail & E-Commerce';
  if (/quantum/.test(t)) return 'Quantum Computing';
  if (/telecom|5g|6g|network|connectivity/.test(t)) return 'Telecom & Connectivity';
  if (/agricult|farm|food|crop/.test(t)) return 'Agriculture & Food';
  if (/insur|actuari|underwriting|claims/.test(t)) return 'Insurance';
  if (/startup|venture|fund|invest|unicorn/.test(t)) return 'VC & Startup Funding';
  if (/real.?estate|construct|building|urban|architect/.test(t)) return 'Real Estate & Construction';
  if (/government|public.?sector|smart.?city|e.?gov/.test(t)) return 'Government & Public Sector';
  if (/creativ|art|music|media|entertainment|video|image.?gen/.test(t)) return 'Creative Industries';
  if (/africa|asia|india|asean|emerging|develop/.test(t)) return 'Emerging Markets';
  if (/enterprise|strateg|adoption|deploy|scale|business/.test(t)) return 'Enterprise & Strategy';
  return 'State of AI';
}

function inferType(venue = '', title = '') {
  const v = venue.toLowerCase();
  const t = title.toLowerCase();
  if (/survey|census/.test(t)) return 'Survey';
  if (/framework|standard|guideline/.test(t)) return 'Framework';
  if (/white.?paper/.test(t)) return 'White Paper';
  if (/report|annual|state.of/.test(t)) return 'Report';
  if (/analysis|review|overview/.test(t)) return 'Analysis';
  if (/arxiv|proceedings|conference|journal|icml|neurips|iclr|aaai|acl/.test(v)) return 'Paper';
  return 'Paper';
}

// ── arXiv ──
async function fetchArxiv(query, maxResults = 500) {
  console.log(`[arXiv] Fetching "${query}" (max ${maxResults})...`);
  const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const xml = await r.text();
    const entries = xml.split('<entry>').slice(1);
    return entries.map(e => {
      const title = (e.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').replace(/\s+/g, ' ').trim();
      const abs = (e.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      const link = e.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || '';
      const published = e.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';
      const date = published ? new Date(published) : null;
      if (!title || !link) return null;
      // Only 2025+
      if (date && date.getFullYear() < 2025) return null;
      const dateStr = date ? `${date.toLocaleString('en', { month: 'short' })} ${date.getFullYear()}` : '2025';
      return { title, source: 'arXiv', url: link, date: dateStr, category: categorize(title, abs), type: 'Paper', description: abs || undefined };
    }).filter(Boolean);
  } catch (e) { console.error(`  arXiv error: ${e.message}`); return []; }
}

// ── Semantic Scholar ──
async function fetchSemanticScholar(query, limit = 200) {
  console.log(`[S2] Fetching "${query}" (max ${limit})...`);
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${Math.min(limit, 100)}&fields=title,url,year,venue,abstract&year=2025-2026`;
  const data = await fetchJSON(url);
  if (!data?.data) return [];
  return data.data.map(p => {
    if (!p.title || !p.url) return null;
    const abs = p.abstract ? p.abstract.slice(0, 200) : undefined;
    return {
      title: p.title,
      source: p.venue || 'Semantic Scholar',
      url: p.url,
      date: p.year ? `${p.year}` : '2025',
      category: categorize(p.title, p.abstract || ''),
      type: inferType(p.venue || '', p.title),
      description: abs,
    };
  }).filter(Boolean);
}

// ── OpenAlex ──
async function fetchOpenAlex(query, maxPages = 5) {
  console.log(`[OpenAlex] Fetching "${query}" (max ${maxPages * 200})...`);
  const results = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=from_publication_date:2025-01-01&per_page=200&page=${page}&sort=publication_date:desc&select=title,doi,publication_date,primary_location`;
    const data = await fetchJSON(url);
    if (!data?.results || data.results.length === 0) break;
    
    const mapped = data.results.map(w => {
      const title = w.title;
      if (!title) return null;
      const doi = w.doi || '';
      const url = doi || '#';
      const d = w.publication_date ? new Date(w.publication_date) : null;
      const dateStr = d ? `${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}` : '2025';
      const venue = w.primary_location?.source?.display_name || 'OpenAlex';
      return { title, source: venue, url, date: dateStr, category: categorize(title), type: inferType(venue, title) };
    }).filter(Boolean);
    
    results.push(...mapped);
    await new Promise(r => setTimeout(r, 200)); // politeness delay
  }
  return results;
}

// ── Main ──
async function main() {
  console.log('🚀 Starting massive parallel AI report aggregation for 10,000+ entries...\n');
  const t0 = Date.now();

  const baseTopics = [
    'artificial intelligence', 'large language model', 'machine learning', 'deep learning',
    'natural language processing', 'computer vision', 'reinforcement learning', 'generative AI',
    'diffusion model', 'transformer architecture', 'AI safety', 'AI alignment', 'AI ethics',
    'AI governance', 'AI regulation', 'AI healthcare', 'AI drug discovery', 'AI finance',
    'AI education', 'AI climate', 'AI energy', 'AI cybersecurity', 'AI robotics', 'humanoid robot',
    'AI supply chain', 'AI manufacturing', 'autonomous vehicle', 'quantum machine learning',
    'federated learning', 'differential privacy', 'AI benchmark', 'model evaluation', 'AI agent',
    'multimodal model', 'vision language model', 'AI reasoning', 'AI code generation',
    'retrieval augmented generation', 'AI hallucination', 'prompt engineering', 'explainable AI',
    'AI edge computing', 'AI hardware accelerators', 'AI optimization', 'AI personalization',
    'AI media generation', 'AI translation', 'AI voice synthesis', 'autonomous drone',
    'AI market analysis', 'AI venture capital', 'AI legal framework', 'AI patent',
    'AI spatial computing', 'AI internet of things', 'AI bioinformatics', 'AI protein folding'
  ];

  // Create massive list of combined queries
  const extendedQueries = baseTopics.flatMap(topic => [
    topic,
    `${topic} 2025`,
    `${topic} 2026`,
    `${topic} review`,
    `${topic} survey`,
    `${topic} application`,
    `${topic} challenge`,
    `${topic} framework`
  ]);

  // Shuffle and pick top queries to avoid hitting API limits too aggressively, but enough for 10k
  const arxivQueries = extendedQueries.slice(0, 150);
  const oaQueries = extendedQueries.slice(150, 350);

  const tasks = [
    ...arxivQueries.map(q => () => fetchArxiv(q, 1000)), // Max 1000 per arxiv query
    ...oaQueries.map(q => () => fetchOpenAlex(q, 3)),    // Max 600 per openalex query
  ];

  console.log(`📋 ${tasks.length} total fetch tasks, running ${CONCURRENCY} in parallel...\n`);

  const allResults = await runParallel(tasks, CONCURRENCY);

  // Deduplicate by normalized title
  const seen = new Set();
  const deduped = [];
  for (const r of allResults) {
    const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(r);
  }

  console.log(`\n✅ Fetched ${allResults.length} total, ${deduped.length} unique after dedup`);
  console.log(`⏱  Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  // Category breakdown
  const cats = {};
  deduped.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
  console.log('\n📊 Category breakdown:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

  writeFileSync(OUT_PATH, JSON.stringify(deduped, null, 0));
  console.log(`\n💾 Written ${deduped.length} entries to ${OUT_PATH}`);
}

main().catch(console.error);
