#!/usr/bin/env python3
"""Fix SHORT maps, source attributions, and subtitles across ALL compositions."""
import os, re, glob, shutil

DIRS = [
    "/Users/vedang/vedang-website/data-viz-videos-repo/hyperframes/compositions",
    "/Users/vedang/.gemini/antigravity/scratch/data-viz-videos/hyperframes/compositions",
]

# ── 1. COMPREHENSIVE SHORT MAP ──────────────────────────────────────────
# Every entity name > 14 chars needs an entry here
FULL_SHORT = {
    "United States": "USA",
    "United Kingdom": "UK",
    "South Korea": "S. Korea",
    "Saudi Arabia": "Saudi",
    "New Zealand": "N. Zealand",
    "United Arab Emirates": "UAE",
    "Russian Federation": "Russia",
    "Czech Republic": "Czechia",
    "American Airlines": "American AL",
    "United Airlines": "United AL",
    "Turkish Airlines": "Turkish AL",
    "Lord of the Rings": "LOTR",
    "Bernard Arnault": "Arnault",
    "Mark Zuckerberg": "Zuckerberg",
    "Sora (AI Video)": "Sora",
    "Midjourney (AI Image)": "Midjourney",
    "South Africa": "S. Africa",
}

# Build the JS object string
short_js_pairs = ', '.join(f'"{k}": "{v}"' for k, v in FULL_SHORT.items())
NEW_SHORT_LINE = f'const SHORT = {{{short_js_pairs}}};'

# ── 2. CORRECT SOURCE ATTRIBUTIONS ─────────────────────────────────────
# Only attribute sources we are SURE about.
# World Bank compositions: keep "Source: World Bank"
# Non-WB: use the correct source, or a generic safe attribution
CORRECT_SOURCES = {
    # World Bank API data (batch_fetch.py indicators) - these are correct
    "foreign-reserves": "Source: World Bank",
    "national-debt": "Source: World Bank",
    "net-migration": "Source: World Bank",
    "patent-applications": "Source: World Bank (WIPO)",
    "life-expectancy": "Source: World Bank",
    "manufacturing-output": "Source: World Bank",
    "goods-exports": "Source: World Bank",
    "rnd-spending": "Source: World Bank (UNESCO)",
    "grain-production": "Source: World Bank (FAO)",
    "homicide-rate": "Source: World Bank (UNODC)",
    "infant-mortality": "Source: World Bank",
    "military-personnel": "Source: World Bank (IISS)",
    "agricultural-land": "Source: World Bank (FAO)",
    "renewable-electricity": "Source: World Bank (IEA)",
    "forest-area": "Source: World Bank (FAO)",
    "hospital-beds": "Source: World Bank (WHO)",
    "external-debt": "Source: World Bank",
    "tourism-spending": "Source: World Bank (UNWTO)",
    "co2-emissions": "Source: World Bank (CDIAC)",
    "population-race": "Source: World Bank",
    "urbanization": "Source: World Bank",
    "birthrate": "Source: World Bank",
    "annual-births": "Source: World Bank",
    "internet-users": "Source: World Bank (ITU)",
    "oil-production": "Source: World Bank (EIA)",
    "steel-production": "Source: World Bank",
    "gold-reserves": "Source: World Bank (IMF)",
    "inflation-race": "Source: World Bank / IMF",
    "gdp-bar-race": "Source: World Bank / IMF",
    "gdp-bar-race-v2": "Source: World Bank / IMF",
    # Non-World-Bank compositions - use correct/safe sources
    "arms-imports": "Source: SIPRI Arms Transfers Database",
    "military-race": "Source: SIPRI",
    "military-spending": "Source: SIPRI",
    "nuclear-warheads": "Source: SIPRI / FAS",
    "active-satellites": "Source: UCS Satellite Database",
    "airlines": "Source: World Bank (ICAO)",
    "billionaires": "Source: Forbes",
    "richest-people": "Source: Forbes / Bloomberg",
    "car-sales": "Source: OICA",
    "console-race": "Source: Company Reports",
    "crypto-cap": "Source: CoinGecko",
    "ev-sales": "Source: IEA Global EV Data",
    "fifa-rankings": "Source: FIFA",
    "movie-franchises": "Source: Box Office Mojo",
    "music-streaming": "Source: Company Reports / IFPI",
    "olympic-golds": "Source: IOC",
    "prog-languages": "Source: TIOBE Index",
    "renewables": "Source: IRENA",
    "smartphone-share": "Source: IDC / Counterpoint",
    "social-race": "Source: Company Earnings Reports",
    "space-launches": "Source: Space Launch Report",
    "studio-revenue": "Source: Box Office Mojo",
    "techcap-race": "Source: CompaniesMarketCap",
    "tourism": "Source: World Bank (UNWTO)",
    "web3-jobs-race": "Source: Industry Data",
    "chokepoint": "Source: TrendForce",
    "scale-shock": "Source: IEA / SemiAnalysis",
}

# ── 3. PROCESS ALL FILES ───────────────────────────────────────────────
total_short_fixes = 0
total_source_fixes = 0

for comp_dir in DIRS:
    if not os.path.isdir(comp_dir):
        print(f"⚠️  Skipping missing dir: {comp_dir}")
        continue
    
    files = sorted(glob.glob(os.path.join(comp_dir, "*.html")))
    print(f"\n📁 Processing {len(files)} files in {comp_dir}")
    
    for fpath in files:
        fname = os.path.basename(fpath).replace(".html", "")
        with open(fpath, "r") as f:
            content = f.read()
        
        # Skip non-bar-race compositions
        if "rawData" not in content or "bar-fill" not in content:
            continue
        
        modified = False
        
        # ── Fix SHORT map ──
        short_m = re.search(r'const SHORT\s*=\s*\{[^}]*\};', content)
        if short_m:
            old_short = short_m.group(0)
            if old_short != f"const SHORT = {{{short_js_pairs}}};":
                # Only add entries that are relevant (entity exists in rawData)
                content = content.replace(old_short, NEW_SHORT_LINE)
                modified = True
                total_short_fixes += 1
        
        # ── Fix source attribution ──
        if fname in CORRECT_SOURCES:
            correct = CORRECT_SOURCES[fname]
            source_m = re.search(r'class="source">(.*?)<', content)
            if source_m:
                old_source = source_m.group(1)
                if old_source != correct:
                    content = content.replace(
                        f'class="source">{old_source}<',
                        f'class="source">{correct}<'
                    )
                    modified = True
                    total_source_fixes += 1
        
        if modified:
            with open(fpath, "w") as f:
                f.write(content)
            print(f"  ✅ Fixed: {fname}")

print(f"\n{'='*60}")
print(f"SHORT map fixes: {total_short_fixes}")
print(f"Source fixes:     {total_source_fixes}")
print(f"{'='*60}")
