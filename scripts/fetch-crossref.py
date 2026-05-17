#!/usr/bin/env python3
"""Fast Crossref-only fetcher. Crossref has 150M+ records, 50 req/s with polite pool."""

import json, time, ssl, sys
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from pathlib import Path

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

MODE = sys.argv[1] if len(sys.argv) > 1 else "web3"

if MODE == "ai":
    OUTPUT = Path(__file__).parent.parent / "src/lib/ai-reports-data-generated.json"
    QUERIES = [
        "artificial intelligence", "machine learning", "deep learning",
        "neural network", "natural language processing",
        "computer vision", "reinforcement learning", "generative AI",
        "large language model", "transformer architecture",
        "GPT", "ChatGPT", "BERT", "diffusion model",
        "image recognition deep learning", "speech recognition AI",
        "object detection neural", "semantic segmentation",
        "sentiment analysis NLP", "question answering model",
        "autonomous driving AI", "robotics machine learning",
        "convolutional neural network", "recurrent neural network",
        "attention mechanism transformer", "self-attention",
        "transfer learning", "few-shot learning", "zero-shot learning",
        "meta learning", "federated learning", "continual learning",
        "knowledge distillation", "model compression pruning",
        "explainable artificial intelligence", "XAI",
        "adversarial machine learning", "adversarial examples",
        "data augmentation deep learning", "synthetic data AI",
        "multimodal machine learning", "vision language model",
        "graph neural network", "knowledge graph embedding",
        "recommendation system neural", "collaborative filtering",
        "anomaly detection deep learning",
        "AI ethics bias", "responsible AI", "AI safety alignment",
        "AI governance regulation",
        "generative adversarial network GAN", "variational autoencoder",
        "contrastive learning", "self-supervised learning",
        "medical imaging AI", "clinical decision support AI",
        "drug discovery machine learning", "AI radiology",
        "AI education learning", "intelligent tutoring",
        "AI agent planning", "retrieval augmented generation RAG",
        "prompt engineering LLM", "fine-tuning language model",
        "text-to-image generation", "speech synthesis neural",
        "AutoML hyperparameter", "neural architecture search NAS",
        "AI cybersecurity threat", "AI fraud detection",
        "algorithmic trading machine learning", "AI finance",
        "natural language generation", "text summarization AI",
        "dialogue systems chatbot", "conversational AI",
        "AI music generation", "AI art creative",
        "AI video generation", "video understanding",
        "autonomous robot manipulation", "drone AI navigation",
        "precision agriculture AI", "AI crop detection",
        "edge AI inference", "TinyML embedded",
        "AI chip accelerator", "neural processing unit",
        "foundation model pretraining", "instruction tuning RLHF",
        "AI benchmark evaluation", "model interpretability",
        "causal inference machine learning",
        "time series forecasting deep learning",
        "protein structure prediction AlphaFold",
        "quantum machine learning", "neuromorphic computing",
        "digital twin AI simulation", "embodied intelligence",
        "chain of thought reasoning", "AI planning",
        "multi-agent reinforcement learning",
        "code generation LLM", "copilot AI",
        "document AI OCR", "table extraction",
        "neural information retrieval", "dense retrieval",
        "Bayesian deep learning uncertainty",
        "domain adaptation transfer", "LoRA efficient",
        "mixture of experts MoE", "state space model Mamba",
        "vision transformer ViT", "CLIP contrastive",
        "segment anything SAM", "point cloud 3D",
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
        "decentralized finance DeFi", "bitcoin", "ethereum",
        "non-fungible token NFT", "stablecoin", "CBDC central bank digital",
        "tokenization asset", "decentralized autonomous organization DAO",
        "Web3", "distributed ledger technology", "DeFi protocol",
        "blockchain scalability", "blockchain security vulnerability",
        "blockchain privacy zero knowledge", "blockchain consensus",
        "zk-SNARK proof", "layer 2 rollup scaling",
        "cross-chain interoperability", "blockchain oracle",
        "blockchain governance", "crypto regulation policy",
        "blockchain supply chain traceability",
        "blockchain IoT internet of things", "blockchain healthcare",
        "metaverse blockchain", "NFT marketplace",
        "yield farming liquidity", "decentralized exchange DEX",
        "blockchain voting election", "decentralized identity SSI",
        "Hyperledger Fabric", "Solana blockchain", "Polkadot parachain",
        "blockchain energy trading", "security token offering STO",
        "initial coin offering ICO", "MEV extractable value",
        "flash loan attack", "blockchain forensics analytics",
        "tokenomics economics", "liquid staking derivative",
        "account abstraction ERC-4337", "blockchain gaming play-to-earn",
        "soulbound token reputation", "modular blockchain celestia",
        "blockchain remittance payment", "blockchain crowdfunding",
        "Binance BNB Chain", "Ripple XRP ledger",
        "Chainlink oracle network", "Uniswap automated market maker",
        "Aave lending protocol", "MakerDAO stablecoin",
        "Optimism rollup", "Arbitrum rollup", "zkSync era",
        "blockchain agriculture food", "blockchain logistics",
        "IPFS decentralized storage", "Filecoin storage",
        "blockchain patent intellectual", "multisig wallet",
        "Cardano blockchain", "Avalanche blockchain",
        "Tezos blockchain", "Algorand blockchain",
        "blockchain insurance", "blockchain real estate",
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
        print(f"    Error: {e}")
        time.sleep(5)
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

    new_count, target = 0, 100000

    for i, q in enumerate(QUERIES):
        if len(papers) >= target:
            print(f"Reached {target}!")
            break
        print(f"[{i+1}/{len(QUERIES)}] {q}")

        # 50 pages of 200 = 10000 per query max
        for offset in range(0, 10000, 200):
            results = fetch_crossref(q, offset=offset, rows=200)
            if not results:
                break
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_relevant(p["title"]):
                    seen.add(key)
                    papers.append(p)
                    new_count += 1
                    added += 1
            print(f"    offset={offset}: {len(results)} fetched, +{added} new → {len(papers)}")
            time.sleep(0.5)  # Crossref polite pool allows 50 req/s
            if added == 0 and offset > 0:
                break  # No more new results
            if len(papers) >= target:
                break

        if (i + 1) % 3 == 0:
            print(f"  → Checkpoint: {len(papers)} ({new_count} new)")
            papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
            with open(OUTPUT, "w") as f:
                json.dump(papers, f, indent=None)

    papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT, "w") as f:
        json.dump(papers, f, indent=None)
    print(f"\nDone! {MODE}: {len(papers)} ({new_count} new)")


if __name__ == "__main__":
    main()
