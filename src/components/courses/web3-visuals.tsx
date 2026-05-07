'use client';

/* ─── Web Evolution ─── */
export function WebEvolution() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Web Evolution</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From reading to owning</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { era: 'Web1', period: '~1990–2004', model: 'Read-Only', desc: 'Static pages, open protocols', who: 'Users consume content', color: '#6b7280' },
            { era: 'Web2', period: '~2004–Now', model: 'Read-Write', desc: 'Social media, user-generated content', who: 'Platforms own your data', color: '#3b82f6' },
            { era: 'Web3', period: 'Emerging', model: 'Read-Write-Own', desc: 'Blockchain-based, decentralized', who: 'Users own data & assets', color: '#8b5cf6' },
          ].map((e) => (
            <div key={e.era} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: e.color }}>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: e.color }}>{e.era}</span>
                  <span className="text-[10px] text-muted-foreground/60">{e.period}</span>
                </div>
                <div className="text-[11px] font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-1">{e.model}</div>
                <p className="text-[10px] text-muted-foreground">{e.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{e.who}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Blockchain Explainer ─── */
export function BlockchainExplainer() {
  const concepts = [
    { title: 'Blocks = Pages', desc: 'Each block contains a list of transactions. Once full, it is sealed and added to the chain.', color: '#f59e0b' },
    { title: 'Chain = Binding', desc: 'Each block is cryptographically linked to the previous one, creating an unbreakable sequence.', color: '#ef4444' },
    { title: 'Distributed', desc: 'Everyone has a copy. No single master copy to attack. Updates sync across the network.', color: '#10b981' },
    { title: 'Gas Fees', desc: 'Crypto pays validators for processing. Economic incentives keep the network honest.', color: '#3b82f6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">How Blockchain Works</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">An immutable, distributed ledger of transactions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {concepts.map((c) => (
            <div key={c.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <div className="px-4 py-2.5">
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.title}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Smart Contracts ─── */
export function SmartContractExplainer() {
  const props = [
    { title: 'Autonomous', desc: 'Runs automatically when conditions are met: no human trigger needed.' },
    { title: 'Immutable', desc: 'Code cannot be changed after deployment: rules are permanent.' },
    { title: 'Transparent', desc: 'Code is visible to everyone on the blockchain for verification.' },
    { title: 'Composable', desc: '"Money Legos": developers combine existing contracts to build new products.' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Smart Contracts</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Self-executing programs on the blockchain: like a digital vending machine</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {props.map((p) => (
            <div key={p.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.title}</span>
              <p className="text-[10px] text-muted-foreground mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Web3 Ecosystem ─── */
export function Web3Ecosystem() {
  const pillars = [
    { title: 'dApps', desc: 'Decentralized apps: runs on smart contracts, no single company controls it', examples: 'Uniswap, Aave, OpenSea', color: '#3b82f6' },
    { title: 'NFTs', desc: 'Unique digital tokens proving ownership: art, tickets, identities', examples: 'CryptoPunks, Bored Apes, ENS', color: '#8b5cf6' },
    { title: 'DAOs', desc: 'Organizations governed by smart contracts and token-holder votes', examples: 'MakerDAO, Uniswap DAO, Nouns', color: '#ef4444' },
    { title: 'DeFi', desc: 'Decentralized finance: lending, trading without banks, 24/7', examples: 'Aave, Compound, Curve', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Web3 Ecosystem</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four pillars of the decentralized internet</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="px-4 py-2.5">
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.title}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 italic">Examples: {p.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Web3 Passport (Getting Started) ─── */
export function Web3Passport() {
  const steps = [
    { num: '1', title: 'Get a Wallet', desc: 'Install MetaMask, Rainbow, or Phantom. This is your Web3 identity and login.', warning: '', color: '#3b82f6' },
    { num: '2', title: 'Secure Seed Phrase', desc: 'Write down your 12-24 word phrase offline. NEVER share it.', warning: 'Lose it = lose everything', color: '#ef4444' },
    { num: '3', title: 'Get Crypto', desc: 'Buy ETH on Coinbase/Kraken, then withdraw to your own wallet.', warning: 'Start with small amounts', color: '#f59e0b' },
    { num: '4', title: 'Explore', desc: 'Get an ENS name, try Uniswap, mint an NFT. Start small.', warning: 'Only risk what you can lose', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Your Web3 Passport</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four steps to get started today</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.num} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <span className="text-xs font-bold" style={{ color: s.color }}>Step {s.num}: {s.title}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                  {s.warning && <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5 font-semibold">{s.warning}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Web3 Future (Challenges vs Opportunities) ─── */
export function Web3Future() {
  const challenges = [
    { title: 'Scalability', desc: 'L2 solutions (Arbitrum, Optimism, Base) processing cheaper off main chain' },
    { title: 'UX Complexity', desc: 'Seed phrases, gas fees, network switching too hard for mainstream' },
    { title: 'Regulation', desc: 'Governments still developing legal frameworks (MiCA in EU)' },
  ];
  const opportunities = [
    { title: 'Creator Economy', desc: 'Artists sell directly via NFTs, keeping more revenue' },
    { title: 'User-Owned Platforms', desc: 'Social media governed by DAOs: users set the rules' },
    { title: 'Global DeFi', desc: 'Open financial services for anyone with internet access' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Challenges vs Opportunities</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">What's holding Web3 back, and what's pulling it forward</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-red-500/5">
              <span className="text-xs font-bold text-red-500 dark:text-red-400">Challenges</span>
            </div>
            <div className="px-4 py-2.5">
              {challenges.map((c) => (
                <div key={c.title} className="py-1.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">
                  <span className="text-[11px] font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.title}</span>
                  <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-green-500/5">
              <span className="text-xs font-bold text-green-600 dark:text-green-400">Opportunities</span>
            </div>
            <div className="px-4 py-2.5">
              {opportunities.map((o) => (
                <div key={o.title} className="py-1.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">
                  <span className="text-[11px] font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{o.title}</span>
                  <p className="text-[10px] text-muted-foreground">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── L2 Scaling ─── */
export function L2ScalingDiagram() {
  const l2s = [
    { name: 'Arbitrum', type: 'Optimistic Rollup', tps: '~4,000', cost: '~$0.01', color: '#3b82f6' },
    { name: 'Optimism', type: 'Optimistic Rollup', tps: '~2,000', cost: '~$0.02', color: '#ef4444' },
    { name: 'Base', type: 'Optimistic Rollup', tps: '~2,000', cost: '~$0.01', color: '#3b82f6' },
    { name: 'zkSync', type: 'ZK Rollup', tps: '~3,000', cost: '~$0.03', color: '#8b5cf6' },
    { name: 'Polygon zkEVM', type: 'ZK Rollup', tps: '~2,000', cost: '~$0.02', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Layer 2 Scaling Solutions</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Process transactions faster and cheaper off the main chain</p>

        <div className="mb-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Ethereum L1:</strong> ~15 TPS, $1-50+ per tx. L2s batch hundreds of transactions and post proofs back to L1.</span>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">L2</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">TPS</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Avg Cost</th>
              </tr>
            </thead>
            <tbody>
              {l2s.map((l) => (
                <tr key={l.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2 px-2 font-bold" style={{ color: l.color }}>{l.name}</td>
                  <td className="py-2 px-2 text-muted-foreground">{l.type}</td>
                  <td className="py-2 px-2 text-muted-foreground">{l.tps}</td>
                  <td className="py-2 px-2 text-muted-foreground">{l.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Tokenomics ─── */
export function TokenomicsVisual() {
  const types = [
    { label: 'Utility', desc: 'Pay for services on the network', example: 'ETH for gas fees', supply: 'Often inflationary', color: '#3b82f6' },
    { label: 'Governance', desc: 'Vote on protocol decisions', example: 'UNI, AAVE, MKR', supply: 'Fixed supply', color: '#8b5cf6' },
    { label: 'Security', desc: 'Represents ownership stake', example: 'Tokenized stock', supply: 'Regulated', color: '#10b981' },
    { label: 'Stablecoin', desc: 'Pegged to fiat currency', example: 'USDC, DAI, USDT', supply: 'Backed by reserves', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Token Types</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four categories of crypto tokens and their economic models</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Purpose</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Examples</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Supply Model</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.label} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2 px-2 font-bold" style={{ color: t.color }}>{t.label}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.desc}</td>
                  <td className="py-2 px-2 text-muted-foreground/60">{t.example}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.supply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── DeFi Stack ─── */
export function DeFiStackDiagram() {
  const layers = [
    { layer: 'Yield Aggregators', desc: 'Auto-optimize returns across protocols', examples: 'Yearn, Beefy', color: '#8b5cf6' },
    { layer: 'Lending & Borrowing', desc: 'Deposit to earn, borrow against collateral', examples: 'Aave, Compound', color: '#3b82f6' },
    { layer: 'Decentralized Exchanges', desc: 'Swap tokens peer-to-peer via liquidity pools', examples: 'Uniswap, Curve', color: '#10b981' },
    { layer: 'Stablecoins', desc: 'Price-stable assets as the unit of account', examples: 'USDC, DAI', color: '#f59e0b' },
    { layer: 'Settlement Layer', desc: 'The base blockchain securing all transactions', examples: 'Ethereum, Solana', color: '#6b7280' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The DeFi Stack</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Bottom to top: each layer builds on the one below</p>

        <div className="space-y-1.5">
          {layers.map((l, i) => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground/60 mr-2">L{layers.length - i}</span>
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.layer}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{l.desc}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60">{l.examples}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Security Red Flags ─── */
export function SecurityRedFlags() {
  const flags = [
    { title: 'Phishing Sites', desc: 'Fake websites mimicking real projects. Always check the URL.', severity: 'Critical' },
    { title: 'Rug Pulls', desc: 'Team hypes a token, raises money, then disappears.', severity: 'Critical' },
    { title: '"Free" Airdrops', desc: 'Messages offering free tokens that drain your wallet.', severity: 'High' },
    { title: 'Pump & Dumps', desc: 'Coordinated buying to inflate price, then insiders sell.', severity: 'High' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Security Red Flags</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Common scam patterns every Web3 user must know</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {flags.map((f) => (
            <div key={f.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: f.severity === 'Critical' ? '#ef4444' : '#f59e0b' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{f.title}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${f.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>{f.severity}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 1 (B): Web3 Timeline ─── */
export function Web3Timeline() {
  const eras = [
    { year: '1991', event: 'Web 1.0: Read-only websites', desc: 'Static HTML pages, one-way information flow', color: '#94a3b8' },
    { year: '2004', event: 'Web 2.0: Read-write platforms', desc: 'Social media, user-generated content, platform monopolies', color: '#3b82f6' },
    { year: '2009', event: 'Bitcoin: first blockchain', desc: 'Peer-to-peer money without banks or intermediaries', color: '#f59e0b' },
    { year: '2015', event: 'Ethereum: programmable blockchain', desc: 'Smart contracts turn blockchains into computers', color: '#8b5cf6' },
    { year: '2024', event: 'Web3: read-write-own', desc: 'Users own their data, identity, and digital assets', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Web3 Timeline</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">35 years from static pages to user ownership</p>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2">
            {eras.map(e => (
              <div key={e.year} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-2">
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: e.color }}>{e.year}</div>
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-2.5">
                  <span className="text-xs font-bold" style={{ color: e.color }}>{e.event}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2 (B): Consensus Comparison ─── */
export function ConsensusComparison() {
  const mechanisms = [
    { name: 'Proof of Work', energy: 'Very High', speed: '7-15 TPS', security: 'Very High', used: 'Bitcoin', color: '#f59e0b' },
    { name: 'Proof of Stake', energy: 'Low', speed: '15-100K TPS', security: 'High', used: 'Ethereum, Solana', color: '#10b981' },
    { name: 'Delegated PoS', energy: 'Low', speed: '1,000+ TPS', security: 'Medium', used: 'EOS, Tron', color: '#3b82f6' },
    { name: 'Proof of Authority', energy: 'Minimal', speed: '1,000+ TPS', security: 'Lower', used: 'Private chains', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Consensus Mechanism Comparison</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">How different blockchains achieve agreement on truth</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Mechanism', 'Energy', 'Speed', 'Security', 'Used By'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {mechanisms.map(m => (
                <tr key={m.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: m.color }}>{m.name}</td>
                  <td className="px-2 py-2 text-muted-foreground">{m.energy}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{m.speed}</td>
                  <td className="px-2 py-2 text-muted-foreground">{m.security}</td>
                  <td className="px-2 py-2 text-muted-foreground/60">{m.used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3 (B): Smart Contract Platforms ─── */
export function SmartContractPlatforms() {
  const platforms = [
    { name: 'Ethereum', lang: 'Solidity', tvl: '$60B+', fees: '$1-50', strength: 'Largest developer ecosystem', color: '#8b5cf6' },
    { name: 'Solana', lang: 'Rust', tvl: '$8B+', fees: '<$0.01', strength: 'Speed (400ms finality)', color: '#10b981' },
    { name: 'Base', lang: 'Solidity', tvl: '$10B+', fees: '<$0.01', strength: 'Coinbase distribution + Ethereum security', color: '#3b82f6' },
    { name: 'Sui', lang: 'Move', tvl: '$1B+', fees: '<$0.01', strength: 'Object-oriented data model', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Smart Contract Platforms</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Where developers deploy on-chain programs today</p>
        <div className="space-y-1.5">
          {platforms.map(p => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <span className="text-xs font-bold min-w-[80px]" style={{ color: p.color }}>{p.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground min-w-[50px]">{p.lang}</span>
              <span className="text-[10px] text-muted-foreground min-w-[60px]">TVL: {p.tvl}</span>
              <span className="text-[10px] text-muted-foreground flex-1 hidden md:block">{p.strength}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4 (B): NFT Use Cases ─── */
export function NFTUseCases() {
  const cases = [
    { category: 'Digital Art', example: 'Art Blocks generative art', market: 'Established', color: '#8b5cf6' },
    { category: 'Gaming Assets', example: 'In-game items, skins, characters', market: 'Growing', color: '#3b82f6' },
    { category: 'Identity', example: 'ENS names, on-chain credentials', market: 'Early', color: '#10b981' },
    { category: 'Real-World Assets', example: 'Tokenized real estate, bonds', market: 'Emerging', color: '#f59e0b' },
    { category: 'Memberships', example: 'Access passes, community tokens', market: 'Growing', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">NFT Use Cases Beyond Art</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Non-fungible tokens are programmable ownership certificates</p>
        <div className="space-y-1.5">
          {cases.map(c => (
            <div key={c.category} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <span className="text-xs font-bold min-w-[120px]" style={{ color: c.color }}>{c.category}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{c.example}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: c.color + '15', color: c.color }}>{c.market}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5 (B): Wallet Comparison ─── */
export function WalletComparison() {
  const wallets = [
    { name: 'MetaMask', type: 'Browser extension', chains: 'Ethereum + EVMs', best: 'Most dApp compatibility', color: '#f59e0b' },
    { name: 'Phantom', type: 'Browser extension', chains: 'Solana, Ethereum', best: 'Solana ecosystem', color: '#8b5cf6' },
    { name: 'Coinbase Wallet', type: 'Mobile + extension', chains: 'Multi-chain', best: 'Beginners, fiat on-ramp', color: '#3b82f6' },
    { name: 'Ledger', type: 'Hardware device', chains: 'Multi-chain', best: 'Cold storage security', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Wallet Comparison</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Choosing the right wallet for your use case</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Wallet', 'Type', 'Chains', 'Best For'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {wallets.map(w => (
                <tr key={w.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: w.color }}>{w.name}</td>
                  <td className="px-2 py-2 text-muted-foreground">{w.type}</td>
                  <td className="px-2 py-2 text-muted-foreground">{w.chains}</td>
                  <td className="px-2 py-2 text-muted-foreground/60">{w.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6 (B): Regulation Map ─── */
export function RegulationMap() {
  const regions = [
    { region: 'European Union', framework: 'MiCA (Markets in Crypto-Assets)', status: 'Active', stance: 'Pro-regulation', color: '#3b82f6' },
    { region: 'United States', framework: 'SEC / CFTC dual oversight', status: 'Evolving', stance: 'Enforcement-driven', color: '#f59e0b' },
    { region: 'Singapore', framework: 'Payment Services Act', status: 'Active', stance: 'Innovation-friendly', color: '#10b981' },
    { region: 'UAE (Dubai)', framework: 'VARA (Virtual Assets Regulatory Authority)', status: 'Active', stance: 'Pro-crypto hub', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Global Regulatory Landscape</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">How major jurisdictions are approaching crypto regulation</p>
        <div className="space-y-1.5">
          {regions.map(r => (
            <div key={r.region} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: r.color }}>
              <span className="text-xs font-bold min-w-[100px]" style={{ color: r.color }}>{r.region}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{r.framework}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: r.color + '15', color: r.color }}>{r.stance}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7 (B): L2 Comparison ─── */
export function L2Comparison() {
  const l2s = [
    { name: 'Arbitrum', type: 'Optimistic Rollup', tps: '40,000', tvl: '$15B+', fee: '$0.01-0.10', color: '#3b82f6' },
    { name: 'Optimism', type: 'Optimistic Rollup', tps: '2,000', tvl: '$7B+', fee: '$0.01-0.10', color: '#ef4444' },
    { name: 'Base', type: 'Optimistic Rollup', tps: '2,000', tvl: '$10B+', fee: '<$0.01', color: '#3b82f6' },
    { name: 'zkSync', type: 'ZK Rollup', tps: '2,000', tvl: '$1B+', fee: '$0.01-0.05', color: '#8b5cf6' },
    { name: 'StarkNet', type: 'ZK Rollup', tps: '500', tvl: '$500M+', fee: '$0.01-0.05', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Layer 2 Comparison</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Leading Ethereum scaling solutions by type, speed, and liquidity</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['L2', 'Type', 'TPS', 'TVL', 'Avg Fee'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {l2s.map(l => (
                <tr key={l.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: l.color }}>{l.name}</td>
                  <td className="px-2 py-2 text-muted-foreground">{l.type}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{l.tps}</td>
                  <td className="px-2 py-2 text-muted-foreground">{l.tvl}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground/60">{l.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 8 (B): Token Value Drivers ─── */
export function TokenValueDrivers() {
  const drivers = [
    { driver: 'Utility', desc: 'Token is required to use the protocol (gas, staking, governance)', impact: 'High', color: '#10b981' },
    { driver: 'Scarcity', desc: 'Token burns, halving events, fixed supply caps', impact: 'High', color: '#f59e0b' },
    { driver: 'Revenue Share', desc: 'Protocol distributes fees to token holders', impact: 'Very High', color: '#8b5cf6' },
    { driver: 'Network Effects', desc: 'More users = more value for all participants', impact: 'High', color: '#3b82f6' },
    { driver: 'Speculation', desc: 'Market sentiment and trading activity', impact: 'Variable', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Token Value Drivers</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Five factors that determine whether a token accrues value</p>
        <div className="space-y-1.5">
          {drivers.map(d => (
            <div key={d.driver} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: d.color }}>
              <span className="text-xs font-bold min-w-[110px]" style={{ color: d.color }}>{d.driver}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{d.desc}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: d.color + '15', color: d.color }}>{d.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

