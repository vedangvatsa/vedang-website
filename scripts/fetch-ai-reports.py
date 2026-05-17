#!/usr/bin/env python3
"""Fetch AI/ML papers from OpenAlex to reach 20k+."""

import json, time, ssl
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError
from pathlib import Path

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

OUTPUT = Path(__file__).parent.parent / "src/lib/ai-reports-data-generated.json"

QUERIES = [
    "artificial intelligence", "machine learning", "deep learning",
    "neural network", "natural language processing", "NLP",
    "computer vision", "reinforcement learning", "generative AI",
    "large language model", "LLM", "transformer architecture",
    "GPT", "BERT language model", "ChatGPT",
    "diffusion model", "stable diffusion", "image generation",
    "text generation", "speech recognition", "object detection",
    "image segmentation", "semantic segmentation", "image classification",
    "sentiment analysis", "text classification", "question answering",
    "named entity recognition", "machine translation",
    "autonomous driving", "self-driving car", "robotics AI",
    "convolutional neural network", "recurrent neural network",
    "attention mechanism", "self-attention",
    "transfer learning", "few-shot learning", "zero-shot learning",
    "meta-learning", "federated learning", "continual learning",
    "knowledge distillation", "model compression", "neural pruning",
    "explainable AI", "interpretable machine learning",
    "AI fairness", "algorithmic bias", "adversarial machine learning",
    "data augmentation", "synthetic data generation",
    "multimodal AI", "vision language model", "visual question answering",
    "graph neural network", "knowledge graph", "word embedding",
    "recommendation system", "collaborative filtering",
    "anomaly detection machine learning", "predictive analytics AI",
    "AI ethics", "responsible AI", "AI safety", "AI alignment",
    "AI governance", "AI regulation", "AI policy",
    "generative adversarial network", "GAN image", "variational autoencoder",
    "contrastive learning", "self-supervised learning",
    "medical AI", "clinical machine learning", "AI healthcare",
    "AI drug discovery", "AI radiology", "AI pathology",
    "AI education", "AI tutoring", "intelligent tutoring system",
    "AI agent", "agentic AI", "retrieval augmented generation",
    "fine-tuning language model", "prompt engineering",
    "text-to-image generation", "speech synthesis", "voice cloning",
    "AI optimization", "hyperparameter optimization", "AutoML",
    "neural architecture search", "model selection",
    "AI cybersecurity", "AI threat detection",
    "AI supply chain", "AI manufacturing", "AI quality control",
    "AI climate", "AI sustainability", "AI energy",
    "AI finance", "AI trading", "algorithmic trading",
    "AI legal", "AI compliance", "legal AI",
    "natural language generation", "text summarization",
    "dialogue system", "chatbot AI", "conversational AI",
    "AI creativity", "AI music generation", "AI art",
    "AI video generation", "video understanding AI",
    "3D generation AI", "point cloud deep learning",
    "autonomous robot", "robot manipulation",
    "drone AI", "UAV artificial intelligence",
    "AI agriculture", "precision agriculture AI",
    "AI retail", "AI customer service",
    "AI human resources", "AI recruitment",
    "edge AI", "TinyML", "on-device AI",
    "AI chip", "neural processing unit", "AI accelerator",
    "foundation model", "pre-trained model",
    "instruction tuning", "RLHF", "reinforcement learning human feedback",
    "AI benchmark", "model evaluation",
    "AI transparency", "model interpretability",
    "causal AI", "causal inference machine learning",
    "time series forecasting AI", "time series prediction",
    "AI protein", "AlphaFold", "protein structure prediction",
    "AI materials science", "materials discovery AI",
    "quantum machine learning", "quantum AI",
    "neuromorphic computing", "spiking neural network",
    "AI simulation", "digital twin AI",
    "embodied AI", "embodied intelligence",
    "AI planning", "AI reasoning", "chain of thought",
    "multiagent AI", "multi-agent system",
    "AI code generation", "code LLM", "copilot AI",
    "AI testing", "AI debugging", "software engineering AI",
    "document AI", "OCR deep learning", "table extraction AI",
    "AI search", "neural information retrieval",
    "knowledge representation", "ontology AI",
    "Bayesian deep learning", "uncertainty estimation",
    "continual pretraining", "domain adaptation",
    "low-rank adaptation", "LoRA", "parameter efficient",
    "mixture of experts", "MoE architecture",
    "state space model", "Mamba architecture",
    "vision transformer", "ViT", "CLIP model",
    "segment anything", "SAM model",
    "whisper speech", "audio AI",
    "AI governance framework", "AI risk management",
]

