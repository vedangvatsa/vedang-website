#!/usr/bin/env python3
import json
import time
import ssl
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError
from pathlib import Path

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

OUTPUT_PATH = Path(__file__).parent.parent / "src/lib/web3-reports-data-generated.json"
TARGET = 100000

STRONG_WEB3 = [
    'blockchain', 'bitcoin', 'btc', 'ethereum', 'solidity',
    'cryptocurrency', 'smart contract', 'decentralized finance', 'defi',
    'non-fungible token', 'nft',
    'distributed ledger', 'web3',
    'proof of work', 'proof of stake',
    'stablecoin', 'cbdc', 'central bank digital currency',
    'decentralized application', 'dapp',
    'decentralized autonomous organization', 'dao',
    'hyperledger', 'polkadot', 'cardano', 'solana',
    'binance', 'chainlink', 'uniswap',
    'filecoin', 'ipfs',
    'layer 2', 'rollup', 'zk-snark',
    'cross-chain', 'on-chain',
    'tokenization',
    'liquidity pool', 'yield farming',
    'decentralized exchange', 'dex',
    'staking',
    'metaverse',
]

POISON_PHRASES = [
    'cryptococcus', 'cryptococcal', 'cryptochrome', 'cryptosporidium',
    'cryptorchid', 'cryptogam', 'solanaceae', 'solanum',
    'elastic scattering', 'inelastic scattering', 'proton scattering',
    'neutron scattering', 'deuteron scattering', 'alpha particle',
    'pion-proton', 'optical-model', 'optical model analysis',
    'phase-shift analysis', 'partial-wave analysis', 'nucleon-nucleon',
    'van de graaff', 'synchrotron', 'spallation', 'fission induced',
    'neutrino', 'baryogenesis', 'dark matter', 'supersymmetric',
    'muonic hydrogen', 'charmonium',
    'simian immunodeficiency', 'immunodeficiency virus',
    'plasma viremia', 'cd8+ t cell', 'cd4+ t cell', 'macaque',
    'human immunodeficiency virus', 'semeval-20', 'semeval 20',
    'cropland-sparing', 'high-yield farming',
]

def is_web3(title: str) -> bool:
    t = title.lower()
    for pp in POISON_PHRASES:
        if pp in t:
            return False
    return any(kw in t for kw in STRONG_WEB3)

def categorize(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["defi", "decentralized finance", "yield", "lending", "liquidity", "amm", "dex", "stablecoin", "swap"]):
        return "DeFi & Finance"
    if any(k in t for k in ["nft", "non-fungible", "metaverse", "digital art", "collectible", "gaming", "play to earn"]):
        return "NFTs & Culture"
    if any(k in t for k in ["dao", "governance", "voting", "decentralized autonomous"]):
        return "Governance & DAOs"
    if any(k in t for k in ["regulation", "compliance", "legal", "tax", "mica", "cbdc", "central bank", "policy", "aml"]):
        return "Regulation & Policy"
    if any(k in t for k in ["security", "vulnerability", "attack", "exploit", "audit", "privacy", "zero-knowledge", "zk-", "forensic"]):
        return "Security & Privacy"
    if any(k in t for k in ["scaling", "layer 2", "l2", "rollup", "sidechain", "sharding", "throughput", "performance", "infrastructure"]):
        return "Infrastructure"
    if any(k in t for k in ["institutional", "enterprise", "bank", "custody", "tokeniz", "etf"]):
        return "Institutional & Enterprise"
    return "State of Crypto"

def fetch_crossref(query, offset=0, rows=1000):
    params = {
        "query": query,
        "rows": rows,
        "offset": offset,
        "sort": "relevance",
        "order": "desc",
        "mailto": "vedangvats@gmail.com",
    }
    url = f"https://api.crossref.org/works?{urlencode(params)}"
    req = Request(url, headers={
        "User-Agent": "Web3Reports/2.0 (mailto:vedangvats@gmail.com)",
        "Accept": "application/json",
    })
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        items = data.get("message", {}).get("items", [])
        results = []
        for item in items:
            titles = item.get("title", [])
            if not titles:
                continue
            title = titles[0]
            doi = item.get("DOI", "")
            url_link = f"https://doi.org/{doi}" if doi else ""
            date_parts = item.get("published-print", {}).get("date-parts", [[]])
            if not date_parts or not date_parts[0]:
                date_parts = item.get("published-online", {}).get("date-parts", [[]])
            year = str(date_parts[0][0]) if date_parts and date_parts[0] else ""
            citations = item.get("is-referenced-by-count", 0) or 0
            results.append({
                "title": title,
                "source": "Crossref",
                "url": url_link,
                "date": year,
                "category": categorize(title),
                "type": "Paper",
                "citations": citations,
            })
        return results
    except Exception as e:
        print(f"Error: {e}")
        return []

def main():
    all_papers = []
    seen = set()
    
    # Reload loop to keep up with the other script writing to the file
    while True:
        try:
            if OUTPUT_PATH.exists():
                with open(OUTPUT_PATH) as f:
                    existing = json.load(f)
                all_papers = []
                seen = set()
                for r in existing:
                    seen.add(r["title"].lower().strip())
                    all_papers.append(r)
            break
        except:
            time.sleep(1)
            
    print(f"Loaded {len(all_papers)}. Target {TARGET}.")
    
    QUERIES = ["nft", "defi", "decentralized finance", "zero-knowledge proof", "distributed ledger"]
    new_count = 0
    
    for q in QUERIES:
        if len(all_papers) >= TARGET:
            break
        print(f"Query: {q}")
        for offset in range(0, 10000, 1000):
            # Reload file to get latest count written by other scripts
            try:
                if OUTPUT_PATH.exists():
                    with open(OUTPUT_PATH) as f:
                        existing = json.load(f)
                    seen = set(r["title"].lower().strip() for r in existing)
                    all_papers = existing
            except:
                pass
                
            if len(all_papers) >= TARGET:
                break
                
            results = fetch_crossref(q, offset=offset, rows=1000)
            if not results:
                break
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_web3(p["title"]):
                    seen.add(key)
                    all_papers.append(p)
                    new_count += 1
                    added += 1
            print(f"  Offset {offset}: +{added} -> {len(all_papers)}")
            if added > 0:
                all_papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
                with open(OUTPUT_PATH, "w") as f:
                    json.dump(all_papers, f, indent=None)
            if len(all_papers) >= TARGET:
                break
            time.sleep(1)

    all_papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(all_papers, f, indent=None)
    print(f"Done! Final count: {len(all_papers)}")

if __name__ == "__main__":
    main()
