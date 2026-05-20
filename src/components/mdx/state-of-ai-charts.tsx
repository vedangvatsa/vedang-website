'use client';

import * as React from 'react';
import { useState } from 'react';

// ============================================================
// ALL DATA BELOW: Fresh analysis on 133,847 documents from
// src/lib/ai-reports-data-generated.json (run: 2026-05-20)
// ============================================================

interface YearlyData {
  year: string;
  docs: number;
  growth: string;
  milestone: string;
}

interface TermFrequency {
  term: string;
  count: number;
  percent: number;
  context: string;
}

// Fresh yearly distribution from corpus (2015–2026 focus window)
const yearlyDataset: YearlyData[] = [
  { year: '2015', docs: 916, growth: '--', milestone: 'Early deep learning publications. ResNet introduced.' },
  { year: '2016', docs: 1229, growth: '+34.2%', milestone: 'AlphaGo victory. GAN research accelerates.' },
  { year: '2017', docs: 1721, growth: '+40.0%', milestone: 'Transformer architecture introduced (Vaswani et al.).' },
  { year: '2018', docs: 2415, growth: '+40.3%', milestone: 'BERT and GPT-1 launch. Transfer learning becomes standard.' },
  { year: '2019', docs: 3784, growth: '+56.7%', milestone: 'GPT-2 released. Few-shot capabilities demonstrated.' },
  { year: '2020', docs: 4742, growth: '+25.3%', milestone: 'GPT-3 launch. RAG architecture introduced (Lewis et al.).' },
  { year: '2021', docs: 6639, growth: '+40.0%', milestone: 'DALL-E, Codex. Multimodal AI research accelerates.' },
  { year: '2022', docs: 8433, growth: '+27.0%', milestone: 'ChatGPT launch (Nov). RLHF and instruction tuning emerge.' },
  { year: '2023', docs: 13841, growth: '+64.1%', milestone: 'GPT-4, Llama. Post-ChatGPT research explosion (+64%).' },
  { year: '2024', docs: 22289, growth: '+61.0%', milestone: 'Agentic frameworks emerge. MCP and A2A protocols.' },
  { year: '2025', docs: 33647, growth: '+50.9%', milestone: 'DeepSeek disrupts. Over 33K papers in a single year.' },
  { year: '2026', docs: 14234, growth: 'Partial', milestone: 'Jan–May partial. Autonomous agent deployment accelerates.' },
];

// Fresh unigram analysis (minimal stop words: function words only)
const unigramData: TermFrequency[] = [
  { term: 'learning', count: 32601, percent: 24.4, context: 'Dominant paradigm across all AI subdisciplines.' },
  { term: 'network', count: 14962, percent: 11.2, context: 'Neural networks as primary computational architecture.' },
  { term: 'neural', count: 14796, percent: 11.1, context: 'Neural architectures dominate model design.' },
  { term: 'detection', count: 11343, percent: 8.5, context: 'Applied computer vision: object and anomaly detection.' },
  { term: 'deep', count: 11007, percent: 8.2, context: 'Deep learning models for pattern recognition.' },
  { term: 'language', count: 8560, percent: 6.4, context: 'Natural language processing and LLMs.' },
  { term: 'intelligence', count: 8381, percent: 6.3, context: 'Artificial intelligence as foundational category.' },
  { term: 'generative', count: 7858, percent: 5.9, context: 'Generative models: GANs, diffusion, autoregressive.' },
  { term: 'recognition', count: 6706, percent: 5.0, context: 'Speech, image, and pattern recognition.' },
  { term: 'autonomous', count: 6289, percent: 4.7, context: 'Autonomous driving, agents, and systems.' },
];

// Fresh bigram analysis
const bigramData: TermFrequency[] = [
  { term: 'neural network', count: 11949, percent: 8.9, context: 'Foundation of modern deep learning architectures.' },
  { term: 'machine learning', count: 9765, percent: 7.3, context: 'Production-grade ML pipelines.' },
  { term: 'artificial intelligence', count: 7545, percent: 5.6, context: 'Broad AI research spanning all subdisciplines.' },
  { term: 'deep learning', count: 7030, percent: 5.3, context: 'Multi-layer neural networks for complex patterns.' },
  { term: 'reinforcement learning', count: 4597, percent: 3.4, context: 'Autonomous decision-making, robotics, navigation.' },
  { term: 'convolutional neural', count: 4477, percent: 3.3, context: 'Image classification and visual features (CNNs).' },
  { term: 'large language', count: 4391, percent: 3.3, context: 'LLM scaling: GPT, Llama, DeepSeek.' },
  { term: 'object detection', count: 4205, percent: 3.1, context: 'Industrial computer vision for logistics.' },
  { term: 'question answering', count: 3695, percent: 2.8, context: 'Reading comprehension and QA systems.' },
  { term: 'attention mechanism', count: 3657, percent: 2.7, context: 'Transformer architecture dominance.' },
];

