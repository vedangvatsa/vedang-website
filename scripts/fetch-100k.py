#!/usr/bin/env python3
"""Multi-source 100k fetcher: Crossref + arXiv + Europe PMC + CORE."""

import json, time, ssl, sys, xml.etree.ElementTree as ET
from urllib.request import Request, urlopen
from urllib.parse import urlencode, quote
from urllib.error import HTTPError
from pathlib import Path

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE
MODE = sys.argv[1] if len(sys.argv) > 1 else "ai"
TARGET = 100000

if MODE == "ai":
    OUTPUT = Path(__file__).parent.parent / "src/lib/ai-reports-data-generated.json"
    QUERIES = [
        "artificial intelligence", "machine learning", "deep learning",
        "neural network", "natural language processing", "computer vision",
        "reinforcement learning", "generative AI", "large language model",
        "transformer", "GPT", "ChatGPT", "BERT", "diffusion model",
        "object detection", "image segmentation", "speech recognition",
        "sentiment analysis", "question answering", "machine translation",
        "autonomous driving", "robotics", "convolutional neural network",
        "recurrent neural network", "attention mechanism",
        "transfer learning", "few-shot learning", "zero-shot learning",
        "federated learning", "knowledge distillation", "explainable AI",
        "adversarial machine learning", "multimodal", "graph neural network",
        "knowledge graph", "recommendation system", "anomaly detection",
        "AI ethics", "AI safety", "generative adversarial network",
        "contrastive learning", "self-supervised learning",
        "medical imaging AI", "drug discovery AI",
        "AI agent", "retrieval augmented generation", "prompt engineering",
        "text-to-image", "speech synthesis", "AutoML",
        "neural architecture search", "foundation model",
        "instruction tuning", "RLHF", "vision transformer",
        "AI cybersecurity", "AI finance", "conversational AI",
        "text summarization", "code generation LLM",
        "time series forecasting", "protein structure prediction",
        "quantum machine learning", "embodied AI", "multi-agent system",
        "edge AI", "AI chip", "LoRA", "mixture of experts",
        "AI governance", "AI regulation", "responsible AI",
        "data augmentation", "synthetic data", "model compression",
        "Bayesian deep learning", "domain adaptation",
        "image classification", "semantic segmentation",
        "named entity recognition", "text classification",
        "dialogue system", "chatbot", "video understanding",
        "3D point cloud", "AI agriculture", "AI education",
    ]
    STRONG_KW = [
        'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
        'natural language processing', 'nlp', 'computer vision', 'reinforcement learning',
        'large language model', 'llm', 'transformer', 'gpt', 'bert', 'chatgpt',
        'diffusion model', 'generative ai', 'generative adversarial',
        'convolutional neural', 'recurrent neural', 'attention mechanism',
        'image classification', 'object detection', 'image segmentation',
        'sentiment analysis', 'text classification', 'question answering',
        'machine translation', 'named entity', 'speech recognition',
        'transfer learning', 'few-shot', 'zero-shot', 'meta-learning',
        'federated learning', 'knowledge distillation', 'explainable ai',
        'self-supervised', 'contrastive learning', 'knowledge graph',
        'graph neural', 'recommendation system', 'anomaly detection',
        'ai ethics', 'ai safety', 'ai alignment', 'ai governance',
        'foundation model', 'language model', 'pre-trained model', 'pretrained model',
        'fine-tuning', 'prompt engineering', 'retrieval augmented',
        'ai agent', 'autonomous driving', 'self-driving', 'robotics',
        'medical imaging', 'drug discovery', 'automl', 'neural architecture',
        'text generation', 'image generation', 'speech synthesis',
        'multimodal', 'vision-language', 'ai-driven', 'ai-based', 'ai-powered',
        'artificial neural', 'deep neural', 'deep reinforcement',
        'text summarization', 'chatbot', 'conversational ai', 'dialogue system',
        'edge ai', 'tinyml', 'embedding', 'random forest', 'support vector',
        'decision tree', 'gradient boosting', 'xgboost', 'ensemble learning',
        'data mining', 'feature engineering', 'predictive model',
        'time series forecast', 'clustering', 'classification',
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
        "blockchain", "cryptocurrency", "smart contract", "decentralized finance",
        "bitcoin", "ethereum", "non-fungible token", "stablecoin", "CBDC",
        "tokenization", "decentralized autonomous organization", "Web3",
        "distributed ledger", "DeFi", "blockchain scalability",
        "blockchain security", "zero knowledge proof", "layer 2 rollup",
        "cross-chain interoperability", "blockchain oracle", "blockchain governance",
        "crypto regulation", "blockchain supply chain", "blockchain IoT",
        "metaverse blockchain", "NFT marketplace", "yield farming",
        "decentralized exchange", "blockchain voting", "decentralized identity",
        "Hyperledger", "Solana", "Polkadot", "blockchain energy",
        "security token offering", "MEV", "flash loan",
        "blockchain forensics", "tokenomics", "liquid staking",
        "blockchain gaming", "soulbound token", "modular blockchain",
        "Chainlink", "Uniswap", "Aave", "MakerDAO",
        "Optimism rollup", "Arbitrum", "zkSync",
        "IPFS", "Filecoin", "Cardano", "Avalanche",
        "blockchain insurance", "blockchain real estate",
        "blockchain healthcare", "blockchain agriculture",
        "proof of work", "proof of stake", "consensus mechanism",
        "token economics", "crypto exchange", "crypto wallet",
        "blockchain privacy", "blockchain interoperability",
    ]
    STRONG_KW = [
        'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3',
        'smart contract', 'ethereum', 'bitcoin', 'solana', 'polygon',
        'stablecoin', 'cbdc', 'digital asset', 'decentraliz',
        'distributed ledger', 'cryptocurrency', 'digital currency',
        'tokeniz', 'on-chain', 'off-chain', 'mev', 'dapp',
        'hyperledger', 'ripple', 'cardano', 'polkadot', 'tezos',
        'proof of work', 'proof of stake', 'chainlink', 'ipfs',
        'filecoin', 'rollup', 'zk-', 'zero-knowledge', 'zero knowledge',
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
    return any(kw in title.lower() for kw in STRONG_KW)


# === CROSSREF (50 req/s polite pool, 150M+ records) ===
def fetch_crossref(query, offset=0, rows=200):
    params = {"query": query, "rows": rows, "offset": offset,
              "sort": "relevance", "order": "desc", "mailto": "vedang@veda.ng"}
    url = f"https://api.crossref.org/works?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "Reports/1.0 (mailto:vedang@veda.ng)"})
    try:
        with urlopen(req, timeout=45, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for item in data.get("message", {}).get("items", []):
            titles = item.get("title", [])
            if not titles: continue
            doi = item.get("DOI", "")
            year = ""
            dp = item.get("published-print", {}).get("date-parts") or item.get("created", {}).get("date-parts")
            if dp and dp[0]: year = str(dp[0][0])
            results.append({
                "title": titles[0], "source": "Crossref",
                "url": f"https://doi.org/{doi}" if doi else "",
                "date": year, "category": categorize(titles[0]),
                "type": "Paper", "citations": item.get("is-referenced-by-count", 0) or 0,
            })
        return results
    except Exception as e:
        print(f"    CR err: {e}")
        time.sleep(5)
        return []


# === arXiv (3 req/s, free, preprints) ===
def fetch_arxiv(query, start=0, max_results=100):
    params = {"search_query": f"all:{quote(query)}", "start": start,
              "max_results": max_results, "sortBy": "relevance"}
    url = f"http://export.arxiv.org/api/query?{urlencode(params)}"
    try:
        with urlopen(url, timeout=30, context=SSL_CTX) as resp:
            xml = resp.read().decode("utf-8")
        ns = {"a": "http://www.w3.org/2005/Atom"}
        root = ET.fromstring(xml)
        results = []
        for entry in root.findall("a:entry", ns):
            title = entry.find("a:title", ns)
            if title is None: continue
            t = " ".join(title.text.split())
            link = entry.find("a:id", ns)
            pub = entry.find("a:published", ns)
            results.append({
                "title": t, "source": "arXiv",
                "url": link.text if link is not None else "",
                "date": pub.text[:4] if pub is not None else "",
                "category": categorize(t), "type": "Preprint", "citations": 0,
            })
        return results
    except Exception as e:
        print(f"    arXiv err: {e}")
        time.sleep(5)
        return []


# === Europe PMC (free, biomedical + CS, 40M+ records) ===
def fetch_europepmc(query, page=1, pageSize=100):
    params = {"query": query, "format": "json", "pageSize": pageSize,
              "page": page, "sort": "RELEVANCE"}
    url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/search?{urlencode(params)}"
    try:
        with urlopen(url, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for r in data.get("resultList", {}).get("result", []):
            title = r.get("title", "")
            if not title: continue
            doi = r.get("doi", "")
            results.append({
                "title": title, "source": "Europe PMC",
                "url": f"https://doi.org/{doi}" if doi else r.get("fullTextUrlList", {}).get("fullTextUrl", [{}])[0].get("url", "") if r.get("fullTextUrlList") else "",
                "date": str(r.get("pubYear", "")),
                "category": categorize(title), "type": "Paper",
                "citations": r.get("citedByCount", 0) or 0,
            })
        return results
    except Exception as e:
        print(f"    EPMC err: {e}")
        time.sleep(3)
        return []


def main():
    papers, seen = [], set()
    if OUTPUT.exists():
        with open(OUTPUT) as f:
            existing = json.load(f)
        for r in existing:
            seen.add(r["title"].lower().strip())
            papers.append(r)
        print(f"Loaded {len(existing)} [{MODE}]")

    new_count = 0

    for i, q in enumerate(QUERIES):
        if len(papers) >= TARGET:
            print(f"Reached {TARGET}!")
            break
        print(f"\n[{i+1}/{len(QUERIES)}] {q} (total: {len(papers)})")

        # 1) Crossref — up to 5000 per query
        for offset in range(0, 5000, 200):
            if len(papers) >= TARGET: break
            results = fetch_crossref(q, offset=offset)
            if not results: break
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key); papers.append(p); new_count += 1; added += 1
            if added: print(f"    CR +{added} → {len(papers)}")
            time.sleep(0.3)
            if added == 0 and offset > 400: break

        # 2) arXiv — up to 500 per query
        for start in range(0, 500, 100):
            if len(papers) >= TARGET: break
            results = fetch_arxiv(q, start=start)
            if not results: break
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key); papers.append(p); new_count += 1; added += 1
            if added: print(f"    arXiv +{added} → {len(papers)}")
            time.sleep(3)
            if added == 0: break

        # 3) Europe PMC — up to 500 per query
        for page in range(1, 6):
            if len(papers) >= TARGET: break
            results = fetch_europepmc(q, page=page)
            if not results: break
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key); papers.append(p); new_count += 1; added += 1
            if added: print(f"    EPMC +{added} → {len(papers)}")
            time.sleep(1)
            if added == 0: break

        # Checkpoint every 3 queries
        if (i + 1) % 3 == 0:
            print(f"  → CHECKPOINT: {len(papers)} ({new_count} new)")
            papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
            with open(OUTPUT, "w") as f:
                json.dump(papers, f, indent=None)

    papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT, "w") as f:
        json.dump(papers, f, indent=None)
    print(f"\nDone! {MODE}: {len(papers)} ({new_count} new)")


if __name__ == "__main__":
    main()
