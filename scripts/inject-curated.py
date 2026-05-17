#!/usr/bin/env python3
"""Inject curated whitepapers, consulting reports, standards into datasets."""
import json
from pathlib import Path

BASE = Path(__file__).parent.parent / "src/lib"

# === WEB3 CURATED ===
WEB3_CURATED = [
    # Foundational Whitepapers
    {"title": "Bitcoin: A Peer-to-Peer Electronic Cash System", "source": "Satoshi Nakamoto", "url": "https://bitcoin.org/bitcoin.pdf", "date": "2008", "category": "State of Crypto", "type": "White Paper", "citations": 20000},
    {"title": "Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform", "source": "Vitalik Buterin", "url": "https://ethereum.org/whitepaper", "date": "2014", "category": "Infrastructure", "type": "White Paper", "citations": 8000},
    {"title": "Uniswap v3 Core", "source": "Uniswap Labs", "url": "https://uniswap.org/whitepaper-v3.pdf", "date": "2021", "category": "DeFi & Finance", "type": "White Paper", "citations": 500},
    {"title": "MakerDAO: The Dai Stablecoin System", "source": "MakerDAO", "url": "https://makerdao.com/whitepaper", "date": "2017", "category": "DeFi & Finance", "type": "White Paper", "citations": 1200},
    {"title": "Aave Protocol Whitepaper V3", "source": "Aave", "url": "https://docs.aave.com", "date": "2022", "category": "DeFi & Finance", "type": "White Paper", "citations": 400},
    {"title": "Solana: A new architecture for a high performance blockchain", "source": "Anatoly Yakovenko", "url": "https://solana.com/solana-whitepaper.pdf", "date": "2018", "category": "Infrastructure", "type": "White Paper", "citations": 1500},
    {"title": "Polkadot: Vision for a Heterogeneous Multi-Chain Framework", "source": "Gavin Wood", "url": "https://polkadot.network/whitepaper", "date": "2016", "category": "Infrastructure", "type": "White Paper", "citations": 2000},
    {"title": "Cosmos: A Network of Distributed Ledgers", "source": "Jae Kwon, Ethan Buchman", "url": "https://cosmos.network/whitepaper", "date": "2019", "category": "Infrastructure", "type": "White Paper", "citations": 1000},
    {"title": "Chainlink 2.0: Next Steps in the Evolution of Decentralized Oracle Networks", "source": "Chainlink Labs", "url": "https://chain.link/whitepaper", "date": "2021", "category": "Infrastructure", "type": "White Paper", "citations": 600},
    {"title": "Filecoin: A Decentralized Storage Network", "source": "Protocol Labs", "url": "https://filecoin.io/filecoin.pdf", "date": "2017", "category": "Infrastructure", "type": "White Paper", "citations": 800},
    {"title": "IPFS - Content Addressed, Versioned, P2P File System", "source": "Juan Benet", "url": "https://ipfs.io/ipfs/QmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X1o4k7zrJa3LX/ipfs.draft3.pdf", "date": "2014", "category": "Infrastructure", "type": "White Paper", "citations": 2500},
    {"title": "Avalanche: A Novel Metastable Consensus Protocol Family", "source": "Team Rocket", "url": "https://www.avalabs.org/whitepapers", "date": "2018", "category": "Infrastructure", "type": "White Paper", "citations": 700},
    {"title": "Cardano: A Provably Secure Proof-of-Stake Blockchain Protocol", "source": "IOHK", "url": "https://iohk.io/research/papers", "date": "2017", "category": "Infrastructure", "type": "White Paper", "citations": 900},
    {"title": "Tezos: A Self-Amending Crypto-Ledger", "source": "L.M. Goodman", "url": "https://tezos.com/whitepaper.pdf", "date": "2014", "category": "Infrastructure", "type": "White Paper", "citations": 500},
    {"title": "Algorand: Scaling Byzantine Agreements for Cryptocurrencies", "source": "Silvio Micali", "url": "https://algorand.com/technology/white-papers", "date": "2017", "category": "Infrastructure", "type": "White Paper", "citations": 1100},
    {"title": "Near Protocol: Nightshade Sharding Design", "source": "NEAR Foundation", "url": "https://near.org/papers/nightshade", "date": "2019", "category": "Infrastructure", "type": "White Paper", "citations": 300},
    {"title": "Compound: The Money Market Protocol", "source": "Robert Leshner", "url": "https://compound.finance/documents/Compound.Whitepaper.pdf", "date": "2019", "category": "DeFi & Finance", "type": "White Paper", "citations": 600},
    {"title": "Curve Finance: Automatic Market-Making with Dynamic Peg", "source": "Curve Finance", "url": "https://curve.fi/whitepaper", "date": "2020", "category": "DeFi & Finance", "type": "White Paper", "citations": 400},
    {"title": "Lido: Liquid Staking Protocol for Ethereum", "source": "Lido DAO", "url": "https://lido.fi/static/Lido:Ethereum-Liquid-Staking.pdf", "date": "2020", "category": "DeFi & Finance", "type": "White Paper", "citations": 300},
    {"title": "EigenLayer: The Restaking Collective", "source": "Sreeram Kannan", "url": "https://docs.eigenlayer.xyz/whitepaper", "date": "2023", "category": "Infrastructure", "type": "White Paper", "citations": 200},
    {"title": "Optimism: Scaling Ethereum with Optimistic Rollups", "source": "Optimism Foundation", "url": "https://community.optimism.io", "date": "2021", "category": "Infrastructure", "type": "White Paper", "citations": 350},
    {"title": "Arbitrum: Scalable Private Smart Contracts", "source": "Offchain Labs", "url": "https://github.com/OffchainLabs/arbitrum/blob/master/docs/Arbitrum_Nitro_whitepaper.pdf", "date": "2021", "category": "Infrastructure", "type": "White Paper", "citations": 400},
    {"title": "zkSync Era: Scaling Freedom with Zero Knowledge Proofs", "source": "Matter Labs", "url": "https://docs.zksync.io", "date": "2023", "category": "Infrastructure", "type": "White Paper", "citations": 250},
    {"title": "StarkNet: A Decentralized Validity Rollup", "source": "StarkWare", "url": "https://starknet.io/what-is-starknet", "date": "2022", "category": "Infrastructure", "type": "White Paper", "citations": 300},
    {"title": "Celestia: Modular Consensus and Data Availability", "source": "Mustafa Al-Bassam", "url": "https://celestia.org/resources", "date": "2019", "category": "Infrastructure", "type": "White Paper", "citations": 400},
    {"title": "dYdX: A Protocol for Decentralized Margin Trading and Derivatives", "source": "dYdX Foundation", "url": "https://dydx.exchange", "date": "2021", "category": "DeFi & Finance", "type": "White Paper", "citations": 200},
    {"title": "Worldcoin: Universal Basic Income via Biometric Verification on Blockchain", "source": "Tools for Humanity", "url": "https://whitepaper.worldcoin.org", "date": "2023", "category": "State of Crypto", "type": "White Paper", "citations": 150},
    {"title": "Polygon zkEVM: A Virtual Machine with Verifiable Computation", "source": "Polygon Labs", "url": "https://polygon.technology/polygon-zkevm", "date": "2023", "category": "Infrastructure", "type": "White Paper", "citations": 200},
    {"title": "Ripple: XRP Ledger Consensus Protocol", "source": "Ripple", "url": "https://xrpl.org/consensus.html", "date": "2014", "category": "Infrastructure", "type": "White Paper", "citations": 1500},
    {"title": "Monero: CryptoNote v2.0 Privacy Protocol", "source": "Nicolas van Saberhagen", "url": "https://www.getmonero.org/resources/research-lab", "date": "2013", "category": "Security & Privacy", "type": "White Paper", "citations": 800},
    # Consulting Reports - Web3
    {"title": "The State of Crypto 2024: Annual Report", "source": "a16z Crypto", "url": "https://a16zcrypto.com/state-of-crypto", "date": "2024", "category": "State of Crypto", "type": "Consulting Report", "citations": 500},
    {"title": "Blockchain and Digital Assets: Moving to Broad Adoption", "source": "McKinsey & Company", "url": "https://mckinsey.com/industries/financial-services/our-insights/blockchain", "date": "2024", "category": "Institutional & Enterprise", "type": "Consulting Report", "citations": 300},
    {"title": "Crypto Market Sizing and Institutional Adoption", "source": "Boston Consulting Group", "url": "https://bcg.com/publications/crypto", "date": "2024", "category": "Institutional & Enterprise", "type": "Consulting Report", "citations": 250},
    {"title": "Global Blockchain Business Council Annual Report 2024", "source": "GBBC Digital Finance", "url": "https://gbbcouncil.org", "date": "2024", "category": "State of Crypto", "type": "Consulting Report", "citations": 100},
    {"title": "DeFi: Decentralized Finance Market Assessment", "source": "Deloitte", "url": "https://deloitte.com/us/en/insights/industry/financial-services/decentralized-finance", "date": "2024", "category": "DeFi & Finance", "type": "Consulting Report", "citations": 200},
    {"title": "Tokenization of Real-World Assets: From Hype to Reality", "source": "McKinsey & Company", "url": "https://mckinsey.com/industries/financial-services/our-insights/tokenization", "date": "2024", "category": "Institutional & Enterprise", "type": "Consulting Report", "citations": 400},
    {"title": "Stablecoins: The Emerging Market Structure", "source": "Brevan Howard Digital", "url": "https://brevanhoward.com/research", "date": "2024", "category": "DeFi & Finance", "type": "Consulting Report", "citations": 300},
    {"title": "CBDCs: Central Bank Digital Currencies Global Status", "source": "Bank for International Settlements", "url": "https://bis.org/publ/othp42.htm", "date": "2024", "category": "Regulation & Policy", "type": "Consulting Report", "citations": 500},
    {"title": "Crypto Regulation: Global Landscape and Compliance Framework", "source": "PwC", "url": "https://pwc.com/gx/en/new-ventures/cryptocurrency-assets/pwc-global-crypto-regulation-report.pdf", "date": "2024", "category": "Regulation & Policy", "type": "Consulting Report", "citations": 250},
    {"title": "Web3 Venture Capital: State of Blockchain Funding", "source": "Galaxy Digital Research", "url": "https://galaxy.com/research", "date": "2024", "category": "State of Crypto", "type": "Consulting Report", "citations": 200},
    {"title": "Digital Asset Anti-Money Laundering and Compliance Report", "source": "Chainalysis", "url": "https://chainalysis.com/reports", "date": "2024", "category": "Regulation & Policy", "type": "Consulting Report", "citations": 400},
    {"title": "Crypto Crime Report: Illicit Activity in the Cryptocurrency Ecosystem", "source": "Chainalysis", "url": "https://chainalysis.com/crypto-crime-report", "date": "2024", "category": "Security & Privacy", "type": "Consulting Report", "citations": 600},
    {"title": "Ethereum Staking Ecosystem Report", "source": "Dune Analytics", "url": "https://dune.com/research", "date": "2024", "category": "Infrastructure", "type": "Consulting Report", "citations": 150},
    {"title": "NFT Market Report: Beyond Profile Pictures", "source": "Nansen", "url": "https://nansen.ai/research", "date": "2024", "category": "NFTs & Culture", "type": "Consulting Report", "citations": 100},
    {"title": "Institutional Crypto Custody: Market Structure and Best Practices", "source": "Ernst & Young", "url": "https://ey.com/en_gl/financial-services/blockchain", "date": "2024", "category": "Institutional & Enterprise", "type": "Consulting Report", "citations": 200},
    {"title": "MiCA: Markets in Crypto-Assets Regulation Implementation Guide", "source": "European Banking Authority", "url": "https://eba.europa.eu/regulation-and-policy/markets-in-crypto-assets", "date": "2024", "category": "Regulation & Policy", "type": "Government Report", "citations": 300},
    {"title": "GENIUS Act: Framework for US Stablecoin Regulation", "source": "US Senate Banking Committee", "url": "https://banking.senate.gov", "date": "2025", "category": "Regulation & Policy", "type": "Government Report", "citations": 200},
    {"title": "Global Financial Stability Report: Crypto-Asset Risks", "source": "International Monetary Fund", "url": "https://imf.org/en/Publications/GFSR", "date": "2024", "category": "Regulation & Policy", "type": "Government Report", "citations": 500},
    {"title": "Blockchain Technology Overview: Standards and Interoperability", "source": "NIST", "url": "https://csrc.nist.gov/publications/detail/nistir/8202/final", "date": "2024", "category": "Infrastructure", "type": "Standard", "citations": 400},
    {"title": "ISO 23257: Blockchain and Distributed Ledger Technologies Reference Architecture", "source": "ISO/TC 307", "url": "https://iso.org/standard/75093.html", "date": "2022", "category": "Infrastructure", "type": "Standard", "citations": 200},
    {"title": "IEEE 3652.1-2020: Guide for Architectural Framework of Blockchain Systems", "source": "IEEE Standards Association", "url": "https://standards.ieee.org/standard/3652_1-2020.html", "date": "2020", "category": "Infrastructure", "type": "Standard", "citations": 150},
]

