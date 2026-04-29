'use client';

import { Globe, Link2, Blocks, FileCode2, Users, Shield, Coins, Vote } from 'lucide-react';

/* ─── Web Evolution ─── */
export function WebEvolution() {
  const eras = [
    { label: 'Web1', period: '~1990–2004', desc: 'Read-Only', detail: 'Static pages, open protocols, users consume content', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/5 border-slate-500/20' },
    { label: 'Web2', period: '~2004–Now', desc: 'Read-Write', detail: 'Social media, user-generated content, centralized platforms own your data', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
    { label: 'Web3', period: 'Emerging', desc: 'Read-Write-Own', detail: 'Blockchain-based, users own data & assets, decentralized protocols', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/5 border-purple-500/20' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {eras.map((e, i) => (
        <div key={e.label} className={`p-5 rounded-xl border ${e.bg} relative`}>
          {i < eras.length - 1 && <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg z-10">→</div>}
          <div className={`text-xs font-bold uppercase tracking-wider ${e.color} mb-1`}>{e.label}</div>
          <div className="text-xs text-muted-foreground mb-2">{e.period}</div>
          <div className="font-semibold text-sm mb-2">{e.desc}</div>
          <p className="text-xs text-muted-foreground leading-relaxed">{e.detail}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Blockchain Explainer ─── */
export function BlockchainExplainer() {
  const concepts = [
    { icon: Blocks, title: 'Blocks = Pages', desc: 'Each block contains a list of transactions. Once full, it is sealed and added to the chain.', color: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-500/10' },
    { icon: Link2, title: 'Chain = Binding', desc: 'Each block is cryptographically linked to the previous one, creating an unbreakable sequence.', color: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-500/10' },
    { icon: Globe, title: 'Distributed', desc: 'Everyone has a copy. No single master copy to attack. Updates sync across the entire network.', color: 'text-teal-600 dark:text-teal-400', iconBg: 'bg-teal-500/10' },
    { icon: Coins, title: 'Gas Fees', desc: 'Crypto pays validators for processing transactions. Economic incentives keep the network honest.', color: 'text-yellow-600 dark:text-yellow-400', iconBg: 'bg-yellow-500/10' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {concepts.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="p-4 rounded-xl border bg-card">
            <div className={`${c.iconBg} p-2 rounded-lg ${c.color} inline-block mb-3`}><Icon className="w-5 h-5" /></div>
            <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Smart Contracts ─── */
export function SmartContractExplainer() {
  const props = [
    { title: 'Autonomous', desc: 'Runs automatically when conditions are met — no human trigger needed.' },
    { title: 'Immutable', desc: 'Code cannot be changed after deployment — rules are permanent.' },
    { title: 'Transparent', desc: 'Code is visible to everyone on the blockchain for verification.' },
    { title: 'Composable', desc: '"Money Legos" — developers combine existing contracts to build new products.' },
  ];
  return (
    <div className="not-prose my-6 p-6 bg-card border rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><FileCode2 className="w-5 h-5" /></div>
        <div>
          <h4 className="font-semibold text-base">Smart Contracts</h4>
          <p className="text-xs text-muted-foreground">Self-executing programs on the blockchain — like a digital vending machine</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {props.map((p) => (
          <div key={p.title} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <div className="font-medium text-sm text-emerald-700 dark:text-emerald-400 mb-1">{p.title}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Web3 Ecosystem (dApps, NFTs, DAOs) ─── */
export function Web3Ecosystem() {
  const pillars = [
    { icon: Globe, title: 'dApps', desc: 'Decentralized apps — looks like a website but runs on blockchain smart contracts. No single company controls it.', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20', iconBg: 'bg-blue-500/10' },
    { icon: Shield, title: 'NFTs', desc: 'Unique digital tokens proving ownership — art, game items, tickets, identities. Creates verifiable digital scarcity.', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/5 border-purple-500/20', iconBg: 'bg-purple-500/10' },
    { icon: Vote, title: 'DAOs', desc: 'Decentralized Autonomous Organizations — groups governed by smart contracts and token-holder votes, not executives.', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/5 border-rose-500/20', iconBg: 'bg-rose-500/10' },
    { icon: Coins, title: 'DeFi', desc: 'Decentralized Finance — lending, borrowing, trading without banks. Open 24/7, permissionless, globally accessible.', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20', iconBg: 'bg-emerald-500/10' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {pillars.map((p) => {
        const Icon = p.icon;
        return (
          <div key={p.title} className={`p-4 rounded-xl border ${p.bg}`}>
            <div className={`${p.iconBg} p-2 rounded-lg ${p.color} inline-block mb-3`}><Icon className="w-5 h-5" /></div>
            <h4 className="font-semibold text-sm mb-1">{p.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Web3 Passport (Getting Started) ─── */
export function Web3Passport() {
  const steps = [
    { num: '1', title: 'Get a Wallet', desc: 'Install MetaMask, Rainbow, or Phantom. This is your Web3 identity and login.', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/5 border-cyan-500/20' },
    { num: '2', title: 'Secure Seed Phrase', desc: 'Write down your 12-24 word phrase offline. NEVER share it. Lose it = lose everything.', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
    { num: '3', title: 'Get Crypto', desc: 'Buy ETH on Coinbase/Kraken, then withdraw to your own wallet for true self-custody.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
    { num: '4', title: 'Explore', desc: 'Get an ENS name, try Uniswap, mint an NFT. Start small — only risk what you can lose.', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {steps.map((s) => (
        <div key={s.num} className={`p-4 rounded-xl border ${s.bg}`}>
          <div className={`text-2xl font-bold ${s.color} mb-2`}>{s.num}</div>
          <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Web3 Future ─── */
export function Web3Future() {
  const items = [
    { title: 'Scalability', desc: 'Layer 2 solutions (Arbitrum, Optimism, Base) process transactions faster and cheaper off the main chain.', type: 'challenge' },
    { title: 'UX Complexity', desc: 'Seed phrases, gas fees, and network switching are still too hard for mainstream users.', type: 'challenge' },
    { title: 'Regulation', desc: 'Governments worldwide are still developing legal frameworks for crypto and DeFi.', type: 'challenge' },
    { title: 'Creator Economy', desc: 'Artists sell directly via NFTs, keeping more revenue without platform intermediaries.', type: 'promise' },
    { title: 'User-Owned Platforms', desc: 'Social media and gaming governed by DAOs — users set the rules and share the value.', type: 'promise' },
    { title: 'Global DeFi', desc: 'Open financial services for anyone with internet access — no bank account required.', type: 'promise' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">Challenges</div>
        {items.filter(i => i.type === 'challenge').map((item) => (
          <div key={item.title} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="font-medium text-sm mb-1">{item.title}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Opportunities</div>
        {items.filter(i => i.type === 'promise').map((item) => (
          <div key={item.title} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <div className="font-medium text-sm mb-1">{item.title}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Module 7: L2 Scaling ─── */
export function L2ScalingDiagram() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 250" className="w-full h-auto" role="img" aria-label="Layer 2 scaling diagram showing rollups batching transactions to Layer 1">
        {/* L1 base */}
        <rect x={100} y={180} width={600} height={50} rx={10} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={2} />
        <text x={400} y={210} textAnchor="middle" fill="#f59e0b" fontSize={16} fontWeight={700}>Layer 1 — Ethereum Mainnet</text>
        <text x={400} y={225} textAnchor="middle" fill="#f59e0b" fontSize={10} opacity={0.6}>Slow, expensive, ultra-secure</text>

        {/* L2s */}
        {[
          { x: 110, label: 'Arbitrum', color: '#3b82f6' },
          { x: 310, label: 'Optimism', color: '#ef4444' },
          { x: 510, label: 'Base', color: '#3b82f6' },
        ].map((l2) => (
          <g key={l2.label}>
            <rect x={l2.x} y={50} width={170} height={45} rx={8} fill={`${l2.color}12`} stroke={l2.color} strokeWidth={1.5} />
            <text x={l2.x + 85} y={77} textAnchor="middle" fill={l2.color} fontSize={13} fontWeight={700}>{l2.label}</text>
            {/* Tx dots */}
            {[0, 20, 40, 60, 80, 100, 120].map((dx) => (
              <circle key={dx} cx={l2.x + 25 + dx} cy={25} r={4} fill={`${l2.color}40`} stroke={l2.color} strokeWidth={0.5} />
            ))}
            <text x={l2.x + 85} y={18} textAnchor="middle" fill={l2.color} fontSize={9} opacity={0.6}>Transactions</text>
            {/* Arrow down */}
            <line x1={l2.x + 85} y1={95} x2={l2.x + 85} y2={175} stroke={l2.color} strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={l2.x + 95} y={140} fill={l2.color} fontSize={9} opacity={0.7}>Batch</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Module 8: Tokenomics ─── */
export function TokenomicsVisual() {
  const types = [
    { label: 'Utility', desc: 'Pay for services', example: 'ETH for gas', color: '#3b82f6' },
    { label: 'Governance', desc: 'Vote on proposals', example: 'UNI, AAVE', color: '#8b5cf6' },
    { label: 'Security', desc: 'Represents ownership', example: 'Tokenized stock', color: '#10b981' },
    { label: 'Stablecoin', desc: 'Pegged to fiat', example: 'USDC, DAI', color: '#f59e0b' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {types.map((t) => (
        <div key={t.label} className="p-4 rounded-xl border bg-card text-center">
          <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: t.color }}>{t.label[0]}</div>
          <h4 className="font-semibold text-sm mb-1">{t.label}</h4>
          <p className="text-xs text-muted-foreground">{t.desc}</p>
          <p className="text-xs text-muted-foreground/70 italic mt-1">{t.example}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── DeFi Stack Diagram ─── */
export function DeFiStackDiagram() {
  const layers = [
    { label: 'Yield Aggregators', desc: 'Yearn, Beefy — auto-optimize your returns across protocols', color: '#8b5cf6', bg: 'bg-purple-500/5 border-purple-500/20' },
    { label: 'Lending & Borrowing', desc: 'Aave, Compound — deposit to earn, borrow against collateral', color: '#3b82f6', bg: 'bg-blue-500/5 border-blue-500/20' },
    { label: 'Decentralized Exchanges', desc: 'Uniswap, Curve — swap tokens peer-to-peer via liquidity pools', color: '#10b981', bg: 'bg-emerald-500/5 border-emerald-500/20' },
    { label: 'Stablecoins', desc: 'USDC, DAI — price-stable assets that serve as DeFi\'s unit of account', color: '#f59e0b', bg: 'bg-amber-500/5 border-amber-500/20' },
    { label: 'Settlement Layer', desc: 'Ethereum, Solana — the base blockchain that secures all transactions', color: '#6b7280', bg: 'bg-gray-500/5 border-gray-500/20' },
  ];
  return (
    <div className="not-prose my-6">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">The DeFi Stack — Bottom to Top</div>
      <div className="space-y-2">
        {[...layers].reverse().map((l, i) => (
          <div key={l.label} className={`p-3 rounded-lg border ${l.bg} flex items-start gap-3`}>
            <div className="text-xs font-mono font-bold mt-0.5 shrink-0 w-4" style={{ color: l.color }}>{layers.length - i}</div>
            <div>
              <div className="font-medium text-sm" style={{ color: l.color }}>{l.label}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Security Red Flags ─── */
export function SecurityRedFlags() {
  const flags = [
    { title: 'Phishing Sites', desc: 'Fake websites mimicking real projects. Always check the URL before connecting your wallet.', severity: 'Critical' },
    { title: 'Rug Pulls', desc: 'Team hypes a token, raises money, then disappears. Red flag: anonymous team + unrealistic promises.', severity: 'Critical' },
    { title: '"Free" Airdrops', desc: 'Messages offering free tokens that require wallet connection to unknown sites. These drain your wallet.', severity: 'High' },
    { title: 'Pump & Dumps', desc: 'Coordinated buying to inflate price, then insiders sell. If a coin is being shilled everywhere, be skeptical.', severity: 'High' },
  ];
  return (
    <div className="not-prose my-6 p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
      <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">Common Scam Patterns</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {flags.map((f) => (
          <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${f.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'}`} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{f.title}</span>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${f.severity === 'Critical' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>{f.severity}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

