"use client";

import React, { useState, useEffect } from 'react';

export function BeamSearchVisualizer() {
  const [beamWidth, setBeamWidth] = useState(3);
  const [step, setStep] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const vocabulary = ['the', 'a', 'cat', 'dog', 'sat', 'ran', 'on', 'in', 'big', 'fast', 'mat', 'park', 'happy', 'lazy'];

  const generateCandidates = (prefix: string, depth: number) => {
    const seed = prefix.length * 31 + depth * 7;
    return vocabulary.map((word, i) => ({
      text: prefix ? `${prefix} ${word}` : word,
      score: Math.round((Math.sin(seed + i * 1.7) * 0.3 + 0.5 + (i < 3 ? 0.2 : 0)) * 100) / 100,
      word
    })).sort((a, b) => b.score - a.score);
  };

  const tree: {text: string; score: number; word: string; depth: number; kept: boolean}[][] = [];

  // Build the search tree
  let currentBeams = [{ text: '', score: 1.0 }];
  for (let d = 0; d < 4; d++) {
    const allCandidates: {text: string; score: number; word: string; depth: number; kept: boolean}[] = [];
    currentBeams.forEach(beam => {
      const candidates = generateCandidates(beam.text, d);
      candidates.slice(0, 5).forEach(c => {
        allCandidates.push({
          ...c,
          score: Math.round(beam.score * c.score * 100) / 100,
          depth: d,
          kept: false
        });
      });
    });
    allCandidates.sort((a, b) => b.score - a.score);
    allCandidates.forEach((c, i) => { c.kept = i < beamWidth; });
    tree.push(allCandidates);
    currentBeams = allCandidates.filter(c => c.kept).map(c => ({ text: c.text, score: c.score }));
  }

  const startSearch = () => {
    setIsSearching(true);
    setStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= 4) {
        clearInterval(interval);
        setIsSearching(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Beam Search Decoding</h3>
        <p className="text-slate-600 max-w-2xl">Watch how language models explore multiple word sequences simultaneously</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Beam Width</label>
        {[1, 2, 3, 5].map(w => (
          <button
            key={w}
            onClick={() => { setBeamWidth(w); setStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              beamWidth === w ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-600'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      <div className="w-full max-w-3xl overflow-x-auto">
        <svg viewBox="0 0 700 350" className="w-full border border-slate-200 rounded-xl bg-white" style={{minWidth: 600}}>
          <text x={20} y={25} fontSize="10" fill="#64748b">Step</text>
          {[0, 1, 2, 3].map(d => (
            <text key={d} x={100 + d * 160} y={25} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">
              Word {d + 1}
            </text>
          ))}

          {tree.map((level, depth) => {
            if (depth >= step) return null;
            const visibleCandidates = level.slice(0, Math.min(8, level.length));
            return visibleCandidates.map((candidate, i) => {
              const x = 100 + depth * 160;
              const y = 50 + i * 35;
              const isKept = candidate.kept;
              return (
                <g key={`${depth}-${i}`}>
                  <rect
                    x={x - 55} y={y - 12} width={110} height={24} rx={6}
                    fill={isKept ? '#eff6ff' : '#fef2f2'}
                    stroke={isKept ? '#3b82f6' : '#fca5a5'}
                    strokeWidth={isKept ? 2 : 1}
                    opacity={isKept ? 1 : 0.4}
                    className="transition-all duration-300"
                  />
                  <text x={x - 45} y={y + 3} fontSize="8" fill={isKept ? '#1e40af' : '#9ca3af'} fontWeight={isKept ? '600' : '400'}>
                    {candidate.word}
                  </text>
                  <text x={x + 40} y={y + 3} textAnchor="end" fontSize="7" fill={isKept ? '#3b82f6' : '#d4d4d8'} className="font-mono">
                    {candidate.score.toFixed(2)}
                  </text>
                  {!isKept && (
                    <line x1={x - 55} y1={y} x2={x + 55} y2={y} stroke="#ef4444" strokeWidth="1" opacity={0.3} />
                  )}
                </g>
              );
            });
          })}

          {/* Beam width indicator */}
          <g transform="translate(20, 50)">
            <rect width={8} height={beamWidth * 35} rx={4} fill="#3b82f6" opacity={0.3} />
            <text x={15} y={beamWidth * 17} fontSize="8" fill="#3b82f6" fontWeight="600">beam={beamWidth}</text>
          </g>
        </svg>
      </div>

      <button
        onClick={startSearch}
        disabled={isSearching}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-all"
      >
        {isSearching ? '🔍 Searching...' : '▶ Run Beam Search'}
      </button>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-lg text-center">
        <p className="text-indigo-800 text-sm">
          <strong>Beam width = {beamWidth}</strong> means the model keeps the top {beamWidth} most promising sequences at each step.
          {beamWidth === 1 && ' This is greedy search — only the single best option survives.'}
          {beamWidth >= 3 && ' More beams explore more possibilities but use more memory and computation.'}
        </p>
      </div>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        Beam search balances between greedy decoding (always picking the top word) and exhaustive search (trying every combination). It keeps the top-k most promising sequences at each step, pruning unlikely paths while exploring multiple possibilities. Wider beams find better sequences but cost more computation.
      </p>
    </div>
  );
}