"use client";

import { useState } from 'react';

export function BatchNormalizationVisualizer() {
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [batchSize, setBatchSize] = useState(4);
  const [selectedLayer, setSelectedLayer] = useState(1);
  const [showStep, setShowStep] = useState(0);
  
  // Generate batch data with some variance
  const generateBatchData = (layer: number) => {
    const baseValues = [2.1, 5.7, 1.3, 8.2, 3.4, 6.1];
    const layerShift = layer * 2;
    const layerScale = 1 + layer * 0.5;
    return baseValues.slice(0, batchSize).map(val => val * layerScale + layerShift);
  };
  
  const rawData = generateBatchData(selectedLayer);
  
  // Calculate batch normalization steps
  const mean = rawData.reduce((sum, val) => sum + val, 0) / rawData.length;
  const variance = rawData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / rawData.length;
  const stdDev = Math.sqrt(variance + 1e-8);
  const normalizedData = rawData.map(val => (val - mean) / stdDev);
  
  const displayData = isNormalizing ? normalizedData : rawData;
  const maxVal = Math.max(...rawData, ...normalizedData, 3);
  const minVal = Math.min(...rawData, ...normalizedData, -3);
  
  const steps = [
    'Original activations from previous layer',
    'Calculate batch mean (μ)',
    'Calculate batch variance (σ²)',
    'Normalize: (x - μ) / √(σ² + ε)',
    'Scale and shift: γ * x_norm + β'
  ];
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Batch Normalization</h3>
        <p className="text-slate-600">Interactive visualization of how batch normalization stabilizes layer inputs during training</p>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Layer:</label>
          <select 
            value={selectedLayer} 
            onChange={(e) => setSelectedLayer(Number(e.target.value))}
            className="px-3 py-1 border border-slate-300 rounded-lg bg-white"
          >
            <option value={1}>Layer 1</option>
            <option value={2}>Layer 2</option>
            <option value={3}>Layer 3</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Batch Size:</label>
          <input
            type="range"
            min="3"
            max="6"
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-slate-600">{batchSize}</span>
        </div>
        
        <button
          onClick={() => setIsNormalizing(!isNormalizing)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isNormalizing 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isNormalizing ? 'Show Original' : 'Apply BatchNorm'}
        </button>
      </div>
      
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualization */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              Layer {selectedLayer} Activations
            </h4>
            
            <div className="space-y-4">
              {/* Distribution bars */}
              <div className="space-y-2">
                {displayData.map((value, idx) => {
                  const normalizedPosition = ((value - minVal) / (maxVal - minVal)) * 100;
                  const isOriginal = !isNormalizing;
                  
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-8 text-sm text-slate-600">x{idx + 1}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOriginal ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.abs(normalizedPosition)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs font-medium text-slate-700">
                            {value.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Mean (μ)</div>
                  <div className={`text-lg font-bold transition-colors ${
                    isNormalizing ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isNormalizing ? '0.00' : mean.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">Std Dev (σ)</div>
                  <div className={`text-lg font-bold transition-colors ${
                    isNormalizing ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isNormalizing ? '1.00' : stdDev.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              Normalization Process
            </h4>
            
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setShowStep(idx)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    showStep === idx
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      showStep === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="text-sm text-slate-700">{step}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Formula display */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm font-medium text-indigo-800 mb-2">Current Formula:</div>
              <div className="font-mono text-sm text-indigo-700">
                {showStep === 0 && "x = layer_output"}
                {showStep === 1 && `μ = (1/m) Σx = ${mean.toFixed(2)}`}
                {showStep === 2 && `σ² = (1/m) Σ(x-μ)² = ${variance.toFixed(2)}`}
                {showStep === 3 && "x̂ = (x - μ) / √(σ² + ε)"}
                {showStep === 4 && "y = γx̂ + β (learnable params)"}
              </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-500">
              Click steps to explore the normalization process
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-sm text-amber-800">
            <strong>Key Insight:</strong> Notice how different layers have different distributions. 
            Batch normalization ensures each layer receives inputs with consistent statistics (μ=0, σ=1), 
            preventing internal covariate shift and enabling faster, more stable training.
          </div>
        </div>
      </div>
    </div>
  );
}