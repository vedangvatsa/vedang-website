"use client";

import { useState } from 'react';

export function TopKSamplingVisualizer() {
  const [k, setK] = useState(3);
  const [temperature, setTemperature] = useState(1.0);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  // Mock vocabulary with logits
  const vocabulary = [
    { token: "the", logit: 4.2 },
    { token: "cat", logit: 3.8 },
    { token: "dog", logit: 3.5 },
    { token: "house", logit: 2.1 },
    { token: "tree", logit: 1.8 },
    { token: "moon", logit: 1.2 },
    { token: "purple", logit: 0.8 },
    { token: "flying", logit: 0.3 }
  ];

  // Sort by logit descending
  const sortedVocab = [...vocabulary].sort((a, b) => b.logit - a.logit);

  // Apply top-k filtering
  const topKTokens = sortedVocab.slice(0, k);
  const filteredTokens = sortedVocab.map((token, idx) => ({
    ...token,
    included: idx < k,
    adjustedLogit: idx < k ? token.logit / temperature : -Infinity
  }));

  // Calculate softmax probabilities
  const maxLogit = Math.max(...topKTokens.map(t => t.logit / temperature));
  const expSum = topKTokens.reduce((sum, token) => sum + Math.exp(token.logit / temperature - maxLogit), 0);
  
  const tokensWithProbs = filteredTokens.map(token => ({
    ...token,
    probability: token.included ? Math.exp(token.logit / temperature - maxLogit) / expSum : 0
  }));

  const handleSample = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < tokensWithProbs.length; i++) {
      cumulative += tokensWithProbs[i].probability;
      if (rand <= cumulative && tokensWithProbs[i].included) {
        setSelectedToken(i);
        break;
      }
    }
  };

  const resetAnimation = () => {
    setSelectedToken(null);
    setAnimationStep(0);
  };

  const nextStep = () => {
    setAnimationStep(prev => (prev + 1) % 4);
    if (animationStep === 3) {
      setSelectedToken(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Top-k Sampling</h3>
        <p className="text-slate-600">Interactive visualization of how AI models select the next token using top-k sampling</p>
      </div>

      <div className="flex gap-8 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-w-64">
          <h4 className="text-lg font-semibold text-slate-800">Parameters</h4>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">k (top tokens): {k}</label>
            <input
              type="range"
              min="1"
              max="8"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Temperature: {temperature.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Step {animationStep + 1}: {['Raw Logits', 'Filter Top-k', 'Softmax', 'Sample'][animationStep]}
            </button>
            
            <button
              onClick={handleSample}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Random Sample
            </button>
            
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Visualization */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Token Probabilities</h4>
          
          <div className="space-y-2">
            {tokensWithProbs.map((token, idx) => {
              const isFiltered = !token.included;
              const isSelected = selectedToken === idx;
              const maxProb = Math.max(...tokensWithProbs.map(t => t.probability));
              const barWidth = (token.probability / maxProb) * 100;

              return (
                <div
                  key={token.token}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? 'bg-emerald-100 border-emerald-300'
                      : isFiltered && animationStep >= 1
                      ? 'bg-rose-50 border-rose-200 opacity-50'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-16 text-sm font-mono text-slate-700">
                    {token.token}
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-32">
                      <div className="text-xs text-slate-500 mb-1">
                        {animationStep === 0 ? 'Logit' : animationStep >= 2 ? 'Probability' : 'Filtered'}
                      </div>
                      <div className="relative h-4 bg-slate-200 rounded">
                        {animationStep === 0 && (
                          <div
                            className="h-full bg-blue-400 rounded transition-all duration-300"
                            style={{ width: `${(token.logit / Math.max(...vocabulary.map(v => v.logit))) * 100}%` }}
                          />
                        )}
                        {animationStep >= 2 && !isFiltered && (
                          <div
                            className={`h-full rounded transition-all duration-300 ${
                              isSelected ? 'bg-emerald-500' : 'bg-indigo-400'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        )}
                        {animationStep === 1 && !isFiltered && (
                          <div className="h-full bg-amber-400 rounded w-full" />
                        )}
                      </div>
                    </div>
                    
                    <div className="w-20 text-right text-sm font-mono">
                      {animationStep === 0 && token.logit.toFixed(1)}
                      {animationStep === 1 && (token.included ? '✓' : '✗')}
                      {animationStep >= 2 && !isFiltered && `${(token.probability * 100).toFixed(1)}%`}
                      {animationStep >= 2 && isFiltered && '-'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <div className="text-sm text-slate-600">
              <div className="font-semibold mb-2">Process:</div>
              <div className={`${animationStep >= 0 ? 'text-slate-800' : 'text-slate-400'}`}>
                1. Start with raw logits from model
              </div>
              <div className={`${animationStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                2. Keep only top-{k} tokens, filter out the rest
              </div>
              <div className={`${animationStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                3. Apply softmax to get probability distribution
              </div>
              <div className={`${animationStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                4. Sample from the filtered distribution
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}