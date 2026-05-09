"use client";

import React, { useState } from 'react';

export function DecentralizedExchangeDexVisualizer() {
  const [showRight, setShowRight] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Decentralized Exchange (DEX)</h3>
        <p className="text-slate-500 mt-2">Trade directly from your wallet without a central intermediary.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex gap-4 justify-center mb-4">
          <button onClick={() => setShowRight(false)} className={`px-5 py-2 rounded-lg font-semibold transition-all ${!showRight ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Centralized Exchange</button>
          <button onClick={() => setShowRight(true)} className={`px-5 py-2 rounded-lg font-semibold transition-all ${showRight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>DEX</button>
        </div>
        <div className="flex flex-col gap-3 transition-all duration-500">
          {(showRight ? ["Trade from your own wallet","You control your keys","Permissionless","Non-custodial"] : ["You deposit funds to exchange","Exchange holds your keys","KYC required","Can freeze your account"]).map((item: string, i: number) => (
            <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${showRight ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
