"use client";

import { useState } from "react";

export function ScalingLawVisualizer() {
  const [modelParams, setModelParams] = useState(1);
  const [dataTokens, setDataTokens] = useState(1);
  const [computeBudget, setComputeBudget] = useState(1);
  const [selectedLaw, setSelectedLaw] = useState("openai");
  const [isAnimating, setIsAnimating] = useState(false);

  // OpenAI scaling law: L = A * N^(-α) where α ≈ 0.076
  const calculateOpenAILoss = (params: number, data: number, compute: number) => {
    const N = params * 1e6; // Convert to millions
    const D = data * 1e9; // Convert to billions of tokens
    const C = compute * 1e18; // Convert to FLOPs
    
    const lossFromParams = 1.73 * Math.pow(N, -0.076);
    const lossFromData = 5.4 * Math.pow(D, -0.095);
    const lossFromCompute = 1.37 * Math.pow(C, -0.050);
    
    return Math.min(lossFromParams, lossFromData, lossFromCompute);
  };

  // Chinchilla optimal scaling: N ∝ D (parameters scale with data)
  const calculateChinchillaLoss = (params: number, data: number) => {
    const N = params * 1e6;
    const D = data * 1e9;
    const optimalRatio = D / N;
    const efficiency = Math.min(1, optimalRatio / 20); // Penalty for suboptimal ratio
    return 2.0 * Math.pow(N, -0.076) * Math.pow(D, -0.095) * (2 - efficiency);
  };

  const currentLoss = selectedLaw === "openai" 
    ? calculateOpenAILoss(modelParams, dataTokens, computeBudget)
    : calculateChinchillaLoss(modelParams, dataTokens);

  const performance = Math.max(0, 100 - (currentLoss * 50));

  const runOptimization = () => {
    setIsAnimating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (selectedLaw === "chinchilla") {
        // Scale params and data proportionally
        setModelParams(prev => Math.min(10, prev * 1.2));
        setDataTokens(prev => Math.min(10, prev * 1.2));
      } else {
        // Scale all factors
        setModelParams(prev => Math.min(10, prev * 1.15));
        setDataTokens(prev => Math.min(10, prev * 1.15));
        setComputeBudget(prev => Math.min(10, prev * 1.15));
      }
      
      if (step >= 8) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 500);
  };

  const reset = () => {
    setModelParams(1);
    setDataTokens(1);
    setComputeBudget(1);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Scaling Laws</h3>
        <p className="text-slate-600 max-w-2xl">
          Discover how neural network performance improves with model size, training data, and compute. 
          Adjust the sliders to see power law relationships in action.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedLaw("openai")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedLaw === "openai"
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          OpenAI Law
        </button>
        <button
          onClick={() => setSelectedLaw("chinchilla")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedLaw === "chinchilla"
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          Chinchilla Law
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Scaling Factors</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Model Parameters: {modelParams.toFixed(1)}B
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={modelParams}
                  onChange={(e) => setModelParams(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                  disabled={isAnimating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Training Data: {dataTokens.toFixed(1)}T tokens
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={dataTokens}
                  onChange={(e) => setDataTokens(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                  disabled={isAnimating}
                />
              </div>

              {selectedLaw === "openai" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Compute Budget: {computeBudget.toFixed(1)}E FLOPs
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={computeBudget}
                    onChange={(e) => setComputeBudget(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-amber"
                    disabled={isAnimating}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={runOptimization}
                disabled={isAnimating}
                className="flex-1 bg-rose-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAnimating ? "Scaling..." : "Auto Scale"}
              </button>
              <button
                onClick={reset}
                disabled={isAnimating}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 disabled:opacity-50 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {selectedLaw === "chinchilla" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Optimal Ratio</h4>
              <p className="text-sm text-slate-600 mb-3">
                Chinchilla: Parameters and data should scale proportionally
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (dataTokens / modelParams) * 10)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {(dataTokens / modelParams).toFixed(1)}:1
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h4>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Training Loss</span>
                <span className="text-sm text-slate-600">{currentLoss.toFixed(3)}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-300 transition-all duration-300"
                  style={{ width: `${Math.min(100, currentLoss * 50)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Model Performance</span>
                <span className="text-sm text-slate-600">{performance.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300"
                  style={{ width: `${performance}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h5 className="font-medium text-slate-900 mb-2">Power Law Formula</h5>
              <div className="text-sm text-slate-600 font-mono">
                {selectedLaw === "openai" ? (
                  <div>L = min(A·N^(-α), B·D^(-β), C·C^(-γ))</div>
                ) : (
                  <div>L = A·N^(-α)·D^(-β)·efficiency</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 w-full max-w-4xl">
        <div className="text-sm text-slate-600 leading-relaxed">
          <strong className="text-slate-900">
            {selectedLaw === "openai" ? "OpenAI Scaling Law:" : "Chinchilla Scaling Law:"}
          </strong>
          {" "}
          {selectedLaw === "openai" 
            ? "Performance is bottlenecked by the least scaled resource. Increasing all factors improves results."
            : "For optimal compute efficiency, model size and training data should grow together proportionally."
          }
        </div>
      </div>
    </div>
  );
}