import os

ai_file = "/Users/vedang/.gemini/antigravity/scratch/vedang-website/src/content/essays/stateofai.mdx"
web3_file = "/Users/vedang/.gemini/antigravity/scratch/vedang-website/src/content/essays/stateofweb3.mdx"

with open(ai_file, "r") as f:
    ai_text = f.read()

ai_replacements = {
    "enterprise: not what": "enterprise. Not what",
    "method-level: neural network": "method-level. These are neural network",
    "application-level: image classification": "application-level. These are image classification",
    "inflection point: between 2018": "inflection point. Between 2018",
    "recency: papers published": "recency. Papers published",
    "clear: a tiny fraction": "clear. A tiny fraction",
    "(2013-2018: 734,197)": "(2013-2018 at 734,197)"
}

for k, v in ai_replacements.items():
    ai_text = ai_text.replace(k, v)

with open(ai_file, "w") as f:
    f.write(ai_text)

with open(web3_file, "r") as f:
    web3_text = f.read()

web3_replacements = {
    "eras: a Bitcoin-only": "eras. A Bitcoin-only",
    "Trends: A Bibliometric": "Trends - A Bibliometric",
    "telling: the Chinese": "telling. The Chinese"
}

for k, v in web3_replacements.items():
    web3_text = web3_text.replace(k, v)

with open(web3_file, "w") as f:
    f.write(web3_text)

print("Replacements applied successfully.")
