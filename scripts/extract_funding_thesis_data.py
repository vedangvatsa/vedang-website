import pandas as pd
import numpy as np
import re
from collections import defaultdict

def parse_amount(val):
    if pd.isna(val):
        return 0.0
    val_str = str(val).strip().upper()
    if not val_str:
        return 0.0
    factor = 1.0
    if val_str.endswith('B'):
        factor = 1e9
        val_str = val_str[:-1]
    elif val_str.endswith('M'):
        factor = 1e6
        val_str = val_str[:-1]
    elif val_str.endswith('K'):
        factor = 1e3
        val_str = val_str[:-1]
    val_str = re.sub(r'[^\d.]', '', val_str)
    try:
        return float(val_str) * factor
    except:
        return 0.0

def calculate_gini(array):
    # Gini coefficient calculation for concentration of dollars
    array = np.array(array, dtype=np.float64)
    if len(array) == 0:
        return 0.0
    array = array[array > 0]
    if len(array) == 0:
        return 0.0
    array = np.sort(array)
    index = np.arange(1, len(array) + 1)
    n = len(array)
    return ((np.sum((2 * index - n - 1) * array)) / (n * np.sum(array)))

print("Loading Global Funding Rounds...")
chunksize = 100000
years_total = defaultdict(int)
amount_total = defaultdict(float)
round_sizes_by_year = defaultdict(list)

# Stage-specific tracking (exact mapping to lowercase DB values)
stages_mapping = {
    'pre_seed': 'Pre-Seed',
    'seed': 'Seed',
    'series_a': 'Series A',
    'series_b': 'Series B'
}
stages = list(stages_mapping.keys())
rounds_by_stage_year = {s: defaultdict(int) for s in stages}
amount_by_stage_year = {s: defaultdict(float) for s in stages}
sizes_by_stage_year = {s: defaultdict(list) for s in stages}

# Timeline parsing patterns
date_pattern = re.compile(r'\b(201\d|202\d)\b')

print("Processing funding rounds dataset...")
for chunk in pd.read_csv('/Users/vedang/Desktop/crunchbase/crunchbase_funding_rounds_global.csv', chunksize=chunksize, usecols=['Announced Date', 'Amount Raised (USD)', 'Investment Type']):
    chunk = chunk.dropna(subset=['Announced Date'])
    chunk['Year'] = chunk['Announced Date'].str.extract(r'\b(19\d{2}|20\d{2})\b').fillna(0).astype(int)
    chunk = chunk[chunk['Year'] >= 2015]
    
    for idx, row in chunk.iterrows():
        y = row['Year']
        amt = parse_amount(row['Amount Raised (USD)'])
        itype = str(row['Investment Type']).strip().lower()
        
        years_total[y] += 1
        if amt > 0:
            amount_total[y] += amt
            round_sizes_by_year[y].append(amt)
            
            # Exact Stage matching
            if itype in stages_mapping:
                rounds_by_stage_year[itype][y] += 1
                amount_by_stage_year[itype][y] += amt
                sizes_by_stage_year[itype][y].append(amt)

print("\n=== Global Funding Overview (2015-2026) ===")
stats_output = []
for y in sorted(years_total.keys()):
    if y >= 2015 and y <= 2026:
        sizes = round_sizes_by_year[y]
        avg_size = np.mean(sizes) if len(sizes) > 0 else 0
        med_size = np.median(sizes) if len(sizes) > 0 else 0
        gini = calculate_gini(sizes)
        
        y_stats = {
            'year': int(y),
            'rounds': int(years_total[y]),
            'total_raised': float(amount_total[y]),
            'avg_round': float(avg_size),
            'med_round': float(med_size),
            'gini': float(gini)
        }
        stats_output.append(y_stats)
        
        print(f"Year {y}: {years_total[y]:,} rounds, Total Raised: ${amount_total[y]/1e9:.2f}B, "
              f"Median: ${med_size/1e6:.2f}M, Gini Concentration: {gini:.3f}")

# Compile Stage Details
stage_output = {}
for stage in stages:
    pretty_name = stages_mapping[stage]
    print(f"\n=== {pretty_name} Stats by Year ===")
    stage_output[pretty_name] = []
    for y in sorted(years_total.keys()):
        if y >= 2015 and y <= 2026:
            r_count = rounds_by_stage_year[stage][y]
            r_amount = amount_by_stage_year[stage][y]
            sizes = sizes_by_stage_year[stage][y]
            med_size = np.median(sizes) if len(sizes) > 0 else 0
            
            stage_stats = {
                'year': int(y),
                'rounds': int(r_count),
                'total_raised': float(r_amount),
                'med_round': float(med_size)
            }
            stage_output[pretty_name].append(stage_stats)
            
            print(f"  Year {y}: {r_count:,} rounds, Total: ${r_amount/1e9:.2f}B, Median: ${med_size/1e6:.2f}M")

# Save outputs to clean JSON
import json
output_payload = {
    'global_overview': stats_output,
    'stages': stage_output
}
with open('src/lib/crunchbase-funding-thesis-raw.json', 'w') as f:
    json.dump(output_payload, f, indent=2)

print("\nData exported successfully to src/lib/crunchbase-funding-thesis-raw.json")
