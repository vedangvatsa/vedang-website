'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Database, Search, ArrowRight, Star, Layers, Shield, FileText, ChevronRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';

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
  layer: string;
  description: string;
  dataFlow: string[];
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
  { year: '2019', docs: 10591, growth: '+51.4%', avgCitations: 22.0, milestone: 'DeFi primitives appear. Supply chain research scales rapidly.' },
  { year: '2020', docs: 11996, growth: '+13.3%', avgCitations: 15.5, milestone: 'DeFi Summer. Federated learning and blockchain convergence begins.' },
  { year: '2021', docs: 13337, growth: '+11.2%', avgCitations: 10.8, milestone: 'NFT research surges. Zero-knowledge proof applications multiply.' },
  { year: '2022', docs: 14979, growth: '+12.3%', avgCitations: 7.2, milestone: 'Layer-2 rollups and cross-chain protocols dominate architecture research.' },
  { year: '2023', docs: 17677, growth: '+18.0%', avgCitations: 4.8, milestone: 'NFT research peaks then declines. Institutional era begins.' },
  { year: '2024', docs: 17993, growth: '+1.8%', avgCitations: 2.5, milestone: 'Lowest growth year. NIST post-quantum standards catalyze new research.' },
  { year: '2025', docs: 20668, growth: '+14.9%', avgCitations: 0.8, milestone: 'Record output: 20,668 papers. Post-quantum and regulatory themes surge.' },
  { year: '2026', docs: 18800, growth: 'Estimate', avgCitations: 0.1, milestone: 'On pace for ~18,800. Quantum-resistant and AI convergence accelerate.' }
];

const unigramData: TermFrequency[] = [
  { term: 'blockchain', count: 87818, percent: 68.5, context: 'The foundational term, appearing in more than two-thirds of all abstracts.' },
  { term: 'data', count: 70208, percent: 54.7, context: 'Storage, integrity, on-chain privacy, and data-sharing architectures.' },
  { term: 'security', count: 59388, percent: 46.3, context: 'Nearly half of all papers discuss security, central to the value proposition.' },
  { term: 'decentralized', count: 48670, percent: 37.9, context: 'Decentralized systems, consensus mechanics, and governance models.' },
  { term: 'cryptocurrency', count: 43190, percent: 33.7, context: 'Digital asset economics, exchange mechanics, and monetary theory.' },
  { term: 'trust', count: 39373, percent: 30.7, context: 'Trust-minimized systems, reputation protocols, and verification.' },
  { term: 'transaction', count: 38708, percent: 30.2, context: 'Transaction throughput, finality, and fee optimization research.' },
  { term: 'smart contract', count: 38414, percent: 29.9, context: 'Programmable execution layers now mentioned in 3 of every 10 papers.' }
];

const bigramData: TermFrequency[] = [
  { term: 'blockchain technology', count: 44102, percent: 34.4, context: 'Dominant bigram: blockchain treated as modular infrastructure component.' },
  { term: 'smart contract', count: 21134, percent: 16.5, context: 'Automated execution, formal verification, and vulnerability auditing.' },
  { term: 'blockchain based', count: 18516, percent: 14.4, context: 'Papers proposing blockchain as a solution to problems in other domains.' },
  { term: 'supply chain', count: 11418, percent: 8.9, context: 'Largest non-financial application vertical: provenance and logistics.' },
  { term: 'Internet of Things', count: 9851, percent: 7.7, context: 'Strong blockchain-IoT intersection for distributed device authentication.' },
  { term: 'distributed ledger', count: 7973, percent: 6.2, context: 'Enterprise-grade permissioned frameworks (Hyperledger, R3 Corda).' },
  { term: 'machine learning', count: 5667, percent: 4.4, context: 'AI methods applied to blockchain: anomaly detection, optimization.' },
  { term: 'artificial intelligence', count: 5463, percent: 4.3, context: 'Blockchain for AI governance: decentralized training, model provenance.' }
];

