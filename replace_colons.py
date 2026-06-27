import os

ai_file = "/Users/vedang/.gemini/antigravity/scratch/vedang-website/src/content/essays/stateofai.mdx"
web3_file = "/Users/vedang/.gemini/antigravity/scratch/vedang-website/src/content/essays/stateofweb3.mdx"

with open(ai_file, "r") as f:
    ai_text = f.read()

ai_replacements = {
    "## I. Methodology: 5 Million Papers, One Open API": "## I. Methodology (5 Million Papers, One Open API)",
    "terms: *artificial intelligence": "terms. These terms are *artificial intelligence",
    "## II. The Empirical Map: What 5 Million Abstracts Reveal": "## II. The Empirical Map",
    "categories:": "categories.",
    "ratio is 3.9:1.": "ratio is 3.9 to 1.",
    "nuanced story: in 2025": "nuanced story. In 2025",
    "### Trigram Architecture: The Structural DNA": "### Trigram Architecture",
    "The critical signal: **\"large language model\"**": "The critical signal is that **\"large language model\"**",
    "searches suggest: 292,873 abstract mentions": "searches suggest. There are 292,873 abstract mentions",
    "## III. The LLM Inflection: 29.9x and Accelerating": "## III. The LLM Inflection",
    "For comparison, from 2022 to 2025:": "For comparison, from 2022 to 2025",
    "### The Fastest-Rising Keywords: All LLM, All the Time": "### The Fastest-Rising Keywords",
    "architecture:": "architecture.",
    "## IV. The Global Research Race: China Leads by Volume": "## IV. The Global Research Race",
    "(China: 12,074; US: 13,829)": "(China with 12,074 and US with 13,829)",
    "category: **\"large language model\"**": "category. **\"Large language model\"**",
    "### India: The Fastest-Growing Major Producer": "### India",
    "## V. The Citation Economy: Power Law Reality": "## V. The Citation Economy",
    "characteristic: they are all reusable building blocks": "characteristic. They are all reusable building blocks",
    "implications: the barrier": "implications. The barrier",
    "## VI. Strategic Implications: Three Imperatives": "## VI. Strategic Implications",
    "strategic imperatives:": "strategic imperatives."
}

for k, v in ai_replacements.items():
    ai_text = ai_text.replace(k, v)

with open(ai_file, "w") as f:
    f.write(ai_text)

with open(web3_file, "r") as f:
    web3_text = f.read()

web3_replacements = {
    "From 176 papers in 2013 to 20,668 in 2025: a **117x increase** in twelve years.": "From 176 papers in 2013 to 20,668 in 2025, there is a **117x increase** in twelve years.",
    "## I. Methodology: A 128,286-Paper Empirical Corpus": "## I. Methodology",
    "independent databases: **Crossref**": "independent databases. These are **Crossref**",
    "## II. The Research Map: What 128,286 Papers Reveal": "## II. The Research Map",
    "**Publication Volume & Milestone Timeline:**": "**Publication Volume & Milestone Timeline**",
    "The critical signal: **\"smart contract\"**": "The critical signal is that **\"smart contract\"**",
    "**Linguistic N-Gram Corpus Frequency Analyzer:**": "**Linguistic N-Gram Corpus Frequency Analyzer**",
    "research map:": "research map.",
    "- **Infrastructure Integration, Not Standalone Products:**": "- **Infrastructure Integration, Not Standalone Products.**",
    "- **Smart Contract Maturation:**": "- **Smart Contract Maturation.**",
    "- **Supply Chain Dominance:**": "- **Supply Chain Dominance.**",
    "- **The Blockchain-AI Convergence:**": "- **The Blockchain-AI Convergence.**",
    "- **Sovereign Digital Currencies:**": "- **Sovereign Digital Currencies.**",
    "fastest: **+163.9%**": "fastest at **+163.9%**",
    "deployment challenges: scalability": "deployment challenges like scalability",
    "## V. Post-Quantum Urgency: The Fastest-Rising Research Theme": "## V. Post-Quantum Urgency",
    "urgency is real: most blockchain systems rely": "urgency is real. Most blockchain systems rely",
    "research themes:": "research themes is below.",
    "fastest-rising terms:": "fastest-rising terms.",
    "1. **Post-Quantum Security:**": "1. **Post-Quantum Security.**",
    "2. **Scalability Infrastructure:**": "2. **Scalability Infrastructure.**",
    "3. **Institutional Adoption:**": "3. **Institutional Adoption.**",
    "4. **Core DeFi:**": "4. **Core DeFi.**",
    "confirm the pattern: \"NFT\"": "confirm the pattern. \"NFT\"",
    "notable: in most computer science": "notable. In most computer science",
    "contribute significantly: **Indonesia**": "contribute significantly. **Indonesia**",
    "## VIII. Strategic Implications: Three Imperatives": "## VIII. Strategic Implications",
    "institutional investors:": "institutional investors.",
    "corpus—82.7%": "corpus. 82.7%",
    "paper: \"Blockchain Research": "paper \"Blockchain Research"
}

for k, v in web3_replacements.items():
    web3_text = web3_text.replace(k, v)

with open(web3_file, "w") as f:
    f.write(web3_text)

print("Replacements applied successfully.")
