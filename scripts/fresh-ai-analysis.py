#!/usr/bin/env python3
"""Fresh n-gram analysis on the AI corpus (133,847 documents)."""
import json, re, sys
from collections import Counter

STOP_WORDS = {
    'the','and','for','with','from','this','that','have','which','were','their',
    'what','about','some','would','could','should','there','because','other',
    'when','been','more','also','such','than','into','only','most','these',
    'used','using','based','approach','performance','system','proposed','results',
    'method','paper','research','study','analysis','time','well','two','can',
    'has','are','our','over','under','through','between','during','before','after',
    'its','will','not','new','one','how','does','may','via','all','each','both',
    'use','first','second','third','high','low','real','towards','toward',
    'review','survey','comprehensive','novel','efficient','improved','enhanced',
    'multi','cross','end','non','pre','self','semi','zero','state','art','large',
    'scale'
}

data = json.load(open('src/lib/ai-reports-data-generated.json'))
print(f"Total documents: {len(data)}")

# Year extraction
year_counts = Counter()
for r in data:
    if r.get('date'):
        m = re.match(r'(\d{4})', r['date'])
        if m:
            year_counts[m.group(1)] += 1

print("\n=== YEARLY DISTRIBUTION ===")
for y in sorted(year_counts.keys()):
    print(f"{y}: {year_counts[y]}")

# N-gram analysis on titles
unigrams = Counter()
bigrams = Counter()
trigrams = Counter()

for r in data:
    title = r.get('title', '')
    if not title:
        continue
    words = re.sub(r'[^\w\s-]', ' ', title.lower()).split()
    words = [w for w in words if len(w) > 2 and w not in STOP_WORDS]
    
    for w in words:
        unigrams[w] += 1
    for i in range(len(words)-1):
        bigrams[f"{words[i]} {words[i+1]}"] += 1
    for i in range(len(words)-2):
        trigrams[f"{words[i]} {words[i+1]} {words[i+2]}"] += 1

print("\n=== TOP 15 UNIGRAMS ===")
for w, c in unigrams.most_common(15):
    pct = round(c / len(data) * 100, 1)
    print(f"{w}: {c} ({pct}%)")

print("\n=== TOP 15 BIGRAMS ===")
for b, c in bigrams.most_common(15):
    pct = round(c / len(data) * 100, 1)
    print(f"{b}: {c} ({pct}%)")

print("\n=== TOP 15 TRIGRAMS ===")
for t, c in trigrams.most_common(15):
    pct = round(c / len(data) * 100, 1)
    print(f"{t}: {c} ({pct}%)")

# Growth analysis: 2025-2026 vs 2022-2023
old_uni = Counter()
new_uni = Counter()
for r in data:
    if not r.get('date') or not r.get('title'):
        continue
    m = re.match(r'(\d{4})', r['date'])
    if not m:
        continue
    yr = int(m.group(1))
    words = re.sub(r'[^\w\s-]', ' ', r['title'].lower()).split()
    words = [w for w in words if len(w) > 2 and w not in STOP_WORDS]
    if yr in (2022, 2023):
        for w in words:
            old_uni[w] += 1
    elif yr in (2025, 2026):
        for w in words:
            new_uni[w] += 1

print("\n=== FASTEST RISING KEYWORDS (2025-26 vs 2022-23) ===")
rising = []
for w, new_c in new_uni.items():
    old_c = max(old_uni.get(w, 0), 1)
    ratio = new_c / old_c
    if new_c >= 50:  # minimum threshold
        rising.append((w, new_c, old_c, ratio))
rising.sort(key=lambda x: -x[3])
for w, nc, oc, ratio in rising[:15]:
    print(f"{w}: {nc} (was {oc}) → {ratio:.1f}x")

# Citation stats
cite_counts = [r.get('citations', 0) for r in data if isinstance(r.get('citations'), (int, float))]
if cite_counts:
    cite_counts.sort()
    print(f"\n=== CITATION STATS ===")
    print(f"Papers with citations data: {len(cite_counts)}")
    print(f"Median: {cite_counts[len(cite_counts)//2]}")
    print(f"Mean: {sum(cite_counts)/len(cite_counts):.1f}")
    print(f"Max: {max(cite_counts)}")
