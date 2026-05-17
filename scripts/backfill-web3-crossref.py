#!/usr/bin/env python3
"""Backfill Web3 dataset using Crossref API (more generous rate limits than OpenAlex).
Target: push dataset from ~96k to 101k+ entries."""

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
TARGET = 101000

CROSSREF_QUERIES = [
    "blockchain whitepaper",
    "blockchain protocol design",
    "cryptocurrency market",
    "smart contract verification",
    "decentralized application",
    "tokenized asset",
    "blockchain scalability solution",
    "distributed ledger technology",
    "blockchain consensus algorithm",
    "cross-chain interoperability",
    "zero knowledge proof blockchain",
    "blockchain privacy",
    "blockchain IoT integration",
    "supply chain blockchain",
    "blockchain healthcare system",
    "decentralized identity management",
    "blockchain energy trading",
    "blockchain voting system",
    "NFT digital asset",
    "metaverse blockchain",
    "DeFi protocol",
    "stablecoin mechanism",
    "CBDC central bank digital",
    "blockchain regulation compliance",
    "smart contract audit",
    "layer 2 scaling",
    "rollup blockchain",
    "proof of stake consensus",
    "blockchain data integrity",
    "federated learning blockchain",
    "blockchain carbon credit",
    "blockchain real estate",
    "tokenization securities",
    "blockchain game",
    "decentralized exchange",
    "blockchain oracle",
    "blockchain governance",
    "blockchain insurance",
    "decentralized storage",
    "blockchain trust management",
    "blockchain access control",
    "blockchain food traceability",
    "blockchain pharmaceutical",
    "blockchain crowdfunding",
    "blockchain digital twin",
    "blockchain agriculture",
    "blockchain logistics",
    "blockchain trade finance",
    "Ethereum smart contract",
    "Bitcoin network analysis",
    "Solana blockchain",
    "Polkadot interoperability",
    "Cardano proof of stake",
    "Hyperledger enterprise",
    "blockchain machine learning",
    "blockchain artificial intelligence",
    "blockchain anomaly detection",
    "blockchain cybersecurity",
    "blockchain authentication",
    "blockchain edge computing",
]

POISON_PHRASES = [
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

WEB3_KEYWORDS = [
    'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3',
    'token', 'smart contract', 'ethereum', 'bitcoin', 'solana', 'polygon',
    'stablecoin', 'cbdc', 'digital asset', 'decentraliz', 'decentralised',
    'consensus', 'ledger', 'staking', 'rollup', 'zk-', 'zero-knowledge',
    'zero knowledge', 'dapp', 'wallet', 'metaverse', 'dex', 'cross-chain',
    'distributed ledger', 'cryptocurrency', 'digital currency',
    'tokeniz', 'on-chain', 'off-chain', 'miner', 'mining',
    'hyperledger', 'ripple', 'cardano', 'polkadot', 'algorand',
    'fintech', 'proof of work', 'proof of stake',
    'chainlink', 'oracle', 'ipfs', 'filecoin',
    'liquidity', 'yield farming', 'amm', 'flash loan',
    'supply chain', 'traceab', 'provenance',
    'iot', 'internet of things',
    'federated learning', 'privacy preserv',
    'deep learning', 'machine learning', 'neural network',
    'artificial intelligence',
    'encrypt', 'cryptograph', 'cipher',
    'authentication', 'digital signature',
    'intrusion detection', 'anomaly detection', 'malware',
    'cyber', 'access control',
    'edge computing', 'fog computing', 'cloud computing',
    'data sharing', 'data privacy', 'data integrity',
    'crowdfund', 'interoperab', 'scalab',
    'peer-to-peer', 'p2p', 'merkle',
    'digital twin', 'sensor',
    'trust management', 'reputation',
]


def is_web3(title):
    t = title.lower()
    for pp in POISON_PHRASES:
        if pp in t:
            return False
    return any(kw in t for kw in WEB3_KEYWORDS)


def categorize(title):
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


def fetch_crossref(query, offset=0, rows=100, _retry=0):
    """Fetch from Crossref API. Returns list of results."""
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
        "User-Agent": "Web3Reports/1.0 (mailto:vedangvats@gmail.com)",
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
            
            # Extract year
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
    except HTTPError as e:
        if e.code == 429 and _retry < 3:
            wait = 10 * (_retry + 1)
            print(f"    429 — waiting {wait}s (retry {_retry+1}/3)")
            time.sleep(wait)
            return fetch_crossref(query, offset, rows, _retry + 1)
        print(f"    HTTP {e.code}")
        return []
    except Exception as e:
        print(f"    Error: {e}")
        return []


def main():
    with open(OUTPUT_PATH) as f:
        all_papers = json.load(f)

    seen = set()
    for r in all_papers:
        seen.add(r["title"].lower().strip())

    print(f"Current: {len(all_papers)} papers")
    print(f"Target: {TARGET}")
    print(f"Need: {TARGET - len(all_papers)} more\n")

    new_count = 0

    for i, q in enumerate(CROSSREF_QUERIES):
        if len(all_papers) >= TARGET:
            print(f"\n✅ Reached target!")
            break

        print(f"[{i+1}/{len(CROSSREF_QUERIES)}] \"{q}\" (total: {len(all_papers)})")

        for offset in range(0, 1000, 100):  # Up to 1000 per query
            results = fetch_crossref(q, offset=offset, rows=100)
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

            print(f"    offset={offset}: {len(results)} fetched, {added} new")
            time.sleep(1.0)  # Polite rate

            if len(results) < 100:
                break
            if len(all_papers) >= TARGET:
                break

        # Checkpoint every 5 queries
        if (i + 1) % 5 == 0:
            print(f"  → Checkpoint: {len(all_papers)} total ({new_count} new)")
            all_papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
            with open(OUTPUT_PATH, "w") as f:
                json.dump(all_papers, f, indent=None)

    # Final save
    all_papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(all_papers, f, indent=None)

    print(f"\nDone! Total: {len(all_papers)} ({new_count} new)")


if __name__ == "__main__":
    main()
