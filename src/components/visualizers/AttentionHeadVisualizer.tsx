"use client";
import React, { useState } from 'react';

export function AttentionHeadVisualizer() {
  const [selectedHead, setSelectedHead] = useState(0);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [showProjections, setShowProjections] = useState(false);
  
  const tokens = ["The", "cat", "sat", "on", "the", "mat"];
  
  // Different attention patterns for different heads
  const attentionPatterns = [
    // Head 0: Subject-verb relationships
    [
      [0.1, 0.8, 0.05, 0.02, 0.02, 0.01], // "The" -> "cat"
      [0.3, 0.2, 0.4, 0.05, 0.03, 0.02], // "cat" -> "sat"
      [0.05, 0.7, 0.15, 0.05, 0.03, 0.02], // "sat" -> "cat"
      [0.02, 0.05, 0.1, 0.1, 0.6, 0.13], // "on" -> "the"
      [0.02, 0.03, 0.05, 0.3, 0.1, 0.5], // "the" -> "mat"
      [0.01, 0.02, 0.02, 0.15, 0.3, 0.5] // "mat" -> self
    ],
    // Head 1: Determiner-noun relationships
    [
      [0.05, 0.9, 0.02, 0.01, 0.01, 0.01], // "The" -> "cat"
      [0.1, 0.7, 0.1, 0.05, 0.03, 0.02], // "cat" -> self
      [0.02, 0.08, 0.8, 0.05, 0.03, 0.02], // "sat" -> self
      [0.01, 0.02, 0.05, 0.2, 0.7, 0.02], // "on" -> "the"
      [0.01, 0.01, 0.02, 0.1, 0.1, 0.76], // "the" -> "mat"
      [0.01, 0.01, 0.02, 0.06, 0.2, 0.7] // "mat" -> self
    ],
    // Head 2: Positional relationships
    [
      [0.6, 0.3, 0.05, 0.02, 0.02, 0.01], // "The" -> self
      [0.4, 0.4, 0.1, 0.03, 0.02, 0.01], // "cat" -> neighbors
      [0.05, 0.4, 0.4, 0.1, 0.03, 0.02], // "sat" -> neighbors
      [0.02, 0.05, 0.4, 0.4, 0.1, 0.03], // "on" -> neighbors
      [0.01, 0.02, 0.05, 0.4, 0.4, 0.12], // "the" -> neighbors
      [0.01, 0.01, 0.02, 0.1, 0.4, 0.46] // "mat" -> neighbors
    ]
  ];
  
  const headDescriptions = [
    "Subject-Verb Relations",
    "Determiner-Noun Relations", 
    "Positional Context"
  ];
  
  const headColors = ["bg-blue-500", "bg-emerald-500", "bg-rose-500"];
  
  const getAttentionColor = (score: number, baseColor: string) => {
    if (score > 0.5) return baseColor.replace('500', '600');
    if (score > 0.3) return baseColor.replace('500', '400');
    if (score > 0.1) return baseColor.replace('500', '200');
    return 'bg-slate-100';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Multi-Head Attention Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how different attention heads in a transformer learn specialized patterns. Each head focuses on different types of relationships between words.
        </p>
      </div>
      
      {/* Head Selection */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          {[0, 1, 2].map((head) => (
            <button
              key={head}
              onClick={() => setSelectedHead(head)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedHead === head 
                  ? `${headColors[head]} text-white shadow-lg` 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Head {head + 1}
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <div className="font-semibold text-slate-800">
            {headDescriptions[selectedHead]}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Click tokens to see attention patterns • Hover for details
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showProjections}
            onChange={(e) => setShowProjections(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-700">Show Q,K,V Projections</span>
        </label>
      </div>
      
      {/* Attention Matrix Visualization */}
      <div className="flex flex-col items-center gap-6">
        {/* Input Tokens */}
        <div className="flex gap-3">
          {tokens.map((token, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                hoveredToken === i
                  ? `border-${headColors[selectedHead].split('-')[1]}-500 bg-white shadow-lg`
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              onMouseEnter={() => setHoveredToken(i)}
              onMouseLeave={() => setHoveredToken(null)}
            >
              <div className="font-medium text-slate-800">{token}</div>
              <div className="text-xs text-slate-500">pos {i}</div>
            </div>
          ))}
        </div>
        
        {/* QKV Projections (if enabled) */}
        {showProjections && (
          <div className="grid grid-cols-3 gap-6 w-full max-w-md">
            {['Query', 'Key', 'Value'].map((proj, idx) => (
              <div key={proj} className="text-center">
                <div className="font-medium text-slate-700 mb-2">{proj}</div>
                <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded border flex items-center justify-center text-sm text-slate-600">
                  W_{proj.charAt(0).toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Attention Matrix */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center font-medium text-slate-700 mb-4">
            Attention Weights for Head {selectedHead + 1}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-sm">
            {/* Header row */}
            <div></div>
            {tokens.map((token, i) => (
              <div key={i} className="text-center font-medium text-slate-600 p-2">
                {token}
              </div>
            ))}
            
            {/* Matrix rows */}
            {tokens.map((fromToken, i) => (
              <React.Fragment key={i}>
                <div className="text-right font-medium text-slate-600 p-2">
                  {fromToken}
                </div>
                {tokens.map((toToken, j) => {
                  const attention = attentionPatterns[selectedHead][i][j];
                  const isHighlighted = hoveredToken === i || hoveredToken === j;
                  
                  return (
                    <div
                      key={j}
                      className={`w-12 h-12 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                        getAttentionColor(attention, headColors[selectedHead])
                      } ${isHighlighted ? 'ring-2 ring-indigo-400 scale-110' : ''}`}
                      title={`${fromToken} → ${toToken}: ${(attention * 100).toFixed(1)}%`}
                      onMouseEnter={() => setHoveredToken(j)}
                    >
                      {(attention * 100).toFixed(0)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Pattern Description */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-lg text-center">
          <div className="font-medium text-slate-700 mb-2">Current Pattern Analysis</div>
          <div className="text-sm text-slate-600">
            {selectedHead === 0 && "This head focuses on connecting subjects with their verbs (e.g., 'cat' → 'sat')."}
            {selectedHead === 1 && "This head specializes in linking determiners with their nouns (e.g., 'the' → 'cat', 'the' → 'mat')."}
            {selectedHead === 2 && "This head captures positional relationships, attending to neighboring words for context."}
          </div>
        </div>
      </div>
    </div>
  );
}