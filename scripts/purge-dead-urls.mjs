import fs from 'fs';

const BATCH = 100; // concurrent
const TIMEOUT = 10000;

async function checkUrl(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT);
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    clearTimeout(t);
    return res.status;
  } catch {
    return 'TIMEOUT'; // treat timeouts as OK (bot blocking)
  }
}

async function processBatch(entries) {
  return Promise.all(entries.map(async (e) => {
    const status = await checkUrl(e.url);
    return { ...e, status };
  }));
}

async function cleanDataset(path, label) {
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  console.log(`\n${label}: ${data.length} entries. Checking for 404s...`);
  
  const dead = [];
  let checked = 0;
  
  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH);
    const results = await processBatch(batch);
    
    for (const r of results) {
      if (r.status === 404 || r.status === 410) {
        dead.push(r.url);
      }
    }
    checked += batch.length;
    if (checked % 500 === 0 || checked === data.length) {
      console.log(`  Checked ${checked}/${data.length}, found ${dead.length} dead so far`);
    }
  }
  
  if (dead.length > 0) {
    const deadSet = new Set(dead);
    const clean = data.filter(e => !deadSet.has(e.url));
    // Remove status field
    const final = clean.map(({ status, ...rest }) => rest);
    fs.writeFileSync(path, JSON.stringify(final));
    console.log(`  Removed ${dead.length} dead URLs. ${final.length} remain.`);
  } else {
    console.log(`  No dead URLs found!`);
  }
  
  return dead.length;
}

async function main() {
  const aiDead = await cleanDataset('./src/lib/ai-reports-data-generated.json', 'AI');
  const w3Dead = await cleanDataset('./src/lib/web3-reports-data-generated.json', 'Web3');
  console.log(`\nTotal removed: ${aiDead + w3Dead}`);
}

main();
