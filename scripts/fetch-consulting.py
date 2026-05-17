#!/usr/bin/env python3
"""Fetch consulting/industry reports via Crossref publisher search + curated entries."""

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
    # Consulting-style queries
    QUERIES = [
        "artificial intelligence industry report",
        "machine learning enterprise adoption",
        "AI market analysis forecast",
        "deep learning commercial application",
        "AI strategy consulting",
        "generative AI business impact",
        "AI workforce transformation",
        "machine learning operations MLOps",
        "AI governance framework enterprise",
        "large language model enterprise",
        "AI automation industry",
        "computer vision industrial application",
        "natural language processing business",
        "AI healthcare market",
        "AI financial services",
        "responsible AI framework",
        "AI supply chain optimization",
        "AI manufacturing quality",
        "AI retail customer",
        "AI talent skills gap",
        "AI maturity assessment",
        "AI risk management",
        "AI return investment ROI",
        "ChatGPT enterprise productivity",
        "generative AI content creation",
        "AI patent landscape",
        "AI standardization IEEE",
        "AI regulation policy government",
        "AI national strategy",
        "AI benchmark performance",
        "AI infrastructure cloud computing",
        "edge computing AI deployment",
        "AI semiconductor chip market",
        "autonomous vehicle industry report",
        "AI drug development pharmaceutical",
        "AI education technology EdTech",
        "AI agriculture precision farming",
        "AI energy grid optimization",
        "AI insurance underwriting",
        "AI legal technology",
    ]
    STRONG_KW = [
        'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
        'ai', 'ml', 'nlp', 'computer vision', 'reinforcement learning',
        'generative ai', 'large language model', 'llm', 'transformer',
        'gpt', 'chatgpt', 'diffusion model', 'foundation model',
        'language model', 'autonomous', 'robotics', 'ai-driven',
        'ai-based', 'ai-powered', 'intelligent system',
        'neural', 'classification', 'prediction', 'automation',
        'smart system', 'cognitive', 'algorithmic',
    ]
    def categorize(t):
        t = t.lower()
        if any(k in t for k in ["nlp", "natural language", "text", "language model", "llm", "gpt", "chatgpt"]): return "NLP & Language"
        if any(k in t for k in ["image", "vision", "object detection", "video"]): return "Computer Vision"
        if any(k in t for k in ["robot", "autonomous", "agent"]): return "Robotics & RL"
        if any(k in t for k in ["medical", "health", "clinical", "drug", "pharma"]): return "AI in Healthcare"
        if any(k in t for k in ["ethic", "bias", "safety", "governance", "regulation", "responsible"]): return "AI Ethics & Safety"
        if any(k in t for k in ["generative", "creation", "content"]): return "Generative AI"
        return "ML Foundations"