const trigramData: TermFrequency[] = [
  { term: 'Internet of Things', count: 9851, percent: 7.7, context: 'Top trigram: IoT devices generate distributed data secured by blockchain.' },
  { term: 'distributed ledger technology', count: 4058, percent: 3.2, context: 'Enterprise permissioned blockchain frameworks and institutional DLT.' },
  { term: 'supply chain management', count: 3699, percent: 2.9, context: 'Proven logistics automation; largest single non-financial vertical.' },
  { term: 'zero knowledge proof', count: 1472, percent: 1.1, context: 'Fast-rising privacy primitive: zk-SNARKs, zk-STARKs, and rollups.' },
  { term: 'non fungible token', count: 1121, percent: 0.9, context: 'Digital ownership research: peaked in 2023, now in structural decline.' },
  { term: 'byzantine fault tolerance', count: 1009, percent: 0.8, context: 'Core consensus research: pBFT variants and finality guarantees.' },
  { term: 'central bank digital', count: 867, percent: 0.7, context: 'Sovereign digital currency design: CBDC pilots and monetary policy.' },
  { term: 'bank digital currency', count: 864, percent: 0.7, context: 'Complementary CBDC term: offline settlement and privacy frameworks.' }
];

const convergenceNodes: ConceptNode[] = [
  {
    id: 'fed-learn',
    label: 'Federated Learning',
    papers: 664,
    layer: 'Coordination & Incentive Layer',
    description: 'Blockchain coordinates decentralized AI training across multiple nodes. It manages parameter updates, calculates model accuracy rewards, and prevents malicious model poisoning—all without centralizing raw training data.',
    dataFlow: [
      '1. Local nodes train on private data',
      '2. Encrypted parameters submitted to ledger',
      '3. Smart contracts aggregate weights',
      '4. Verified parameter contributors paid in tokens'
    ],
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
    layer: 'Cryptography & Security Layer',
    description: 'Combines Zero-Knowledge Proofs (ZKPs) and Secure Multi-Party Computation (SMPC) to verify training compliance and process transactions on encrypted data. Ensures raw dataset privacy while validating execution.',
    dataFlow: [
      '1. Private data masked with ZK proofs',
      '2. Smart contracts verify proof validity',
      '3. Homomorphic operations run on-chain',
      '4. Clean state transition written to database'
    ],
    exemplar: {
      title: 'Hawk: The blockchain model of cryptography and privacy-preserving smart contracts',
      authors: 'A. Kosba et al.',
      year: 2016,
      citations: 1845,
      url: 'https://ieeexplore.ieee.org/document/7546538'
    }
  },
  {
    id: 'ai-governance',
    label: 'Decentralized AI Governance',
    papers: 11130,
    layer: 'Data & Provenance Layer',
    description: 'Applies blockchain audit trails to track AI model lineage, verify training dataset authenticity, and timestamp neural weights. Mitigates AI hallucinations, deepfakes, and unverified data scraping.',
    dataFlow: [
      '1. Dataset hashes stored on ledger',
      '2. Model training steps cryptographically logged',
      '3. Neural weights hashed & timestamped on-chain',
      '4. Downstream agents verify model authenticity'
    ],
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

  const solidPoints = points.slice(0, 13);
  const solidPathD = `M ${solidPoints[0].x} ${solidPoints[0].y} ` + solidPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const dashedPathD = `M ${points[12].x} ${points[12].y} L ${points[13].x} ${points[13].y}`;
  const areaD = `${solidPathD} L ${dashedPathD.split(' L ')[1]} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            Publication Volume &amp; Milestone Timeline (2013 to 2026)
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Publication volume and key milestones from genesis to maturation
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-semibold">
          Active Year: {selectedTimeline.year}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-muted/20 border border-border/50 rounded-lg p-3">
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="w-full h-auto overflow-visible select-none">
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
                    strokeOpacity={0.08}
                    strokeWidth={1} 
                    strokeDasharray="4 4" 
                  />
                );
              })}

              {/* Area */}
              <path d={areaD} fill="url(#areaGradWeb3)" className="transition-all duration-300" />
              
              {/* Stroke */}
              <path 
                d={solidPathD} 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2.5} 
                className="transition-all duration-300" 
              />

              <path 
                d={dashedPathD} 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2.5} 
                strokeDasharray="4 4"
                className="transition-all duration-300" 
              />

              {/* Selection Line */}
              <line 
                x1={points[selectedTimelineIndex].x} 
                y1={padding} 
                x2={points[selectedTimelineIndex].x} 
                y2={height - padding} 
                stroke="hsl(var(--primary))" 
                strokeWidth={1} 
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />

              {/* Nodes */}
              {points.map((pt, i) => {
                const isSelected = selectedTimelineIndex === i;
                const isEstimate = pt.year === '2026';
                return (
                  <g 
                    key={i} 
                    className="cursor-pointer"
                    onClick={() => setSelectedTimelineIndex(i)}
                  >
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isSelected ? 7 : 4.5} 
                      fill={isSelected ? (isEstimate ? 'hsl(var(--card))' : 'hsl(var(--foreground))') : 'hsl(var(--card))'} 
                      stroke="hsl(var(--primary))"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={isEstimate ? "3 1.5" : undefined}
                    />
                    <text 
                      x={pt.x} 
                      y={height - padding + 18} 
                      textAnchor="middle" 
                      className={`text-[10px] font-mono ${isSelected ? 'fill-foreground font-bold' : 'fill-muted-foreground/60'}`}
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
                  {selectedTimeline.avgCitations.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Milestone Context</p>
              <p className="text-xs text-muted-foreground leading-relaxed bg-background/50 rounded-lg p-2 border border-border/40 font-light">
                {selectedTimeline.milestone}
              </p>
            </div>

            {/* Citation Decay Insight */}
            <div className="border-t border-border/50 pt-2 space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                <span>Citation Density</span>
                <span>Avg: {selectedTimeline.avgCitations.toFixed(1)} / paper</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(selectedTimeline.avgCitations / 85) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-muted-foreground/60 leading-snug">
                As research volume surged 117x, the average citations per paper decayed from 85.0 to 0.1 due to Recency Effect and volume diluting attention.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: 128,286 concept-tagged papers via OpenAlex database.
      </div>
    </figure>
  );
}

// --- N-Gram Frequency Analyzer ---
export function StateOfWeb3NgramAnalyzer() {
  const [activeNgramTab, setActiveNgramTab] = useState<'unigrams' | 'bigrams' | 'trigrams'>('bigrams');
  const [activeTermIdx, setActiveTermIdx] = useState<number>(0);

  const activeNgrams = 
    activeNgramTab === 'unigrams' ? unigramData :
    activeNgramTab === 'bigrams' ? bigramData : trigramData;
  const maxNgramCount = Math.max(...activeNgrams.map(item => item.count));
  const activeTerm = activeNgrams[activeTermIdx] || activeNgrams[0];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200">
            Linguistic N-Gram Frequency Analyzer
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Token frequency distribution across 128,286 abstracts
          </span>
        </div>
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border shrink-0 self-start sm:self-auto">
          {[
            { id: 'unigrams', label: 'Unigrams' },
            { id: 'bigrams', label: 'Bigrams' },
            { id: 'trigrams', label: 'Trigrams' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveNgramTab(tab.id as any);
                setActiveTermIdx(0);
              }}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Term List */}
        <div className="lg:col-span-2 space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {activeNgrams.map((item, idx) => {
            const widthPct = (item.count / maxNgramCount) * 100;
            const isSelected = activeTermIdx === idx;
            return (
              <button 
                key={idx} 
                onClick={() => setActiveTermIdx(idx)}
                className={`w-full text-left bg-muted/20 border rounded-lg p-3 space-y-2 transition-all flex flex-col ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/40 bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${isSelected ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      Rank #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-foreground font-mono lowercase truncate max-w-[180px] sm:max-w-[280px]">
                      &ldquo;{item.term}&rdquo;
                    </span>
                  </div>
                  <div className="text-right flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-foreground font-mono">{item.count.toLocaleString()}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">({item.percent}%)</span>
                  </div>
                </div>
                {/* Visual bar fill indicator */}
                <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-primary/65 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Term Detail Box */}
        <div className="bg-muted/30 border border-border/50 rounded-lg p-4.5 space-y-3 lg:sticky lg:top-4 self-stretch flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Term Insight Detail</span>
            <h5 className="text-base font-extrabold text-foreground font-mono lowercase">
              &ldquo;{activeTerm.term}&rdquo;
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              {activeTerm.context}
            </p>
          </div>
          <div className="border-t border-border/40 pt-3 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
            <span>Corpus Share:</span>
            <span className="font-bold text-foreground">{activeTerm.percent}% of abstracts</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: 128,286 concept-tagged papers via OpenAlex. Click any rank card to view terminology context.
      </div>
    </figure>
  );
}

