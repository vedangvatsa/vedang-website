'use client';

import * as React from 'react';
import { useState } from 'react';

// --- Data Structures ---
interface YearlyData {
  year: string;
  docs: number;
  growth: string;
  avgCitations: number;
  milestone: string;
}

interface TermFrequency {
  term: string;
  count: number;
  percent: number;
  context: string;
}

interface ConceptNode {
  id: string;
  label: string;
  papers: number;
  description: string;
  exemplar: { title: string; authors: string; year: number; citations: number; url: string };
}

// 1. Core dataset from latex/template.tex
const yearlyDataset: YearlyData[] = [
  { year: '2015', docs: 788, growth: '--', avgCitations: 64.1, milestone: 'Ethereum network launches; early smart contract concepts emerge.' },
  { year: '2016', docs: 897, growth: '+13.8%', avgCitations: 107.6, milestone: 'Peak citation impact cohort. Early scalability, sharding, and EVM studies.' },
  { year: '2017', docs: 1584, growth: '+76.6%', avgCitations: 91.2, milestone: 'ERC-20 token standard scales; initial boom in decentralized publications.' },
  { year: '2018', docs: 3752, growth: '+136.9%', avgCitations: 70.8, milestone: 'Peak YoY expansion. Cryptographic consensus research explodes globally.' },
  { year: '2019', docs: 6122, growth: '+63.2%', avgCitations: 44.1, milestone: 'DeFi primitives (MakerDAO, Uniswap v1) draw intense academic interest.' },
  { year: '2020', docs: 7008, growth: '+14.5%', avgCitations: 21.2, milestone: 'DeFi Summer launches yield-farming and liquidity pool modeling.' },
  { year: '2021', docs: 8993, growth: '+28.3%', avgCitations: 13.9, milestone: 'NFT standards scale. Access control and zero-knowledge proof applications.' },
  { year: '2022', docs: 11263, growth: '+25.2%', avgCitations: 8.2, milestone: 'Rollups and layer-2 scaling solutions dominate system architecture.' },
  { year: '2023', docs: 14462, growth: '+28.4%', avgCitations: 5.4, milestone: 'Transition to institutional research. Cross-chain communication protocols.' },
  { year: '2024', docs: 16394, growth: '+13.4%', avgCitations: 3.9, milestone: 'Real-world asset (RWA) tokenization and stablecoin utility models scale.' },
  { year: '2025', docs: 20781, growth: '+26.8%', avgCitations: 1.0, milestone: 'Integration of Decentralized Physical Infrastructure Networks (DePIN).' },
  { year: '2026', docs: 7980, growth: 'Partial', avgCitations: 0.1, milestone: 'Convergence with artificial intelligence (Large Language Models).' }
];

const unigramData: TermFrequency[] = [
  { term: 'blockchain', count: 54780, percent: 54.8, context: 'Standardized baseline of distributed ledger technology.' },
  { term: 'decentralized', count: 12897, percent: 12.9, context: 'Decentralized systems, consensus mechanics, and governance.' },
  { term: 'technology', count: 9982, percent: 10.0, context: 'Systems integration and engineering architectural paradigms.' },
  { term: 'smart', count: 8043, percent: 8.0, context: 'Smart contracts, automated execution, and verification.' },
  { term: 'data', count: 8032, percent: 8.0, context: 'Storage protocols, integrity, on-chain privacy, and encryption.' },
  { term: 'bitcoin', count: 6024, percent: 6.0, context: 'The genesis peer-to-peer electronic cash infrastructure.' },
  { term: 'security', count: 5702, percent: 5.7, context: 'Cryptographic defense, vulnerability analysis, and formal proofs.' },
  { term: 'IoT', count: 5521, percent: 5.5, context: 'Internet of Things sensor networks coordinated by blockchain.' }
];

const bigramData: TermFrequency[] = [
  { term: 'blockchain technology', count: 8181, percent: 8.2, context: 'Reflects integration of blockchain as a component of larger systems.' },
  { term: 'supply chain', count: 3960, percent: 4.0, context: 'Product traceability, logistics provenance, and anti-counterfeiting.' },
  { term: 'smart contract', count: 2887, percent: 2.9, context: 'Automated digital agreements and protocol logic analysis.' },
  { term: 'blockchain enabled', count: 2313, percent: 2.3, context: 'System capability expansions using decentralized ledger state.' },
  { term: 'smart contracts', count: 2216, percent: 2.2, context: 'Plural variations mapping vulnerability audits and execution.' },
  { term: 'federated learning', count: 1712, percent: 1.7, context: 'Distributed machine learning coordinated by secure smart networks.' },
  { term: 'machine learning', count: 1779, percent: 1.8, context: 'Algorithmic models trained and validated on blockchain registries.' },
  { term: 'privacy preserving', count: 1342, percent: 1.3, context: 'Zero-knowledge architectures, homomorphic encryption protocols.' }
];

