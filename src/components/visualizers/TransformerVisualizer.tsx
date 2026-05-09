"use client";

import React, { useState } from 'react';

export function TransformerVisualizer() {
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [showAttention, setShowAttention] = useState(false);
  const [architecture, setArchitecture] = useState<'rnn' | 'transformer'>('rnn');
  const [step, setStep] = useState(0);
  
  const sentence = ["The", "cat", "sat", "on", "the", "mat"];
  
  // Mock attention weights - higher values show stronger attention
  const attentionMatrix = [
    [0.9, 0.1, 0.0, 0.0, 0.0, 0.0], // The
    [0.2, 0.8, 0.0, 0.0, 0.0, 0.0], // cat
    [0.1, 0.7, 0.9, 0.0, 0.1, 0.2], // sat
    [0.0, 0.1, 0.3, 0.8, 0.0, 0.3], // on
    [0.6, 0.0, 0.0, 0.1, 0.9, 0.0], // the
    [0.1, 0.4, 0.2, 0.3, 0.2, 0.8]  // mat
  ];

  const getAttentionColor = (weight: number) => {
    if (weight > 0.7) return 'bg-rose-500';
    if (weight > 0.4) return 'bg-amber-400';
    if (weight > 0.1) return 'bg-blue-300';
    return 'bg-slate-200';
  };

  const getAttentionOpacity = (weight: number) => {
    return Math.max(0.1, weight);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Transformer Architecture</h3>
        <p className="text-slate-600">Compare RNN sequential processing vs Transformer attention mechanism</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setArchitecture('rnn')}
          className={`px-4 py-2 rounded-lg font-medium ${
            architecture === 'rnn' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          RNN (Sequential)
        </button>
        <button
          onClick={() => setArchitecture('transformer')}
          className={`px-4 py-2 rounded-lg font-medium ${
            architecture === 'transformer' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Transformer (Attention)
        </button>
      </div>

      {architecture === 'rnn' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-3 py-1 bg-slate-300 rounded disabled:opacity-50"
            >
              ←
            </button>
            <span className="font-medium">Step {step + 1} of {sentence.length}</span>
            <button
              onClick={() => setStep(Math.min(sentence.length - 1, step + 1))}
              disabled={step === sentence.length - 1}
              className="px-3 py-1 bg-slate-300 rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
          
          <div className="flex gap-2 items-center">
            {sentence.map((token, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`px-3 py-2 rounded-lg border-2 ${
                    i === step 
                      ? 'bg-emerald-200 border-emerald-500' 
                      : i < step 
                        ? 'bg-slate-200 border-slate-400' 
                        : 'bg-white border-slate-300'
                  }`}
                >
                  {token}
                </div>
                {i < sentence.length - 1 && (
                  <div className={`w-8 h-0.5 mt-2 ${i < step ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center text-sm text-slate-600 max-w-md">
            RNNs process tokens one at a time, sequentially. Information from early tokens may be lost by the time we reach later tokens. This creates a bottleneck for long sequences.
          </div>
        </div>
      )}

      {architecture === 'transformer' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setShowAttention(!showAttention)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {showAttention ? 'Hide' : 'Show'} Attention
            </button>
            {!showAttention && (
              <span className="text-sm text-slate-600 self-center">Click a token to see its attention</span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {sentence.map((token, i) => (
              <div
                key={i}
                onClick={() => setSelectedToken(selectedToken === i ? null : i)}
                className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedToken === i 
                    ? 'bg-blue-200 border-blue-500' 
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                {token}
              </div>
            ))}
          </div>

          {(showAttention || selectedToken !== null) && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-slate-700">
                Attention Matrix {selectedToken !== null && `(Focus: "${sentence[selectedToken]}")`}
              </div>
              <div className="grid grid-cols-6 gap-1 max-w-sm mx-auto">
                {sentence.map((token, i) => (
                  <div key={i} className="text-xs text-center p-1 bg-slate-100 rounded">
                    {token}
                  </div>
                ))}
                {sentence.map((_, i) => 
                  sentence.map((_, j) => {
                    const weight = attentionMatrix[i][j];
                    const shouldHighlight = selectedToken === null || selectedToken === i;
                    return (
                      <div
                        key={`${i}-${j}`}
                        className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                          shouldHighlight ? getAttentionColor(weight) : 'bg-slate-200'
                        }`}
                        style={{ 
                          opacity: shouldHighlight ? getAttentionOpacity(weight) : 0.3 
                        }}
                      >
                        {shouldHighlight && Math.round(weight * 100)}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex items-center gap-4 text-xs justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-rose-500 rounded"></div>
                  <span>Strong (70%+)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-400 rounded"></div>
                  <span>Medium (40%+)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-300 rounded"></div>
                  <span>Weak (10%+)</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-slate-600 max-w-md">
            Transformers process all tokens simultaneously using attention. Each token can "attend" to any other token, capturing long-range dependencies efficiently.
          </div>
        </div>
      )}
    </div>
  );
}