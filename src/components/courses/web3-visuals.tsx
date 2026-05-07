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
