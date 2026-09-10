"""Article SVG charts for veda.ng/agentready. House style: white bg,
#37352f text, #e3e3e0 borders. Data matches the research paper corpus.
Run with /usr/bin/python3 (system matplotlib).
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path("/Users/vedang/ZCodeProject/vedang-website/public/images/essays")
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 13,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.edgecolor": "#e3e3e0",
    "text.color": "#37352f",
    "axes.labelcolor": "#37352f",
    "xtick.color": "#37352f",
    "ytick.color": "#37352f",
})

def save(fig, name):
    fig.patch.set_facecolor("white")
    fig.tight_layout(pad=1.4)
    fig.savefig(OUT / name, format="svg")
    plt.close(fig)
    print("wrote", name)

# 0. Census summary
fig = plt.figure(figsize=(9, 3.4))
fig.text(0.08, 0.84, "Agent-Readiness Census", fontsize=19, fontweight="bold")
fig.text(0.08, 0.75, "50,000 domains from the Tranco top-1M sample, tested with 61 deterministic checks", fontsize=12, color="#555555")
fig.add_artist(plt.Line2D([0.08, 0.92], [0.67, 0.67], color="#37352f", linewidth=0.8))
for x, value, label in [
    (0.08, "25.7 / 100", "Mean readiness score"),
    (0.38, "6.62%", "Valid llms.txt files"),
    (0.66, "1.82%", "Live MCP endpoints"),
]:
    fig.text(x, 0.45, value, fontsize=24, fontweight="bold")
    fig.text(x, 0.34, label, fontsize=11, color="#555555")
save(fig, "agentready-hero.svg")

# 1. Adoption bars (11 headline checks)
checks = [
    ("robots.txt AI policy", 43.76),
    ("Both bot identities served", 37.82),
    ("JSON-LD structured data", 21.37),
    ("Author E-E-A-T signals", 13.82),
    ("llms.txt catalog", 6.62),
    ("security.txt", 4.58),
    ("Markdown negotiation", 2.95),
    ("Live MCP server", 1.82),
    ("OpenAPI spec", 0.16),
    ("Machine payments", 0.33),
]
labels = [c for c, _ in checks][::-1]
vals = [v for _, v in checks][::-1]
fig, ax = plt.subplots(figsize=(9, 5.2))
ax.barh(labels, vals, color="#4f6fb5", height=0.62)
ax.set_xlabel("Share of 50,000 domains (%)")
for i, v in enumerate(vals):
    ax.text(v + 0.6, i, f"{v:.2f}%", va="center", fontsize=11)
ax.set_xlim(0, max(vals) * 1.32)
save(fig, "agentready-adoption.svg")

# 2. Tier means
tiers = ["Ranks 1-10k", "Ranks 10k-100k", "Ranks 100k-1M"]
means = [26.1, 25.2, 25.9]
refused = [56.2, 55.6, 52.2]
x = range(3)
fig, ax1 = plt.subplots(figsize=(9, 4.6))
ax1.bar([i - 0.2 for i in x], means, width=0.4, color="#4f6fb5", label="Mean score")
ax1.set_ylabel("Mean score (0-100)")
ax1.set_xticks(list(x))
ax1.set_xticklabels(tiers)
ax1.set_ylim(0, 32)
ax2 = ax1.twinx()
ax2.bar([i + 0.2 for i in x], refused, width=0.4, color="#d98a3d", label="Both-bot refusal %")
ax2.set_ylabel("Refusal (%)")
ax2.set_ylim(0, 100)
for i, (m, r) in enumerate(zip(means, refused)):
    ax1.text(i - 0.2, m + 0.5, f"{m:.1f}", ha="center", fontsize=11)
    ax2.text(i + 0.2, r + 1.2, f"{r:.1f}%", ha="center", fontsize=11)
save(fig, "agentready-tiers.svg")

# 3. Policy vs behavior
cats = ["Policy allows", "Policy partial", "No AI policy"]
serves = [67.2, 28.4, 13.0]
partial = [11.7, 5.8, 4.6]
refuses = [21.1, 65.8, 82.4]
x = range(3)
w = 0.24
fig, ax = plt.subplots(figsize=(9, 4.6))
ax.bar([i - w for i in x], serves, width=w, color="#5da86f", label="HTTP serves")
ax.bar(x, partial, width=w, color="#d98a3d", label="HTTP partial")
ax.bar([i + w for i in x], refuses, width=w, color="#c0392b", label="HTTP refuses")
ax.set_xticks(list(x))
ax.set_xticklabels(cats)
ax.set_ylabel("Share of row group (%)")
ax.set_ylim(0, 100)
ax.legend(frameon=False, fontsize=11)
save(fig, "agentready-policy.svg")
