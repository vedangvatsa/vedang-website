"use client";

import React, { useState } from 'react';

export function MEVVisualizer() {
  const [step, setStep] = useState(0); // 0: innocent user pending, 1: MEV detected, 2: sandwich executed

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Maximal Extractable Value (MEV)</h3>
        <p className="text-slate-500 mt-2">Visualizing a "Sandwich Attack" in the mempool.</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Mempool (Pending Transactions)</div>
        
        <div className="flex flex-col gap-3 relative">
          
          {/* Top of block - Front run */}
          <div className={`p-4 rounded-xl border-2 transition-all duration-500 flex justify-between items-center ${step >= 2 ? 'border-rose-500 bg-rose-50 opacity-100 translate-y-0' : 'border-transparent bg-transparent opacity-0 -translate-y-4'}`}>
            <div>
              <div className="font-bold text-rose-600">MEV Bot: Buy (Front-run)</div>
              <div className="text-xs text-rose-500 font-mono mt-1">High Gas Fee (bribes miner)</div>
            </div>
            <div className="text-rose-600 font-mono font-bold">+ Profit</div>
          </div>

          {/* Innocent User */}
          <div className={`p-4 rounded-xl border-2 transition-all duration-500 flex justify-between items-center ${step === 0 ? 'border-blue-400 bg-blue-50 shadow-md' : step === 1 ? 'border-amber-400 bg-amber-50 animate-pulse' : 'border-slate-300 bg-slate-100'}`}>
            <div>
              <div className="font-bold text-slate-700">Innocent User: Large Buy Order</div>
              <div className="text-xs text-slate-500 font-mono mt-1">Standard Gas Fee</div>
            </div>
            {step >= 2 && <div className="text-slate-500 font-mono text-sm">Executes at worse price</div>}
          </div>

          {/* Bottom of block - Back run */}
          <div className={`p-4 rounded-xl border-2 transition-all duration-500 flex justify-between items-center ${step >= 2 ? 'border-rose-500 bg-rose-50 opacity-100 translate-y-0' : 'border-transparent bg-transparent opacity-0 translate-y-4'}`}>
            <div>
              <div className="font-bold text-rose-600">MEV Bot: Sell (Back-run)</div>
              <div className="text-xs text-rose-500 font-mono mt-1">Standard Gas Fee</div>
            </div>
            <div className="text-rose-600 font-mono font-bold">+ Profit</div>
          </div>

        </div>

        <div className="mt-8 bg-slate-100 rounded-xl p-4 text-center font-mono text-sm text-slate-600 min-h-[80px] flex items-center justify-center">
          {step === 0 && "1. A user submits a large buy transaction. It waits in the public mempool."}
          {step === 1 && "2. The MEV Bot spots the transaction and calculates that it will push the token price up."}
          {step === 2 && "3. The bot pays high gas to buy right BEFORE the user, then sells right AFTER. The bot pockets the difference!"}
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button 
            onClick={reset}
            disabled={step === 0}
            className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Reset
          </button>
          <button 
            onClick={handleNext}
            disabled={step === 2}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 ${step === 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-600 hover:bg-rose-700'}`}
          >
            {step === 0 ? "Scan Mempool (Bot)" : step === 1 ? "Execute Sandwich Attack!" : "Attack Complete"}
          </button>
        </div>

      </div>
    </div>
  );
}
    }, 4000);

    setTimeout(() => {
      setStep(4);
      setIsAttacking(false);
    }, 5500);
  };

  const reset = () => {
    setStep(-1);
    setProfit(0);
    setMempool([
      { id: 1, type: 'buy', token: 'ETH', amount: 50, gas: 30, from: 'Alice' },
      { id: 2, type: 'buy', token: 'ETH', amount: 200, gas: 25, from: 'Bob' },
      { id: 3, type: 'sell', token: 'ETH', amount: 80, gas: 20, from: 'Carol' },
    ]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">MEV Sandwich Attack</h3>
        <p className="text-slate-600 max-w-2xl">Watch how MEV bots profit by manipulating transaction ordering</p>
      </div>

      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 600 350" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Mempool */}
          <g transform="translate(20, 20)">
            <rect width={260} height={310} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x={130} y={25} textAnchor="middle" fontSize="12" fill="#334155" fontWeight="bold">📋 Mempool (Pending TXs)</text>

            {mempool.map((tx, i) => {
              const y = 45 + i * 55;
              const isBot = tx.from.includes('Bot');
              const isSandwiched = step >= 2 && tx.id === 2;
              return (
                <g key={tx.id} transform={`translate(15, ${y})`}>
                  <rect width={230} height={45} rx={8}
                    fill={isBot ? '#fef3c7' : isSandwiched ? '#fef2f2' : '#ffffff'}
                    stroke={isBot ? '#f59e0b' : isSandwiched ? '#ef4444' : '#e2e8f0'} strokeWidth="1.5" />
                  <text x={10} y={18} fontSize="9" fill="#334155" fontWeight="600">{tx.from}</text>
                  <text x={10} y={33} fontSize="8" fill="#64748b">
                    {tx.type.toUpperCase()} {tx.amount} {tx.token} (gas: {tx.gas} gwei)
                  </text>
                  {isBot && <text x={200} y={18} textAnchor="end" fontSize="8" fill="#f59e0b" fontWeight="bold">MEV</text>}
                  {isSandwiched && <text x={200} y={18} textAnchor="end" fontSize="8" fill="#ef4444" fontWeight="bold">VICTIM</text>}
                </g>
              );
            })}
          </g>

          {/* Attack diagram */}
          <g transform="translate(320, 30)">
            <rect width={260} height={160} rx={12} fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5" />
            <text x={130} y={25} textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold">🥪 Sandwich Attack</text>

            {/* Step visualization */}
            {[
              { label: '1. Front-run', desc: 'Buy before victim', y: 50, active: step >= 1, color: '#f59e0b' },
              { label: '2. Victim trades', desc: 'Gets worse price', y: 85, active: step >= 2, color: '#ef4444' },
              { label: '3. Back-run', desc: 'Sell at higher price', y: 120, active: step >= 3, color: '#f59e0b' },
            ].map((s, i) => (
              <g key={i} transform={`translate(20, ${s.y})`}>
                <circle cx={10} cy={0} r={10} fill={s.active ? s.color : '#e2e8f0'} className="transition-all duration-300" />
                <text x={10} y={4} textAnchor="middle" fontSize="8" fill={s.active ? 'white' : '#94a3b8'} fontWeight="bold">{i + 1}</text>
                <text x={30} y={-2} fontSize="9" fill={s.active ? '#334155' : '#94a3b8'} fontWeight="600">{s.label}</text>
                <text x={30} y={12} fontSize="8" fill={s.active ? '#64748b' : '#d4d4d8'}>{s.desc}</text>
              </g>
            ))}
          </g>

          {/* Profit */}
          {profit > 0 && (
            <g transform="translate(320, 210)">
              <rect width={260} height={60} rx={12} fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
              <text x={130} y={25} textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">
                🤖 Bot profit: +${profit} USDC
              </text>
              <text x={130} y={45} textAnchor="middle" fontSize="9" fill="#ef4444">
                Bob lost ${profit} to price manipulation
              </text>
            </g>
          )}

          {/* Price chart */}
          <g transform="translate(320, 280)">
            <rect width={260} height={50} rx={8} fill="#f1f5f9" stroke="#e2e8f0" />
            <text x={10} y={15} fontSize="8" fill="#64748b">ETH Price</text>
            <polyline points={step >= 1 ? "20,35 60,35 80,20 140,15 180,20 220,35 240,35" : "20,35 240,35"}
              fill="none" stroke={step >= 1 ? '#ef4444' : '#94a3b8'} strokeWidth="2" className="transition-all duration-500" />
            {step >= 1 && <text x={80} y={12} fontSize="7" fill="#ef4444">↑ front-run</text>}
            {step >= 3 && <text x={180} y={12} fontSize="7" fill="#22c55e">↓ back-run</text>}
          </g>
        </svg>
      </div>

      <div className="flex gap-3">
        <button onClick={sandwichAttack} disabled={isAttacking || step > -1}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium transition-all">
          🥪 Execute Sandwich Attack
        </button>
        <button onClick={reset}
          className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 font-medium transition-all">
          ↺ Reset
        </button>
      </div>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        MEV (Maximal Extractable Value) is profit extracted by reordering, inserting, or censoring transactions. In a sandwich attack, a bot sees a large pending trade, buys before it (front-running) to push the price up, lets the victim trade at the inflated price, then sells immediately after (back-running) to pocket the difference.
      </p>
    </div>
  );
}
