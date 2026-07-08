'use client';

import * as React from 'react';
import { useState } from 'react';

// ============================================================
// ALL DATA BELOW: Abstract-level analysis on 5,003,783 papers
// from OpenAlex (run: 2026-06-12). Source: state-of-ai-research-2026.md
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

// Annual publication volume from Table 2 (abstract-level corpus, 2013-2026)
const yearlyDataset: YearlyData[] = [
  { year: '2013', docs: 93226, growth: '--', milestone: 'Baseline year. Word2Vec published. Early deep learning research.' },
  { year: '2014', docs: 97510, growth: '+4.6%', milestone: 'GANs introduced (Goodfellow et al.). Steady incremental growth.' },
  { year: '2015', docs: 105609, growth: '+8.3%', milestone: 'ResNet introduced. Deep learning surpasses 100K papers/year.' },
  { year: '2016', docs: 115423, growth: '+9.3%', milestone: 'AlphaGo victory. GAN research accelerates globally.' },
  { year: '2017', docs: 137237, growth: '+18.9%', milestone: 'Transformer architecture introduced (Vaswani et al.). Growth inflects.' },
  { year: '2018', docs: 185192, growth: '+34.9%', milestone: 'BERT and GPT-1 launch. Fastest YoY growth since baseline (+34.9%).' },
  { year: '2019', docs: 242286, growth: '+30.8%', milestone: 'GPT-2 released. Federated learning research surges 402x from 2017.' },
  { year: '2020', docs: 305903, growth: '+26.3%', milestone: 'GPT-3 launch. RAG architecture introduced (Lewis et al.).' },
  { year: '2021', docs: 369519, growth: '+20.8%', milestone: 'China exceeds US in AI paper volume for first time (71K vs 65K).' },
  { year: '2022', docs: 411098, growth: '+11.2%', milestone: 'ChatGPT launch (Nov). Growth temporarily decelerates to 11.2%.' },
  { year: '2023', docs: 520861, growth: '+26.7%', milestone: 'GPT-4, Llama released. Post-ChatGPT research explosion re-accelerates.' },
  { year: '2024', docs: 662417, growth: '+27.2%', milestone: 'Agentic frameworks emerge. LLM papers reach 10.3% of corpus.' },
  { year: '2025', docs: 944530, growth: '+42.6%', milestone: 'DeepSeek disrupts. 944K papers, highest annual growth since 2018.' },
  { year: '2026', docs: 1600000, growth: 'Estimate', milestone: 'Jan-Jun partial. On pace for 1.6M papers, first year exceeding 1M.' },
];

// Top 10 bigrams from Table 3 (abstract-level search, 5M corpus)
const bigramData: TermFrequency[] = [
  { term: 'neural network', count: 1522612, percent: 30.4, context: 'Dominant paradigm: appears in 30.4% of all 5M paper abstracts.' },
  { term: 'machine learning', count: 1287123, percent: 25.7, context: 'Production-grade ML pipelines across every discipline.' },
  { term: 'deep learning', count: 980070, percent: 19.6, context: 'Surpassed neural network in annual mentions for first time in 2025.' },
  { term: 'artificial intelligence', count: 745358, percent: 14.9, context: 'Broad AI research spanning all subdisciplines.' },
  { term: 'attention mechanism', count: 432079, percent: 8.6, context: 'Transformer-driven: attention spans NLP, vision, and multimodal tasks.' },
  { term: 'large language', count: 405166, percent: 8.1, context: 'LLM scaling: surpasses image classification by volume.' },
  { term: 'image classification', count: 390138, percent: 7.8, context: 'Applied computer vision for industrial and medical use.' },
  { term: 'recommendation system', count: 387638, percent: 7.7, context: 'E-commerce and content personalization at scale.' },
  { term: 'medical imaging', count: 359104, percent: 7.2, context: 'Healthcare AI: radiology, pathology, diagnostics.' },
  { term: 'feature extraction', count: 256159, percent: 5.1, context: 'General-purpose term across ML pipelines.' },
];

