"use client";

import { useState } from 'react';

export function KvCacheVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [useCache, setUseCache] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const maxTokens = 6;
  const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat'];

  const generateToken = () => {
    if (currentStep >= maxTokens) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 1000);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const getComputations = (step: number) => {
    if (!useCache) {
      return step + 1; // Without cache: recompute all previous tokens
    }
    return 1; // With cache: only compute current token
  };

  const getTotalComputations = () => {
    let total = 0;
    for (let i = 0; i < currentStep; i++) {
      total += getComputations(i);
    }
    return total;
  };

  const getCacheSize = () => {
    return useCache ? currentStep : 0;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">KV Cache Visualization</h3>
        <p className="text-slate-600">See how caching Key-Value vectors reduces computation during autoregressive generation</p>
      </div>

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={useCache}
            onChange={(e) => setUseCache(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          Enable KV Cache
        </label>
        <button
          onClick={generateToken}
          disabled={isAnimating || currentStep >= maxTokens}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Next Token
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
        >
          Reset
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Generation Visualization */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Token Generation</h4>
            <div className="space-y-3">
              {tokens.slice(0, currentStep + 1).map((token, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-16 h-8 rounded flex items-center justify-center text-sm font-medium ${
                    index < currentStep ? 'bg-emerald-100 text-emerald-700' : 
                    index === currentStep && isAnimating ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {token}
                  </div>
                  <div className="text-xs text-slate-500">
                    Token {index}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attention Computation */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Attention Computation</h4>
            <div className="space-y-2">
              {Array.from({ length: currentStep }, (_, step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="text-xs text-slate-600 w-16">Step {step}:</div>
                  <div className="flex gap-1">
                    {Array.from({ length: step + 1 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                          !useCache ? 'bg-rose-200 text-rose-700' : 
                          i < step ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-200 text-blue-700'
                        }`}
                        title={!useCache ? 'Recomputed' : i < step ? 'Cached' : 'New computation'}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 ml-2">
                    {getComputations(step)} computation{getComputations(step) !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cache Visualization */}
        {useCache && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mt-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">KV Cache Contents</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Key Vectors</div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: getCacheSize() }, (_, i) => (
                    <div key={i} className="w-12 h-8 bg-indigo-100 text-indigo-700 rounded flex items-center justify-center text-xs font-medium">
                      K{i}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Value Vectors</div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: getCacheSize() }, (_, i) => (
                    <div key={i} className="w-12 h-8 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center text-xs font-medium">
                      V{i}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mt-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Performance Impact</h4>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getTotalComputations()}</div>
              <div className="text-sm text-slate-600">Total Computations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{getCacheSize()}</div>
              <div className="text-sm text-slate-600">Cached Vectors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {currentStep > 0 ? Math.round((1 - (useCache ? currentStep : currentStep * (currentStep + 1) / 2) / (currentStep * (currentStep + 1) / 2)) * 100) : 0}%
              </div>
              <div className="text-sm text-slate-600">Computation Saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 max-w-2xl text-center">
        <span className="font-medium">Legend:</span>
        <span className="ml-2 inline-flex items-center gap-1">
          <div className="w-3 h-3 bg-rose-200 rounded"></div> Recomputed
        </span>
        <span className="ml-2 inline-flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-200 rounded"></div> Cached
        </span>
        <span className="ml-2 inline-flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-200 rounded"></div> New computation
        </span>
      </div>
    </div>
  );
}