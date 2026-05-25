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

print("Loading Global Funding Rounds for semantic description analysis...")
chunksize = 100000

# Define semantic themes and matching keywords
themes = {
    'GenAI & LLMs': r'(generative ai|llm|large language|transformer|co-pilot|diffusion model|neural network|chatgpt|openai|anthropic)',
    'Enterprise SaaS': r'(saas|cloud software|enterprise platform|b2b software|workflow automation|crm|erp|api infrastructure)',
    'Climate & GreenTech': r'(climate tech|renewable|solar|green energy|battery storage|decarbonization|electric vehicle|ev |sustainability)',
    'Web3 & Ledger': r'(blockchain|web3|decentralized|smart contract|crypto|bitcoin|ethereum|defi|stablecoin|tokenization)',
    'DeepTech & Hardware': r'(quantum computing|semiconductor|silicon|robotics|space tech|autonomous drone|hardware design|edge compute)',
    'Consumer & Marketplace': r'(marketplace|e-commerce|consumer brand|retail tech|direct-to-consumer|dtc|foodtech|mobility)'
}

# Compile regex patterns
patterns = {name: re.compile(pat, re.IGNORECASE) for name, pat in themes.items()}

# Trackers
theme_counts = defaultdict(int)
theme_amounts = defaultdict(list)
theme_locations = defaultdict(list)
theme_investor_counts = defaultdict(list)
theme_valuations = defaultdict(list)

# Stage-specific check sizes per theme
# Structure: theme -> stage -> list of check sizes
theme_stage_sizes = {theme: {stage: [] for stage in ['seed', 'series_a', 'series_b']} for theme in themes}

print("Scanning records and matching descriptions...")
for chunk in pd.read_csv('/Users/vedang/Desktop/crunchbase/crunchbase_funding_rounds_global.csv', chunksize=chunksize, usecols=['Company Description', 'Company Categories', 'Amount Raised (USD)', 'Pre-Money Valuation (USD)', 'Company Location', 'Number of Investors', 'Investment Type']):
    
    # Fill NaN for text columns
    chunk['Company Description'] = chunk['Company Description'].fillna('')
    chunk['Company Categories'] = chunk['Company Categories'].fillna('')
    chunk['Combined Text'] = chunk['Company Description'] + ' ' + chunk['Company Categories']
    chunk['Investment Type'] = chunk['Investment Type'].fillna('').str.strip().str.lower()
    
    for idx, row in chunk.iterrows():
        text = row['Combined Text']
        if not text:
            continue
            
        amt = parse_amount(row['Amount Raised (USD)'])
        val = parse_amount(row['Pre-Money Valuation (USD)'])
        loc = str(row['Company Location']).strip()
        itype = row['Investment Type']
        
        # Parse number of investors
        try:
            inv_count = int(row['Number of Investors'])
        except:
            inv_count = None
            
        # Match themes
        matched_any = False
        for theme_name, pattern in patterns.items():
            if pattern.search(text):
                theme_counts[theme_name] += 1
                matched_any = True
                
                if amt > 0:
                    theme_amounts[theme_name].append(amt)
                    if itype in ['seed', 'series_a', 'series_b']:
                        theme_stage_sizes[theme_name][itype].append(amt)
                        
                if val > 0:
                    theme_valuations[theme_name].append(val)
                    
                if loc and loc != 'nan':
                    theme_locations[theme_name].append(loc)
                    
                if inv_count is not None and inv_count > 0:
                    theme_investor_counts[theme_name].append(inv_count)

print("\n=== Semantic Description Analysis Results ===")
semantic_output = {}

for theme in themes:
    count = theme_counts[theme]
    amts = theme_amounts[theme]
    vals = theme_valuations[theme]
    locs = theme_locations[theme]
    invs = theme_investor_counts[theme]
    
    avg_amt = np.mean(amts) if len(amts) > 0 else 0
    med_amt = np.median(amts) if len(amts) > 0 else 0
    med_val = np.median(vals) if len(vals) > 0 else 0
    avg_inv = np.mean(invs) if len(invs) > 0 else 0
    
    # Get top locations
    from collections import Counter
    top_locs = [x[0] for x in Counter(locs).most_common(3)]
    
    print(f"\nSector: {theme}")
    print(f"  Total matched transactions: {count:,}")
    print(f"  Median funding amount raised: ${med_amt/1e6:.2f}M")
    if med_val > 0:
        print(f"  Median pre-money valuation: ${med_val/1e6:.2f}M")
    print(f"  Average number of investors per round: {avg_inv:.1f}")
    print(f"  Primary geographic hubs: {', '.join(top_locs)}")
    
    # Stage specifics
    stage_medians = {}
    for stage in ['seed', 'series_a', 'series_b']:
        sizes = theme_stage_sizes[theme][stage]
        m = np.median(sizes) if len(sizes) > 0 else 0
        stage_medians[stage] = float(m)
        print(f"    Median {stage.upper()}: ${m/1e6:.2f}M")
        
    semantic_output[theme] = {
        'total_rounds': int(count),
        'med_round_size': float(med_amt),
        'med_valuation': float(med_val),
        'avg_investors': float(avg_inv),
        'top_locations': top_locs,
        'stages': stage_medians
    }

# Export results
import json
with open('src/lib/global-funding-semantic-raw.json', 'w') as f:
    json.dump(semantic_output, f, indent=2)

print("\nSemantic analysis exported successfully to src/lib/global-funding-semantic-raw.json")
