"use client";

import React, { useState } from 'react';

export function LayerNormalizationVisualizer() {
  const [selectedSample, setSelectedSample] = useState(0);
  const [showNormalized, setShowNormalized] = useState(false);
  const [gamma, setGamma] = useState(1);
  const [beta, setBeta] = useState(0);

  // Sample data representing activations for 3 samples, each with 6 features
  const samples = [
    [2.5, 1.2, 4.8, 0.9, 3.1, 2.7],
    [5.2, 3.8, 2.1, 6.4, 1.9, 4.3],
    [1.1, 0.8, 3.9, 2.2, 5.5, 1.6]
  ];

  const calculateLayerNorm = (values: number[]) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance + 1e-5); // epsilon for numerical stability
    
    const normalized = values.map(val => (val - mean) / std);
    const scaled = normalized.map(val => gamma * val + beta);
    
    return { mean, variance, std, normalized, scaled };
  };

  const currentSample = samples[selectedSample];
  const { mean, variance, std, normalized, scaled } = calculateLayerNorm(currentSample);

  const getBarColor = (index: number, phase: string) => {
    if (phase === 'original') return 'bg-blue-500';
    if (phase === 'normalized') return 'bg-indigo-500';
    return 'bg-emerald-500';
  };

  const getDisplayValues = () => {
    if (!showNormalized) return currentSample;
    return scaled;
  };

  const maxValue = Math.max(...samples.flat(), ...scaled);
  const minValue = Math.min(...samples.flat(), ...scaled);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Layer Normalization</h3>
        <p className="text-slate-600">Normalizes activations across features for each sample independently</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Sample Selection */}
        <div className="flex justify-center gap-4">
          {samples.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSample(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSample === idx
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Sample {idx + 1}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-slate-800">
              Sample {selectedSample + 1} Features
            </h4>
            <button
              onClick={() => setShowNormalized(!showNormalized)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showNormalized
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {showNormalized ? 'Show Normalized' : 'Show Original'}
            </button>
          </div>

          {/* Feature Bars */}
          <div className="flex justify-center items-end gap-3 h-48 mb-6">
            {getDisplayValues().map((value, idx) => {
              const normalizedHeight = ((value - minValue) / (maxValue - minValue)) * 160 + 20;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="text-xs text-slate-600 font-mono">
                    {value.toFixed(2)}
                  </div>
                  <div
                    className={`w-12 ${getBarColor(idx, showNormalized ? 'scaled' : 'original')} rounded-t transition-all duration-500`}
                    style={{ height: `${normalizedHeight}px` }}
                  />
                  <div className="text-xs text-slate-500">F{idx + 1}</div>
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-slate-600">Mean</div>
              <div className="text-lg font-mono text-slate-800">
                {showNormalized ? '0.00' : mean.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-600">Std Dev</div>
              <div className="text-lg font-mono text-slate-800">
                {showNormalized ? gamma.toFixed(2) : std.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-600">Variance</div>
              <div className="text-lg font-mono text-slate-800">
                {showNormalized ? (gamma * gamma).toFixed(2) : variance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Learned Parameters</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scale (γ): {gamma.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={gamma}
                onChange={(e) => setGamma(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Shift (β): {beta.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-800 mb-3">Layer Norm Formula</h4>
          <div className="text-center font-mono text-indigo-700">
            y = γ × (x - μ) / σ + β
          </div>
          <div className="text-sm text-indigo-600 mt-2 text-center">
            where μ and σ are computed across features for each sample
          </div>
        </div>
      </div>
    </div>
  );
}