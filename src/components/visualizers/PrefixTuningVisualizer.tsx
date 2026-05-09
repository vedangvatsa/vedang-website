"use client";

import { useState } from 'react';

export function PrefixTuningVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [prefixLength, setPrefixLength] = useState(10);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const layers = ['Embedding', 'Layer 1', 'Layer 2', 'Layer 3', 'Output'];
  const totalParams = 175000000; // 175M parameters
  const prefixParams = prefixLength * layers.length * 768; // 768 dim per prefix vector
  const efficiency = ((prefixParams / totalParams) * 100).toFixed(3);

  const handleTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingStep(0);
    
    const interval = setInterval(() => {
      setTrainingStep(prev => {
        if (prev >= 100) {
          setIsTraining(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const getParameterColor = (isPrefix: boolean, isActive: boolean) => {
    if (isPrefix) {
      return isActive ? 'bg-rose-500' : 'bg-rose-300';
    }
    return 'bg-slate-300';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Prefix Tuning Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how prefix tuning adapts language models by learning only small prefix vectors while keeping the original model frozen
        </p>
      </div>

      <div className="flex gap-8 w-full max-w-6xl">
        {/* Model Architecture */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Model Architecture</h4>
          <div className="space-y-3">
            {layers.map((layer, idx) => (
              <div
                key={layer}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedLayer === idx
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={() => setSelectedLayer(idx)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{layer}</span>
                  <div className="flex items-center gap-2">
                    {/* Prefix vectors */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(prefixLength, 8) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded ${getParameterColor(true, selectedLayer === idx)} transition-colors`}
                        />
                      ))}
                      {prefixLength > 8 && (
                        <span className="text-xs text-slate-500">+{prefixLength - 8}</span>
                      )}
                    </div>
                    {/* Frozen parameters indicator */}
                    <div className="flex gap-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded bg-slate-300"
                        />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">frozen</span>
                    </div>
                  </div>
                </div>
                {selectedLayer === idx && (
                  <div className="mt-2 text-sm text-slate-600">
                    Prefix vectors: {prefixLength} × 768 dims = {(prefixLength * 768).toLocaleString()} trainable params
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls & Stats */}
        <div className="flex-1 space-y-6">
          {/* Prefix Length Control */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Prefix Length: {prefixLength} vectors
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={prefixLength}
              onChange={(e) => setPrefixLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Efficiency Stats */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h5 className="font-medium text-slate-700 mb-3">Parameter Efficiency</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Model Parameters:</span>
                <span className="font-mono">{totalParams.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trainable Prefixes:</span>
                <span className="font-mono text-rose-600">{prefixParams.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-slate-600 font-medium">Efficiency:</span>
                <span className="font-mono text-emerald-600 font-bold">{efficiency}%</span>
              </div>
            </div>
          </div>

          {/* Training Simulation */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h5 className="font-medium text-slate-700 mb-3">Training Simulation</h5>
            <button
              onClick={handleTraining}
              disabled={isTraining}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isTraining
                  ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isTraining ? `Training... ${trainingStep}%` : 'Start Prefix Training'}
            </button>
            {trainingStep > 0 && (
              <div className="mt-3">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${trainingStep}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Only updating {prefixParams.toLocaleString()} prefix parameters
                </p>
              </div>
            )}
          </div>

          {/* Comparison Toggle */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                showComparison ? 'bg-blue-500' : 'bg-slate-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform transform top-1 relative ${
                  showComparison ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
              <span className="ml-3 text-sm font-medium text-slate-700">
                Show vs Full Fine-tuning
              </span>
            </label>
          </div>

          {showComparison && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h5 className="font-medium text-indigo-800 mb-2">Comparison</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Full Fine-tuning:</span>
                  <span className="font-mono text-indigo-900">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Prefix Tuning:</span>
                  <span className="font-mono text-emerald-600 font-bold">{efficiency}%</span>
                </div>
                <div className="text-xs text-indigo-600 mt-2">
                  {Math.round(100 / parseFloat(efficiency))}× more efficient!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Flow Visualization */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-700 mb-4">Input Processing Flow</h4>
        <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex gap-1">
            {Array.from({ length: prefixLength / 2 }).map((_, i) => (
              <div key={i} className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-mono">
                P{i}
              </div>
            ))}
          </div>
          <div className="text-slate-400">+</div>
          <div className="flex gap-1">
            {['The', 'cat', 'sat', 'on', 'the', 'mat'].map((token, i) => (
              <div key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                {token}
              </div>
            ))}
          </div>
          <div className="text-slate-400 ml-4">→</div>
          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-sm font-medium">
            Adapted Output
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">
          Prefix vectors (red) guide the model's behavior for the input tokens (blue)
        </p>
      </div>
    </div>
  );
}