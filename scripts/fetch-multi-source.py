#!/usr/bin/env python3
"""Multi-source academic paper fetcher: Crossref + Semantic Scholar + OpenAlex.
Rotates between APIs to avoid rate limits."""

import json, time, ssl
from urllib.request import Request, urlopen
from urllib.parse import urlencode, quote
from urllib.error import HTTPError
from pathlib import Path
import sys

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

MODE = sys.argv[1] if len(sys.argv) > 1 else "web3"  # "ai" or "web3"

if MODE == "ai":
    OUTPUT = Path(__file__).parent.parent / "src/lib/ai-reports-data-generated.json"
    QUERIES = [
        "artificial intelligence", "machine learning", "deep learning",
        "neural network", "natural language processing",
        "computer vision", "reinforcement learning", "generative AI",
        "large language model", "transformer model",
        "GPT language", "ChatGPT", "diffusion model",
        "image generation AI", "speech recognition",
        "object detection", "image segmentation",
        "sentiment analysis", "question answering",
        "autonomous driving", "robotics AI",
        "convolutional neural", "attention mechanism",
        "transfer learning", "few-shot learning", "zero-shot",
        "federated learning", "knowledge distillation",
        "explainable AI", "adversarial machine learning",
        "multimodal AI", "vision language model",
        "graph neural network", "knowledge graph",
        "recommendation system", "anomaly detection",
        "AI ethics", "AI safety", "AI alignment",
        "generative adversarial network", "contrastive learning",
        "self-supervised learning", "medical AI",
        "AI drug discovery", "AI healthcare",
        "AI agent", "retrieval augmented generation",
        "prompt engineering", "fine-tuning LLM",
        "text-to-image", "speech synthesis",
        "AutoML", "neural architecture search",
        "AI cybersecurity", "AI finance",
        "conversational AI", "chatbot",
        "foundation model", "pre-trained model",
        "RLHF", "instruction tuning",
        "edge AI", "TinyML",
        "AI protein folding", "AlphaFold",
        "quantum machine learning",
        "embodied AI", "AI reasoning",
        "multi-agent system", "AI code generation",
        "vision transformer", "CLIP model",
        "segment anything model", "LoRA adaptation",
        "mixture of experts", "state space model",
    ]
    KEYWORDS = [
        'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
        'natural language', 'nlp', 'computer vision', 'reinforcement learning',
        'generative ai', 'large language model', 'llm', 'transformer',
        'gpt', 'bert', 'chatgpt', 'diffusion model',
        'image generation', 'speech recognition', 'object detection',
        'image segmentation', 'sentiment analysis', 'text classification',
        'question answering', 'named entity', 'machine translation',
        'autonomous', 'self-driving', 'robot', 'convolutional', 'recurrent',
        'attention mechanism', 'transfer learning', 'few-shot', 'zero-shot',
        'federated learning', 'knowledge distillation', 'explainable',
        'adversarial', 'multimodal', 'graph neural', 'knowledge graph',
        'recommendation', 'anomaly detection', 'ai ethics', 'ai safety',
        'generative adversarial', 'gan', 'autoencoder', 'contrastive learning',
        'self-supervised', 'ai-driven', 'ai-based', 'ai-powered',
        'neural', 'automl', 'classifier', 'classification',
        'fine-tuning', 'foundation model', 'pre-trained', 'pretrained',
        'language model', 'speech synthesis', 'ai agent', 'agentic',
        'retrieval augmented', 'embedding', 'segmentation', 'detection',
        'clustering', 'forecasting', 'predictive', 'optimization',
    ]
    def categorize(t):
        t = t.lower()
        if any(k in t for k in ["nlp", "natural language", "text", "language model", "llm", "gpt", "bert", "chatgpt", "translation", "sentiment"]): return "NLP & Language"
        if any(k in t for k in ["image", "vision", "object detection", "segmentation", "visual", "video"]): return "Computer Vision"
        if any(k in t for k in ["reinforcement", "robot", "autonomous", "self-driving", "agent"]): return "Robotics & RL"
        if any(k in t for k in ["medical", "health", "clinical", "drug", "radiology", "protein"]): return "AI in Healthcare"
        if any(k in t for k in ["ethic", "bias", "fair", "safety", "alignment", "governance", "explainable"]): return "AI Ethics & Safety"
        if any(k in t for k in ["generative", "diffusion", "gan", "generation", "creative"]): return "Generative AI"
        if any(k in t for k in ["graph", "knowledge", "recommendation", "embedding"]): return "Knowledge & Graphs"
        return "ML Foundations"
