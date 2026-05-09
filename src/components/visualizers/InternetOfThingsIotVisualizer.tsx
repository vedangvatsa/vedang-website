"use client";

import React, { useState } from 'react';

export function InternetOfThingsIotVisualizer() {
  const nodes = ["Thermostat","Door Lock","Camera","Speaker","Fridge"];
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Internet of Things (IoT)</h3>
        <p className="text-slate-500 mt-2">Everyday objects connected to the internet, generating and sharing data.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 justify-center">
          {nodes.map((node, i) => (
            <button key={i} onClick={() => setActiveNode(activeNode === i ? null : i)}
              className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${activeNode === i ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-lg' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}`}>
              {node}
            </button>
          ))}
        </div>
        <div className="mt-6 bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-600">
          {activeNode !== null ? `${nodes[activeNode]} communicates directly with all other peers — no central server needed.` : "Click a node to see its peer connections."}
        </div>
      </div>
    </div>
  );
}