// Top 10 trigrams from Table 3 (abstract-level search, 5M corpus)
const trigramData: TermFrequency[] = [
  { term: 'deep neural network', count: 518431, percent: 10.4, context: 'Dominant trigram: over half a million abstract mentions.' },
  { term: 'convolutional neural network', count: 394934, percent: 7.9, context: 'Image classification and visual feature extraction (CNNs).' },
  { term: 'large language model', count: 292873, percent: 5.9, context: '29.9x growth from 2018-2025. Now #3 trigram overall.' },
  { term: 'artificial neural network', count: 261355, percent: 5.2, context: 'Classical neural architecture references.' },
  { term: 'support vector machine', count: 239347, percent: 4.8, context: 'Classical ML persists as baseline comparator.' },
  { term: 'natural language processing', count: 172355, percent: 3.4, context: 'Text understanding, generation, and translation.' },
  { term: 'long short-term memory', count: 137359, percent: 2.7, context: 'Sequence modeling, time-series, and language tasks.' },
  { term: 'recurrent neural network', count: 88266, percent: 1.8, context: 'Sequential architectures, increasingly replaced by transformers.' },
  { term: 'graph neural network', count: 86453, percent: 1.7, context: 'Molecular, social network, and knowledge graph applications.' },
  { term: 'random forest classifier', count: 73385, percent: 1.5, context: 'Ensemble methods still widely used in applied domains.' },
];

// Fastest-rising keywords from Table 4 (2025-2026 vs 2022-2023)
const momentumData = [
  { term: 'deepseek', count2026: 11033, growth: 848.7, context: 'Open-weight models challenging proprietary labs. Only 13 papers in 2022-2023.' },
  { term: 'retrieval augmented generation', count2026: 18196, growth: 52.4, context: 'RAG pipeline: the dominant enterprise LLM deployment pattern.' },
  { term: 'jailbreak', count2026: 2803, growth: 25.5, context: 'Adversarial prompt research for LLM safety and red-teaming.' },
  { term: 'retrieval-augmented', count2026: 21105, growth: 19.2, context: 'RAG variant: 21K papers in 2025-2026, up from 1.1K.' },
  { term: 'mistral', count2026: 4361, growth: 16.8, context: 'European open-weight model family gaining research traction.' },
  { term: 'llm', count2026: 161771, growth: 16.0, context: 'The abbreviation itself: 161K papers. Largest absolute count in table.' },
  { term: 'copilot', count2026: 5699, growth: 16.0, context: 'LLM-based coding and productivity assistants.' },
  { term: 'rag', count2026: 19193, growth: 15.4, context: 'RAG abbreviation: 19K papers in the 2025-2026 window.' },
  { term: 'gemini', count2026: 22365, growth: 13.6, context: 'Google multimodal model family as research subject.' },
  { term: 'guardrail', count2026: 5046, growth: 9.7, context: 'Output constraint techniques for safe LLM deployment.' },
];