else:
    OUTPUT = Path(__file__).parent.parent / "src/lib/web3-reports-data-generated.json"
    QUERIES = [
        "blockchain", "cryptocurrency", "smart contract",
        "decentralized finance", "bitcoin", "ethereum",
        "non-fungible token", "stablecoin", "CBDC",
        "tokenization", "decentralized autonomous organization",
        "Web3", "distributed ledger", "DeFi",
        "blockchain scalability", "blockchain security",
        "blockchain privacy", "blockchain consensus",
        "zero knowledge proof", "zk-SNARK", "layer 2 rollup",
        "cross-chain", "blockchain oracle", "blockchain governance",
        "crypto regulation", "blockchain supply chain",
        "blockchain IoT", "blockchain healthcare",
        "metaverse blockchain", "NFT marketplace",
        "yield farming", "liquidity pool", "decentralized exchange",
        "blockchain voting", "decentralized identity",
        "Hyperledger", "Solana blockchain", "Polkadot",
        "blockchain energy", "security token offering",
        "initial coin offering", "MEV blockchain",
        "flash loan", "blockchain forensics",
        "token economics", "liquid staking",
        "account abstraction", "blockchain gaming",
        "soulbound token", "modular blockchain",
        "blockchain remittance", "blockchain crowdfunding",
        "Binance Chain", "Ripple XRP", "Monero privacy",
        "Chainlink oracle", "Uniswap protocol",
        "Aave lending", "MakerDAO",
        "Optimism rollup", "Arbitrum rollup", "zkSync",
        "blockchain agriculture", "blockchain logistics",
        "decentralized storage", "IPFS Filecoin",
        "blockchain patent", "blockchain benchmark",
        "multisig wallet", "interchain communication",
    ]
    KEYWORDS = [
        'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3',
        'smart contract', 'ethereum', 'bitcoin', 'solana', 'polygon',
        'stablecoin', 'cbdc', 'digital asset', 'decentraliz',
        'distributed ledger', 'cryptocurrency', 'digital currency',
        'tokeniz', 'on-chain', 'off-chain', 'mev', 'dapp',
        'hyperledger', 'ripple', 'cardano', 'polkadot', 'tezos',
        'proof of work', 'proof of stake', 'chainlink', 'ipfs',
        'filecoin', 'arweave', 'rollup', 'zk-', 'zero-knowledge',
        'cross-chain', 'metaverse', 'non-fungible', 'liquidity',
        'yield farming', 'flash loan', 'consensus', 'ledger',
        'token', 'mining', 'staking', 'wallet', 'coin',
    ]
    def categorize(t):
        t = t.lower()
        if any(k in t for k in ["defi", "decentralized finance", "yield", "lending", "liquidity", "amm", "dex", "stablecoin"]): return "DeFi & Finance"
        if any(k in t for k in ["nft", "non-fungible", "metaverse", "gaming"]): return "NFTs & Culture"
        if any(k in t for k in ["dao", "governance", "voting"]): return "Governance & DAOs"
        if any(k in t for k in ["regulation", "compliance", "legal", "tax", "cbdc", "central bank", "policy"]): return "Regulation & Policy"
        if any(k in t for k in ["security", "vulnerability", "attack", "exploit", "privacy", "zero-knowledge", "zk-"]): return "Security & Privacy"
        if any(k in t for k in ["scaling", "layer 2", "l2", "rollup", "sidechain", "sharding", "infrastructure"]): return "Infrastructure"
        if any(k in t for k in ["institutional", "enterprise", "bank", "custody", "tokeniz", "etf"]): return "Institutional & Enterprise"
        return "State of Crypto"


def is_relevant(title):
    t = title.lower()
    return any(kw in t for kw in KEYWORDS)


# === CROSSREF API (no auth, 50 req/s with polite pool) ===
def fetch_crossref(query, offset=0, rows=100):
    params = {"query": query, "rows": rows, "offset": offset,
              "sort": "relevance", "order": "desc",
              "mailto": "vedang@veda.ng"}
    url = f"https://api.crossref.org/works?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "Reports/1.0 (mailto:vedang@veda.ng)"})
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for item in data.get("message", {}).get("items", []):
            titles = item.get("title", [])
            if not titles: continue
            title = titles[0]
            doi = item.get("DOI", "")
            year = ""
            if item.get("published-print", {}).get("date-parts"):
                year = str(item["published-print"]["date-parts"][0][0])
            elif item.get("created", {}).get("date-parts"):
                year = str(item["created"]["date-parts"][0][0])
            results.append({
                "title": title, "source": "Crossref",
                "url": f"https://doi.org/{doi}" if doi else "",
                "date": year, "category": categorize(title),
                "type": "Paper", "citations": item.get("is-referenced-by-count", 0) or 0,
            })
        return results
    except Exception as e:
        print(f"    Crossref error: {e}")
        return []


