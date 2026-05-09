"use client";

import React, { useState } from 'react';

export function DecentralizedSequencerVisualizer() {
  const [showRight, setShowRight] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Decentralized Sequencer</h3>
        <p className="text-slate-500 mt-2">Distributing transaction ordering across multiple operators.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex gap-4 justify-center mb-4">
          <button onClick={() => setShowRight(false)} className={`px-5 py-2 rounded-lg font-semibold transition-all ${!showRight ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Centralized Sequencer</button>
          <button onClick={() => setShowRight(true)} className={`px-5 py-2 rounded-lg font-semibold transition-all ${showRight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Decentralized Sequencer</button>
        </div>
        <div className="flex flex-col gap-3 transition-all duration-500">
          {(showRight ? ["Multiple operators rotate","Censorship resistant","No single point of failure"] : ["Single operator orders txs","Can censor or front-run","Single point of failure"]).map((item: string, i: number) => (
            <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${showRight ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