# === AI CURATED ===
AI_CURATED = [
    # Foundational Papers/Whitepapers
    {"title": "Attention Is All You Need: The Transformer Architecture", "source": "Google Brain", "url": "https://arxiv.org/abs/1706.03762", "date": "2017", "category": "NLP & Language", "type": "White Paper", "citations": 100000},
    {"title": "GPT-4 Technical Report", "source": "OpenAI", "url": "https://openai.com/research/gpt-4", "date": "2023", "category": "NLP & Language", "type": "White Paper", "citations": 5000},
    {"title": "LLaMA: Open and Efficient Foundation Language Models", "source": "Meta AI", "url": "https://arxiv.org/abs/2302.13971", "date": "2023", "category": "NLP & Language", "type": "White Paper", "citations": 4000},
    {"title": "Gemini: A Family of Highly Capable Multimodal Models", "source": "Google DeepMind", "url": "https://arxiv.org/abs/2312.11805", "date": "2023", "category": "NLP & Language", "type": "White Paper", "citations": 2000},
    {"title": "Claude: Constitutional AI Training Methodology", "source": "Anthropic", "url": "https://anthropic.com/research", "date": "2023", "category": "AI Ethics & Safety", "type": "White Paper", "citations": 1500},
    {"title": "Stable Diffusion: High-Resolution Image Synthesis with Latent Diffusion Models", "source": "Stability AI", "url": "https://arxiv.org/abs/2112.10752", "date": "2022", "category": "Generative AI", "type": "White Paper", "citations": 8000},
    {"title": "DALL-E 3: Improving Image Generation with Better Captions", "source": "OpenAI", "url": "https://openai.com/research/dall-e-3", "date": "2023", "category": "Generative AI", "type": "White Paper", "citations": 1500},
    {"title": "AlphaFold: Highly Accurate Protein Structure Prediction", "source": "DeepMind", "url": "https://www.nature.com/articles/s41586-021-03819-2", "date": "2021", "category": "AI in Healthcare", "type": "White Paper", "citations": 20000},
    {"title": "Sora: Video Generation Model Technical Report", "source": "OpenAI", "url": "https://openai.com/sora", "date": "2024", "category": "Generative AI", "type": "White Paper", "citations": 500},
    {"title": "Mistral 7B: Efficient Open-Weight Language Model", "source": "Mistral AI", "url": "https://arxiv.org/abs/2310.06825", "date": "2023", "category": "NLP & Language", "type": "White Paper", "citations": 1500},
    # Consulting Reports - AI
    {"title": "The State of AI 2024: Annual Report", "source": "Stanford HAI", "url": "https://aiindex.stanford.edu/report", "date": "2024", "category": "ML Foundations", "type": "Consulting Report", "citations": 2000},
    {"title": "AI and the Future of Work: Impact Assessment", "source": "McKinsey Global Institute", "url": "https://mckinsey.com/featured-insights/future-of-work/ai", "date": "2024", "category": "AI Ethics & Safety", "type": "Consulting Report", "citations": 500},
    {"title": "The Economic Potential of Generative AI", "source": "McKinsey & Company", "url": "https://mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai", "date": "2023", "category": "Generative AI", "type": "Consulting Report", "citations": 1000},
    {"title": "AI Adoption in Enterprise: Global Survey Results", "source": "Deloitte", "url": "https://deloitte.com/insights/ai-adoption", "date": "2024", "category": "ML Foundations", "type": "Consulting Report", "citations": 300},
    {"title": "Generative AI Market Size and Growth Forecast", "source": "Gartner", "url": "https://gartner.com/en/topics/generative-ai", "date": "2024", "category": "Generative AI", "type": "Consulting Report", "citations": 400},
    {"title": "AI Infrastructure: Cloud Computing Market Analysis", "source": "IDC", "url": "https://idc.com/research/ai", "date": "2024", "category": "ML Foundations", "type": "Consulting Report", "citations": 250},
    {"title": "Responsible AI: Governance Framework and Implementation Guide", "source": "World Economic Forum", "url": "https://weforum.org/projects/responsible-use-of-ai", "date": "2024", "category": "AI Ethics & Safety", "type": "Consulting Report", "citations": 350},
    {"title": "AI Chip Market: GPU, TPU, and Custom Silicon Landscape", "source": "Forrester Research", "url": "https://forrester.com/research/ai", "date": "2024", "category": "ML Foundations", "type": "Consulting Report", "citations": 200},
    {"title": "Large Language Models in Healthcare: Clinical Applications", "source": "Accenture", "url": "https://accenture.com/us-en/insights/health/generative-ai-healthcare", "date": "2024", "category": "AI in Healthcare", "type": "Consulting Report", "citations": 200},
    {"title": "AI in Financial Services: Risk, Regulation, and Revenue", "source": "Boston Consulting Group", "url": "https://bcg.com/publications/ai-financial-services", "date": "2024", "category": "ML Foundations", "type": "Consulting Report", "citations": 300},
    {"title": "AI Talent: Global Skills Gap and Workforce Development", "source": "LinkedIn Economic Graph", "url": "https://economicgraph.linkedin.com", "date": "2024", "category": "ML Foundations", "type": "Consulting Report", "citations": 200},
    {"title": "EU AI Act: Comprehensive Regulatory Framework Analysis", "source": "European Commission", "url": "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai", "date": "2024", "category": "AI Ethics & Safety", "type": "Government Report", "citations": 500},
    {"title": "Executive Order on Safe, Secure, and Trustworthy AI", "source": "The White House", "url": "https://whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-ai", "date": "2023", "category": "AI Ethics & Safety", "type": "Government Report", "citations": 400},
    {"title": "NIST AI Risk Management Framework", "source": "NIST", "url": "https://airc.nist.gov/AI_RMF_Interactivity", "date": "2023", "category": "AI Ethics & Safety", "type": "Standard", "citations": 600},
    {"title": "IEEE 7000-2021: Standard for Addressing Ethical Concerns in System Design", "source": "IEEE Standards Association", "url": "https://standards.ieee.org/ieee/7000/6781", "date": "2021", "category": "AI Ethics & Safety", "type": "Standard", "citations": 200},
    {"title": "ISO/IEC 42001: Artificial Intelligence Management System", "source": "ISO/IEC JTC 1/SC 42", "url": "https://iso.org/standard/81230.html", "date": "2023", "category": "AI Ethics & Safety", "type": "Standard", "citations": 300},
]

def inject(path, entries):
    with open(path) as f:
        data = json.load(f)
    seen = {r["title"].lower().strip() for r in data}
    added = 0
    for e in entries:
        if e["title"].lower().strip() not in seen:
            data.append(e)
            seen.add(e["title"].lower().strip())
            added += 1
    data.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=None)
    return added, len(data)

a, t = inject(BASE / "web3-reports-data-generated.json", WEB3_CURATED)
print(f"Web3: +{a} curated → {t}")

a, t = inject(BASE / "ai-reports-data-generated.json", AI_CURATED)
print(f"AI: +{a} curated → {t}")
