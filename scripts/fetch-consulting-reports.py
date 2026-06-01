#!/usr/bin/env python3
"""Fetch 20,000 consulting/institutional reports from OpenAlex.
Targets: reports, working papers, books, monographs - NOT journal articles."""
import json, time, urllib.request, ssl, sys, hashlib
from collections import Counter

# Bypass SSL issues on macOS
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

OUTPUT = "/Users/vedang/Desktop/consulting-reports-raw.json"
TARGET = 20000

# ── Topic queries (broad enough to get volume) ──
QUERIES = [
    # AI core
    "artificial intelligence", "machine learning", "deep learning",
    "neural network", "natural language processing", "computer vision",
    "reinforcement learning", "generative ai", "large language model",
    "AI safety", "AI governance", "AI regulation", "AI ethics",
    "agentic ai", "autonomous systems", "AI strategy",
    # Enterprise tech
    "digital transformation", "cloud computing", "data analytics",
    "cybersecurity", "automation", "robotics", "internet of things",
    "edge computing", "quantum computing", "5G", "semiconductor",
    # Fintech/Web3
    "blockchain", "cryptocurrency", "fintech", "decentralized finance",
    "digital currency", "central bank digital", "stablecoin",
    # Industry
    "smart manufacturing", "supply chain", "autonomous vehicles",
    "precision medicine", "telemedicine", "climate technology",
    "clean energy", "carbon capture", "smart grid", "electric vehicle",
    # Business/strategy
    "venture capital", "startup ecosystem", "innovation strategy",
    "platform economy", "gig economy", "future of work",
    "talent management", "workforce transformation",
    "ESG", "sustainability reporting", "corporate governance",
]

# ── Types to fetch (non-journal-article) ──
TYPES = ["report", "book", "standard"]

def fetch_page(query, work_type, cursor="*"):
    """Fetch one page from OpenAlex."""
    q = query.replace(" ", "+")
    url = (
        f"https://api.openalex.org/works?"
        f"filter=title.search:{q},type:{work_type}"
        f"&per_page=200&cursor={cursor}"
        f"&select=id,title,publication_date,type,cited_by_count,doi,primary_location"
        f"&sort=cited_by_count:desc"
    )
    req = urllib.request.Request(url, headers={
        "User-Agent": "vedang-research/1.0 (mailto:vedang@veda.ng)"
    })
    try:
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        return json.loads(resp.read())
    except Exception as e:
        print(f"  Error: {e}")
        return None

def extract_report(work):
    """Extract clean report record from OpenAlex work."""
    loc = work.get("primary_location") or {}
    source = loc.get("source") or {}
    
    # Build URL: prefer DOI, then OpenAlex ID
    url = ""
    if work.get("doi"):
        url = work["doi"]
    elif work.get("id"):
        url = work["id"]
    
    # Source name
    source_name = source.get("display_name", "")
    if not source_name:
        source_name = source.get("host_organization_name", "Unknown")
    
    return {
        "title": work.get("title", ""),
        "source": source_name,
        "url": url,
        "date": work.get("publication_date", ""),
        "type": work.get("type", ""),
        "citations": work.get("cited_by_count", 0),
    }

def main():
    all_reports = {}  # dedupe by title hash
    
    for work_type in TYPES:
        for query in QUERIES:
            if len(all_reports) >= TARGET:
                break
            
            cursor = "*"
            pages = 0
            max_pages = 3  # 600 per query-type combo max
            
            while pages < max_pages and len(all_reports) < TARGET:
                data = fetch_page(query, work_type, cursor)
                if not data or not data.get("results"):
                    break
                
                for work in data["results"]:
                    title = work.get("title", "")
                    if not title or len(title) < 10:
                        continue
                    key = hashlib.md5(title.lower().encode()).hexdigest()
                    if key not in all_reports:
                        all_reports[key] = extract_report(work)
                
                cursor = data.get("meta", {}).get("next_cursor")
                if not cursor:
                    break
                pages += 1
                time.sleep(0.1)  # rate limit
            
            print(f"  [{len(all_reports):,}/{TARGET:,}] type={work_type} query=\"{query}\"")
            
            if len(all_reports) >= TARGET:
                break
        if len(all_reports) >= TARGET:
            break
    
    # Save
    reports = list(all_reports.values())
    with open(OUTPUT, "w") as f:
        json.dump(reports, f)
    
    # Stats
    types = Counter(r["type"] for r in reports)
    print(f"\n=== RESULT ===")
    print(f"Total unique reports: {len(reports):,}")
    for t, c in types.most_common():
        print(f"  {t}: {c:,}")
    
    sources = Counter(r["source"] for r in reports)
    print(f"\nTop 15 sources:")
    for s, c in sources.most_common(15):
        print(f"  {s}: {c:,}")

if __name__ == "__main__":
    main()
