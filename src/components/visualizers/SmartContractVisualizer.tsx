"use client";
import React, { useState } from 'react';
export function SmartContractVisualizer() {
  const [deposited, setDeposited] = useState(false);
  const [condition, setCondition] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Contract</h3>
        <p className="text-slate-500 mt-2">Self-executing code: IF condition met THEN transfer funds.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className={`p-6 rounded-xl border-2 text-center ${deposited ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'}`}>
            <div className="font-bold text-slate-700">Buyer</div>
            <div className="text-sm text-slate-500 mt-1">{deposited ? '1 ETH deposited' : 'Waiting'}</div>
          </div>
          <div className="p-6 rounded-xl border-2 border-indigo-400 bg-indigo-50 text-center">
            <div className="font-bold text-indigo-700">Smart Contract</div>
            <div className="text-xs font-mono text-indigo-600 mt-1">if (delivered) send()</div>
          </div>
          <div className={`p-6 rounded-xl border-2 text-center ${condition ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'}`}>
            <div className="font-bold text-slate-700">Seller</div>
            <div className="text-sm text-slate-500 mt-1">{condition ? 'Funds received!' : 'Waiting'}</div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => { setDeposited(true); setCondition(false); }} disabled={deposited} className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50">Deposit Funds</button>
          <button onClick={() => setCondition(true)} disabled={!deposited || condition} className="px-6 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50">Confirm Delivery</button>
          <button onClick={() => { setDeposited(false); setCondition(false); }} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 transition-all">Reset</button>
        </div>
      </div>
    </div>
  );
}