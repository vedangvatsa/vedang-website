import fetch from 'node-fetch';
import fs from 'fs';

const QUERIES = [
  'deep reinforcement learning',
  'federated learning privacy',
  'graph neural network',
  'attention mechanism transformer',
  'generative adversarial network',
  'object detection deep learning',
  'image segmentation neural',
  'transfer learning domain adaptation',
  'natural language understanding',
  'text classification deep learning',
  'anomaly detection machine learning',
  'time series forecasting deep',
  'autonomous driving perception',
  'medical image analysis deep',
  'drug discovery machine learning',
  'protein structure prediction',
  'climate model machine learning',
  'robotics manipulation learning',
  'speech recognition neural',
  'multi-modal learning vision',
  'knowledge distillation',
  'continual learning catastrophic',
  'meta-learning few-shot',
  'self-supervised learning',
  'contrastive learning representation',
  'diffusion model generative',
  'point cloud deep learning',
  'video understanding temporal',
  'semantic segmentation',
  'pose estimation human',
];

const CATS = [
  'LLMs & Benchmarks', 'Privacy & Data Protection', 'Enterprise & Strategy',
  'LLMs & Benchmarks', 'Creative Industries', 'Robotics & Embodied AI',
  'Healthcare & Biotech', 'LLMs & Benchmarks', 'LLMs & Benchmarks',
  'LLMs & Benchmarks', 'Cybersecurity & Defense', 'Finance & Banking',
  'Robotics & Embodied AI', 'Healthcare & Biotech', 'Healthcare & Biotech',
  'Healthcare & Biotech', 'Climate & Energy', 'Robotics & Embodied AI',
  'LLMs & Benchmarks', 'LLMs & Benchmarks', 'LLMs & Benchmarks',
  'LLMs & Benchmarks', 'LLMs & Benchmarks', 'LLMs & Benchmarks',
  'LLMs & Benchmarks', 'Creative Industries', 'Robotics & Embodied AI',
  'LLMs & Benchmarks', 'Robotics & Embodied AI', 'Robotics & Embodied AI',
];

const existing = JSON.parse(fs.readFileSync('./src/lib/ai-reports-data-generated.json', 'utf-8'));
const seen = new Set(existing.map(r => r.title));
let results = [...existing];
const PER_PAGE = 200;

function isRealUrl(url) {
  if (!url || url === '#' || url.length < 15) return false;
  const real = ['doi.org/','arxiv.org/','ncbi.nlm','pubmed','hdl.handle','ssrn.com/','api.openalex','ieee.org/','springer','wiley','sciencedirect','nature.com/','mdpi.com/','frontiersin','plos','sagepub','cambridge.org/','oxford','taylor','emerald','zenodo','biorxiv','medrxiv','jstor','acm.org/','researchgate','semanticscholar','biomedcentral','aaai.org/','aclweb','neurips','openreview','proceedings.mlr','jmlr','dl.acm','ieeexplore','link.springer','onlinelibrary.wiley','academic.oup','journals.sage','tandfonline','worldscientific','sciendo','karger','nber.org/','cell.com/','thelancet','bmj.com/','iop.org/','aip.org/','aps.org/','rsc.org/','acs.org/','.pdf','repository','eprints','dspace','hal.science','core.ac.uk'];
  return real.some(p => url.includes(p));
}

async function fetchPage(query, page) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=from_publication_date:2020-01-01,type:article&per_page=${PER_PAGE}&page=${page}&select=id,title,publication_date,primary_location,authorships&sort=cited_by_count:desc&mailto=vedang@veda.ng`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

async function main() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  console.log('Starting AI backfill. Current:', results.length);
  
  for (let qi = 0; qi < QUERIES.length; qi++) {
    if (results.length >= 21000) { console.log('Hit 21k. Done.'); break; }
    const query = QUERIES[qi];
    console.log(`Query: "${query}" (total: ${results.length})`);
    
    for (let page = 1; page <= 5; page++) {
      const works = await fetchPage(query, page);
      if (works.length === 0) break;
      let added = 0;
      for (const work of works) {
        if (!work.title || seen.has(work.title)) continue;
        
        let url = work.primary_location?.landing_page_url || '';
        if (!isRealUrl(url)) continue; // ONLY keep real URLs
        
        seen.add(work.title);
        const date = work.publication_date || '2024';
        const d = new Date(date);
        const dateStr = isNaN(d.getTime()) ? date : `${months[d.getMonth()]} ${d.getFullYear()}`;
        let source = 'Academic Research';
        if (work.primary_location?.source?.display_name) source = work.primary_location.source.display_name;
        else if (work.authorships?.[0]?.institutions?.[0]?.display_name) source = work.authorships[0].institutions[0].display_name;
        
        results.push({ title: work.title, source, url, date: dateStr, category: CATS[qi] || 'LLMs & Benchmarks', type: 'Paper' });
        added++;
      }
      console.log(`  p${page}: +${added} (total: ${results.length})`);
      await new Promise(r => setTimeout(r, 200));
    }
  }
  console.log('Final:', results.length);
  fs.writeFileSync('./src/lib/ai-reports-data-generated.json', JSON.stringify(results));
}
main();