// --- Blockchain-ML Convergence Matrix ---
export function StateOfWeb3ConvergenceMatrix() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fed-learn');
  const selectedNode = convergenceNodes.find(node => node.id === selectedNodeId) || convergenceNodes[0];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div>
        <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200">
          The Blockchain-AI Convergence Architecture
        </h4>
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
          Decentralized coordination layers connecting artificial intelligence with cryptography
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="space-y-2 flex flex-col justify-center">
          {convergenceNodes.map(node => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`text-left p-3.5 rounded-lg border transition-all text-sm font-sans relative ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-foreground font-semibold shadow-sm'
                    : 'border-border bg-muted/20 hover:border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Layers className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{node.label}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/10 border border-primary/20 text-primary">
                    {node.papers} papers
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Architectural Flow Diagram (REPLACES THE SLOP PULSING ICON) */}
        <div className="bg-muted/20 border border-border/50 rounded-lg p-5 flex flex-col justify-between text-left min-h-[220px]">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">{selectedNode.layer}</span>
            <div className="space-y-2">
              {selectedNode.dataFlow.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start text-[11px] text-muted-foreground leading-snug">
                  <ChevronRight className="w-3.5 h-3.5 text-primary/80 shrink-0 mt-0.5" />
                  <span className={idx === 1 || idx === 2 ? "font-mono font-medium text-foreground/80" : ""}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/60 border-t border-border/30 pt-2.5">
            <Zap className="w-3 h-3 text-amber-500 fill-current animate-pulse" />
            <span>Interactive Data Pipeline Flow</span>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Strategic Rationale</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedNode.description}
            </p>
          </div>
          <div className="bg-background rounded-lg p-2.5 border border-border/50 space-y-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Exemplar Research Document</p>
            <a href={selectedNode.exemplar.url} target="_blank" rel="noopener noreferrer" className="block text-xs font-bold text-foreground font-serif leading-snug hover:text-primary transition-colors line-clamp-2">
              &ldquo;{selectedNode.exemplar.title}&rdquo;
            </a>
            <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground pt-1.5">
              <span>{selectedNode.exemplar.authors} ({selectedNode.exemplar.year})</span>
              <span className="text-primary font-semibold">{selectedNode.exemplar.citations} cites</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: Co-occurrence analyses of 11,130 AI/ML papers in Web3 database. Click coordination layers on left to scrub pipelines.
      </div>
    </figure>
  );
}

// --- Topic Momentum Analyzer ---
export function StateOfWeb3Momentum() {
  const [activeMetricTab, setActiveMetricTab] = useState<'velocity' | 'volume'>('velocity');

  // Relative growth vs absolute paper counts
  const sortedMomentum = useMemo(() => {
    const list = [...momentumData];
    if (activeMetricTab === 'volume') {
      return list.sort((a, b) => b.count2026 - a.count2026);
    }
    return list.sort((a, b) => b.growth - a.growth);
  }, [activeMetricTab]);

  const maxVal = useMemo(() => {
    if (activeMetricTab === 'volume') {
      return Math.max(...momentumData.map(d => d.count2026));
    }
    return Math.max(...momentumData.map(d => d.growth));
  }, [activeMetricTab]);

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200">
            Topic Momentum Dashboard (2025-2026 vs. 2022-2023)
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Analyzing relative research velocity against absolute document counts
          </span>
        </div>
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetricTab('velocity')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeMetricTab === 'velocity' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Growth Velocity
          </button>
          <button
            onClick={() => setActiveMetricTab('volume')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeMetricTab === 'volume' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Absolute Volume
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
        {sortedMomentum.map((item, idx) => {
          const val = activeMetricTab === 'volume' ? item.count2026 : item.growth;
          const widthPct = (val / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1.5 flex flex-col justify-center">
              <div className="flex justify-between items-baseline text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="font-mono lowercase truncate max-w-[160px]">&ldquo;{item.term}&rdquo;</span>
                  <span className="text-[8px] font-sans font-bold px-1 py-0.2 rounded bg-secondary text-muted-foreground tracking-wider uppercase shrink-0">
                    {item.category.split(' ')[0]}
                  </span>
                </div>
                <div className="text-right font-mono font-bold text-primary">
                  {activeMetricTab === 'volume' ? `${item.count2026.toLocaleString()} papers` : `+${item.growth.toFixed(1)}x`}
                </div>
              </div>
              <div className="h-6 w-full bg-secondary rounded-full overflow-hidden relative flex items-center">
                <div 
                  className="h-full bg-primary/65 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${widthPct}%` }}
                />
                {/* Secondary metric helper inside bar container if there's room */}
                <span className="absolute right-2.5 text-[9px] font-mono text-muted-foreground/80">
                  {activeMetricTab === 'volume' ? `+${item.growth.toFixed(1)}x velocity` : `${item.count2026.toLocaleString()} papers`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4 flex flex-col sm:flex-row justify-between gap-2">
        <span>Source: 128,286 papers tracked in blockchain corpus. Toggle metric dashboard controls to rebuild ranking lists.</span>
        <span className="font-bold text-destructive font-mono uppercase text-[9px] self-start sm:self-auto">NFT / Metaverse in contraction (&lt;1.0x)</span>
      </div>
    </figure>
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
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200">
            Corpus Citation Skewness Distribution
          </h4>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mt-1">
            Exploration of academic citations and citation inequality
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold text-primary">
          {percentile}th Percentile
        </div>
      </div>

      {/* PARETO DISTRIBUTION MULTI-SEGMENT BAR CHART (REPLACES STATIC SLIDER TEXT ONLY) */}
      <div className="space-y-2 bg-muted/10 border border-border/40 rounded-lg p-4">
        <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          <span>Corpus Pareto Distribution Curve (Percentiles)</span>
          <span className="text-primary font-mono">{percentile}% threshold: {getPercentileCitations(percentile)} citations</span>
        </div>
        <div className="h-6 w-full rounded-full overflow-hidden flex text-[10px] font-mono font-bold text-white shadow-inner">
          <div 
            className={`h-full flex items-center justify-center transition-all ${percentile <= 50 ? 'bg-zinc-500 ring-2 ring-white ring-inset' : 'bg-zinc-300 dark:bg-zinc-800 text-muted-foreground'}`}
            style={{ width: '43.5%' }}
            title="Zero Citations (43.5% of papers)"
          >
            {percentile <= 50 ? 'Active' : '0 Cites (43.5%)'}
          </div>
          <div 
            className={`h-full flex items-center justify-center transition-all ${percentile > 50 && percentile <= 75 ? 'bg-primary ring-2 ring-white ring-inset text-white' : 'bg-sky-200 dark:bg-sky-950/40 text-sky-800'}`}
            style={{ width: '31.5%' }}
            title="Low Citations: 1-13 (31.5% of papers)"
          >
            {percentile > 50 && percentile <= 75 ? 'Active' : '1-13 (31.5%)'}
          </div>
          <div 
            className={`h-full flex items-center justify-center transition-all ${percentile > 75 && percentile <= 95 ? 'bg-primary ring-2 ring-white ring-inset text-white' : 'bg-blue-350 dark:bg-blue-900/60 text-blue-100'}`}
            style={{ width: '20%' }}
            title="Moderate Citations: 14-41 (20% of papers)"
          >
            {percentile > 75 && percentile <= 95 ? 'Active' : '14-41 (20%)'}
          </div>
          <div 
            className={`h-full flex items-center justify-center transition-all ${percentile > 95 ? 'bg-amber-500 ring-2 ring-white ring-inset text-white' : 'bg-amber-100 dark:bg-amber-950/20 text-amber-600'}`}
            style={{ width: '5%' }}
            title="Elite Citations: 42+ (5% of papers)"
          >
            {percentile > 95 ? 'Active' : '42+ (5%)'}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-light">
          Pareto curve colored relative to active slider. As you slide from 50th (median) to 99th percentile, notice how the citation thresholds grow exponentially.
        </p>
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
            {isNakamotoHighlight ? 'Reset Slider' : 'Trigger Satoshi Outlier Node (14,286 citations)'}
          </button>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 border-t border-border/50 pt-3 mt-4">
        Source: Citation aggregates on 128,286 papers. 43.5% of papers have zero citations.
      </div>
    </figure>
  );
}

// Keep backward compatibility exports
export function StateOfWeb3KeywordsChart() {
  return <StateOfWeb3NgramAnalyzer />;
}

export function StateOfWeb3BigramsChart() {
  return <StateOfWeb3Timeline />;
}