else:
    OUTPUT = Path(__file__).parent.parent / "src/lib/web3-reports-data-generated.json"
    QUERIES = [
        "blockchain industry report",
        "cryptocurrency market analysis",
        "DeFi market report",
        "NFT market analysis",
        "Web3 enterprise adoption",
        "blockchain supply chain industry",
        "digital asset management",
        "crypto regulation policy framework",
        "stablecoin market report",
        "CBDC central bank digital currency report",
        "tokenization securities market",
        "blockchain healthcare application",
        "blockchain energy trading",
        "blockchain financial services",
        "smart contract audit security",
        "decentralized identity report",
        "blockchain IoT integration",
        "crypto exchange industry",
        "blockchain patent analysis",
        "blockchain governance framework",
        "blockchain sustainability ESG",
        "bitcoin institutional adoption",
        "ethereum ecosystem report",
        "layer 2 scaling report",
        "blockchain interoperability cross-chain",
        "metaverse virtual economy",
        "blockchain gaming industry",
        "crypto custody institutional",
        "blockchain insurance industry",
        "blockchain real estate tokenization",
        "DAO governance treasury",
        "zero knowledge proof application",
        "blockchain standards ISO",
        "crypto tax compliance",
        "blockchain venture capital funding",
        "Web3 developer ecosystem",
        "blockchain privacy regulation",
        "crypto mining energy",
        "blockchain voting governance",
        "decentralized storage market",
    ]
    STRONG_KW = [
        'blockchain', 'crypto', 'defi', 'nft', 'dao', 'web3',
        'smart contract', 'ethereum', 'bitcoin', 'stablecoin', 'cbdc',
        'decentraliz', 'distributed ledger', 'cryptocurrency',
        'tokeniz', 'digital asset', 'digital currency',
        'token', 'consensus', 'ledger', 'mining', 'staking',
        'metaverse', 'non-fungible', 'on-chain',
    ]
    def categorize(t):
        t = t.lower()
        if any(k in t for k in ["defi", "finance", "lending", "liquidity", "stablecoin"]): return "DeFi & Finance"
        if any(k in t for k in ["nft", "non-fungible", "metaverse", "gaming"]): return "NFTs & Culture"
        if any(k in t for k in ["dao", "governance", "voting"]): return "Governance & DAOs"
        if any(k in t for k in ["regulation", "compliance", "legal", "cbdc", "policy"]): return "Regulation & Policy"
        if any(k in t for k in ["security", "vulnerability", "attack", "privacy"]): return "Security & Privacy"
        if any(k in t for k in ["scaling", "layer 2", "rollup", "infrastructure"]): return "Infrastructure"
        if any(k in t for k in ["institutional", "enterprise", "bank", "tokeniz"]): return "Institutional & Enterprise"
        return "State of Crypto"


def is_relevant(title):
    return any(kw in title.lower() for kw in STRONG_KW)


def fetch_crossref(query, offset=0, rows=200, filter_type=None):
    params = {"query": query, "rows": rows, "offset": offset,
              "sort": "relevance", "order": "desc", "mailto": "vedang@veda.ng"}
    if filter_type:
        params["filter"] = filter_type
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
            # Determine type
            ctype = item.get("type", "")
            if ctype in ("report", "report-component"):
                doc_type = "Report"
            elif ctype == "standard":
                doc_type = "Standard"
            elif ctype in ("monograph", "book", "book-chapter"):
                doc_type = "Book/Chapter"
            elif ctype == "proceedings-article":
                doc_type = "Conference Paper"
            else:
                doc_type = "Paper"
            # Tag source
            publisher = item.get("publisher", "")
            source = publisher if publisher else "Crossref"
            results.append({
                "title": titles[0], "source": source,
                "url": f"https://doi.org/{doi}" if doi else "",
                "date": year, "category": categorize(titles[0]),
                "type": doc_type, "citations": item.get("is-referenced-by-count", 0) or 0,
            })
        return results
    except Exception as e:
        print(f"    Error: {e}")
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

    # Search for reports specifically
    report_filters = [
        None,  # No filter (general)
        "type:report",
        "type:proceedings-article",
        "type:book-chapter",
        "type:standard",
    ]

    for i, q in enumerate(QUERIES):
        print(f"[{i+1}/{len(QUERIES)}] {q}")
        for filt in report_filters:
            for offset in range(0, 2000, 200):
                results = fetch_crossref(q, offset=offset, filter_type=filt)
                if not results: break
                added = 0
                for p in results:
                    key = p["title"].lower().strip()
                    if key not in seen and is_relevant(p["title"]):
                        seen.add(key); papers.append(p); new_count += 1; added += 1
                if added: print(f"    [{filt or 'all'}] +{added} → {len(papers)}")
                time.sleep(0.3)
                if added == 0 and offset > 200: break

        if (i + 1) % 5 == 0:
            print(f"  → {len(papers)} ({new_count} new consulting/industry)")
            papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
            with open(OUTPUT, "w") as f:
                json.dump(papers, f, indent=None)

    papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT, "w") as f:
        json.dump(papers, f, indent=None)
    print(f"\nDone! {MODE}: {len(papers)} ({new_count} new consulting/industry)")


if __name__ == "__main__":
    main()
