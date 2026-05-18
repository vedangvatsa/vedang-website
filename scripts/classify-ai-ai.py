#!/usr/bin/env python3
"""Use Claude API to classify Web3 dataset entries as relevant or not.
Processes in batches of 50 titles with 10 parallel workers."""

import json
import os
import ssl
import time
import concurrent.futures
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from pathlib import Path

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
if not API_KEY:
    # Try .env.local
    env_path = Path(__file__).parent.parent / ".env.local"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("ANTHROPIC_API_KEY="):
                API_KEY = line.split("=", 1)[1].strip()

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

BATCH_SIZE = 50  # titles per API call
WORKERS = 100


def classify_batch(titles_batch, batch_id):
    """Send a batch of titles to Claude and get back indices of FALSE POSITIVES."""
    numbered = "\n".join(f"{i+1}. {t}" for i, t in enumerate(titles_batch))
    
    payload = json.dumps({
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": f"""You are a dataset quality auditor. Below are titles from a AI/machine learning research database.

Your task: Identify which titles are FALSE POSITIVES — i.e., NOT related to artificial intelligence, machine learning, deep learning, neural networks, NLP, computer vision, data science, robotics, or closely related topics.

Papers about cryptography, cybersecurity, IoT, machine learning, supply chain, etc. ARE relevant if they have a clear blockchain/Web3 connection in the title. Papers about general software engineering, databases, or networking without AI/ML angle are borderline — keep them if they have any data science connection.

Papers about pure physics, geology, botany, unrelated medicine without AI angle, pure mathematics without ML, or other non-tech fields are FALSE POSITIVES.

Return ONLY the numbers of false positives as a comma-separated list. If none, return "NONE".

{numbered}"""
        }]
    }).encode("utf-8")
    
    req = Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    
    for retry in range(3):
        try:
            with urlopen(req, timeout=30, context=SSL_CTX) as resp:
                result = json.loads(resp.read().decode("utf-8"))
            text = result["content"][0]["text"].strip()
            
            if text.upper() == "NONE":
                return batch_id, []
            
            # Parse comma-separated numbers
            indices = []
            for part in text.replace("\n", ",").split(","):
                part = part.strip().rstrip(".")
                if part.isdigit():
                    idx = int(part) - 1  # 0-indexed
                    if 0 <= idx < len(titles_batch):
                        indices.append(idx)
            return batch_id, indices
            
        except HTTPError as e:
            if e.code == 429:
                time.sleep(5 * (retry + 1))
                continue
            if e.code == 529:  # overloaded
                time.sleep(10 * (retry + 1))
                continue
            print(f"  Batch {batch_id}: HTTP {e.code}")
            return batch_id, []
        except Exception as e:
            print(f"  Batch {batch_id}: Error {e}")
            time.sleep(2)
    
    return batch_id, []


def main():
    dataset_path = Path(__file__).parent.parent / "src/lib/ai-reports-data-generated.json"
    with open(dataset_path) as f:
        data = json.load(f)
    
    print(f"Total entries: {len(data)}")
    
    # Create batches
    batches = []
    for i in range(0, len(data), BATCH_SIZE):
        batch_titles = [d["title"] for d in data[i:i+BATCH_SIZE]]
        batches.append((batch_titles, i))
    
    print(f"Total batches: {len(batches)} ({BATCH_SIZE} titles each)")
    print(f"Workers: {WORKERS}")
    print()
    
    false_positive_indices = set()
    processed = 0
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {}
        for batch_titles, start_idx in batches:
            future = executor.submit(classify_batch, batch_titles, start_idx)
            futures[future] = start_idx
        
        for future in concurrent.futures.as_completed(futures):
            start_idx = futures[future]
            batch_id, fp_indices = future.result()
            
            for idx in fp_indices:
                global_idx = start_idx + idx
                false_positive_indices.add(global_idx)
                print(f"  FP: {data[global_idx]['title'][:100]}")
            
            processed += 1
            if processed % 50 == 0:
                print(f"  Progress: {processed}/{len(batches)} batches, {len(false_positive_indices)} FPs found")
    
    print(f"\nTotal false positives found: {len(false_positive_indices)}")
    
    # Remove false positives
    kept = [d for i, d in enumerate(data) if i not in false_positive_indices]
    kept.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    
    with open(dataset_path, "w") as f:
        json.dump(kept, f, indent=None)
    
    print(f"Final dataset: {len(kept)} entries")
    print(f"Removed: {len(data) - len(kept)} entries")


if __name__ == "__main__":
    main()