const trigramData: TermFrequency[] = [
  { term: 'supply chain management', count: 1036, percent: 1.0, context: 'Proven logistics automation; largest single non-financial vertical.' },
  { term: 'central bank digital', count: 959, percent: 1.0, context: 'Public sector research on state-backed sovereign currencies (CBDCs).' },
  { term: 'bank digital currency', count: 852, percent: 0.9, context: 'Algorithmic monetary policy, offline settlement mechanics.' },
  { term: 'distributed ledger technology', count: 643, percent: 0.6, context: 'Enterprise-grade permissioned frameworks (Hyperledger, R3).' },
  { term: 'non fungible tokens', count: 558, percent: 0.6, context: 'Digital asset ownership mapping, intellectual property research.' },
  { term: 'blockchain federated learning', count: 382, percent: 0.4, context: 'Decentralized consensus parameters managing AI weights distribution.' },
  { term: 'blockchain machine learning', count: 306, percent: 0.3, context: 'On-chain execution of trained artificial intelligence models.' },
  { term: 'federated learning blockchain', count: 300, percent: 0.3, context: 'Trustless coordination engines preventing poison attacks.' }
];

const convergenceNodes: ConceptNode[] = [
  {
    id: 'fed-learn',
    label: 'Federated Learning',
    papers: 1712,
    description: 'AI model training across decentralized networks without centralizing sensitive databases. The blockchain coordinates parameters, calculates rewards, and prevents poisoned weights.',
    exemplar: {
      title: 'Blockchain empowered asynchronous federated learning for secure data sharing',
      authors: 'Y. Lu et al.',
      year: 2020,
      citations: 512,
      url: 'https://ieeexplore.ieee.org/document/8998397'
    }
  },
  {
    id: 'privacy',
    label: 'Privacy Preserving',
    papers: 1342,
    description: 'Combining zero-knowledge proofs (ZKPs), secure multi-party computation (SMPC), and homomorphic encryption to train neural networks on private records without decryption.',
    exemplar: {
      title: 'Hawk: The blockchain model of cryptography and privacy-preserving smart contracts',
      authors: 'A. Kosba et al.',
      year: 2016,
      citations: 1845,
      url: 'https://ieeexplore.ieee.org/document/7546538'
    }
  },
  {
    id: 'agentic',
    label: 'Autonomous Agents',
    papers: 894,
    description: 'AI agents operating with sovereign crypto wallets. Smart contracts act as the economic playground, allowing agents to trade resources, trigger services, and settle balances instantly.',
    exemplar: {
      title: 'The rise and potential of large language model based agents: A survey',
      authors: 'Z. Xi et al.',
      year: 2023,
      citations: 1520,
      url: 'https://arxiv.org/abs/2309.07864'
    }
  }
];

const momentumData = [
  { term: 'language models', growth: 26.0, count2026: 26, category: 'AI Convergence' },
  { term: 'enhancing transparency', growth: 25.0, count2026: 25, category: 'Regulation & Compliance' },
  { term: 'large language', growth: 19.0, count2026: 19, category: 'AI Convergence' },
  { term: 'chain transparency', growth: 18.0, count2026: 18, category: 'Supply Chain' },
  { term: 'quantum resistant', growth: 15.0, count2026: 15, category: 'Cryptography' },
  { term: 'secure transparent', growth: 12.0, count2026: 36, category: 'Infrastructure' }
];

