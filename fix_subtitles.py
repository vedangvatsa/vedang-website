#!/usr/bin/env python3
"""
Fix subtitle/title text in bar chart race HTML compositions.
Processes BOTH the source repo and the scratch directory.
"""
import os

DIRS = [
    "/Users/vedang/vedang-website/data-viz-videos-repo/hyperframes/compositions",
    "/Users/vedang/.gemini/antigravity/scratch/data-viz-videos/hyperframes/compositions",
]

# Each entry: (filename, [(old_string, new_string), ...])
REPLACEMENTS = [
    ("active-satellites.html", [
        ('class="meta">Active Satellites in Orbit (1970–2024)<', 'class="meta">Total Operational Satellites in Orbit<'),
    ]),
    ("annual-births.html", [
        ('class="meta">Total Annual Births (Millions)<', 'class="meta">Live Births per Year by Country<'),
    ]),
    ("arms-imports.html", [
        ('class="meta">Value of Weapons and Arms Imports (SIPRI TIV)<', 'class="meta">Conventional Arms Transfer Value (SIPRI TIV)<'),
    ]),
    ("billionaires.html", [
        ('class="meta">Total Number of Billionaires<', 'class="meta">Individuals with Net Worth Over $1B<'),
    ]),
    ("external-debt.html", [
        ('class="meta">Total External Debt Stock (USD)<', 'class="meta">Debt Owed to Foreign Creditors (USD)<'),
    ]),
    ("forest-area.html", [
        ('class="meta">Total Forest Area in Square Kilometers<', 'class="meta">Land Under Natural or Planted Forest (km²)<'),
    ]),
    ("grain-production.html", [
        ('class="meta">Cereal Production (Metric Tons)<', 'class="meta">Annual Grain Harvest (Metric Tons)<'),
    ]),
    ("hospital-beds.html", [
        ('class="meta">Hospital Beds per 1,000 People<', 'class="meta">Inpatient Beds per 1,000 Population<'),
    ]),
    ("life-expectancy.html", [
        ('class="meta">Average Life Expectancy at Birth<', 'class="meta">Average Years Lived at Birth<'),
    ]),
    ("military-race.html", [
        ('class="main-title">Military Spending<', 'class="main-title">Defense Spending<'),
        ('class="meta">Military Spending by Country (1980–2024)<', 'class="meta">Defense Expenditure by Country (1980–2024)<'),
    ]),
    ("national-debt.html", [
        ('class="meta">Central Government Debt (% of GDP)<', 'class="meta">Central Government Debt-to-GDP Ratio<'),
    ]),
    ("oil-production.html", [
        ('class="meta">Oil Production (Million Barrels per Day)<', 'class="meta">Crude Output (Million Barrels/Day)<'),
    ]),
    ("patent-applications.html", [
        ('class="meta">Resident Patent Applications<', 'class="meta">Domestic Patent Filings by Country<'),
    ]),
    ("tourism-spending.html", [
        ('class="meta">International Tourism Receipts (USD)<', 'class="meta">Revenue from Inbound Visitors (USD)<'),
    ]),
]

total_changes = 0
errors = []

for comp_dir in DIRS:
    print(f"\n{'='*60}")
    print(f"Processing: {comp_dir}")
    print(f"{'='*60}")

    if not os.path.isdir(comp_dir):
        print(f"  ⚠️  Directory not found, skipping!")
        continue

    for filename, subs in REPLACEMENTS:
        filepath = os.path.join(comp_dir, filename)
        if not os.path.isfile(filepath):
            print(f"  ⚠️  {filename} not found, skipping")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False
        for old, new in subs:
            if old in content:
                content = content.replace(old, new)
                changed = True
                total_changes += 1
                print(f"  ✅ {filename}: replaced")
                print(f"     OLD: ...{old[15:]}...")
                print(f"     NEW: ...{new[15:]}...")
            else:
                # Check if already replaced
                if new in content:
                    print(f"  ℹ️  {filename}: already has new text, skipping")
                else:
                    msg = f"  ❌ {filename}: old text NOT FOUND"
                    print(msg)
                    errors.append(msg)

        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print(f"\n{'='*60}")
print(f"Total replacements made: {total_changes}")
if errors:
    print(f"Errors: {len(errors)}")
    for e in errors:
        print(f"  {e}")
else:
    print("No errors!")
print(f"{'='*60}")
