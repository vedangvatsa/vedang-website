#!/usr/bin/env python3
import json
import ssl
import time
import concurrent.futures
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError
from pathlib import Path

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

OUTPUT_PATH = Path(__file__).parent.parent / "src/lib/web3-reports-data-generated.json"
TARGET = 101000

STRONG_WEB3 = [
    'blockchain', 'bitcoin', 'btc', 'ethereum', 'solidity',
    'cryptocurrency', 'smart contract', 'decentralized finance', 'defi',
    'non-fungible token', 'non fungible token', 'nft marketplace',
    'distributed ledger', 'web3', 'web 3',
    'proof of work', 'proof of stake', 'proof-of-work', 'proof-of-stake',
    'stablecoin', 'cbdc', 'central bank digital currency',
    'decentralized application', 'dapp',
    'decentralized autonomous organization',
    'hyperledger', 'polkadot', 'cardano blockchain', 'solana blockchain',
    'algorand', 'tezos', 'avalanche blockchain', 'cosmos blockchain',
    'binance', 'chainlink', 'uniswap', 'aave', 'compound finance',
    'ripple xrp', 'xrp ledger', 'litecoin', 'monero', 'zcash',
    'filecoin', 'arweave', 'ipfs decentralized',
    'erc-20', 'erc-721', 'erc-1155', 'erc20', 'erc721',
    'sidechain', 'rollup', 'layer 2 blockchain', 'layer-2',
    'zk-snark', 'zk-stark', 'zkevm',
    'cross-chain', 'crosschain', 'interchain',
    'on-chain', 'on chain', 'off-chain',
    'gas fee', 'mempool', 'nonce',
    'airdrop', 'initial coin offering', 'ico token',
    'tokenization', 'tokenisation', 'tokenized asset',
    'liquidity pool', 'yield farming', 'automated market maker',
    'decentralized exchange', 'decentralised exchange',
    'staking', 'restaking', 'liquid staking',
    'depin', 'gamefi', 'socialfi', 'play-to-earn',
    'crypto exchange', 'crypto wallet', 'crypto trading',
    'metaverse', 'digital twin blockchain',
    'supply chain blockchain', 'supply chain traceab',
    'blockchain iot', 'blockchain healthcare',
    'blockchain voting', 'blockchain energy',
    'blockchain federated', 'federated learning blockchain',
    'blockchain machine learning', 'blockchain ai',
    'blockchain privacy', 'blockchain security',
    'blockchain scalability', 'blockchain consensus',
    'blockchain interoperability', 'blockchain governance',
    'blockchain oracle', 'blockchain insurance',
    'blockchain crowdfunding', 'blockchain agriculture',
    'blockchain logistics', 'blockchain manufacturing',
    'blockchain forensic', 'blockchain audit',
    'mev blockchain', 'mev ethereum', 'maximal extractable',
    'decentralized identity', 'self-sovereign identity',
    'verifiable credential',
    'dao governance', 'dao token',
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

def fetch_semanticscholar(query: str, offset: int):
    params = {
        "query": query,
        "offset": offset,
        "limit": 100,
        "fields": "title,url,year,citationCount"
    }
    url = f"https://api.semanticscholar.org/graph/v1/paper/search?{urlencode(params)}"
    req = Request(url, headers={
        "User-Agent": "Web3Reports/1.0",
        "Accept": "application/json",
    })
    try:
        with urlopen(req, timeout=20, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for w in data.get("data", []):
            title = w.get("title")
            if not title:
                continue
            url_link = w.get("url", "")
            results.append({
                "title": title,
                "source": "Semantic Scholar",
                "url": url_link,
                "date": str(w.get("year", "")) if w.get("year") else "",
                "category": categorize(title),
                "type": "Paper",
                "citations": w.get("citationCount", 0) or 0,
            })
        return results
    except Exception as e:
        return []

def main():
    all_papers = []
    seen = set()
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)
        for r in existing:
            seen.add(r["title"].lower().strip())
            all_papers.append(r)
            
    print(f"Loaded {len(all_papers)}. Target {TARGET}.")
    
    QUERIES = [
        "blockchain", "smart contract", "cryptocurrency", "defi", "web3", 
        "ethereum", "bitcoin", "nft", "decentralized finance"
    ]
    
    jobs = []
    for q in QUERIES:
        for offset in range(0, 5000, 100):
            jobs.append((q, offset))
            
    print(f"Executing {len(jobs)} parallel fetch jobs...")
    
    # 5 workers for semantic scholar because rate limits are strict (100 req per 5 min)
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(fetch_semanticscholar, q, o): (q, o) for q, o in jobs}
        for future in concurrent.futures.as_completed(futures):
            q, o = futures[future]
            results = future.result()
            added = 0
            for r in results:
                key = r["title"].lower().strip()
                if key not in seen and is_web3(r["title"]):
                    seen.add(key)
                    all_papers.append(r)
                    added += 1
            if added > 0:
                print(f"  {q} offset {o}: +{added} -> {len(all_papers)}")
            if len(all_papers) >= TARGET:
                break
            time.sleep(1) # delay to not get rate limited too hard

    all_papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(all_papers[:TARGET], f, indent=None)
    print(f"Done! Final count: {len(all_papers)}")

if __name__ == "__main__":
    main()
