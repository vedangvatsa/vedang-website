"use client";

import { useState } from 'react';

export function AttentionMechanismVisualizer() {
  const [selectedQuery, setSelectedQuery] = useState(2);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [showVectors, setShowVectors] = useState(false);
  
  const tokens = ["The", "cat", "sat", "on", "the", "mat"];
  
  // Simplified attention scores (normally computed from Q·K^T)
  const attentionMatrix = [
    [0.8, 0.1, 0.05, 0.02, 0.02, 0.01],
    [0.2, 0.6, 0.1, 0.05, 0.03, 0.02],
    [0.1, 0.3, 0.4, 0.1, 0.05, 0.05],
    [0.05, 0.1, 0.2, 0.5, 0.1, 0.05],
    [0.8, 0.05, 0.02, 0.02, 0.1, 0.01],
    [0.1, 0.2, 0.1, 0.05, 0.05, 0.5]
  ];

  const getAttentionColor = (score: number) => {
    const intensity = Math.floor(score * 100);
    if (intensity > 50) return 'bg-rose-500';
    if (intensity > 30) return 'bg-amber-400';
    if (intensity > 10) return 'bg-blue-400';
    return 'bg-slate-300';
  };

  const getAttentionOpacity = (score: number) => {
    return Math.max(0.2, score);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Attention Mechanism Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          See how each token attends to others in a sequence. Click tokens to see their attention patterns, toggle vectors to understand Q, K, V computation.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showVectors 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {showVectors ? 'Hide' : 'Show'} Q·K·V Vectors
          </button>
        </div>

        {/* Token Sequence */}
        <div className="flex justify-center gap-2">
          {tokens.map((token, i) => (
            <div
              key={i}
              onClick={() => setSelectedQuery(i)}
              onMouseEnter={() => setHoveredToken(i)}
              onMouseLeave={() => setHoveredToken(null)}
              className={`px-4 py-3 rounded-lg cursor-pointer transition-all font-medium ${
                selectedQuery === i
                  ? 'bg-indigo-500 text-white scale-110 shadow-lg'
                  : hoveredToken === i
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {token}
              <div className="text-xs mt-1 opacity-75">pos {i}</div>
            </div>
          ))}
        </div>

        {/* Q·K·V Vectors Display */}
        {showVectors && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
            <div className="text-center">
              <h4 className="font-semibold text-blue-600 mb-2">Query (Q)</h4>
              <div className="text-sm text-slate-600">What am I looking for?</div>
              <div className="mt-2 p-2 bg-blue-50 rounded font-mono text-xs">
                [{(selectedQuery * 0.3).toFixed(1)}, {(selectedQuery * 0.7).toFixed(1)}, {(selectedQuery * 0.2).toFixed(1)}]
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-emerald-600 mb-2">Key (K)</h4>
              <div className="text-sm text-slate-600">What do I represent?</div>
              <div className="mt-2 p-2 bg-emerald-50 rounded font-mono text-xs">
                Multiple vectors for each token
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-rose-600 mb-2">Value (V)</h4>
              <div className="text-sm text-slate-600">What information do I carry?</div>
              <div className="mt-2 p-2 bg-rose-50 rounded font-mono text-xs">
                Weighted by attention scores
              </div>
            </div>
          </div>
        )}

        {/* Attention Visualization */}
        <div className="bg-white rounded-lg p-6 border">
          <h4 className="text-lg font-semibold mb-4 text-center">
            Attention Pattern for "{tokens[selectedQuery]}" (Query)
          </h4>
          
          {/* Attention Scores */}
          <div className="flex justify-center gap-2 mb-4">
            {tokens.map((token, i) => {
              const score = attentionMatrix[selectedQuery][i];
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-slate-500 mb-1">{token}</div>
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all ${getAttentionColor(score)}`}
                    style={{ opacity: getAttentionOpacity(score) }}
                  >
                    {(score * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connection Lines */}
          <div className="relative h-20 mb-4">
            <svg className="absolute inset-0 w-full h-full">
              {tokens.map((_, i) => {
                const score = attentionMatrix[selectedQuery][i];
                const startX = (selectedQuery + 0.5) * (100 / tokens.length);
                const endX = (i + 0.5) * (100 / tokens.length);
                
                return (
                  <line
                    key={i}
                    x1={`${startX}%`}
                    y1="10%"
                    x2={`${endX}%`}
                    y2="90%"
                    stroke={score > 0.3 ? '#ef4444' : score > 0.1 ? '#3b82f6' : '#94a3b8'}
                    strokeWidth={Math.max(1, score * 8)}
                    opacity={score}
                    className="transition-all"
                  />
                );
              })}
            </svg>
          </div>

          {/* Formula */}
          <div className="bg-slate-100 p-4 rounded-lg">
            <div className="text-center font-mono text-sm">
              <div className="mb-2">Attention(Q,K,V) = softmax(Q·K<sup>T</sup>/√d<sub>k</sub>)·V</div>
              <div className="text-xs text-slate-600">
                Current: "{tokens[selectedQuery]}" attends most to "{tokens[attentionMatrix[selectedQuery].indexOf(Math.max(...attentionMatrix[selectedQuery]))]}"
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-500 rounded"></div>
            <span>High attention (&gt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-400 rounded"></div>
            <span>Medium attention (30-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span>Low attention (10-30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-300 rounded"></div>
            <span>Minimal attention (&lt;10%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}