// --- Timeline Component ---
export function StateOfWeb3Timeline() {
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(11); // default to 2026
  const selectedTimeline = yearlyDataset[selectedTimelineIndex];

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
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            Publication Volume & Milestone Timeline (2015-2026)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click chart nodes to scrub years and explore scholarly output acceleration.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-semibold">
          Active Year: {selectedTimeline.year}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-muted/20 border border-border/50 rounded-xl p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="areaGradWeb3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {Array.from({ length: 4 }).map((_, i) => {
                const yVal = padding + (i / 3) * graphHeight;
                return (
                  <line 
                    key={i} 
                    x1={padding} 
                    y1={yVal} 
                    x2={width - padding} 
                    y2={yVal} 
                    stroke="currentColor" 
                    strokeOpacity={0.1}
                    strokeWidth={1} 
                    strokeDasharray="4 4" 
                  />
                );
              })}

              {/* Area */}
              <path d={areaD} fill="url(#areaGradWeb3)" className="transition-all duration-300" />
              
              {/* Stroke */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                className="transition-all duration-300" 
              />

              {/* Selection Line */}
              <line 
                x1={points[selectedTimelineIndex].x} 
                y1={padding} 
                x2={points[selectedTimelineIndex].x} 
                y2={height - padding} 
                stroke="hsl(var(--primary))" 
                strokeWidth={1.5} 
              />

              {/* Nodes */}
              {points.map((pt, i) => {
                const isSelected = selectedTimelineIndex === i;
                return (
                  <g 
                    key={i} 
                    className="cursor-pointer"
                    onClick={() => setSelectedTimelineIndex(i)}
                  >
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isSelected ? 7 : 4} 
                      fill={isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--primary))'} 
                    />
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isSelected ? 14 : 0} 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2} 
                    />
                    <text 
                      x={pt.x} 
                      y={height - padding + 18} 
                      textAnchor="middle" 
                      className={`text-[10px] font-mono ${isSelected ? 'fill-foreground font-bold' : 'fill-muted-foreground'}`}
                    >
                      {pt.year}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-xl font-bold tracking-tight text-foreground font-mono">
                Year {selectedTimeline.year}
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-semibold font-mono">
                YoY: {selectedTimeline.growth}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-2.5 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Documents</p>
                <p className="text-base font-extrabold text-foreground font-mono mt-0.5">
                  {selectedTimeline.docs.toLocaleString()}
                </p>
              </div>
              <div className="bg-background rounded-lg p-2.5 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Avg Citations</p>
                <p className="text-base font-extrabold text-primary font-mono mt-0.5">
                  {selectedTimeline.avgCitations}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Milestone Context</p>
              <p className="text-xs text-muted-foreground leading-relaxed bg-background/50 rounded-lg p-2 border border-border/40 font-light">
                {selectedTimeline.milestone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- N-Gram Frequency Analyzer ---
export function StateOfWeb3NgramAnalyzer() {
  const [activeNgramTab, setActiveNgramTab] = useState<'unigrams' | 'bigrams' | 'trigrams'>('bigrams');

  const activeNgrams = 
    activeNgramTab === 'unigrams' ? unigramData :
    activeNgramTab === 'bigrams' ? bigramData : trigramData;
  const maxNgramCount = Math.max(...activeNgrams.map(item => item.count));

  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Linguistic N-Gram Frequency Analyzer
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Toggle token models to explore raw terminology patterns mined across document titles.
          </p>
        </div>
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border">
          {[
            { id: 'unigrams', label: 'Unigrams' },
            { id: 'bigrams', label: 'Bigrams' },
            { id: 'trigrams', label: 'Trigrams' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveNgramTab(tab.id as any)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeNgramTab === tab.id 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeNgrams.map((item, idx) => {
          const widthPct = (item.count / maxNgramCount) * 100;
          return (
            <div 
              key={idx} 
              className="bg-muted/20 border border-border/30 hover:border-border/60 rounded-lg p-3.5 space-y-2.5 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold">
                    Rank #{idx + 1}
                  </span>
                  <p className="text-sm font-bold text-foreground font-mono lowercase tracking-wide mt-1.5">
                    &ldquo;{item.term}&rdquo;
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground font-mono">
                    {item.count.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {item.percent}% of papers
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                {item.context}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Blockchain-ML Convergence Matrix ---
export function StateOfWeb3ConvergenceMatrix() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fed-learn');
  const selectedNode = convergenceNodes.find(node => node.id === selectedNodeId) || convergenceNodes[0];

  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div>
        <h4 className="text-base font-bold text-foreground">
          The Blockchain-Machine Learning Convergence Matrix
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select standard technology concepts below to trace how blockchain acts as a decentralized security substrate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="space-y-2 flex flex-col justify-center">
          {convergenceNodes.map(node => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`text-left p-3.5 rounded-lg border transition-all text-sm font-sans ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-foreground font-semibold shadow-sm'
                    : 'border-border bg-muted/20 hover:border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{node.label}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/10 border border-primary/20 text-primary">
                    {node.papers} papers
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-muted/20 border border-border/50 rounded-xl p-5 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[180px]">
          <div className="absolute w-40 h-40 border border-primary/10 rounded-full animate-ping opacity-20" />
          
          <div className="relative space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-bold">Active Substrate</p>
              <h5 className="text-sm font-bold text-foreground mt-0.5">{selectedNode.label} Integration</h5>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Conceptual Strategy</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedNode.description}
            </p>
          </div>
          <div className="bg-background rounded-lg p-2.5 border border-border/50 space-y-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Exemplar Research Document</p>
            <a href={selectedNode.exemplar.url} target="_blank" rel="noopener noreferrer" className="block text-xs font-bold text-foreground font-serif leading-snug hover:text-primary transition-colors">
              &ldquo;{selectedNode.exemplar.title}&rdquo;
            </a>
            <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground pt-1">
              <span>{selectedNode.exemplar.authors} ({selectedNode.exemplar.year})</span>
              <span className="text-primary font-semibold">{selectedNode.exemplar.citations} cites</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Topic Momentum Slider ---
export function StateOfWeb3Momentum() {
  const [momentumThreshold, setMomentumThreshold] = useState<number>(12);
  const filteredMomentum = momentumData.filter(item => item.growth >= momentumThreshold);

  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Topic Momentum Accelerator (2022 vs 2026)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust the range slider to isolate key topics accelerating exponentially.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold text-primary">
          {momentumThreshold.toFixed(1)}x Growth Min
        </div>
      </div>

      <div className="bg-muted/20 border border-border/40 rounded-lg p-4 space-y-3">
        <input 
          type="range" 
          min="10" 
          max="25" 
          step="1" 
          value={momentumThreshold}
          onChange={(e) => setMomentumThreshold(parseInt(e.target.value))}
          className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>10.0x growth limit</span>
          <span>25.0x absolute limit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMomentum.map((item, idx) => (
          <div 
            key={idx} 
            className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/40"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground font-mono lowercase">
                &ldquo;{item.term}&rdquo;
              </p>
              <span className="px-1.5 py-0.2 rounded bg-secondary text-[8px] font-semibold text-muted-foreground font-sans uppercase">
                {item.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-primary font-mono block">
                +{item.growth.toFixed(1)}x
              </span>
              <span className="text-[9px] text-muted-foreground font-mono">
                {item.count2026} mentions
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Citation Skewness Distribution ---
export function StateOfWeb3Citations() {
  const [percentile, setPercentile] = useState<number>(95);
  const [isNakamotoHighlight, setIsNakamotoHighlight] = useState<boolean>(false);

  const getPercentileCitations = (p: number) => {
    if (p <= 50) return 0;
    if (p <= 75) return 1;
    if (p <= 90) return 14;
    if (p <= 95) return 42;
    if (p <= 98) return 156;
    return 249; // 99th
  };

  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Corpus Citation Skewness Distribution
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use the controller slider to explore the right-skew distribution across 100,000+ documents.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold text-primary">
          {percentile}th Percentile
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-muted/20 border border-border/40 rounded-xl p-4 flex flex-col justify-center space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Distribution Segment Selector</p>
          <input 
            type="range" 
            min="50" 
            max="99" 
            step="1" 
            value={percentile}
            onChange={(e) => {
              setPercentile(parseInt(e.target.value));
              setIsNakamotoHighlight(false);
            }}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>50th (median=0)</span>
            <span>99th (cutoff=249)</span>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-xl p-5 text-center flex flex-col justify-center items-center relative overflow-hidden">
          {isNakamotoHighlight ? (
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-mono tracking-widest text-destructive font-bold">Absolute Extreme Outlier</p>
              <p className="text-2xl font-black text-destructive font-mono">14,286 citations</p>
              <p className="text-xs font-semibold text-foreground font-serif leading-snug mt-1">
                Satoshi Nakamoto &ldquo;Bitcoin Whitepaper (2008)&rdquo;
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
            onClick={() => setIsNakamotoHighlight(!isNakamotoHighlight)}
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border transition-all mt-4 ${
              isNakamotoHighlight 
                ? 'bg-destructive/10 border-destructive text-destructive'
                : 'bg-background border-border hover:border-foreground/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            {isNakamotoHighlight ? '◀ Reset Slider' : '🔥 Trigger Satoshi Outlier Node (14,286 citations)'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Keep backward compatibility exports
export function StateOfWeb3KeywordsChart() {
  return <StateOfWeb3NgramAnalyzer />;
}

export function StateOfWeb3BigramsChart() {
  return <StateOfWeb3Timeline />;
}