// Fresh trigram analysis
const trigramData: TermFrequency[] = [
  { term: 'convolutional neural network', count: 4005, percent: 3.0, context: 'Image classification and visual feature extraction.' },
  { term: 'recurrent neural network', count: 3442, percent: 2.6, context: 'Sequence modeling, time-series, language.' },
  { term: 'natural language processing', count: 1546, percent: 1.2, context: 'Text understanding, generation, translation.' },
  { term: 'deep reinforcement learning', count: 1206, percent: 0.9, context: 'Robotics and control systems research.' },
  { term: 'visual question answering', count: 645, percent: 0.5, context: 'Multimodal reasoning over images.' },
  { term: 'automatic speech recognition', count: 581, percent: 0.4, context: 'Voice processing and transcription.' },
  { term: 'medical image segmentation', count: 454, percent: 0.3, context: 'Clinical diagnostics: radiology, pathology.' },
  { term: 'neural network model', count: 453, percent: 0.3, context: 'Generic neural architecture papers.' },
  { term: 'machine learning techniques', count: 440, percent: 0.3, context: 'Applied ML methodology papers.' },
  { term: 'deep learning models', count: 426, percent: 0.3, context: 'Production deep learning systems.' },
];

// Fresh momentum data (2025-2026 vs 2022-2023 cohort comparison)
const momentumData = [
  { term: 'agentic', count2026: 449, growth: 449.0, context: 'Autonomous multi-step execution by AI systems.' },
  { term: 'GPT-4o', count2026: 190, growth: 190.0, context: 'OpenAI multimodal flagship model.' },
  { term: 'RAG', count2026: 99, growth: 99.0, context: 'Retrieval-augmented generation for enterprise.' },
  { term: 'DeepSeek', count2026: 92, growth: 92.0, context: 'Open-weight models challenging proprietary labs.' },
  { term: 'gen', count2026: 86, growth: 86.0, context: 'Generation-related research (gen AI).' },
  { term: 'cloud-native', count2026: 76, growth: 76.0, context: 'Cloud-native AI deployment architectures.' },
  { term: 'LLM-based', count2026: 61, growth: 61.0, context: 'LLM-powered application systems.' },
];