// --- Timeline Component ---
export function StateOfAiTimeline() {
  const [selectedIndex, setSelectedIndex] = useState<number>(12);
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

  const solidPoints = points.slice(0, 13);
  const solidPathD = `M ${solidPoints[0].x} ${solidPoints[0].y} ` + solidPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const dashedPathD = `M ${points[12].x} ${points[12].y} L ${points[13].x} ${points[13].y}`;
  const areaD = `${solidPathD} L ${dashedPathD.split(' L ')[1]} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            Publication Volume &amp; Milestone Timeline (2013-2026)
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Annual publication volume and key milestones
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-semibold">
          Active Year: {selected.year}{selected.year === '2026' ? '*' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-muted/20 border border-border/50 rounded-lg p-3">
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="w-full h-auto overflow-visible select-none">
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
              <path d={solidPathD} fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="2.5" strokeLinejoin="round" />
              <path d={dashedPathD} fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="2.5" strokeDasharray="4 4" strokeLinejoin="round" />
              {points.map((p, i) => {
                const isEstimate = p.year === '2026';
                return (
                  <g key={i} onClick={() => setSelectedIndex(i)} className="cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={i === selectedIndex ? 7 : 4.5} 
                      fill={i === selectedIndex ? (isEstimate ? 'hsl(var(--card))' : 'hsl(217, 91%, 60%)') : 'hsl(var(--card))'} 
                      stroke="hsl(217, 91%, 60%)" 
                      strokeWidth={i === selectedIndex ? 2.5 : 1.5}
                      strokeDasharray={isEstimate ? "3 1.5" : undefined}
                      className="transition-all duration-200" 
                    />
                    <text 
                      x={p.x} 
                      y={height - padding + 20} 
                      textAnchor="middle" 
                      fill="currentColor" 
                      fillOpacity={i === selectedIndex ? 0.9 : 0.5} 
                      fontSize="10" 
                      fontFamily="monospace"
                      className={i === selectedIndex ? "font-bold" : ""}
                    >
                      {p.year}
                    </text>
                  </g>
                );
              })}
              {(() => {
                const sp = points[selectedIndex];
                return <line x1={sp.x} y1={sp.y + 8} x2={sp.x} y2={height - padding} stroke="hsl(217, 91%, 60%)" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />;
              })()}
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-2">
            <div className="text-3xl font-black tabular-nums text-foreground">{selected.docs.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Papers Published{selected.year === '2026' ? ' (Jan-Jun)' : ''}</div>
            <div className="text-xs font-mono font-bold text-blue-500">{selected.growth !== '--' && selected.growth !== 'Partial' ? `YoY: ${selected.growth}` : selected.growth === 'Partial' ? 'Partial Year' : 'Baseline Year'}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Milestone</p>
            <p className="text-xs text-foreground leading-relaxed">{selected.milestone}</p>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Corpus: 5,003,783 papers via abstract-level search on OpenAlex.
      </div>
    </figure>
  );
}


// --- N-gram Analyzer ---
export function StateOfAiNgramAnalyzer() {
  const [activeTab, setActiveTab] = useState<'bigrams' | 'trigrams' | 'rising'>('bigrams');
  const tabs = [
    { key: 'bigrams' as const, label: 'Bigrams', data: bigramData },
    { key: 'trigrams' as const, label: 'Trigrams', data: trigramData },
    { key: 'rising' as const, label: 'Rising', data: momentumData.map(m => ({ term: m.term, count: m.count2026, percent: m.growth, context: m.context })) },
  ];
  const activeData = tabs.find(t => t.key === activeTab)!.data;
  const maxCount = Math.max(...activeData.map(d => d.count));

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Linguistic N-Gram Corpus Frequency Analyzer
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Most frequent bigrams, trigrams, and rising terms
          </span>
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
              <div className={`${activeTab === 'rising' ? 'w-56' : activeTab === 'trigrams' ? 'w-56' : 'w-40'} text-right text-sm font-semibold text-foreground truncate`}>
                {item.term}
              </div>
              <div className="flex-1 relative">
                <div className="h-7 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary/65 transition-all duration-700 ease-out" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                </div>
              </div>
              <div className="w-20 text-right text-xs font-bold tabular-nums text-foreground">{item.count.toLocaleString()}</div>
              <div className="w-14 text-right text-[10px] font-mono text-muted-foreground">{activeTab === 'rising' ? `${item.percent}x` : `${item.percent}%`}</div>
            </div>
            <div className={`ml-9 ${activeTab === 'rising' || activeTab === 'trigrams' ? 'pl-56' : 'pl-40'} text-[10px] text-muted-foreground/70 mt-0.5 hidden group-hover:block transition-all`}>
              {item.context}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: 5,003,783 AI paper abstracts (OpenAlex).
      </div>
    </figure>
  );
}


// --- Momentum Chart ---
export function StateOfAiMomentum() {
  const maxGrowth = momentumData[0].growth;
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-5">
      <div>
        <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          Fastest-Rising Keywords (2025-2026 vs 2022-2023)
        </h4>
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
          Growth velocity of AI research keywords
        </span>
      </div>
      <div className="space-y-3">
        {momentumData.map((item) => {
          const pct = (item.growth / maxGrowth) * 100;
          const isTooNarrow = pct < 15;
          return (
            <div key={item.term} className="group">
              <div className="flex items-center gap-3">
                <div className="w-56 text-right text-sm font-bold text-foreground truncate">{item.term}</div>
                <div className="flex-1 relative flex items-center">
                  <div className="h-8 w-full rounded-full bg-secondary overflow-hidden relative flex items-center">
                    <div 
                      className="h-full rounded-full bg-primary/65 transition-all duration-700 ease-out flex items-center justify-end pr-2" 
                      style={{ width: `${pct}%` }}
                    >
                      {!isTooNarrow && (
                        <span className="text-[10px] font-black text-primary-foreground tabular-nums">{item.growth}x</span>
                      )}
                    </div>
                    {isTooNarrow && (
                      <span className="absolute text-[10px] font-black text-foreground tabular-nums" style={{ left: `calc(${pct}% + 8px)` }}>
                        {item.growth}x
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-20 text-right text-xs font-mono text-muted-foreground">{item.count2026.toLocaleString()}</div>
              </div>
              <div className="ml-9 pl-56 text-[10px] text-muted-foreground/70 mt-0.5 hidden group-hover:block">{item.context}</div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: 5,003,783 papers (OpenAlex). Growth ratio = abstract count in 2025-2026 ÷ abstract count in 2022-2023.
      </div>
    </figure>
  );
}


// --- Backward-compatible exports ---
export function StateOfAiKeywordsChart() {
  return <StateOfAiNgramAnalyzer />;
}

export function StateOfAiBigramsChart() {
  return null; // Absorbed into NgramAnalyzer
}

// --- Geographic Distribution ---
export function StateOfAiGeography() {
  const geoData = [
    { country: 'China', count: 874019 },
    { country: 'United States', count: 718676 },
    { country: 'India', count: 369931 },
    { country: 'Japan', count: 333896 },
    { country: 'United Kingdom', count: 216177 },
    { country: 'Germany', count: 163172 },
    { country: 'Canada', count: 117479 },
    { country: 'Italy', count: 105094 },
    { country: 'France', count: 97247 },
    { country: 'South Korea', count: 95171 },
  ];
  
  const maxCount = geoData[0].count;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-5">
      <div>
        <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          Global Research Output by Country (Top 10)
        </h4>
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
          Geographic distribution of AI research publications
        </span>
      </div>
      <div className="space-y-3 pt-2">
        {geoData.map((item, i) => (
          <div key={item.country} className="flex items-center gap-3">
            <div className="w-6 text-right text-[10px] font-mono text-muted-foreground">{i + 1}</div>
            <div className="w-32 text-right text-sm font-semibold text-foreground truncate">{item.country}</div>
            <div className="flex-1 relative">
              <div className="h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out opacity-65" 
                  style={{ width: `${(item.count / maxCount) * 100}%`, backgroundColor: i === 0 ? 'hsl(12, 90%, 60%)' : i === 1 ? 'hsl(217, 91%, 60%)' : 'hsl(var(--primary))' }} 
                />
              </div>
            </div>
            <div className="w-24 text-right text-xs font-bold tabular-nums text-foreground">{item.count.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: 5,003,783 AI papers (2013-2026) via OpenAlex. A single paper with co-authors from multiple countries is counted once per country.
      </div>
    </figure>
  );
}

// --- Citation Distribution ---
export function StateOfAiCitations() {
  const [percentile, setPercentile] = useState<number>(95);
  const [isResNetHighlight, setIsResNetHighlight] = useState<boolean>(false);

  // Approximate thresholds based on distribution
  const getPercentileCitations = (p: number) => {
    if (p <= 48) return 0;
    if (p <= 50) return 1;
    if (p <= 75) return 5;
    if (p <= 90) return 25;
    if (p <= 95) return 45;
    if (p <= 98) return 95;
    return 480; // 99th
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200">
            Corpus Citation Skewness Distribution
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Concentration of academic impact and citations
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold text-primary">
          {percentile}th Percentile
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-muted/20 border border-border/40 rounded-lg p-4 flex flex-col justify-center space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Distribution Segment Selector</p>
          <input 
            type="range" 
            min="50" 
            max="99" 
            step="1" 
            value={percentile}
            onChange={(e) => {
              setPercentile(parseInt(e.target.value));
              setIsResNetHighlight(false);
            }}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>50th (median=0)</span>
            <span>99th (cutoff=480)</span>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-5 text-center flex flex-col justify-center items-center relative overflow-hidden">
          {isResNetHighlight ? (
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-mono tracking-widest text-destructive font-bold">Absolute Extreme Outlier</p>
              <p className="text-2xl font-black text-destructive font-mono">221,202 citations</p>
              <p className="text-xs font-semibold text-foreground font-serif leading-snug mt-1">
                Kaiming He et al. &ldquo;Deep Residual Learning for Image Recognition (2016)&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground font-bold">Threshold Cutoff</p>
              <p className="text-2xl font-black text-primary font-mono">
                {getPercentileCitations(percentile)} citations
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                A paper in the <strong className="text-foreground">{percentile}th percentile</strong> of the corpus requires at least {getPercentileCitations(percentile)} citations.
              </p>
            </div>
          )}

          <button 
            onClick={() => setIsResNetHighlight(!isResNetHighlight)}
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border transition-all mt-4 ${
              isResNetHighlight 
                ? 'bg-destructive/10 border-destructive text-destructive'
                : 'bg-background border-border hover:border-foreground/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            {isResNetHighlight ? 'Reset Slider' : 'Trigger ResNet Outlier Node (221,202 citations)'}
          </button>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: 5,003,783 AI papers via OpenAlex. 48.9% have zero citations.
      </div>
    </figure>
  );
}
