"use client";

import { useState } from 'react';

export function AdapterVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [adapterDim, setAdapterDim] = useState(64);
  const [isTraining, setIsTraining] = useState(false);
  const [trainStep, setTrainStep] = useState(0);
  const [showFlow, setShowFlow] = useState(false);

  const originalDim = 768;
  const numLayers = 6;
  const totalParams = 110000000; // 110M parameters
  const adapterParams = Math.round((originalDim * adapterDim + adapterDim * originalDim) * numLayers);
  const adapterRatio = ((adapterParams / totalParams) * 100).toFixed(1);

  const handleTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainStep(0);
    
    const interval = setInterval(() => {
      setTrainStep(prev => {
        if (prev >= 10) {
          setIsTraining(false);
          clearInterval(interval);
          return 10;
        }
        return prev + 1;
      });
    }, 300);
  };

  const getLayerColor = (index: number) => {
    if (selectedLayer === index) return 'bg-blue-500';
    if (isTraining && trainStep > index) return 'bg-emerald-400';
    return 'bg-slate-300';
  };

  const getAdapterColor = (index: number) => {
    if (selectedLayer === index) return 'bg-rose-500';
    if (isTraining && trainStep > index) return 'bg-rose-400';
    return 'bg-rose-300';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Adapter Architecture</h3>
        <p className="text-slate-600">Interactive visualization of adapter modules in pretrained models</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Model Architecture */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Pretrained Model</h4>
            
            <div className="flex flex-col gap-3">
              {Array.from({ length: numLayers }, (_, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setSelectedLayer(selectedLayer === i ? null : i)}
                >
                  {/* Main Layer */}
                  <div className={`flex-1 h-12 rounded-lg transition-all duration-300 flex items-center justify-center text-white font-medium ${getLayerColor(i)}`}>
                    Layer {i + 1} {selectedLayer === i && '(768 dim)'}
                    {selectedLayer === i && <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">FROZEN</span>}
                  </div>
                  
                  {/* Adapter Module */}
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded transition-all duration-300 ${getAdapterColor(i)}`} title="Down projection" />
                    <div className="w-4 h-4 bg-amber-400 rounded-full" title="Nonlinearity" />
                    <div className={`w-8 h-8 rounded transition-all duration-300 ${getAdapterColor(i)}`} title="Up projection" />
                    <div className="text-slate-400 text-lg">+</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedLayer !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">Adapter Bottleneck Architecture</h5>
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="bg-blue-500 text-white px-3 py-2 rounded">
                    {originalDim}d
                  </div>
                  <div className="text-slate-600">→</div>
                  <div className="bg-rose-500 text-white px-3 py-2 rounded">
                    {adapterDim}d
                  </div>
                  <div className="text-slate-600">→ ReLU →</div>
                  <div className="bg-rose-500 text-white px-3 py-2 rounded">
                    {originalDim}d
                  </div>
                  <div className="text-slate-600">+ residual</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Adapter Configuration</h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bottleneck Dimension: {adapterDim}
                </label>
                <input
                  type="range"
                  min="32"
                  max="256"
                  step="32"
                  value={adapterDim}
                  onChange={(e) => setAdapterDim(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>32</span>
                  <span>256</span>
                </div>
              </div>

              <div className="bg-slate-100 rounded-lg p-4">
                <h5 className="font-semibold text-slate-800 mb-2">Parameter Efficiency</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Model Params:</span>
                    <span className="font-mono">{(totalParams / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adapter Params:</span>
                    <span className="font-mono">{(adapterParams / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Trainable Ratio:</span>
                    <span className="font-mono font-semibold text-emerald-600">{adapterRatio}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleTraining}
                  disabled={isTraining}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isTraining ? `Training... Step ${trainStep}/10` : 'Start Adapter Training'}
                </button>

                <button
                  onClick={() => setShowFlow(!showFlow)}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {showFlow ? 'Hide' : 'Show'} Data Flow
                </button>
              </div>

              {showFlow && (
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-3">Forward Pass</h5>
                  <div className="space-y-2 text-sm text-indigo-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Input passes through frozen layer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-rose-500 rounded"></div>
                      <span>Adapter processes same input</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                      <span>Outputs are summed (residual)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-400 rounded"></div>
                      <span>Only adapter weights update</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        Click on layers to explore adapter architecture. Adjust bottleneck dimension to see parameter efficiency trade-offs. 
        Adapters enable task-specific fine-tuning while keeping 95%+ of original parameters frozen.
      </div>
    </div>
  );
}