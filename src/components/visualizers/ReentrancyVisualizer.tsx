"use client";
import React, { useState } from 'react';
export function ReentrancyVisualizer() {
  const [vBal, setVBal] = useState(10);
  const [aBal, setABal] = useState(0);
  const [activeLine, setActiveLine] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const handleAttack = async () => {
    setIsAnimating(true);
    let cv = 10, ca = 0;
    while(cv > 0) {
      setActiveLine('line5'); await sleep(400); setActiveLine(null);
      setActiveLine('line1'); await sleep(400); setActiveLine(null);
      setActiveLine('line2'); await sleep(300);
      cv -= 1; ca += 1; setVBal(cv); setABal(ca);
      await sleep(300); setActiveLine(null);
      setActiveLine('line4'); await sleep(400); setActiveLine(null);
    }
    setActiveLine('line3'); await sleep(600); setActiveLine(null);
    setIsAnimating(false);
  };
  const reset = () => { setVBal(10); setABal(0); setActiveLine(null); setIsAnimating(false); };
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-10">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Contract Reentrancy</h3>
        <p className="text-slate-500 mt-2">Visualizing the fallback loop vulnerability</p>
      </div>
      <div className="flex gap-12 items-center justify-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm w-full max-w-3xl">
        <div className="flex flex-col items-center w-[220px] p-6 rounded-2xl border-2 border-blue-600 shadow-[0_4px_20px_rgba(10,102,194,0.15)] bg-white">
          <h4 className="text-blue-600 font-bold mb-4 text-lg">Target Vault</h4>
          <div className="text-4xl font-bold font-mono text-slate-900">{vBal} ETH</div>
          <div className="mt-6 font-mono text-xs bg-slate-50 p-4 rounded-lg w-full text-slate-600 leading-relaxed text-left">
            <div>{"function withdraw() {"}</div>
            <div className={`ml-4 ${activeLine === 'line1' ? 'text-rose-600 font-bold' : ''}`}>{"require(bal > 0);"}</div>
            <div className={`ml-4 ${activeLine === 'line2' ? 'text-rose-600 font-bold' : ''}`}>{"msg.sender.call{value}('');"}</div>
            <div className={`ml-4 ${activeLine === 'line3' ? 'text-rose-600 font-bold' : ''}`}>{"bal = 0;"}</div>
            <div>{"}"}</div>
          </div>
        </div>
        <div className="flex flex-col items-center w-[220px] p-6 rounded-2xl border-2 border-rose-600 shadow-[0_4px_20px_rgba(225,29,72,0.15)] bg-white">
          <h4 className="text-rose-600 font-bold mb-4 text-lg">Attacker</h4>
          <div className="text-4xl font-bold font-mono text-slate-900">{aBal} ETH</div>
          <div className="mt-6 font-mono text-xs bg-slate-50 p-4 rounded-lg w-full text-slate-600 leading-relaxed text-left">
            <div>{"fallback() payable {"}</div>
            <div className={`ml-4 ${activeLine === 'line4' ? 'text-rose-600 font-bold' : ''}`}>{"if(vault.bal > 0) {"}</div>
            <div className={`ml-8 ${activeLine === 'line5' ? 'text-rose-600 font-bold' : ''}`}>{"vault.withdraw();"}</div>
            <div className="ml-4">{"}"}</div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={reset} disabled={isAnimating} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50">Reset</button>
        <button onClick={handleAttack} disabled={isAnimating || vBal === 0} className="px-6 py-3 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all disabled:opacity-50">Execute Attack</button>
      </div>
    </div>
  );
}