// --- Timeline Component ---
export function StateOfAiTimeline() {
  const [selectedIndex, setSelectedIndex] = useState<number>(9);
  const selected = yearlyDataset[selectedIndex];

  const padding = 40;
  const width = 800;
  const height = 300;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const maxDocs = Math.max(...yearlyDataset.map(d => d.docs));
  const points = yearlyDataset.map((d, index) => {
    const x = padding + (index / (yearlyDataset.length - 1)) * graphWidth;
    const y = height - padding - (d.docs / maxDocs) * graphHeight;
    return { x, y, ...d };
  });

  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            Publication Volume &amp; Milestone Timeline (2015–2026)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click chart nodes to scrub years. Corpus: 133,847 documents from Crossref, arXiv, OpenAlex.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-semibold">
          Active Year: {selected.year}{selected.year === '2026' ? '*' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-muted/20 border border-border/50 rounded-xl p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="areaGradAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {Array.from({ length: 4 }).map((_, i) => {
                const yVal = padding + (i / 3) * graphHeight;
                return <line key={`grid-${i}`} x1={padding} y1={yVal} x2={width - padding} y2={yVal} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />;
              })}
              <path d={areaD} fill="url(#areaGradAI)" />
              <path d={pathD} fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="2.5" strokeLinejoin="round" />
              {points.map((p, i) => (
                <g key={i} onClick={() => setSelectedIndex(i)} className="cursor-pointer">
                  <circle cx={p.x} cy={p.y} r={i === selectedIndex ? 7 : 4.5} fill={i === selectedIndex ? 'hsl(217, 91%, 60%)' : 'hsl(var(--card))'} stroke="hsl(217, 91%, 60%)" strokeWidth={i === selectedIndex ? 2.5 : 1.5} className="transition-all duration-200" />
                  <text x={p.x} y={height - padding + 20} textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="monospace">{p.year.slice(2)}</text>
                </g>
              ))}
              {(() => {
                const sp = points[selectedIndex];
                return <line x1={sp.x} y1={sp.y + 8} x2={sp.x} y2={height - padding} stroke="hsl(217, 91%, 60%)" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />;
              })()}
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-2">
            <div className="text-3xl font-black tabular-nums text-foreground">{selected.docs.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Documents Published{selected.year === '2026' ? ' (Jan–May)' : ''}</div>
            <div className="text-xs font-mono font-bold text-blue-500">{selected.growth !== '--' && selected.growth !== 'Partial' ? `YoY: ${selected.growth}` : selected.growth === 'Partial' ? 'Partial Year' : 'Baseline Year'}</div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Milestone</p>
            <p className="text-xs text-foreground leading-relaxed">{selected.milestone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- N-gram Analyzer ---
export function StateOfAiNgramAnalyzer() {
  const [activeTab, setActiveTab] = useState<'unigrams' | 'bigrams' | 'trigrams'>('unigrams');
  const tabs = [
    { key: 'unigrams' as const, label: 'Keywords', data: unigramData },
    { key: 'bigrams' as const, label: 'Bigrams', data: bigramData },
    { key: 'trigrams' as const, label: 'Trigrams', data: trigramData },
  ];
  const activeData = tabs.find(t => t.key === activeTab)!.data;
  const maxCount = activeData[0].count;

  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Linguistic N-Gram Corpus Frequency Analyzer
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">Toggle between keywords, bigrams, and trigrams across 133,847 AI documents.</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === tab.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2.5">
        {activeData.map((item, i) => (
          <div key={item.term} className="group">
            <div className="flex items-center gap-3">
              <div className="w-6 text-right text-[10px] font-mono text-muted-foreground">{i + 1}</div>
              <div className={`${activeTab === 'trigrams' ? 'w-52' : activeTab === 'bigrams' ? 'w-40' : 'w-28'} text-right text-sm font-semibold text-foreground truncate`}>
                {item.term}
              </div>
              <div className="flex-1 relative">
                <div className="h-7 w-full rounded-full bg-secondary/60 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500/80 to-indigo-500/80 transition-all duration-700 ease-out" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                </div>
              </div>
              <div className="w-16 text-right text-xs font-bold tabular-nums text-foreground">{item.count.toLocaleString()}</div>
              <div className="w-12 text-right text-[10px] font-mono text-muted-foreground">{item.percent}%</div>
            </div>
            <div className="ml-9 pl-28 text-[10px] text-muted-foreground/70 mt-0.5 hidden group-hover:block transition-all">
              {item.context}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Momentum Chart ---
export function StateOfAiMomentum() {
  const maxGrowth = momentumData[0].growth;
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden space-y-5">
      <div>
        <h4 className="text-base font-bold text-foreground flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          Fastest-Rising Keywords (2025–2026 vs 2022–2023)
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">Growth ratio = count in 2025–2026 cohort ÷ max(count in 2022–2023, 1). Minimum 50 mentions.</p>
      </div>
      <div className="space-y-3">
        {momentumData.map((item) => (
          <div key={item.term} className="group">
            <div className="flex items-center gap-3">
              <div className="w-24 text-right text-sm font-bold text-foreground">{item.term}</div>
              <div className="flex-1 relative">
                <div className="h-8 w-full rounded-full bg-secondary/60 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/80 to-teal-500/80 transition-all duration-700 ease-out flex items-center justify-end pr-2" style={{ width: `${(item.growth / maxGrowth) * 100}%` }}>
                    <span className="text-[10px] font-black text-white/90 tabular-nums">{item.growth}x</span>
                  </div>
                </div>
              </div>
              <div className="w-14 text-right text-xs font-mono text-muted-foreground">{item.count2026}</div>
            </div>
            <div className="ml-9 pl-24 text-[10px] text-muted-foreground/70 mt-0.5 hidden group-hover:block">{item.context}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Backward-compatible exports ---
export function StateOfAiKeywordsChart() {
  return <StateOfAiNgramAnalyzer />;
}

export function StateOfAiBigramsChart() {
  return null; // Absorbed into NgramAnalyzer
}
