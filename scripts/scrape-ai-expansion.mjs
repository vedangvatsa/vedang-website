import fetch from 'node-fetch';
import fs from 'fs';

const QUERIES = [
  'machine learning operations',
  'neural architecture search',
  'language model evaluation',
  'model compression quantization',
  'synthetic data generation',
  'vision language model',
  'autonomous agent planning',
  'knowledge graph embedding',
  'recommendation system deep learning',
  'speech synthesis text to speech',
];

const CATS = ['LLMs & Benchmarks','Enterprise & Strategy','AI Safety & Alignment','Healthcare & Biotech','Workforce & Labor','Semiconductors & Infrastructure','Robotics & Embodied AI','Privacy & Data Protection','Education','Creative Industries'];

const existing = JSON.parse(fs.readFileSync('./src/lib/ai-reports-data-generated.json', 'utf-8'));
const seen = new Set(existing.map(r => r.title));
let results = [...existing];
const PER_PAGE = 200;

async function fetchPage(query, page) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=from_publication_date:2022-01-01,type:article&per_page=${PER_PAGE}&page=${page}&select=id,title,publication_date,primary_location,authorships&sort=cited_by_count:desc&mailto=vedang@veda.ng`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

async function main() {
  console.log(`Starting AI expansion. Existing: ${results.length}`);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  for (let qi = 0; qi < QUERIES.length; qi++) {
    const query = QUERIES[qi];
    if (results.length >= 20500) break;
    console.log(`Query: "${query}" (total: ${results.length})`);
    
    for (let page = 1; page <= 5; page++) {
      const works = await fetchPage(query, page);
      if (works.length === 0) break;
      let added = 0;
      for (const work of works) {
        if (!work.title || seen.has(work.title)) continue;
        seen.add(work.title);
        const date = work.publication_date || '2024';
        const d = new Date(date);
        const dateStr = isNaN(d.getTime()) ? date : `${months[d.getMonth()]} ${d.getFullYear()}`;
        let source = 'Academic Research';
        if (work.primary_location?.source?.display_name) source = work.primary_location.source.display_name;
        else if (work.authorships?.[0]?.institutions?.[0]?.display_name) source = work.authorships[0].institutions[0].display_name;
        let url = work.primary_location?.landing_page_url || (work.id ? work.id.replace('https://openalex.org/', 'https://api.openalex.org/') : '');
        if (!url) continue;
        results.push({ title: work.title, source, url, date: dateStr, category: CATS[qi % CATS.length], type: 'Paper' });
        added++;
      }
      console.log(`  Page ${page}: +${added} (total: ${results.length})`);
      await new Promise(r => setTimeout(r, 200));
    }
  }
  console.log(`Final: ${results.length}`);
  fs.writeFileSync('./src/lib/ai-reports-data-generated.json', JSON.stringify(results));
}
main();
