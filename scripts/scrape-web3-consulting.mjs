import fetch from 'node-fetch';
import fs from 'fs';

// Scrape OpenAlex for NON-article types (reports, book-chapters, working papers)
// from consulting-style sources about blockchain/crypto
const QUERIES = [
  'blockchain enterprise',
  'cryptocurrency regulation',
  'tokenization finance',
  'digital asset management',
  'DeFi risk',
  'stablecoin regulation',
  'CBDC central bank digital currency',
  'crypto compliance',
  'blockchain audit',
  'NFT marketplace',
  'Web3 governance',
  'crypto ETF',
  'blockchain interoperability',
  'decentralized identity verification',
  'smart contract vulnerability',
  'crypto taxation',
  'blockchain carbon credit',
  'tokenized securities',
  'crypto custody institutional',
  'blockchain trade finance',
  'digital asset custody',
  'crypto derivatives',
  'blockchain insurance',
  'decentralized storage',
  'blockchain gaming',
  'metaverse economy',
  'crypto lending',
  'blockchain cross border payment',
  'real world asset tokenization',
  'blockchain regulatory sandbox',
];

const CATEGORIES_MAP = {
  'blockchain enterprise': 'Institutional Adoption',
  'cryptocurrency regulation': 'Regulation & Policy',
  'tokenization finance': 'Tokenomics & Value Accrual',
  'digital asset management': 'Institutional Adoption',
  'DeFi risk': 'DeFi & Yield',
  'stablecoin regulation': 'Regulation & Policy',
  'CBDC central bank digital currency': 'Regulation & Policy',
  'crypto compliance': 'Regulation & Policy',
  'blockchain audit': 'Security & Exploits',
  'NFT marketplace': 'NFTs & Creator Economy',
  'Web3 governance': 'DAOs & Governance',
  'crypto ETF': 'Institutional Adoption',
  'blockchain interoperability': 'Bridges & Interoperability',
  'decentralized identity verification': 'Identity & Reputation',
  'smart contract vulnerability': 'Security & Exploits',
  'crypto taxation': 'Regulation & Policy',
  'blockchain carbon credit': 'Web3 Infrastructure',
  'tokenized securities': 'Institutional Adoption',
  'crypto custody institutional': 'Institutional Adoption',
  'blockchain trade finance': 'Institutional Adoption',
  'digital asset custody': 'Institutional Adoption',
  'crypto derivatives': 'DeFi & Yield',
  'blockchain insurance': 'Web3 Infrastructure',
  'decentralized storage': 'Web3 Infrastructure',
  'blockchain gaming': 'Gaming & Metaverse',
  'metaverse economy': 'Gaming & Metaverse',
  'crypto lending': 'DeFi & Yield',
  'blockchain cross border payment': 'Institutional Adoption',
  'real world asset tokenization': 'Tokenomics & Value Accrual',
  'blockchain regulatory sandbox': 'Regulation & Policy',
};

// These are non-article types: reports, book-chapters, reviews, preprints
const TYPE_FILTERS = [
  'report',
  'book-chapter',
  'review',
  'preprint',
  'editorial',
  'book',
];

const seen = new Set();
const results = [];
const PER_PAGE = 200;
const PAGES_PER_QUERY = 4;

async function fetchPage(query, typeFilter, page) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=from_publication_date:2020-01-01,type:${typeFilter}&per_page=${PER_PAGE}&page=${page}&select=id,title,publication_date,primary_location,authorships,type&sort=cited_by_count:desc&mailto=vedang@veda.ng`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    return [];
  }
}

function typeToReportType(openalexType) {
  const map = {
    'report': 'Report',
    'book-chapter': 'Analysis',
    'review': 'Report',
    'preprint': 'White Paper',
    'editorial': 'Analysis',
    'book': 'Report',
  };
  return map[openalexType] || 'Report';
}

async function main() {
  console.log('Scraping consulting-style reports (non-article types)...');
  
  for (const query of QUERIES) {
    for (const typeFilter of TYPE_FILTERS) {
      if (results.length >= 5500) {
        console.log(`Hit 5500. Stopping.`);
        fs.writeFileSync('./src/lib/web3-consulting-reports.json', JSON.stringify(results));
        console.log(`Saved ${results.length} consulting-style reports.`);
        return;
      }
      
      for (let page = 1; page <= PAGES_PER_QUERY; page++) {
        const works = await fetchPage(query, typeFilter, page);
        if (works.length === 0) break;
        
        let added = 0;
        for (const work of works) {
          if (!work.title || seen.has(work.title)) continue;
          seen.add(work.title);
          
          const date = work.publication_date || '2024';
          const d = new Date(date);
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const dateStr = isNaN(d.getTime()) ? date : `${months[d.getMonth()]} ${d.getFullYear()}`;
          
          let source = 'Industry Research';
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
            type: typeToReportType(work.type),
          });
          added++;
        }
        if (added > 0) console.log(`  "${query}" [${typeFilter}] p${page}: +${added} (total: ${results.length})`);
        await new Promise(r => setTimeout(r, 200));
      }
    }
  }

  console.log(`\nFinal consulting reports: ${results.length}`);
  fs.writeFileSync('./src/lib/web3-consulting-reports.json', JSON.stringify(results));
  console.log('Saved.');
}

main().catch(console.error);
