"use client";
import React, { useState } from 'react';
export function BeamSearchVisualizer() {
  const [beamWidth, setBeamWidth] = useState(3);
  const beams = Array.from({length: beamWidth}, (_, i) => ({id: i, score: (Math.random() * 0.4 + 0.3).toFixed(2), text: ['The cat sat','A dog ran','The bird flew','She walked to','He drove his'][i % 5]}));
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Beam Search</h3>
        <p className="text-slate-500 mt-2">Exploring multiple candidate sequences simultaneously.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-700">Beam Width:</span>
          <input type="range" min="1" max="5" value={beamWidth} onChange={e => setBeamWidth(Number(e.target.value))} className="flex-1 accent-indigo-600" />
          <span className="font-bold text-indigo-600 text-lg">{beamWidth}</span>
        </div>
        <div className="flex flex-col gap-3">
          {beams.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="w-16 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">{b.score}</div>
              <div className="flex-1 font-mono text-sm text-slate-700">{b.text}...</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-600">
          At each step, keep the top {beamWidth} candidate{beamWidth > 1 ? 's' : ''} by cumulative score. Wider beam = better results but more compute.
        </div>
      </div>
    </div>
  );
}