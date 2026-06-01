#!/usr/bin/env python3
"""Export AI & Web3 reports to organized Desktop folders."""
import json, os, csv
from collections import Counter

BASE = "/Users/vedang/Desktop/AI & Web3 Reports"

def load_data():
    with open("/Users/vedang/vedang-website/public/ai-reports-data.json") as f:
        ai = json.load(f)
    with open("/Users/vedang/vedang-website/public/web3-reports-data.json") as f:
        web3 = json.load(f)
    return ai, web3

def safe_dirname(name):
    return name.replace("&", "and").replace("/", "-").strip()

def write_category_csv(folder, reports):
    """Write a CSV index for a category."""
    os.makedirs(folder, exist_ok=True)
    csv_path = os.path.join(folder, "index.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Title", "Source", "URL", "Date", "Type", "Citations"])
        for r in sorted(reports, key=lambda x: x.get("date", ""), reverse=True):
            writer.writerow([
                r.get("title", ""),
                r.get("source", ""),
                r.get("url", ""),
                r.get("date", ""),
                r.get("type", ""),
                r.get("citations", ""),
            ])
    return len(reports)

def write_summary(path, domain, categories, total):
    """Write a README summary."""
    with open(path, "w") as f:
        f.write(f"# {domain} Reports Library\n\n")
        f.write(f"**Total Reports: {total:,}**\n\n")
        f.write("| Category | Count |\n")
        f.write("|----------|-------|\n")
        for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
            f.write(f"| {cat} | {count:,} |\n")
        f.write(f"\nEach subfolder contains an `index.csv` with all report metadata.\n")
        f.write(f"Open any CSV in Excel/Sheets. URLs link to the original source.\n")

def main():
    ai_data, web3_data = load_data()
    
    # ── AI Reports ──
    ai_dir = os.path.join(BASE, "AI Reports")
    ai_cats = {}
    for r in ai_data:
        cat = r.get("category", "Uncategorized")
        ai_cats.setdefault(cat, []).append(r)
    
    ai_counts = {}
    for cat, reports in ai_cats.items():
        folder = os.path.join(ai_dir, safe_dirname(cat))
        ai_counts[cat] = write_category_csv(folder, reports)
        print(f"  AI / {cat}: {len(reports):,} reports")
    
    write_summary(os.path.join(ai_dir, "README.md"), "AI", ai_counts, len(ai_data))
    
    # Also write the full JSON for power users
    with open(os.path.join(ai_dir, "all-ai-reports.json"), "w") as f:
        json.dump(ai_data, f)
    
    # ── Web3 Reports ──
    web3_dir = os.path.join(BASE, "Web3 Reports")
    web3_cats = {}
    for r in web3_data:
        cat = r.get("category", "Uncategorized")
        web3_cats.setdefault(cat, []).append(r)
    
    web3_counts = {}
    for cat, reports in web3_cats.items():
        folder = os.path.join(web3_dir, safe_dirname(cat))
        web3_counts[cat] = write_category_csv(folder, reports)
        print(f"  Web3 / {cat}: {len(reports):,} reports")
    
    write_summary(os.path.join(web3_dir, "README.md"), "Web3", web3_counts, len(web3_data))
    
    with open(os.path.join(web3_dir, "all-web3-reports.json"), "w") as f:
        json.dump(web3_data, f)
    
    # ── Master README ──
    total = len(ai_data) + len(web3_data)
    with open(os.path.join(BASE, "README.md"), "w") as f:
        f.write(f"# Research Library\n\n")
        f.write(f"**{total:,} reports** across AI and Web3 domains.\n\n")
        f.write(f"## Structure\n\n")
        f.write(f"```\n")
        f.write(f"AI & Web3 Reports/\n")
        f.write(f"  AI Reports/          ({len(ai_data):,} reports, {len(ai_cats)} categories)\n")
        for cat in sorted(ai_cats.keys()):
            f.write(f"    {safe_dirname(cat)}/\n")
        f.write(f"  Web3 Reports/        ({len(web3_data):,} reports, {len(web3_cats)} categories)\n")
        for cat in sorted(web3_cats.keys()):
            f.write(f"    {safe_dirname(cat)}/\n")
        f.write(f"```\n\n")
        f.write(f"Each category folder has an `index.csv` you can open in Excel or Google Sheets.\n")
        f.write(f"Full JSON dumps are in each domain folder for programmatic use.\n")
    
    print(f"\nDone! {total:,} reports exported to {BASE}")

if __name__ == "__main__":
    main()
