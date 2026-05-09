"use client";

import React, { useState } from 'react';

export function LogitVisualizer() {
  const [vocabulary] = useState(['the', 'cat', 'dog', 'runs', 'sits', 'quickly']);
  const [logits, setLogits] = useState([2.1, -0.5, 1.8, 0.3, -1.2, 0.7]);
  const [showProbabilities, setShowProbabilities] = useState(false);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);

  const softmax = (logits: number[]) => {
    const maxLogit = Math.max(...logits);
    const expLogits = logits.map(l => Math.exp(l - maxLogit));
    const sumExp = expLogits.reduce((sum, exp) => sum + exp, 0);
    return expLogits.map(exp => exp / sumExp);
  };

  const probabilities = softmax(logits);
  const maxLogit = Math.max(...logits);
  const minLogit = Math.min(...logits);

  const handleLogitChange = (index: number, value: number) => {
    const newLogits = [...logits];
    newLogits[index] = value;
    setLogits(newLogits);
  };

  const getBarWidth = (value: number, isLogit: boolean) => {
    if (isLogit) {
      const normalized = (value - minLogit) / (maxLogit - minLogit);
      return Math.max(normalized * 100, 5);
    } else {
      return value * 100;
    }
  };

  const getBarColor = (index: number) => {
    if (selectedToken === index) return 'bg-rose-500';
    if (index === logits.indexOf(maxLogit)) return 'bg-indigo-500';
    return 'bg-blue-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Logit Visualization</h3>
        <p className="text-slate-600">Adjust logits and see how they transform into probabilities through softmax</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowProbabilities(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !showProbabilities
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Raw Logits
        </button>
        <button
          onClick={() => setShowProbabilities(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showProbabilities
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Probabilities (After Softmax)
        </button>
      </div>

      <div className="w-full max-w-4xl space-y-4">
        {vocabulary.map((token, index) => (
          <div
            key={token}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            onMouseEnter={() => setSelectedToken(index)}
            onMouseLeave={() => setSelectedToken(null)}
          >
            <div className="w-16 text-sm font-medium text-slate-700 text-center">
              "{token}"
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 w-12">Logit:</span>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={logits[index]}
                  onChange={(e) => handleLogitChange(index, parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs font-mono text-slate-700 w-12">
                  {logits[index].toFixed(1)}
                </span>
              </div>
              
              <div className="relative h-6 bg-slate-100 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getBarColor(index)}`}
                  style={{
                    width: `${getBarWidth(
                      showProbabilities ? probabilities[index] : logits[index],
                      !showProbabilities
                    )}%`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-medium text-slate-700">
                    {showProbabilities
                      ? `${(probabilities[index] * 100).toFixed(1)}%`
                      : logits[index].toFixed(1)
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-2xl">
        <div className="text-sm text-slate-600 space-y-2">
          <div className="font-medium text-slate-800 mb-2">Key Insights:</div>
          <div>• <strong>Logits</strong> are raw scores - they can be any real number</div>
          <div>• <strong>Softmax</strong> converts logits to probabilities (0-100%, sum to 100%)</div>
          <div>• Higher logits don't directly show probability - relative differences matter</div>
          <div>• The highest logit (highlighted in purple) gets the highest probability</div>
          {selectedToken !== null && (
            <div className="mt-3 p-2 bg-rose-50 rounded border-l-4 border-rose-400">
              Token "{vocabulary[selectedToken]}": Logit {logits[selectedToken].toFixed(2)} → 
              Probability {(probabilities[selectedToken] * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}