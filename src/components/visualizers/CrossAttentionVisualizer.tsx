"use client";

import { useState } from 'react';

export function CrossAttentionVisualizer() {
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null);
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);
  const [showAttentionWeights, setShowAttentionWeights] = useState(false);

  const sourceSequence = ["The", "cat", "sleeps", "peacefully"];
  const targetSequence = ["Le", "chat", "dort"];
  
  // Simulated attention weights (Query from target attending to Keys from source)
  const attentionMatrix = [
    [0.1, 0.7, 0.1, 0.1], // "Le" attending to source
    [0.2, 0.6, 0.1, 0.1], // "chat" attending to source  
    [0.1, 0.1, 0.7, 0.1], // "dort" attending to source
  ];

  const getAttentionColor = (weight: number) => {
    if (weight > 0.5) return 'bg-rose-500';
    if (weight > 0.3) return 'bg-amber-400';
    if (weight > 0.1) return 'bg-blue-300';
    return 'bg-slate-200';
  };

  const getConnectionOpacity = (queryIdx: number, keyIdx: number) => {
    if (selectedQuery === null) return 0;
    if (selectedQuery !== queryIdx) return 0;
    return attentionMatrix[queryIdx][keyIdx];
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cross-Attention Mechanism</h3>
        <p className="text-slate-600">Click a target word (Query) to see how it attends to source words (Keys & Values)</p>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-4xl">
        {/* Control Panel */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowAttentionWeights(!showAttentionWeights)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            {showAttentionWeights ? 'Hide' : 'Show'} Attention Matrix
          </button>
          <button
            onClick={() => setSelectedQuery(null)}
            className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Visualization Area */}
        <div className="relative bg-white rounded-xl p-8 border border-slate-200">
          {/* Source Sequence (Keys & Values) */}
          <div className="mb-12">
            <div className="text-sm font-semibold text-slate-600 mb-3">Source Sequence (English) - Keys & Values</div>
            <div className="flex gap-4 justify-center">
              {sourceSequence.map((word, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-3 rounded-lg border-2 transition-all cursor-pointer ${
                    hoveredKey === idx ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-100'
                  }`}
                  onMouseEnter={() => setHoveredKey(idx)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <div className="text-center">
                    <div className="font-semibold text-slate-800">{word}</div>
                    <div className="text-xs text-slate-500 mt-1">K{idx + 1}, V{idx + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attention Connections */}
          {selectedQuery !== null && (
            <div className="absolute top-24 left-0 right-0 h-32 pointer-events-none">
              <svg className="w-full h-full">
                {sourceSequence.map((_, keyIdx) => {
                  const opacity = getConnectionOpacity(selectedQuery, keyIdx);
                  if (opacity === 0) return null;
                  
                  const sourceX = (keyIdx + 0.5) * (100 / sourceSequence.length);
                  const targetX = (selectedQuery + 0.5) * (100 / targetSequence.length);
                  
                  return (
                    <line
                      key={keyIdx}
                      x1={`${sourceX}%`}
                      y1="0%"
                      x2={`${targetX}%`}
                      y2="100%"
                      stroke="#ef4444"
                      strokeWidth={opacity * 4 + 1}
                      opacity={opacity}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
            </div>
          )}

          {/* Target Sequence (Queries) */}
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-3">Target Sequence (French) - Queries</div>
            <div className="flex gap-4 justify-center">
              {targetSequence.map((word, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedQuery === idx 
                      ? 'border-rose-400 bg-rose-50 shadow-lg' 
                      : 'border-slate-300 bg-slate-100 hover:border-rose-300'
                  }`}
                  onClick={() => setSelectedQuery(selectedQuery === idx ? null : idx)}
                >
                  <div className="text-center">
                    <div className="font-semibold text-slate-800">{word}</div>
                    <div className="text-xs text-slate-500 mt-1">Q{idx + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attention Matrix */}
        {showAttentionWeights && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">Attention Weight Matrix</h4>
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              <div></div>
              {sourceSequence.map((word, idx) => (
                <div key={idx} className="text-xs font-semibold text-center text-slate-600 p-2">
                  {word}
                </div>
              ))}
              {targetSequence.map((targetWord, qIdx) => (
                <>
                  <div key={`label-${qIdx}`} className="text-xs font-semibold text-slate-600 p-2 text-right">
                    {targetWord}
                  </div>
                  {sourceSequence.map((_, kIdx) => (
                    <div
                      key={`${qIdx}-${kIdx}`}
                      className={`p-2 rounded text-xs font-semibold text-center text-white ${getAttentionColor(attentionMatrix[qIdx][kIdx])}`}
                    >
                      {attentionMatrix[qIdx][kIdx].toFixed(1)}
                    </div>
                  ))}
                </>
              ))}
            </div>
            <div className="text-xs text-slate-500 text-center mt-4">
              Rows: Target queries | Columns: Source keys | Values: Attention weights
            </div>
          </div>
        )}

        {/* Explanation */}
        {selectedQuery !== null && (
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2">
              Cross-Attention for "{targetSequence[selectedQuery]}"
            </h4>
            <div className="text-sm text-indigo-700">
              <p className="mb-2">
                Query vector from <strong>"{targetSequence[selectedQuery]}"</strong> is attending to all source words.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-1">Highest attention:</p>
                  {sourceSequence.map((word, idx) => {
                    const weight = attentionMatrix[selectedQuery][idx];
                    if (weight > 0.3) {
                      return (
                        <div key={idx} className="text-rose-700">
                          "{word}" ({(weight * 100).toFixed(0)}%)
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <div>
                  <p className="font-semibold mb-1">Key insight:</p>
                  <p className="text-xs">
                    Information flows from source sequence to target sequence, 
                    enabling translation by attending to relevant source words.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}