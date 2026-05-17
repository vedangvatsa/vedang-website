#!/usr/bin/env python3
"""Backfill Web3 dataset to 100k+ by fetching additional papers/whitepapers from OpenAlex.
Targets gaps in the current corpus: whitepapers, protocol docs, niche L1/L2 chains."""

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
TARGET = 101000  # We want 100k+ after cleanup

# New queries focused on whitepapers, protocols, and underrepresented topics
BACKFILL_QUERIES = [
    # Whitepapers & protocol documentation
    "blockchain whitepaper",
    "cryptocurrency whitepaper",
    "protocol whitepaper decentralized",
    "token whitepaper",
    "blockchain technical paper",
    "blockchain yellow paper",
    "blockchain design paper",
    
    # Under-sampled chains & protocols
    "Stellar consensus",
    "TON blockchain",
    "Solana performance",
    "Sui Move language",
    "Aptos Move blockchain",
    "Internet Computer Protocol",
    "Flow blockchain",
    "Mina Protocol",
    "Celo blockchain",
    "Harmony blockchain",
    "Elrond MultiversX",
    "Cronos blockchain",
    "Klaytn blockchain",
    "Wemix blockchain",
    "Mantle network",
    "Scroll zkEVM",
    "Linea rollup",
    "Blast L2",
    "Mode Network",
    "Ronin blockchain gaming",
    "Immutable X gaming",
    "Axie Infinity",
    "Decentraland virtual",
    "The Sandbox metaverse",
    "Enjin gaming",
    "Gala Games",
    
    # DeFi protocols & primitives
    "Synthetix protocol",
    "dYdX perpetual",
    "GMX exchange",
    "Balancer protocol",
    "Yearn Finance",
    "Convex Finance",
    "Pendle Finance",
    "Ethena protocol",
    "Jupiter DEX",
    "Raydium AMM",
    "Orca DEX Solana",
    "PancakeSwap",
    "SushiSwap",
    "1inch aggregator",
    "Morpho lending",
    "Spark Protocol",
    
    # Infrastructure & tooling
    "blockchain RPC",
    "blockchain API infrastructure",
    "blockchain data indexing",
    "smart contract auditing",
    "formal verification smart contract",
    "blockchain simulation",
    "blockchain testing framework",
    "blockchain SDK",
    "blockchain developer tools",
    
    # Real-world assets & tokenization
    "tokenized securities",
    "tokenized real estate",
    "tokenized bonds",
    "tokenized treasury",
    "tokenized commodities",
    "real world asset blockchain",
    "asset tokenization platform",
    "security token standard",
    "fractional ownership blockchain",
    
    # Regulatory & compliance
    "MiCA crypto regulation",
    "GENIUS Act stablecoin",
    "crypto regulatory framework",
    "blockchain KYC AML",
    "travel rule cryptocurrency",
    "stablecoin regulation",
    "crypto taxation",
    "blockchain legal framework",
    "digital asset regulation",
    
    # Emerging topics
    "AI blockchain integration",
    "blockchain large language model",
    "decentralized AI training",
    "blockchain federated learning privacy",
    "decentralized compute network",
    "blockchain data marketplace",
    "decentralized storage network",
    "blockchain verifiable computation",
    "blockchain trusted execution",
    "blockchain confidential computing",
    "intent-based blockchain",
    "chain abstraction",
    "account abstraction ERC-4337",
    "paymaster blockchain",
    "passkey blockchain wallet",
    "social recovery crypto wallet",
    "blockchain batch auction",
    "blockchain MEV protection",
    "blockchain sequencer",
    "shared sequencer",
    "based rollup",
    "blob transaction EIP-4844",
    
    # Social & cultural
    "decentralized social media",
    "Farcaster protocol",
    "Lens Protocol",
    "Nostr protocol",
    "SocialFi",
    "creator economy blockchain",
    "music NFT",
    "digital collectible",
    "blockchain art market",
    "blockchain digital identity",
    
    # Supply chain deep cuts
    "blockchain traceability food",
    "blockchain pharmaceutical supply",
    "blockchain diamond provenance",
    "blockchain textile supply chain",
    "blockchain carbon trading",
    "blockchain emissions tracking",
    "blockchain circular economy",
    
    # Additional academic angles
    "blockchain systematic review",
    "blockchain literature review",
    "blockchain survey paper",
    "cryptocurrency empirical analysis",
    "blockchain adoption enterprise",
    "blockchain usability study",
    "blockchain user experience",
    "cryptocurrency market microstructure",
    "bitcoin network analysis",
    "ethereum network analysis",
    "blockchain transaction analysis",
    "cryptocurrency price prediction",
    "blockchain energy consumption",
    "proof of work environmental",
]

# Poison phrases to filter false positives
POISON_PHRASES = [
    'elastic scattering', 'inelastic scattering', 'proton scattering',
    'neutron scattering', 'deuteron scattering', 'alpha particle',
    'pion-proton', 'pion-nucleon', 'optical-model', 'optical model analysis',
    'phase-shift analysis', 'partial-wave analysis', 'nuclear reaction',
    'nucleon-nucleon', 'van de graaff', 'synchrotron radiation',
    'spallation', 'fission induced', 'neutrino', 'baryogenesis',
    'dark matter', 'supersymmetric', 'muonic hydrogen', 'charmonium',
    'simian immunodeficiency', 'immunodeficiency virus',
    'plasma viremia', 'cd8+ t cell', 'cd4+ t cell', 'macaque',
    'human immunodeficiency virus', 'semeval-20', 'semeval 20',
    'cropland-sparing', 'high-yield farming',
]

