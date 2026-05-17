#!/usr/bin/env python3
"""Fetch Web3/blockchain/crypto papers from OpenAlex API (free, generous rate limits).
OpenAlex indexes 250M+ academic works. We query by concept/keyword and paginate heavily."""

import json
import time
import ssl
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError, URLError
from pathlib import Path

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

OUTPUT_PATH = Path(__file__).parent.parent / "src/lib/web3-reports-data-generated.json"

# OpenAlex concept IDs for blockchain/crypto topics
# Plus keyword searches for coverage
OPENALEX_SEARCHES = [
    # Broad searches — these return 1000s each
    "blockchain",
    "cryptocurrency",
    "smart contract",
    "decentralized finance",
    "bitcoin",
    "ethereum",
    "non-fungible token",
    "stablecoin",
    "central bank digital currency",
    "tokenization",
    "decentralized autonomous organization",
    "Web3",
    "proof of stake",
    "proof of work",
    "distributed ledger",
    "crypto exchange",
    "DeFi",
    "blockchain scalability",
    "blockchain security",
    "blockchain privacy",
    "blockchain consensus",
    "blockchain interoperability",
    "zero knowledge proof",
    "zk-SNARK",
    "layer 2 rollup",
    "cross-chain",
    "blockchain oracle",
    "blockchain governance",
    "crypto regulation",
    "blockchain supply chain",
    "blockchain IoT",
    "blockchain healthcare",
    "metaverse",
    "NFT marketplace",
    "yield farming",
    "liquidity pool",
    "automated market maker",
    "decentralized exchange",
    "blockchain voting",
    "decentralized identity",
    "self-sovereign identity",
    "IPFS decentralized",
    "Hyperledger",
    "Solana",
    "Polkadot",
    "Cardano",
    "Avalanche blockchain",
    "Cosmos blockchain",
    "Algorand",
    "Tezos",
    "blockchain energy",
    "blockchain real estate",
    "security token offering",
    "initial coin offering",
    "crypto wallet",
    "MEV maximal extractable value",
    "flash loan",
    "reentrancy attack",
    "blockchain forensics",
    "on-chain analysis",
    "token economics",
    "crypto derivatives",
    "perpetual futures",
    "liquid staking",
    "restaking",
    "account abstraction",
    "decentralized physical infrastructure",
    "regenerative finance",
    "blockchain gaming",
    "play to earn",
    "blockchain music",
    "blockchain insurance",
    "blockchain carbon credit",
    "soulbound token",
    "blockchain data availability",
    "rollup as a service",
    "blockchain artificial intelligence",
    # Round 2 — deeper cuts to reach 20k
    "Binance Smart Chain",
    "BNB Chain",
    "Ripple XRP",
    "Litecoin",
    "Monero privacy",
    "Zcash privacy",
    "Filecoin storage",
    "Arweave permanent",
    "Hedera Hashgraph",
    "NEAR Protocol",
    "Fantom blockchain",
    "Sui blockchain",
    "Aptos blockchain",
    "Chainlink oracle",
    "Uniswap protocol",
    "Aave lending",
    "MakerDAO",
    "Compound Finance",
    "Curve Finance",
    "Lido staking",
    "EigenLayer restaking",
    "Optimism rollup",
    "Arbitrum rollup",
    "zkSync",
    "StarkNet",
    "Polygon zkEVM",
    "Base blockchain",
    "blockchain education",
    "blockchain agriculture",
    "blockchain logistics",
    "blockchain manufacturing",
    "blockchain identity verification",
    "blockchain land registry",
    "blockchain intellectual property",
    "blockchain anti-counterfeit",
    "blockchain food safety",
    "blockchain pharmaceutical",
    "blockchain digital twin",
    "blockchain trade finance",
    "blockchain remittance",
    "blockchain micropayment",
    "blockchain crowdfunding",
    "blockchain loyalty program",
    "decentralized social network",
    "decentralized science DeSci",
    "decentralized DNS",
    "decentralized VPN",
    "decentralized cloud computing",
    "decentralized machine learning",
    "decentralized prediction market",
    "atomic swap protocol",
    "bonding curve token",
    "impermanent loss",
    "sandwich attack blockchain",
    "front-running MEV",
    "gas fee optimization",
    "ERC-20 token",
    "ERC-721 standard",
    "ERC-1155 token",
    "EIP-4844 blob",
    "proto-danksharding",
    "verkle tree",
    "merkle tree blockchain",
    "Byzantine fault tolerance",
    "Practical Byzantine",
    "Tendermint consensus",
    "Raft consensus blockchain",
    "sharding blockchain",
    "state channel",
    "plasma blockchain",
    "validium",
    "blockchain trilemma",
    "blockchain throughput",
    "blockchain latency",
    "blockchain finality",
    "crypto custody solution",
    "crypto ETF",
    "bitcoin ETF",
    "ethereum ETF",
    "crypto fund management",
    "crypto tax compliance",
    "crypto anti-money laundering",
    "crypto know your customer",
    "travel rule crypto",
    "blockchain patent",
    "blockchain standard",
    "blockchain benchmark",
    "blockchain testnet",
    "blockchain node infrastructure",
    "RPC provider blockchain",
    "blockchain indexer",
    "subgraph TheGraph",
    "blockchain explorer",
    "smart contract formal verification",
    "smart contract testing",
    "smart contract upgrade",
    "proxy contract pattern",
    "multisig wallet",
    "hardware wallet crypto",
    "mobile wallet blockchain",
    "social recovery wallet",
    "intent-centric blockchain",
    "chain abstraction protocol",
    "modular blockchain",
    "sovereign rollup",
    "appchain",
    "blockchain middleware",
    "relayer network",
    "interchain communication",
]

