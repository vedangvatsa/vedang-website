"use client";

import React, { useState, useEffect } from 'react';

export function QuantumComputingVisualizer() {
  const [mode, setMode] = useState<'classical' | 'quantum'>('classical');
  const [bits, setBits] = useState([0, 1, 0, 1]);
  const [qubits, setQubits] = useState([0.5, 0.5, 0.5, 0.5]);
  const [measured, setMeasured] = useState(false);
  const [animAngle, setAnimAngle] = useState(0);

  useEffect(() => {
    if (mode !== 'quantum' || measured) return;
    const interval = setInterval(() => {
      setAnimAngle(a => (a + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [mode, measured]);

  const measure = () => {
    setMeasured(true);
    setQubits(qubits.map(() => Math.random() > 0.5 ? 1 : 0));
  };

  const resetQuantum = () => {
    setMeasured(false);
    setQubits([0.5, 0.5, 0.5, 0.5]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Classical Bits vs Quantum Qubits</h3>
        <p className="text-slate-600 max-w-2xl">See how qubits exist in superposition until measured</p>
      </div>

      <div className="flex gap-4">
        <button onClick={() => { setMode('classical'); setMeasured(false); }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${mode === 'classical' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
          💡 Classical Bits
        </button>
        <button onClick={() => { setMode('quantum'); setMeasured(false); setQubits([0.5, 0.5, 0.5, 0.5]); }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${mode === 'quantum' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
          ⚛️ Quantum Qubits
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 500 300" className="w-full border border-slate-200 rounded-xl bg-white">
          {mode === 'classical' ? (
            // Classical bits
            <>
              <text x={250} y={30} textAnchor="middle" fontSize="12" fill="#334155" fontWeight="600">Each bit is definitively 0 or 1</text>
              {bits.map((bit, i) => {
                const x = 80 + i * 100;
                return (
                  <g key={i} transform={`translate(${x}, 130)`} className="cursor-pointer" onClick={() => {
                    const newBits = [...bits];
                    newBits[i] = newBits[i] === 0 ? 1 : 0;
                    setBits(newBits);
                  }}>
                    <circle r={40} fill={bit ? '#3b82f6' : '#e2e8f0'} stroke={bit ? '#1d4ed8' : '#94a3b8'} strokeWidth="3" className="transition-all duration-300" />
                    <text y={8} textAnchor="middle" fontSize="28" fill={bit ? 'white' : '#64748b'} fontWeight="bold">{bit}</text>
                    <text y={65} textAnchor="middle" fontSize="10" fill="#64748b">Bit {i + 1}</text>
                    <text y={80} textAnchor="middle" fontSize="9" fill="#94a3b8">(click to flip)</text>
                  </g>
                );
              })}
              <text x={250} y={260} textAnchor="middle" fontSize="11" fill="#64748b">
                4 bits = {Math.pow(2, 4)} possible states, but only 1 at a time
              </text>
            </>
          ) : (
            // Quantum qubits
            <>
              <text x={250} y={30} textAnchor="middle" fontSize="12" fill="#334155" fontWeight="600">
                {measured ? 'Measured! Superposition collapsed.' : 'Qubits in superposition — both 0 AND 1'}
              </text>
              {qubits.map((q, i) => {
                const x = 80 + i * 100;
                const isSuperposition = !measured && q === 0.5;
                return (
                  <g key={i} transform={`translate(${x}, 130)`}>
                    {isSuperposition ? (
                      <>
                        <circle r={40} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8 4"
                          transform={`rotate(${animAngle})`}>
                        </circle>
                        <circle r={30} fill="#8b5cf6" opacity={0.15 + 0.1 * Math.sin(animAngle * Math.PI / 180)} />
                        <text y={-5} textAnchor="middle" fontSize="14" fill="#7c3aed" fontWeight="bold">0</text>
                        <text y={15} textAnchor="middle" fontSize="14" fill="#7c3aed" fontWeight="bold">1</text>
                        <text y={-15} textAnchor="middle" fontSize="8" fill="#a78bfa">both!</text>
                      </>
                    ) : (
                      <>
                        <circle r={40} fill={q === 1 ? '#7c3aed' : '#e9d5ff'} stroke="#8b5cf6" strokeWidth="3" />
                        <text y={8} textAnchor="middle" fontSize="28" fill={q === 1 ? 'white' : '#7c3aed'} fontWeight="bold">{q}</text>
                      </>
                    )}
                    <text y={65} textAnchor="middle" fontSize="10" fill="#7c3aed">Qubit {i + 1}</text>
                  </g>
                );
              })}
              <text x={250} y={260} textAnchor="middle" fontSize="11" fill="#7c3aed">
                {measured
                  ? `Collapsed to one state: [${qubits.join(', ')}]`
                  : `4 qubits = all ${Math.pow(2, 4)} states simultaneously!`}
              </text>
            </>
          )}
        </svg>
      </div>

      {mode === 'quantum' && (
        <div className="flex gap-3">
          {!measured ? (
            <button onClick={measure}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all">
              📏 Measure Qubits
            </button>
          ) : (
            <button onClick={resetQuantum}
              className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 font-medium transition-all">
              ↺ Reset to Superposition
            </button>
          )}
        </div>
      )}

      <p className="text-slate-500 text-sm text-center max-w-xl">
        Classical bits are always 0 or 1. Quantum qubits exist in superposition, representing both states simultaneously until measured. This allows quantum computers to explore many solutions in parallel, making them powerful for specific problems like cryptography, optimization, and molecular simulation.
      </p>
    </div>
  );
}
