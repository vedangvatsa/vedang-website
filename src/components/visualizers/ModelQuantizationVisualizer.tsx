"use client";

import { useState } from 'react';

export function ModelQuantizationVisualizer() {
  const [precision, setPrecision] = useState(32);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Original 32-bit weights (simulated neural network layer)
  const originalWeights = [
    3.14159265, -1.41421356, 2.71828182, -0.57721566,
    1.61803398, -2.30258509, 0.69314718, -3.14159265,
    1.73205080, -1.00000000, 2.44948974, -0.86602540
  ];

  const quantizeValue = (value: number, bits: number): number => {
    if (bits === 32) return value;
    
    const maxVal = Math.pow(2, bits - 1) - 1;
    const minVal = -Math.pow(2, bits - 1);
    
    // Scale to integer range and back
    const scale = maxVal / Math.max(...originalWeights.map(Math.abs));
    const quantized = Math.round(value * scale);
    const clamped = Math.max(minVal, Math.min(maxVal, quantized));
    
    return clamped / scale;
  };

  const getBitColor = (bits: number): string => {
    if (bits === 32) return 'bg-blue-500';
    if (bits === 16) return 'bg-indigo-500';
    if (bits === 8) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getMemoryUsage = (bits: number): number => {
    return (originalWeights.length * bits) / 8; // bytes
  };

  const getAccuracyLoss = (bits: number): number => {
    if (bits === 32) return 0;
    const originalSum = originalWeights.reduce((sum, w) => sum + Math.abs(w), 0);
    const quantizedSum = originalWeights.reduce((sum, w) => sum + Math.abs(quantizeValue(w, bits)), 0);
    return Math.abs((originalSum - quantizedSum) / originalSum) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Model Quantization</h3>
        <p className="text-slate-600 max-w-2xl">
          Reduce neural network memory usage by converting weights from high-precision to lower-precision formats. 
          Interact with the precision slider to see the trade-offs between model size and accuracy.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precision: {precision}-bit
            </label>
            <input
              type="range"
              min="1"
              max="32"
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1-bit</span>
              <span>16-bit</span>
              <span>32-bit</span>
            </div>
          </div>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>

          {/* Stats */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Memory Usage:</span>
              <span className={`font-medium ${precision < 16 ? 'text-emerald-600' : 'text-slate-800'}`}>
                {getMemoryUsage(precision)} bytes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Accuracy Loss:</span>
              <span className={`font-medium ${getAccuracyLoss(precision) > 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {getAccuracyLoss(precision).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Compression:</span>
              <span className="font-medium text-blue-600">
                {(32 / precision).toFixed(1)}x smaller
              </span>
            </div>
          </div>
        </div>

        {/* Weight Visualization */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              Neural Network Layer Weights
            </h4>
            
            <div className="grid grid-cols-4 gap-3 mb-6">
              {originalWeights.map((weight, index) => {
                const quantized = quantizeValue(weight, precision);
                const isSelected = selectedWeight === index;
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedWeight(isSelected ? null : index)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs text-slate-500 mb-1">Weight {index + 1}</div>
                    <div className="text-sm font-mono">
                      {showComparison ? (
                        <div className="space-y-1">
                          <div className="text-slate-400">
                            {weight.toFixed(6)}
                          </div>
                          <div className={`${Math.abs(weight - quantized) > 0.1 ? 'text-rose-600' : 'text-slate-800'}`}>
                            {quantized.toFixed(6)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-800">
                          {quantized.toFixed(6)}
                        </div>
                      )}
                    </div>
                    
                    {/* Visual representation of magnitude */}
                    <div className="mt-2 h-2 bg-slate-100 rounded">
                      <div
                        className={`h-full rounded ${getBitColor(precision)}`}
                        style={{
                          width: `${Math.min(100, (Math.abs(quantized) / 3.5) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedWeight !== null && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-medium text-slate-800 mb-2">Weight {selectedWeight + 1} Details</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Original (32-bit):</span>
                    <div className="font-mono text-slate-800">
                      {originalWeights[selectedWeight].toFixed(8)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Quantized ({precision}-bit):</span>
                    <div className="font-mono text-slate-800">
                      {quantizeValue(originalWeights[selectedWeight], precision).toFixed(8)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Error:</span>
                    <div className="font-mono text-rose-600">
                      {Math.abs(originalWeights[selectedWeight] - quantizeValue(originalWeights[selectedWeight], precision)).toFixed(8)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Memory per weight:</span>
                    <div className="font-mono text-blue-600">
                      {precision} bits
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Precision Scale */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-3">Common Quantization Levels</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { bits: 32, label: 'FP32', desc: 'Full Precision', color: 'blue' },
            { bits: 16, label: 'FP16', desc: 'Half Precision', color: 'indigo' },
            { bits: 8, label: 'INT8', desc: 'Integer', color: 'amber' },
            { bits: 1, label: 'Binary', desc: 'Extreme', color: 'rose' }
          ].map((level) => (
            <button
              key={level.bits}
              onClick={() => setPrecision(level.bits)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                precision === level.bits 
                  ? `border-${level.color}-500 bg-${level.color}-50` 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`font-medium text-${level.color}-600`}>{level.label}</div>
              <div className="text-xs text-slate-500">{level.desc}</div>
              <div className="text-xs text-slate-400 mt-1">
                {getMemoryUsage(level.bits)} bytes
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}