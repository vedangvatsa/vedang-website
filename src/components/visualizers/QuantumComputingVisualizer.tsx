"use client";

import React, { useState } from 'react';

export function QuantumComputingVisualizer() {
  const [isOn, setIsOn] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Quantum Computing</h3>
        <p className="text-slate-500 mt-2">Using qubits that can be 0, 1, or both simultaneously via superposition.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 items-center">
        <button onClick={() => setIsOn(!isOn)} className={`w-20 h-10 rounded-full p-1 transition-all duration-300 ${isOn ? 'bg-emerald-500' : 'bg-slate-300'}`}>
          <div className={`w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-300 ${isOn ? 'translate-x-10' : 'translate-x-0'}`} />
        </button>
        <div className="text-lg font-bold text-slate-900">{isOn ? "Classical Bit" : "Qubit (Superposition)"}</div>
        <div className={`p-6 rounded-xl border-2 w-full text-center transition-all duration-500 ${isOn ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
          {isOn ? "A classical bit is either 0 or 1. To check N possibilities, you must try them one at a time." : "A qubit can be 0, 1, or BOTH at once. Quantum computers explore many possibilities simultaneously."}
        </div>
      </div>
    </div>
  );
}
