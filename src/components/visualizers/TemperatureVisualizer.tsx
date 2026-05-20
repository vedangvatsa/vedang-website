"use client";

import { useState } from 'react';

export function TemperatureVisualizer() {
  const [temperature, setTemperature] = useState(1.0);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  
  // Sample logits for common tokens
  const tokens = [
    { word: "the", logit: 2.5 },
    { word: "a", logit: 1.8 },
    { word: "beautiful", logit: 1.2 },
    { word: "amazing", logit: 0.9 },
    { word: "terrible", logit: 0.4 },
    { word: "purple", logit: -0.2 },
    { word: "quantum", logit: -0.8 },
    { word: "zebra", logit: -1.5 }
  ];

  // Apply temperature scaling and softmax
  const scaledLogits = tokens.map(token => token.logit / temperature);
  const maxLogit = Math.max(...scaledLogits);
  const expValues = scaledLogits.map(logit => Math.exp(logit - maxLogit));
  const sumExp = expValues.reduce((sum, val) => sum + val, 0);
  const probabilities = expValues.map(exp => exp / sumExp);

  const tokensWithProbs = tokens.map((token, i) => ({
    ...token,
    probability: probabilities[i],
    scaledLogit: scaledLogits[i]
  })).sort((a, b) => b.probability - a.probability);

  const getBarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500', 'bg-blue-400', 'bg-indigo-400'];
    return colors[index % colors.length];
  };

  const entropy = -tokensWithProbs.reduce((sum, token) => 
    sum + (token.probability > 0 ? token.probability * Math.log2(token.probability) : 0), 0
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Temperature in Language Models</h3>
        <p className="text-slate-600 max-w-2xl">
          Adjust temperature to see how it affects token probability distribution. Lower values make the model more confident and deterministic, while higher values increase randomness and creativity.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Temperature Control */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-slate-700">Temperature</label>
            <span className="text-xl font-mono text-blue-600">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-slate-500 mt-2">
            <span>Deterministic (0.1)</span>
            <span>Creative (2.0)</span>
          </div>
        </div>

        {/* Probability Distribution Visualization */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Next Token Probabilities</h4>
          <div className="space-y-3">
            {tokensWithProbs.map((token, index) => (
              <div
                key={token.word}
                className={`flex items-center gap-4 p-2 rounded cursor-pointer transition-all ${
                  selectedToken === token.word ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                }`}
                onClick={() => setSelectedToken(selectedToken === token.word ? null : token.word)}
              >
                <div className="w-20 text-sm font-mono text-slate-600">{token.word}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`${getBarColor(index)} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${token.probability * 100}%` }}
                  />
                </div>
                <div className="w-16 text-sm font-mono text-slate-600 text-right">
                  {(token.probability * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mathematical Details */}
        {selectedToken && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">Mathematical Details for "{selectedToken}"</h4>
            {(() => {
              const token = tokensWithProbs.find(t => t.word === selectedToken);
              if (!token) return null;
              return (
                <div className="space-y-2 font-mono text-sm">
                  <div>Original logit: <span className="text-blue-600">{token.logit.toFixed(2)}</span></div>
                  <div>Scaled logit: <span className="text-blue-600">{token.logit.toFixed(2)} / {temperature.toFixed(2)} = {token.scaledLogit.toFixed(2)}</span></div>
                  <div>Probability: <span className="text-blue-600">{(token.probability * 100).toFixed(2)}%</span></div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 text-center">
            <div className="text-2xl font-bold text-emerald-700">{entropy.toFixed(2)}</div>
            <div className="text-sm text-emerald-600">Entropy (bits)</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-center">
            <div className="text-2xl font-bold text-amber-700">{(tokensWithProbs[0].probability * 100).toFixed(1)}%</div>
            <div className="text-sm text-amber-600">Top Token Prob</div>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200 text-center">
            <div className="text-2xl font-bold text-rose-700">
              {temperature < 0.5 ? "Low" : temperature > 1.5 ? "High" : "Medium"}
            </div>
            <div className="text-sm text-rose-600">Randomness</div>
          </div>
        </div>
      </div>
    </div>
  );
}