# === SEMANTIC SCHOLAR (1 req/s, free) ===
def fetch_ss(query, offset=0, limit=100, _retry=0):
    params = {"query": query, "offset": offset, "limit": limit,
              "fields": "title,url,year,citationCount,externalIds"}
    url = f"https://api.semanticscholar.org/graph/v1/paper/search?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "Reports/1.0"})
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for p in data.get("data", []):
            if not p.get("title"): continue
            ext = p.get("externalIds") or {}
            doi = ext.get("DOI", "")
            link = p.get("url", "")
            if doi: link = f"https://doi.org/{doi}"
            results.append({
                "title": p["title"], "source": "Semantic Scholar",
                "url": link, "date": str(p.get("year", "")),
                "category": categorize(p["title"]), "type": "Paper",
                "citations": p.get("citationCount", 0) or 0,
            })
        return results
    except HTTPError as e:
        if e.code == 429 and _retry < 3:
            time.sleep(30 * (_retry + 1))
            return fetch_ss(query, offset, limit, _retry + 1)
        return []
    except Exception as e:
        print(f"    SS error: {e}")
        return []


# === OPENALEX (10 req/s with polite pool) ===
def fetch_openalex(query, page=1, per_page=200, _retry=0):
    params = {"search": query, "page": page, "per_page": per_page,
              "select": "title,doi,publication_year,cited_by_count,id",
              "sort": "cited_by_count:desc"}
    url = f"https://api.openalex.org/works?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "Reports/1.0 (mailto:vedang@veda.ng)", "Accept": "application/json"})
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for w in data.get("results", []):
            if not w.get("title"): continue
            doi = w.get("doi", "")
            results.append({
                "title": w["title"], "source": "OpenAlex",
                "url": doi if doi else w.get("id", ""),
                "date": str(w.get("publication_year", "")),
                "category": categorize(w["title"]), "type": "Paper",
                "citations": w.get("cited_by_count", 0) or 0,
            })
        return results
    except HTTPError as e:
        if e.code == 429 and _retry < 2:
            time.sleep(60 * (_retry + 1))
            return fetch_openalex(query, page, per_page, _retry + 1)
        return []
    except Exception as e:
        print(f"    OA error: {e}")
        return []


def main():
    papers = []
    seen = set()
    if OUTPUT.exists():
        with open(OUTPUT) as f:
            existing = json.load(f)
        for r in existing:
            seen.add(r["title"].lower().strip())
            papers.append(r)
        print(f"Loaded {len(existing)} existing [{MODE}]")

    new_count = 0
    target = 20000

    for i, q in enumerate(QUERIES):
        if len(papers) >= target:
            print(f"  Reached {target}!")
            break
        print(f"[{i+1}/{len(QUERIES)}] {q}")

        # 1) Crossref — 3 pages of 100
        for offset in [0, 100, 200]:
            results = fetch_crossref(q, offset=offset)
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key)
                    papers.append(p)
                    new_count += 1
                    added += 1
            if added: print(f"    CR offset={offset}: +{added} (total: {len(papers)})")
            time.sleep(1)

        # 2) Semantic Scholar — 2 pages
        for offset in [0, 100]:
            results = fetch_ss(q, offset=offset)
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key)
                    papers.append(p)
                    new_count += 1
                    added += 1
            if added: print(f"    SS offset={offset}: +{added} (total: {len(papers)})")
            time.sleep(3)

        # 3) OpenAlex — 2 pages
        for page in [1, 2]:
            results = fetch_openalex(q, page=page)
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key)
                    papers.append(p)
                    new_count += 1
                    added += 1
            if added: print(f"    OA page={page}: +{added} (total: {len(papers)})")
            time.sleep(3)

        # Checkpoint
        if (i + 1) % 5 == 0:
            print(f"  → {len(papers)} total ({new_count} new)")
            papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
            with open(OUTPUT, "w") as f:
                json.dump(papers, f, indent=None)

    papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT, "w") as f:
        json.dump(papers, f, indent=None)
    print(f"\nDone! {MODE}: {len(papers)} total ({new_count} new)")


if __name__ == "__main__":
    main()
