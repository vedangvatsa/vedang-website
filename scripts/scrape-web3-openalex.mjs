import fetch from 'node-fetch';
import fs from 'fs';

// Query OpenAlex for real blockchain/crypto/web3 academic papers
const QUERIES = [
  'blockchain',
  'cryptocurrency',
  'decentralized finance',
  'smart contract',
  'web3',
  'ethereum',
  'bitcoin',
  'tokenization',
  'decentralized',
  'distributed ledger',
  'zero knowledge proof',
  'consensus mechanism',
  'proof of stake',
  'NFT non-fungible',
  'stablecoin',
  'DeFi',
  'crypto exchange',
  'decentralized autonomous organization',
  'layer 2 scaling',
  'cross-chain interoperability',
];

const CATEGORIES_MAP = {
  'blockchain': 'Web3 Infrastructure',
  'cryptocurrency': 'State of Crypto',
  'decentralized finance': 'DeFi & Yield',
  'smart contract': 'Security & Exploits',
  'web3': 'Web3 Infrastructure',
  'ethereum': 'L1 & L2 Scaling',
  'bitcoin': 'State of Crypto',
  'tokenization': 'Tokenomics & Value Accrual',
  'decentralized': 'DAOs & Governance',
  'distributed ledger': 'Web3 Infrastructure',
  'zero knowledge proof': 'Zero-Knowledge & Privacy',
  'consensus mechanism': 'L1 & L2 Scaling',
  'proof of stake': 'L1 & L2 Scaling',
  'NFT non-fungible': 'NFTs & Creator Economy',
  'stablecoin': 'Institutional Adoption',
  'DeFi': 'DeFi & Yield',
  'crypto exchange': 'Institutional Adoption',
  'decentralized autonomous organization': 'DAOs & Governance',
  'layer 2 scaling': 'L1 & L2 Scaling',
  'cross-chain interoperability': 'Bridges & Interoperability',
};

const seen = new Set();
const results = [];
const PER_PAGE = 200;
const PAGES_PER_QUERY = 6; // 200 * 6 = 1200 per query, 20 queries = 24,000 max

async function fetchPage(query, page) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=from_publication_date:2022-01-01,type:article&per_page=${PER_PAGE}&page=${page}&select=id,title,publication_date,primary_location,authorships&sort=cited_by_count:desc&mailto=vedang@veda.ng`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  HTTP ${res.status} for ${query} page ${page}`);
      return [];
    }
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error(`  Error fetching ${query} page ${page}:`, err.message);
    return [];
  }
}

function extractReport(work, query) {
  if (!work.title || seen.has(work.id)) return null;
  seen.add(work.id);

  const title = work.title;
  const date = work.publication_date || '2024';
  const d = new Date(date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateStr = isNaN(d.getTime()) ? date : `${months[d.getMonth()]} ${d.getFullYear()}`;
  
  // Get source name
  let source = 'Academic Research';
  if (work.primary_location?.source?.display_name) {
    source = work.primary_location.source.display_name;
  } else if (work.authorships?.[0]?.institutions?.[0]?.display_name) {
    source = work.authorships[0].institutions[0].display_name;
  }
  
  // Get URL
  let url = '';
  if (work.primary_location?.landing_page_url) {
    url = work.primary_location.landing_page_url;
  } else if (work.id) {
    url = work.id.replace('https://openalex.org/', 'https://api.openalex.org/');
  }
  
  if (!url) return null;

  const category = CATEGORIES_MAP[query] || 'Web3 Infrastructure';

  return {
    title,
    source,
    url,
    date: dateStr,
    category,
    type: 'Paper',
  };
}

async function main() {
  console.log('Starting OpenAlex Web3 paper scrape...');
  
  for (const query of QUERIES) {
    console.log(`\nQuery: "${query}"`);
    
    for (let page = 1; page <= PAGES_PER_QUERY; page++) {
      const works = await fetchPage(query, page);
      if (works.length === 0) {
        console.log(`  Page ${page}: no results, skipping remaining pages`);
        break;
      }
      
      let added = 0;
      for (const work of works) {
        const report = extractReport(work, query);
        if (report) {
          results.push(report);
          added++;
        }
      }
      console.log(`  Page ${page}: ${added} new papers (total: ${results.length})`);
      
      // Rate limit: 100ms between requests
      await new Promise(r => setTimeout(r, 150));
    }
  }

  console.log(`\nTotal unique papers: ${results.length}`);
  fs.writeFileSync(
    './src/lib/web3-reports-data-generated.json',
    JSON.stringify(results, null, 0)
  );
  console.log('Saved to web3-reports-data-generated.json');
}

main().catch(console.error);
