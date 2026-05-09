"use client";
import { useState } from 'react';

export function ResidualConnectionVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [inputValue, setInputValue] = useState(5);
  const [showGradients, setShowGradients] = useState(false);
  const [animating, setAnimating] = useState(false);

  const layers = [
    { transform: (x: number) => Math.round(x * 0.8), name: "Layer 1", color: "bg-blue-500" },
    { transform: (x: number) => Math.round(x * 0.6), name: "Layer 2", color: "bg-indigo-500" },
    { transform: (x: number) => Math.round(x * 0.7), name: "Layer 3", color: "bg-rose-500" },
    { transform: (x: number) => Math.round(x * 0.5), name: "Layer 4", color: "bg-emerald-500" }
  ];

  const calculateWithoutResidual = () => {
    let value = inputValue;
    const results = [value];
    for (let i = 0; i <= selectedLayer; i++) {
      value = layers[i].transform(value);
      results.push(value);
    }
    return results;
  };

  const calculateWithResidual = () => {
    let value = inputValue;
    const results = [value];
    const residuals = [];
    for (let i = 0; i <= selectedLayer; i++) {
      const original = value;
      const transformed = layers[i].transform(value);
      const residual = transformed - original;
      residuals.push(residual);
      value = original + transformed; // x + f(x)
      results.push(value);
    }
    return { results, residuals };
  };

  const withoutResidual = calculateWithoutResidual();
  const withResidual = calculateWithResidual();

  const startAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Residual Connection Visualizer</h3>
        <p className="text-slate-600">Interactive comparison of networks with and without skip connections</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4">Controls</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Input Value</label>
              <input
                type="range"
                min="1"
                max="10"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-slate-600">{inputValue}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Network Depth</label>
              <div className="flex gap-2">
                {layers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLayer(index)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedLayer === index 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowGradients(!showGradients)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                {showGradients ? 'Hide' : 'Show'} Gradients
              </button>
              <button
                onClick={startAnimation}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
              >
                Animate Flow
              </button>
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="flex-1 space-y-6">
          {/* Without Residual */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-rose-600 mb-4">Without Residual Connections</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {withoutResidual.map((value, index) => (
                <div key={index} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-slate-500' : layers[index - 1]?.color || 'bg-slate-400'
                  } ${animating ? 'animate-pulse' : ''}`}>
                    {value}
                  </div>
                  {index < withoutResidual.length - 1 && (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-0.5 bg-slate-400"></div>
                      {index < selectedLayer + 1 && (
                        <span className="text-xs text-slate-500 mt-1">
                          ×{(layers[index].transform(1) / 1).toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-rose-50 rounded-lg">
              <p className="text-sm text-rose-700">
                Final output: <strong>{withoutResidual[withoutResidual.length - 1]}</strong>
                {showGradients && (
                  <span className="block mt-1">
                    Gradient strength: <strong className="text-rose-600">
                      {(1 / Math.pow(2, selectedLayer + 1)).toFixed(3)}
                    </strong> (vanishing!)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* With Residual */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-emerald-600 mb-4">With Residual Connections</h4>
            <div className="space-y-4">
              {Array.from({ length: selectedLayer + 2 }).map((_, layerIndex) => (
                <div key={layerIndex} className="flex items-center gap-4">
                  {layerIndex === 0 ? (
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold bg-slate-500">
                      {inputValue}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-slate-500">
                          {withResidual.results[layerIndex - 1]}
                        </div>
                        <span className="text-slate-600">+</span>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${layers[layerIndex - 1].color} ${animating ? 'animate-pulse' : ''}`}>
                          {layers[layerIndex - 1].transform(withResidual.results[layerIndex - 1])}
                        </div>
                        <span className="text-slate-600">=</span>
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold bg-emerald-500">
                          {withResidual.results[layerIndex]}
                        </div>
                      </div>
                      
                      {/* Skip connection arc */}
                      <div className="relative">
                        <div className="absolute -top-6 left-0 w-32 h-12 border-t-2 border-l-2 border-r-2 border-amber-400 rounded-t-lg border-dashed"></div>
                        <span className="absolute -top-8 left-12 text-xs text-amber-600 bg-white px-1">skip</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700">
                Final output: <strong>{withResidual.results[withResidual.results.length - 1]}</strong>
                {showGradients && (
                  <span className="block mt-1">
                    Gradient strength: <strong className="text-emerald-600">
                      {(0.8 + 0.2 * (selectedLayer + 1)).toFixed(3)}
                    </strong> (preserved!)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-4xl">
        <p className="text-sm text-blue-800">
          <strong>Key Insight:</strong> Residual connections (x + f(x)) preserve information flow and prevent gradient vanishing. 
          Notice how the output degrades more slowly with residual connections, and gradients remain strong even in deep networks.
        </p>
      </div>
    </div>
  );
}