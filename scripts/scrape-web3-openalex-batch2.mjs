import fetch from 'node-fetch';
import fs from 'fs';

// Additional queries to push past 20k — all Web3/crypto relevant
const QUERIES = [
  'digital asset',
  'crypto market',
  'blockchain scalability',
  'decentralized application',
  'token economy',
  'peer to peer network',
  'hash function cryptographic',
  'digital currency',
  'central bank digital currency',
  'private key public key',
  'merkle tree',
  'mining cryptocurrency',
  'liquidity pool automated',
  'non-fungible token',
  'yield farming',
  'flash loan attack',
  'crypto wallet security',
  'blockchain governance',
  'sybil attack',
  'decentralized exchange',
  'blockchain oracle',
  'blockchain privacy',
  'blockchain energy consumption',
  'blockchain supply chain',
  'blockchain voting',
  'blockchain healthcare',
  'blockchain IoT',
  'blockchain real estate',
  'blockchain identity management',
  'blockchain regulation compliance',
];

const CATEGORIES_MAP = {
  'digital asset': 'Institutional Adoption',
  'crypto market': 'State of Crypto',
  'blockchain scalability': 'L1 & L2 Scaling',
  'decentralized application': 'Web3 Infrastructure',
  'token economy': 'Tokenomics & Value Accrual',
  'peer to peer network': 'Web3 Infrastructure',
  'hash function cryptographic': 'Zero-Knowledge & Privacy',
  'digital currency': 'State of Crypto',
  'central bank digital currency': 'Regulation & Policy',
  'private key public key': 'Security & Exploits',
  'merkle tree': 'Web3 Infrastructure',
  'mining cryptocurrency': 'L1 & L2 Scaling',
  'liquidity pool automated': 'DeFi & Yield',
  'non-fungible token': 'NFTs & Creator Economy',
  'yield farming': 'DeFi & Yield',
  'flash loan attack': 'Security & Exploits',
  'crypto wallet security': 'Security & Exploits',
  'blockchain governance': 'DAOs & Governance',
  'sybil attack': 'Security & Exploits',
  'decentralized exchange': 'DeFi & Yield',
  'blockchain oracle': 'Web3 Infrastructure',
  'blockchain privacy': 'Zero-Knowledge & Privacy',
  'blockchain energy consumption': 'L1 & L2 Scaling',
  'blockchain supply chain': 'Web3 Infrastructure',
  'blockchain voting': 'DAOs & Governance',
  'blockchain healthcare': 'Web3 Infrastructure',
  'blockchain IoT': 'Web3 Infrastructure',
  'blockchain real estate': 'Institutional Adoption',
  'blockchain identity management': 'Identity & Reputation',
  'blockchain regulation compliance': 'Regulation & Policy',
};

// Load existing to deduplicate
const existing = JSON.parse(fs.readFileSync('./src/lib/web3-reports-data-generated.json', 'utf-8'));
const seen = new Set(existing.map(r => r.title));
let results = [...existing];

const PER_PAGE = 200;
const PAGES_PER_QUERY = 5;

async function fetchPage(query, page) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=from_publication_date:2020-01-01,type:article&per_page=${PER_PAGE}&page=${page}&select=id,title,publication_date,primary_location,authorships&sort=cited_by_count:desc&mailto=vedang@veda.ng`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log(`Starting batch 2. Existing: ${results.length}`);
  
  for (const query of QUERIES) {
    if (results.length >= 20100) {
      console.log(`Hit 20k+ target. Stopping.`);
      break;
    }
    console.log(`\nQuery: "${query}" (total: ${results.length})`);
    
    for (let page = 1; page <= PAGES_PER_QUERY; page++) {
      const works = await fetchPage(query, page);
      if (works.length === 0) break;
      
      let added = 0;
      for (const work of works) {
        if (!work.title || seen.has(work.title)) continue;
        seen.add(work.title);
        
        const date = work.publication_date || '2024';
        const d = new Date(date);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const dateStr = isNaN(d.getTime()) ? date : `${months[d.getMonth()]} ${d.getFullYear()}`;
        
        let source = 'Academic Research';
        if (work.primary_location?.source?.display_name) source = work.primary_location.source.display_name;
        else if (work.authorships?.[0]?.institutions?.[0]?.display_name) source = work.authorships[0].institutions[0].display_name;
        
        let url = '';
        if (work.primary_location?.landing_page_url) url = work.primary_location.landing_page_url;
        else if (work.id) url = work.id.replace('https://openalex.org/', 'https://api.openalex.org/');
        if (!url) continue;

        results.push({
          title: work.title,
          source,
          url,
          date: dateStr,
          category: CATEGORIES_MAP[query] || 'Web3 Infrastructure',
          type: 'Paper',
        });
        added++;
      }
      console.log(`  Page ${page}: +${added} (total: ${results.length})`);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\nFinal total: ${results.length}`);
  fs.writeFileSync('./src/lib/web3-reports-data-generated.json', JSON.stringify(results));
  console.log('Saved.');
}

main().catch(console.error);
