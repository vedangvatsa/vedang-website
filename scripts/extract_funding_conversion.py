import pandas as pd
import numpy as np
import json

print("Loading dataset in vectorized mode...")
df = pd.read_csv('/Users/vedang/Desktop/crunchbase/crunchbase_funding_rounds_global.csv', usecols=['Announced Date', 'Company URL', 'Investment Type'])
df = df.dropna(subset=['Announced Date', 'Company URL'])

print("Parsing dates vectorially...")
df['Date'] = pd.to_datetime(df['Announced Date'], errors='coerce')
df = df.dropna(subset=['Date'])
df['Year'] = df['Date'].dt.year

# Filter for years
df = df[df['Year'] >= 2015]

# Normalize investment type
df['Investment Type'] = df['Investment Type'].str.strip().str.lower()

# Filter for seed and series_a rounds
df = df[df['Investment Type'].isin(['seed', 'series_a'])]

print("Sorting and identifying chronological transitions...")
df = df.sort_values(by=['Company URL', 'Date'])

# Find the first seed round for each company
seeds = df[df['Investment Type'] == 'seed'].groupby('Company URL').first().reset_index()

# Find the first Series A round for each company
series_a = df[df['Investment Type'] == 'series_a'].groupby('Company URL').first().reset_index()

# Merge company rounds to find transitions
merged = pd.merge(seeds, series_a, on='Company URL', suffixes=('_seed', '_a'))

# Keep only those where series A date is strictly after seed date
merged = merged[merged['Date_a'] > merged['Date_seed']]

# Calculate transition gap
merged['Days'] = (merged['Date_a'] - merged['Date_seed']).dt.days
merged['Months'] = merged['Days'] / 30.44

# Keep reasonable transitions (under 5 years)
merged = merged[merged['Months'] <= 60]

print("Aggregating statistics...")
# Total seed count by year
all_seeds_by_year = df[df['Investment Type'] == 'seed'].groupby('Year').size().to_dict()
converted_by_year = merged.groupby('Year_seed').size().to_dict()
median_months_by_year = merged.groupby('Year_seed')['Months'].median().to_dict()
mean_months_by_year = merged.groupby('Year_seed')['Months'].mean().to_dict()

print("\n=== Seed-to-Series A Transition Stats by Cohort Year ===")
conversion_stats = []
for y in sorted(all_seeds_by_year.keys()):
    if y >= 2015 and y <= 2026:
        total = all_seeds_by_year[y]
        conv = converted_by_year.get(y, 0)
        pct = (conv / total) * 100 if total > 0 else 0
        med_dur = median_months_by_year.get(y, 0.0)
        mean_dur = mean_months_by_year.get(y, 0.0)
        
        y_stats = {
            'cohort_year': int(y),
            'total_seed_co': int(total),
            'converted_co': int(conv),
            'conversion_pct': float(pct),
            'avg_duration_months': float(mean_dur),
            'med_duration_months': float(med_dur)
        }
        conversion_stats.append(y_stats)
        
        print(f"Cohort Year {y}: {total:,} Seed companies, {conv:,} converted ({pct:.2f}%), "
              f"Median Transition Duration: {med_dur:.1f} months")

# Export to JSON
with open('src/lib/crunchbase-funding-conversion-raw.json', 'w') as f:
    json.dump(conversion_stats, f, indent=2)

print("\nData exported successfully to src/lib/crunchbase-funding-conversion-raw.json")
