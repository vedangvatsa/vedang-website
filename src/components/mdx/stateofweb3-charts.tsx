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

// 1. Core dataset from state-of-web3-research-2026 Table 3
const yearlyDataset: YearlyData[] = [
  { year: '2013', docs: 176, growth: '--', avgCitations: 85.0, milestone: 'Genesis era. Bitcoin-only research; 176 papers launched the field.' },
  { year: '2014', docs: 430, growth: '+144.3%', avgCitations: 72.0, milestone: 'Early cryptographic analyses of Bitcoin mining and transaction graphs.' },
  { year: '2015', docs: 550, growth: '+27.9%', avgCitations: 64.1, milestone: 'Ethereum launches. Early smart contract and distributed ledger concepts.' },
  { year: '2016', docs: 955, growth: '+73.6%', avgCitations: 58.0, milestone: 'IoT-blockchain intersection emerges. Peak citation-impact cohort forming.' },
  { year: '2017', docs: 2520, growth: '+163.9%', avgCitations: 45.0, milestone: 'ICO boom triggers academic explosion. ERC-20 standard drives research.' },
  { year: '2018', docs: 6995, growth: '+177.6%', avgCitations: 32.0, milestone: 'Peak YoY growth. Consensus mechanisms, scalability, and security dominate.' },
  { year: '2019', docs: 10591, growth: '+51.4%', avgCitations: 22.0, milestone: 'DeFi primitives appear (7 papers). Supply chain research scales rapidly.' },
  { year: '2020', docs: 11996, growth: '+13.3%', avgCitations: 15.5, milestone: 'DeFi Summer. Federated learning–blockchain convergence begins (37 papers).' },
  { year: '2021', docs: 13337, growth: '+11.2%', avgCitations: 10.8, milestone: 'NFT research surges. Zero-knowledge proof applications multiply.' },
  { year: '2022', docs: 14979, growth: '+12.3%', avgCitations: 7.2, milestone: 'Layer-2 rollups and cross-chain protocols dominate architecture research.' },
  { year: '2023', docs: 17677, growth: '+18.0%', avgCitations: 4.8, milestone: 'NFT research peaks (426 papers) then declines. Institutional era begins.' },
  { year: '2024', docs: 17993, growth: '+1.8%', avgCitations: 2.5, milestone: 'Lowest growth year. NIST post-quantum standards catalyze new research.' },
  { year: '2025', docs: 20668, growth: '+14.9%', avgCitations: 0.8, milestone: 'Record output: 20,668 papers. Post-quantum and regulatory themes surge.' },
  { year: '2026', docs: 9419, growth: 'Partial', avgCitations: 0.1, milestone: 'On pace for ~18,800. Quantum-resistant and AI convergence accelerate.' }
];

const unigramData: TermFrequency[] = [
  { term: 'blockchain', count: 87818, percent: 68.5, context: 'The foundational term, appearing in more than two-thirds of all abstracts.' },
  { term: 'data', count: 70208, percent: 54.7, context: 'Storage, integrity, on-chain privacy, and data-sharing architectures.' },
  { term: 'security', count: 59388, percent: 46.3, context: 'Nearly half of all papers discuss security — central to the value proposition.' },
  { term: 'decentralized', count: 48670, percent: 37.9, context: 'Decentralized systems, consensus mechanics, and governance models.' },
  { term: 'cryptocurrency', count: 43190, percent: 33.7, context: 'Digital asset economics, exchange mechanics, and monetary theory.' },
  { term: 'trust', count: 39373, percent: 30.7, context: 'Trust-minimized systems, reputation protocols, and verification.' },
  { term: 'transaction', count: 38708, percent: 30.2, context: 'Transaction throughput, finality, and fee optimization research.' },
  { term: 'smart contract', count: 38414, percent: 29.9, context: 'Programmable execution layers now mentioned in 3 of every 10 papers.' }
];

const bigramData: TermFrequency[] = [
  { term: 'blockchain technology', count: 44102, percent: 34.4, context: 'Dominant bigram — blockchain treated as modular infrastructure component.' },
  { term: 'smart contract', count: 21134, percent: 16.5, context: 'Automated execution, formal verification, and vulnerability auditing.' },
  { term: 'blockchain based', count: 18516, percent: 14.4, context: 'Papers proposing blockchain as a solution to problems in other domains.' },
  { term: 'supply chain', count: 11418, percent: 8.9, context: 'Largest non-financial application vertical: provenance and logistics.' },
  { term: 'Internet of Things', count: 9851, percent: 7.7, context: 'Strong blockchain-IoT intersection for distributed device authentication.' },
  { term: 'distributed ledger', count: 7973, percent: 6.2, context: 'Enterprise-grade permissioned frameworks (Hyperledger, R3 Corda).' },
  { term: 'machine learning', count: 5667, percent: 4.4, context: 'AI methods applied to blockchain: anomaly detection, optimization.' },
  { term: 'artificial intelligence', count: 5463, percent: 4.3, context: 'Blockchain for AI governance: decentralized training, model provenance.' }
];

