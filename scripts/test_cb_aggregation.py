import pandas as pd
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

print('Loading Global Funding Rounds to extract actual capital inflows...')
chunksize = 100000
years_ai = defaultdict(int)
years_crypto = defaultdict(int)
amount_ai = defaultdict(float)
amount_crypto = defaultdict(float)

ai_pattern = re.compile(r'(artificial intelligence|machine learning| deep learning| neural network| generative ai| ai | llm )', re.IGNORECASE)
crypto_pattern = re.compile(r'(blockchain|cryptocurrency|crypto | bitcoin| ethereum| web3| smart contract| defi | nft )', re.IGNORECASE)

for chunk in pd.read_csv('/Users/vedang/Desktop/crunchbase/crunchbase_funding_rounds_global.csv', chunksize=chunksize, usecols=['Announced Date', 'Amount Raised (USD)', 'Company Categories']):
    chunk = chunk.dropna(subset=['Announced Date'])
    chunk['Year'] = chunk['Announced Date'].str.extract(r'\b(19\d{2}|20\d{2})\b').fillna(0).astype(int)
    chunk = chunk[chunk['Year'] >= 2015]
    
    # AI filter
    ai_mask = chunk['Company Categories'].fillna('').str.contains(ai_pattern)
    ai_df = chunk[ai_mask]
    for idx, row in ai_df.iterrows():
        y = row['Year']
        years_ai[y] += 1
        amount_ai[y] += parse_amount(row['Amount Raised (USD)'])

    # Crypto filter
    crypto_mask = chunk['Company Categories'].fillna('').str.contains(crypto_pattern)
    crypto_df = chunk[crypto_mask]
    for idx, row in crypto_df.iterrows():
        y = row['Year']
        years_crypto[y] += 1
        amount_crypto[y] += parse_amount(row['Amount Raised (USD)'])

print('\n=== AI Funding Rounds and Capital Inflow ===')
for y in sorted(years_ai.keys()):
    if y >= 2015 and y <= 2026:
        print(f'Year {y}: {years_ai[y]:,} rounds, Total Raised: ${amount_ai[y]/1e9:.2f}B')

print('\n=== Crypto/Blockchain Funding Rounds and Capital Inflow ===')
for y in sorted(years_crypto.keys()):
    if y >= 2015 and y <= 2026:
        print(f'Year {y}: {years_crypto[y]:,} rounds, Total Raised: ${amount_crypto[y]/1e9:.2f}B')