WEB3_KEYWORDS = [
    'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3', 'web 3',
    'token', 'smart contract', 'ethereum', 'bitcoin', 'solana', 'polygon',
    'stablecoin', 'cbdc', 'digital asset', 'decentraliz', 'consensus',
    'ledger', 'staking', 'rollup', 'zk-', 'zero-knowledge', 'zero knowledge',
    'dapp', 'wallet', 'metaverse', 'dex', 'cross-chain', 'bridge',
    'distributed ledger', 'cryptocurrency', 'digital currency',
    'tokeniz', 'on-chain', 'off-chain', 'mainnet', 'mev',
    'hyperledger', 'ripple', 'stellar', 'cardano', 'polkadot',
    'cosmos', 'avalanche', 'tezos', 'algorand', 'hedera',
    'fintech', 'proof of work', 'proof of stake', 'mining pool',
    'chainlink', 'oracle', 'ipfs', 'filecoin', 'arweave',
    'depin', 'restaking', 'eigenlayer', 'soulbound',
    'liquidity', 'yield farming', 'amm', 'flash loan',
    'reentrancy', 'front-running', 'sandwich attack',
]


def is_web3(title: str) -> bool:
    t = title.lower()
    return any(kw in t for kw in WEB3_KEYWORDS)


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


def fetch_openalex(query: str, page: int = 1, per_page: int = 200) -> tuple:
    """Fetch from OpenAlex API. Returns (results, total_count)."""
    params = {
        "search": query,
        "page": page,
        "per_page": per_page,
        "select": "title,doi,publication_year,cited_by_count,id",
        "sort": "cited_by_count:desc",
    }
    url = f"https://api.openalex.org/works?{urlencode(params)}"
    req = Request(url, headers={
        "User-Agent": "Web3Reports/1.0 (mailto:vedang@example.com)",
        "Accept": "application/json",
    })
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        total = data.get("meta", {}).get("count", 0)
        results = []
        for w in data.get("results", []):
            title = w.get("title")
            if not title:
                continue
            doi = w.get("doi", "")
            url = doi if doi else w.get("id", "")
            results.append({
                "title": title,
                "source": "OpenAlex",
                "url": url,
                "date": str(w.get("publication_year", "")),
                "category": categorize(title),
                "type": "Paper",
                "citations": w.get("cited_by_count", 0) or 0,
            })
        return results, total
    except HTTPError as e:
        if e.code == 429:
            print(f"    429 — waiting 10s")
            time.sleep(10)
            return fetch_openalex(query, page, per_page)
        print(f"    HTTP {e.code}")
        return [], 0
    except Exception as e:
        print(f"    Error: {e}")
        return [], 0


def main():
    all_papers = []
    seen = set()

    # Load existing
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            existing = json.load(f)
        for r in existing:
            seen.add(r["title"].lower().strip())
            all_papers.append(r)
        print(f"Loaded {len(existing)} existing reports")

    new_count = 0
    total_queries = len(OPENALEX_SEARCHES)
    target = 20000

    for i, q in enumerate(OPENALEX_SEARCHES):
        if len(all_papers) >= target:
            print(f"  Reached {target} target!")
            break

        print(f"[{i+1}/{total_queries}] {q}")

        # Paginate: up to 5 pages of 200 = 1000 per query
        for page in range(1, 6):
            results, total = fetch_openalex(q, page=page, per_page=200)
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

            print(f"    Page {page}: {len(results)} fetched, {added} new (total: {len(all_papers)})")
            time.sleep(0.2)  # OpenAlex allows 10 req/sec

            if len(results) < 200:
                break  # No more pages
            if len(all_papers) >= target:
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