AI_KEYWORDS = [
    'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
    'natural language', 'nlp', 'computer vision', 'reinforcement learning',
    'generative ai', 'large language model', 'llm', 'transformer',
    'gpt', 'bert', 'chatgpt', 'diffusion model', 'stable diffusion',
    'image generation', 'text generation', 'speech recognition',
    'object detection', 'image segmentation', 'semantic segmentation',
    'image classification', 'sentiment analysis', 'text classification',
    'question answering', 'named entity', 'machine translation',
    'autonomous', 'self-driving', 'robot', 'robotics',
    'convolutional', 'recurrent', 'attention mechanism', 'self-attention',
    'transfer learning', 'few-shot', 'zero-shot', 'meta-learning',
    'federated learning', 'continual learning', 'knowledge distillation',
    'explainable', 'interpretable', 'adversarial',
    'multimodal', 'vision language', 'visual question',
    'graph neural', 'knowledge graph', 'embedding',
    'recommendation', 'collaborative filtering',
    'anomaly detection', 'predictive', 'forecasting',
    'ai ethics', 'responsible ai', 'ai safety', 'ai alignment',
    'generative adversarial', 'gan', 'autoencoder',
    'contrastive learning', 'self-supervised',
    'ai-driven', 'ai-based', 'ai-powered', 'ai-enhanced',
    'intelligent system', 'cognitive computing',
    'neural', 'automl', 'hyperparameter',
    'feature extraction', 'representation learning',
    'classifier', 'classification', 'regression',
    'clustering', 'segmentation', 'detection',
    'fine-tuning', 'fine tuning', 'prompt engineering',
    'foundation model', 'pre-trained', 'pretrained',
    'language model', 'speech synthesis', 'voice',
    'ai agent', 'agentic', 'retrieval augmented',
    'optimization', 'gradient', 'backpropagation',
]


def categorize(title):
    t = title.lower()
    if any(k in t for k in ["nlp", "natural language", "text", "language model", "llm", "gpt", "bert", "chatgpt", "translation", "sentiment", "question answering"]):
        return "NLP & Language"
    if any(k in t for k in ["image", "vision", "object detection", "segmentation", "visual", "video", "3d"]):
        return "Computer Vision"
    if any(k in t for k in ["reinforcement", "robot", "autonomous", "self-driving", "agent", "planning"]):
        return "Robotics & RL"
    if any(k in t for k in ["medical", "health", "clinical", "drug", "radiology", "pathology", "protein"]):
        return "AI in Healthcare"
    if any(k in t for k in ["ethic", "bias", "fair", "safety", "alignment", "governance", "regulation", "responsible", "explainable", "interpretable"]):
        return "AI Ethics & Safety"
    if any(k in t for k in ["generative", "diffusion", "gan", "generation", "creative", "music", "art"]):
        return "Generative AI"
    if any(k in t for k in ["graph", "knowledge", "recommendation", "embedding"]):
        return "Knowledge & Graphs"
    return "ML Foundations"


def fetch(query, page=1, per_page=200, _retry=0):
    params = {
        "search": query, "page": page, "per_page": per_page,
        "select": "title,doi,publication_year,cited_by_count,id",
        "sort": "cited_by_count:desc",
    }
    url = f"https://api.openalex.org/works?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "AIReports/1.0 (mailto:v@example.com)", "Accept": "application/json"})
    try:
        with urlopen(req, timeout=30, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        results = []
        for w in data.get("results", []):
            title = w.get("title")
            if not title:
                continue
            doi = w.get("doi", "")
            results.append({
                "title": title, "source": "OpenAlex",
                "url": doi if doi else w.get("id", ""),
                "date": str(w.get("publication_year", "")),
                "category": categorize(title), "type": "Paper",
                "citations": w.get("cited_by_count", 0) or 0,
            })
        return results
    except HTTPError as e:
        if e.code == 429:
            print(f"    429 — waiting 30s (retry {_retry+1}/3)")
            time.sleep(30)
            if _retry < 3:
                return fetch(query, page, per_page, _retry+1)
            print(f"    Giving up after 3 retries")
            return []
        return []
    except Exception as e:
        print(f"    Error: {e}")
        return []


def is_ai(title):
    t = title.lower()
    return any(kw in t for kw in AI_KEYWORDS)


def main():
    papers = []
    seen = set()
    if OUTPUT.exists():
        with open(OUTPUT) as f:
            existing = json.load(f)
        for r in existing:
            seen.add(r["title"].lower().strip())
            papers.append(r)
        print(f"Loaded {len(existing)} existing")

    new = 0
    for i, q in enumerate(QUERIES):
        if len(papers) >= 20000:
            print(f"  Reached 20k!")
            break
        print(f"[{i+1}/{len(QUERIES)}] {q}")
        for page in range(1, 6):
            results = fetch(q, page=page, per_page=200)
            if not results:
                break
            added = 0
            for p in results:
                key = p["title"].lower().strip()
                if key not in seen and is_ai(p["title"]):
                    seen.add(key)
                    papers.append(p)
                    new += 1
                    added += 1
            print(f"    Page {page}: {len(results)} fetched, {added} new (total: {len(papers)})")
            time.sleep(1)
            if len(results) < 200 or len(papers) >= 20000:
                break
        if (i + 1) % 5 == 0:
            print(f"  → Checkpoint: {len(papers)} ({new} new)")
            papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
            with open(OUTPUT, "w") as f:
                json.dump(papers, f, indent=None)

    papers.sort(key=lambda x: (x.get("citations", 0), x.get("date", "")), reverse=True)
    with open(OUTPUT, "w") as f:
        json.dump(papers, f, indent=None)
    print(f"\nDone! Total: {len(papers)} ({new} new)")


if __name__ == "__main__":
    main()
