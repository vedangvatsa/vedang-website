"use client";

import React, { useState } from 'react';

export function QuantizationVisualizer() {
  const [precision, setPrecision] = useState(32);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [showQuantized, setShowQuantized] = useState(false);

  const originalWeights = [
    3.14159265, -2.71828182, 1.41421356, -0.57721566, 2.30258509,
    -1.73205080, 0.69314718, 1.61803398, -1.12345678, 0.86602540
  ];

  const quantizeValue = (value: number, bits: number) => {
    const maxVal = Math.pow(2, bits - 1) - 1;
    const minVal = -Math.pow(2, bits - 1);
    const scale = Math.max(Math.abs(Math.max(...originalWeights)), Math.abs(Math.min(...originalWeights)));
    const quantized = Math.round((value / scale) * maxVal);
    const clamped = Math.max(minVal, Math.min(maxVal, quantized));
    return (clamped / maxVal) * scale;
  };

  const getModelSize = (bits: number) => {
    return (originalWeights.length * bits) / 8;
  };

  const getSizeReduction = (bits: number) => {
    return ((getModelSize(32) - getModelSize(bits)) / getModelSize(32)) * 100;
  };

  const getAccuracyLoss = (bits: number) => {
    if (bits === 32) return 0;
    const losses = { 16: 0.5, 8: 2.1, 4: 8.3 };
    return losses[bits as keyof typeof losses] || 0;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Neural Network Quantization</h3>
        <p className="text-slate-600">Reduce model size by lowering numerical precision of weights</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <label className="text-slate-700 font-medium">Precision:</label>
          <div className="flex gap-2">
            {[32, 16, 8, 4].map((bits) => (
              <button
                key={bits}
                onClick={() => setPrecision(bits)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  precision === bits
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-300'
                }`}
              >
                {bits}-bit
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowQuantized(!showQuantized)}
            className="ml-4 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            {showQuantized ? 'Show Original' : 'Show Quantized'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Neural Network Weights</h4>
            <div className="grid grid-cols-2 gap-2">
              {originalWeights.map((weight, index) => {
                const quantizedWeight = quantizeValue(weight, precision);
                const displayWeight = showQuantized ? quantizedWeight : weight;
                const error = Math.abs(weight - quantizedWeight);
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedWeight(index)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedWeight === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm text-slate-600">w[{index}]</div>
                    <div className="font-mono text-sm">
                      {displayWeight.toFixed(precision === 4 ? 2 : 4)}
                    </div>
                    {showQuantized && error > 0.01 && (
                      <div className="text-xs text-rose-500 mt-1">
                        Error: ±{error.toFixed(3)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Model Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Model Size:</span>
                  <span className="font-mono">{getModelSize(precision).toFixed(1)} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Size Reduction:</span>
                  <span className={`font-semibold ${
                    getSizeReduction(precision) > 50 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {getSizeReduction(precision).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Accuracy Loss:</span>
                  <span className={`font-semibold ${
                    getAccuracyLoss(precision) > 5 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    ~{getAccuracyLoss(precision)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Precision Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>32-bit (Original)</span>
                  <span>100% accuracy</span>
                </div>
                {[16, 8, 4].map((bits) => (
                  <div key={bits} className="relative">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{bits}-bit</span>
                      <span>{(100 - getAccuracyLoss(bits)).toFixed(1)}% accuracy</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          bits === precision ? 'bg-blue-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${100 - getAccuracyLoss(bits)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Selected Weight Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-blue-600">Original Value</div>
              <div className="font-mono font-semibold">{originalWeights[selectedWeight].toFixed(6)}</div>
            </div>
            <div>
              <div className="text-blue-600">Quantized Value</div>
              <div className="font-mono font-semibold">
                {quantizeValue(originalWeights[selectedWeight], precision).toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-blue-600">Quantization Error</div>
              <div className="font-mono font-semibold text-rose-600">
                ±{Math.abs(originalWeights[selectedWeight] - quantizeValue(originalWeights[selectedWeight], precision)).toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-blue-600">Bits per Weight</div>
              <div className="font-mono font-semibold">{precision} bits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}