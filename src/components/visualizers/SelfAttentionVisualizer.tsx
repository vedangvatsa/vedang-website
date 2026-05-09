"use client";

import React, { useState } from 'react';

export function SelfAttentionVisualizer() {
  const sentence = ["The", "bank", "of", "the", "river"];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Simplified attention matrix (5x5). High numbers mean high attention.
  // Rows: query word. Columns: key word.
  // "The" attends to itself and "bank", "river".
  // "bank" attends strongly to "river" (contextualizing it as a river bank).
  // "river" attends strongly to "bank".
  const attentionWeights = [
    [0.6, 0.3, 0.05, 0.0, 0.05], // "The"
    [0.1, 0.3, 0.1, 0.1, 0.4],   // "bank" -> highly attends to "river"
    [0.05, 0.4, 0.4, 0.1, 0.05], // "of"
    [0.0, 0.1, 0.1, 0.6, 0.2],   // "the"
    [0.05, 0.4, 0.05, 0.1, 0.4], // "river" -> highly attends to "bank"
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Self-Attention Mechanism</h3>
        <p className="text-slate-500 mt-2">Hover over a word to see how it "attends" to context.</p>
      </div>

      <div className="flex flex-col gap-10 w-full max-w-2xl bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="flex justify-center gap-4 relative py-12">
          {sentence.map((word, i) => (
            <div 
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`text-2xl font-bold p-4 rounded-xl cursor-pointer transition-all duration-300 z-10 
                ${hoveredIndex === i ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {word}
            </div>
          ))}

          {/* Render connecting arcs (simulated by lines below words for simplicity) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 flex justify-center items-end gap-2 px-12">
             {sentence.map((_, j) => {
               // Calculate connection strength based on hovered word
               const weight = hoveredIndex !== null ? attentionWeights[hoveredIndex][j] : 0;
               const opacity = hoveredIndex !== null ? weight * 2 : 0; // scale opacity up a bit for visibility
               const height = hoveredIndex !== null ? 10 + (weight * 40) : 0;
               
               return (
                 <div key={`line-${j}`} className="flex flex-col items-center flex-1 transition-all duration-500 relative">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-full transition-all duration-500" 
                      style={{ height: `${height}px`, opacity: Math.min(opacity, 1) }}
                    />
                    {hoveredIndex !== null && weight > 0.2 && j !== hoveredIndex && (
                      <div className="text-[10px] font-bold text-indigo-600 mt-2 absolute -bottom-6 animate-fade-in">
                         context
                      </div>
                    )}
                 </div>
               );
             })}
          </div>
        </div>

        <div className="bg-slate-100 rounded-xl p-4 text-center font-mono text-sm text-slate-600 min-h-[60px] flex items-center justify-center">
          {hoveredIndex === null 
            ? "Notice how the model understands which 'bank' is meant."
            : hoveredIndex === 1 
              ? "The word 'bank' attends heavily to 'river', knowing it's a riverbank, not a financial institution."
              : hoveredIndex === 4
                ? "The word 'river' looks back at 'bank' to establish the spatial relationship."
                : `The word '${sentence[hoveredIndex]}' assigns its attention weights across the sentence.`}
        </div>

      </div>
    </div>
  );
}