WEB3_KEYWORDS = [
    'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3', 'web 3',
    'token', 'smart contract', 'ethereum', 'bitcoin', 'solana', 'polygon',
    'stablecoin', 'cbdc', 'digital asset', 'decentraliz', 'consensus',
    'ledger', 'staking', 'rollup', 'zk-', 'zero-knowledge', 'zero knowledge',
    'dapp', 'wallet', 'metaverse', 'dex', 'cross-chain', 'bridge',
    'distributed ledger', 'cryptocurrency', 'digital currency',
    'tokeniz', 'on-chain', 'off-chain', 'mainnet', 'miner',
    'hyperledger', 'ripple', 'stellar', 'cardano', 'polkadot',
    'cosmos', 'avalanche', 'tezos', 'algorand', 'hedera',
    'fintech', 'proof of work', 'proof of stake', 'mining pool',
    'chainlink', 'oracle', 'ipfs', 'filecoin', 'arweave',
    'depin', 'restaking', 'eigenlayer', 'soulbound',
    'liquidity', 'yield farming', 'amm', 'flash loan',
    'reentrancy', 'front-running', 'sandwich attack',
    'layer 2', 'layer-2', 'sidechain', 'sharding',
    'nonce', 'mempool', 'gas fee', 'transaction fee',
    'peer-to-peer', 'p2p', 'merkle',
    'supply chain', 'traceab', 'provenance',
    'iot', 'internet of things',
    'federated learning', 'privacy preserv',
    'homomorphic', 'secret sharing',
    'digital twin', 'access control',
    'deep learning', 'machine learning', 'neural network',
    'artificial intelligence', 'reinforcement learning',
    'encrypt', 'cryptograph', 'cipher',
    'authentication', 'digital signature',
    'intrusion detection', 'anomaly detection', 'malware',
    'cyber', 'phishing', 'ransomware',
    'edge computing', 'fog computing', 'cloud computing',
    'data sharing', 'data privacy', 'data integrity',
    'crowdfund', 'crowdsourc',
    'interoperab', 'scalab', 'throughput',
    'decentralised',
    'sui ', 'aptos', 'near protocol', 'ton ', 'toncoin',
    'uniswap', 'aave', 'compound', 'maker', 'curve',
    'arbitrum', 'optimism', 'zksync', 'starknet', 'scroll',
    'farcaster', 'lens protocol', 'nostr',
    'gamefi', 'socialfi', 'play-to-earn', 'play to earn',
    'axie', 'decentraland', 'sandbox',
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


def fetch_openalex(query, page=1, per_page=200, _retry=0):
    params = {
        "search": query,
        "page": page,
        "per_page": per_page,
        "select": "title,doi,publication_year,cited_by_count,id",
        "sort": "cited_by_count:desc",
        "mailto": "vedangvats@gmail.com",  # polite pool — 10x higher rate limit
    }
    url = f"https://api.openalex.org/works?{urlencode(params)}"
    req = Request(url, headers={
        "User-Agent": "Web3Reports/1.0 (mailto:vedangvats@gmail.com)",
        "Accept": "application/json",
    })
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for w in data.get("results", []):
            title = w.get("title")
            if not title:
                continue
            doi = w.get("doi", "")
            link = doi if doi else w.get("id", "")
            results.append({
                "title": title,
                "source": "OpenAlex",
                "url": link,
                "date": str(w.get("publication_year", "")),
                "category": categorize(title),
                "type": "Paper",
                "citations": w.get("cited_by_count", 0) or 0,
            })
        return results
    except HTTPError as e:
        if e.code == 429:
            wait = min(120, 15 * (_retry + 1))
            print(f"    429 — waiting {wait}s (retry {_retry+1}/5)")
            time.sleep(wait)
            if _retry < 5:
                return fetch_openalex(query, page, per_page, _retry + 1)
        print(f"    HTTP {e.code}")
        return []
    except Exception as e:
        print(f"    Error: {e}")
        return []


def main():
    # Load current dataset
    with open(OUTPUT_PATH) as f:
        all_papers = json.load(f)

    seen = set()
    for r in all_papers:
        seen.add(r["title"].lower().strip())

    print(f"Current: {len(all_papers)} papers")
    print(f"Target: {TARGET}")
    need = TARGET - len(all_papers)
    print(f"Need: {need} more\n")

    new_count = 0
    total_queries = len(BACKFILL_QUERIES)

    for i, q in enumerate(BACKFILL_QUERIES):
        if len(all_papers) >= TARGET:
            print(f"\n✅ Reached target {TARGET}!")
            break

        print(f"[{i+1}/{total_queries}] \"{q}\" (total: {len(all_papers)})")
        time.sleep(0.5)  # Delay between queries

        for page in range(1, 11):  # Up to 10 pages = 2000 per query
            results = fetch_openalex(q, page=page, per_page=200)
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

            print(f"    p{page}: {len(results)} fetched, {added} new")
            time.sleep(1.0)

            if len(results) < 200:
                break
            if len(all_papers) >= TARGET:
                break

        # Checkpoint every 10 queries
        if (i + 1) % 10 == 0:
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