const trigramData: TermFrequency[] = [
  { term: 'Internet of Things', count: 9851, percent: 7.7, context: 'Top trigram — IoT devices generate distributed data secured by blockchain.' },
  { term: 'distributed ledger technology', count: 4058, percent: 3.2, context: 'Enterprise permissioned blockchain frameworks and institutional DLT.' },
  { term: 'supply chain management', count: 3699, percent: 2.9, context: 'Proven logistics automation; largest single non-financial vertical.' },
  { term: 'zero knowledge proof', count: 1472, percent: 1.1, context: 'Fast-rising privacy primitive: zk-SNARKs, zk-STARKs, and rollups.' },
  { term: 'non fungible token', count: 1121, percent: 0.9, context: 'Digital ownership research — peaked in 2023, now in structural decline.' },
  { term: 'byzantine fault tolerance', count: 1009, percent: 0.8, context: 'Core consensus research: pBFT variants and finality guarantees.' },
  { term: 'central bank digital', count: 867, percent: 0.7, context: 'Sovereign digital currency design: CBDC pilots and monetary policy.' },
  { term: 'bank digital currency', count: 864, percent: 0.7, context: 'Complementary CBDC term: offline settlement and privacy frameworks.' }
];

const convergenceNodes: ConceptNode[] = [
  {
    id: 'fed-learn',
    label: 'Federated Learning',
    papers: 664,
    description: 'Explosive growth from 3 papers in 2018 to 664 in 2025. Blockchain coordinates decentralized AI training, manages parameter updates, calculates rewards, and prevents model poisoning — without centralizing sensitive data.',
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
    description: '1,342 mentions across the corpus. Combines zero-knowledge proofs (ZKPs), secure multi-party computation (SMPC), and homomorphic encryption to train models and verify transactions on private records without decryption.',
    exemplar: {
      title: 'Hawk: The blockchain model of cryptography and privacy-preserving smart contracts',
      authors: 'A. Kosba et al.',
      year: 2016,
      citations: 1845,
      url: 'https://ieeexplore.ieee.org/document/7546538'
    }
  },
  {
    id: 'ai-convergence',
    label: 'AI Convergence',
    papers: 11130,
    description: 'Machine learning (5,667 papers) and artificial intelligence (5,463 papers) represent the largest technology convergence in the corpus — 11,130 combined mentions. Papers apply AI to blockchain problems (anomaly detection, MEV optimization) or use blockchain for AI governance (decentralized model training, provenance).',
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
  { term: 'quantum resistant', growth: 6.6, count2026: 243, category: 'Post-Quantum Security' },
  { term: 'real world asset', growth: 5.6, count2026: 89, category: 'Institutional Finance' },
  { term: 'layer 2', growth: 4.2, count2026: 275, category: 'Scalability' },
  { term: 'post-quantum', growth: 3.9, count2026: 367, category: 'Post-Quantum Security' },
  { term: 'regulatory', growth: 3.5, count2026: 4529, category: 'Regulation & Compliance' },
  { term: 'zk rollup', growth: 3.4, count2026: 34, category: 'Scalability' },
  { term: 'stablecoin', growth: 2.7, count2026: 576, category: 'Institutional Finance' },
  { term: 'DeFi', growth: 2.6, count2026: 808, category: 'Decentralized Finance' },
  { term: 'interoperability', growth: 2.2, count2026: 1952, category: 'Infrastructure' },
  { term: 'zero knowledge', growth: 2.1, count2026: 743, category: 'Cryptography' }
];

// --- Timeline Component ---
export function StateOfWeb3Timeline() {
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(13); // default to 2026
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
    <div className="my-8 rounded-lg border border-border/50 bg-card p-6 shadow-sm overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            Publication Volume & Milestone Timeline (2013–2026)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            128,286 concept-tagged papers. Click nodes to explore the 118x growth trajectory.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-semibold">
          Active Year: {selectedTimeline.year}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-muted/20 border border-border/50 rounded-lg p-3">
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

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4 flex flex-col justify-between space-y-4">
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
    <div className="my-8 rounded-lg border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Linguistic N-Gram Frequency Analyzer
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Toggle token models to explore terminology patterns across 128,286 paper abstracts.
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
    <div className="my-8 rounded-lg border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div>
        <h4 className="text-base font-bold text-foreground">
          The Blockchain–AI Convergence Matrix
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select convergence domains to trace how blockchain acts as a decentralized coordination substrate for AI.
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
                    {node.papers.toLocaleString()} papers
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-muted/20 border border-border/50 rounded-lg p-5 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[180px]">
          <div className="absolute w-40 h-40 border border-primary/10 rounded-full animate-ping opacity-20" />
          
          <div className="relative space-y-4">
            <div className="w-12 h-12 mx-auto rounded-lg bg-primary flex items-center justify-center shadow-md">
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

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4 flex flex-col justify-between space-y-4">
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
  const [momentumThreshold, setMomentumThreshold] = useState<number>(2.0);
  const filteredMomentum = momentumData.filter(item => item.growth >= momentumThreshold);

  return (
    <div className="my-8 rounded-lg border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Topic Momentum Accelerator (2025-2026 vs. 2022-2023)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust the threshold to isolate the fastest-rising research keywords.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold text-primary">
          {momentumThreshold.toFixed(1)}x Growth Min
        </div>
      </div>

      <div className="bg-muted/20 border border-border/40 rounded-lg p-4 space-y-3">
        <input 
          type="range" 
          min="2" 
          max="7" 
          step="0.1" 
          value={momentumThreshold}
          onChange={(e) => setMomentumThreshold(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>2.0x minimum</span>
          <span>7.0x maximum</span>
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
                {item.count2026.toLocaleString()} papers
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
    <div className="my-8 rounded-lg border border-border/50 bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-foreground">
            Corpus Citation Skewness Distribution
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use the controller slider to explore the right-skew distribution across 128,286 documents. 43.5% have zero citations.
          </p>
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
              setIsNakamotoHighlight(false);
            }}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>50th (median=0)</span>
            <span>99th (cutoff=249)</span>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-5 text-center flex flex-col justify-center items-center relative overflow-hidden">
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
