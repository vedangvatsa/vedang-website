"use client";

import { useState } from 'react';

export function TopPSamplingVisualizer() {
  const [pValue, setPValue] = useState(0.9);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  
  // Sample token probabilities that change based on p value to show different scenarios
  const getTokenData = (p: number) => {
    if (p >= 0.8) {
      // High confidence scenario
      return [
        { token: "the", probability: 0.85 },
        { token: "a", probability: 0.08 },
        { token: "this", probability: 0.04 },
        { token: "that", probability: 0.02 },
        { token: "my", probability: 0.01 }
      ];
    } else if (p >= 0.5) {
      // Medium confidence scenario
      return [
        { token: "cat", probability: 0.35 },
        { token: "dog", probability: 0.25 },
        { token: "bird", probability: 0.15 },
        { token: "fish", probability: 0.12 },
        { token: "rabbit", probability: 0.08 },
        { token: "mouse", probability: 0.05 }
      ];
    } else {
      // Low confidence scenario
      return [
        { token: "red", probability: 0.18 },
        { token: "blue", probability: 0.16 },
        { token: "green", probability: 0.14 },
        { token: "yellow", probability: 0.12 },
        { token: "purple", probability: 0.11 },
        { token: "orange", probability: 0.10 },
        { token: "pink", probability: 0.09 },
        { token: "brown", probability: 0.10 }
      ];
    }
  };

  const tokenData = getTokenData(pValue);
  
  // Sort by probability descending and calculate cumulative probabilities
  const sortedTokens = tokenData
    .sort((a, b) => b.probability - a.probability)
    .map((token, index, arr) => ({
      ...token,
      cumulative: arr.slice(0, index + 1).reduce((sum, t) => sum + t.probability, 0)
    }));

interface TokenInfo {
  token: string;
  probability: number;
  cumulative: number;
}

  // Find tokens included in top-p sampling
  const includedTokens: TokenInfo[] = [];
  let cumulativeProb = 0;
  for (const token of sortedTokens) {
    if (cumulativeProb < pValue) {
      includedTokens.push(token);
      cumulativeProb += token.probability;
    } else {
      break;
    }
  }

  const nucleusSize = includedTokens.length;
  const totalIncludedProb = includedTokens.reduce((sum, t) => sum + t.probability, 0);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Top-p Sampling (Nucleus Sampling)</h3>
        <p className="text-slate-600">
          Dynamically selects the smallest set of tokens whose cumulative probability exceeds threshold p
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            p-value: {pValue.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={pValue}
            onChange={(e) => {
              setPValue(parseFloat(e.target.value));
              setSelectedToken(null);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0.1 (diverse)</span>
            <span>0.95 (focused)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Probabilities */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Token Probabilities</h4>
            <div className="space-y-3">
              {sortedTokens.map((token, index) => {
                const isIncluded = includedTokens.some(t => t.token === token.token);
                const isSelected = selectedToken === index;
                
                return (
                  <div
                    key={token.token}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-100 border-2 border-blue-300' 
                        : isIncluded 
                          ? 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedToken(isSelected ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-sm font-mono ${
                          isIncluded ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {token.token}
                        </span>
                        <div className="flex flex-col text-xs">
                          <span className="font-medium">{(token.probability * 100).toFixed(1)}%</span>
                          <span className="text-slate-500">cumulative: {(token.cumulative * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        isIncluded ? 'bg-emerald-500' : 'bg-slate-300'
                      }`} />
                    </div>
                    
                    {/* Probability bar */}
                    <div className="mt-2 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isIncluded ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${token.probability * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cumulative Probability Visualization */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Nucleus Formation</h4>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">{nucleusSize}</div>
                <div className="text-sm text-emerald-700">Tokens in nucleus</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{(totalIncludedProb * 100).toFixed(1)}%</div>
                <div className="text-sm text-blue-700">Total probability</div>
              </div>
            </div>

            {/* Cumulative probability chart */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 mb-3">Cumulative Probability</div>
              {sortedTokens.map((token, index) => {
                const isIncluded = includedTokens.some(t => t.token === token.token);
                const exceedsThreshold = token.cumulative > pValue;
                
                return (
                  <div key={token.token} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-mono ${isIncluded ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {token.token}
                      </span>
                      <span className={isIncluded ? 'text-emerald-600' : 'text-slate-400'}>
                        {(token.cumulative * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isIncluded ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${token.cumulative * 100}%` }}
                      />
                      {/* p-value threshold line */}
                      <div
                        className="absolute top-0 w-0.5 h-full bg-rose-500"
                        style={{ left: `${pValue * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Threshold indicator */}
              <div className="flex items-center gap-2 mt-4 text-xs">
                <div className="w-3 h-0.5 bg-rose-500" />
                <span className="text-rose-600">p = {pValue} threshold</span>
              </div>
            </div>

            {selectedToken !== null && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm">
                  <div className="font-medium text-blue-800">
                    Token: "{sortedTokens[selectedToken].token}"
                  </div>
                  <div className="text-blue-700">
                    Individual: {(sortedTokens[selectedToken].probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-blue-700">
                    Cumulative: {(sortedTokens[selectedToken].cumulative * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="text-sm text-indigo-800">
            <strong>How it works:</strong> Top-p sampling includes tokens from highest to lowest probability 
            until their cumulative probability reaches the threshold p. With p={pValue}, we include the top {nucleusSize} tokens 
            covering {(totalIncludedProb * 100).toFixed(1)}% of probability mass. 
            {pValue >= 0.8 ? " High p values create focused, predictable outputs." : 
             pValue >= 0.5 ? " Medium p values balance creativity and coherence." : 
             " Low p values enable diverse, creative generation."}
          </div>
        </div>
      </div>
    </div>
  );
}