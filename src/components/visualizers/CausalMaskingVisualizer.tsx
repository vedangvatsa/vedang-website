"use client";

import { useState } from 'react';

export function CausalMaskingVisualizer() {
  const [selectedPosition, setSelectedPosition] = useState(2);
  const [showMask, setShowMask] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  
  const tokens = ['The', 'cat', 'sits', 'on', 'mat'];
  const sequenceLength = tokens.length;

  // Generate attention scores (before masking)
  const generateRawScores = (queryPos: number) => {
    return tokens.map((_, i) => Math.random() * 0.6 + 0.2);
  };

  const rawScores = generateRawScores(selectedPosition);

  // Apply causal mask
  const getMaskedScores = (scores: number[], queryPos: number) => {
    return scores.map((score, i) => {
      if (showMask && i > queryPos) {
        return -Infinity;
      }
      return score;
    });
  };

  // Apply softmax
  const applySoftmax = (scores: number[]) => {
    const validScores = scores.filter(s => s !== -Infinity);
    const maxScore = Math.max(...validScores);
    const expScores = scores.map(s => s === -Infinity ? 0 : Math.exp(s - maxScore));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    return expScores.map(exp => exp / sumExp);
  };

  const maskedScores = getMaskedScores(rawScores, selectedPosition);
  const attentionWeights = applySoftmax(maskedScores);

  const getAttentionColor = (weight: number, isMasked: boolean) => {
    if (isMasked) return 'bg-slate-800 text-white';
    const intensity = Math.min(Math.max(weight * 4, 0.1), 1);
    if (intensity > 0.7) return 'bg-blue-600 text-white';
    if (intensity > 0.4) return 'bg-blue-400 text-white';
    if (intensity > 0.2) return 'bg-blue-200 text-blue-900';
    return 'bg-blue-100 text-blue-800';
  };

  const runAnimation = () => {
    setAnimationStep(0);
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Causal Masking Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive demonstration of how causal masking prevents tokens from attending to future positions, 
          enforcing left-to-right information flow in autoregressive models.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Query Position:</label>
            <select 
              value={selectedPosition} 
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm"
            >
              {tokens.map((token, i) => (
                <option key={i} value={i}>{i}: "{token}"</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setShowMask(!showMask)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showMask 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {showMask ? 'Disable Masking' : 'Enable Masking'}
          </button>

          <button
            onClick={runAnimation}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            Animate Process
          </button>
        </div>

        {/* Sequence Display */}
        <div className="flex justify-center gap-2">
          {tokens.map((token, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                i === selectedPosition
                  ? 'border-indigo-500 bg-indigo-100 text-indigo-900'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="text-xs text-slate-500">pos {i}</div>
              <div className="font-medium">{token}</div>
            </div>
          ))}
        </div>

        {/* Attention Matrix Visualization */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            Attention Weights for Position {selectedPosition} ("{tokens[selectedPosition]}")
          </h4>
          
          {/* Step indicators */}
          <div className="flex justify-center gap-4 mb-6 text-sm">
            <div className={`px-3 py-1 rounded ${animationStep >= 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
              1. Raw Scores
            </div>
            <div className={`px-3 py-1 rounded ${animationStep >= 2 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
              2. Apply Mask
            </div>
            <div className={`px-3 py-1 rounded ${animationStep >= 3 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
              3. Softmax
            </div>
          </div>

          {/* Attention weights grid */}
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
            {tokens.map((token, i) => {
              const isMasked = showMask && i > selectedPosition;
              const weight = attentionWeights[i];
              const isCurrentOrPast = i <= selectedPosition;
              
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-slate-500 mb-1">to "{token}"</div>
                  <div
                    className={`h-16 w-full rounded border-2 flex flex-col items-center justify-center text-xs transition-all duration-500 ${
                      isMasked
                        ? 'bg-slate-800 text-white border-slate-700'
                        : getAttentionColor(weight, false) + ' border-blue-300'
                    }`}
                  >
                    {isMasked ? (
                      <div>
                        <div>-∞</div>
                        <div className="text-xs">masked</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold">{(weight * 100).toFixed(1)}%</div>
                        {!isCurrentOrPast && !showMask && (
                          <div className="text-xs text-rose-600">future</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Information flow arrows */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 bg-emerald-500 rounded"></div>
              <span>Can attend (past/current)</span>
              <div className="w-4 h-4 bg-slate-800 rounded ml-4"></div>
              <span>Masked (future)</span>
            </div>
          </div>

          {/* Mathematical explanation */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg text-sm">
            <div className="text-center font-medium text-slate-800 mb-2">
              Causal Mask Formula
            </div>
            <div className="text-center text-slate-600">
              mask[i,j] = 0 if j ≤ i, else -∞
            </div>
            <div className="text-center text-slate-600 mt-1">
              attention_weight[i,j] = softmax(score[i,j] + mask[i,j])
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}