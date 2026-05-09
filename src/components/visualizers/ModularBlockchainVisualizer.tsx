"use client";

import { useState } from 'react';

export function ModularBlockchainVisualizer() {
  const [architecture, setArchitecture] = useState<'monolithic' | 'modular'>('monolithic');
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [transactionLoad, setTransactionLoad] = useState(100);
  const [animating, setAnimating] = useState(false);

  const monolithicThroughput = Math.max(10, 50 - (transactionLoad - 100) * 0.3);
  const modularThroughput = Math.min(1000, 200 + (transactionLoad - 100) * 2);

  const layers = {
    execution: {
      name: 'Execution Layer',
      description: 'Processes transactions and smart contracts',
      color: 'bg-blue-500',
      hoverColor: 'bg-blue-600',
      textColor: 'text-blue-700'
    },
    settlement: {
      name: 'Settlement Layer',
      description: 'Validates and finalizes transaction results',
      color: 'bg-indigo-500',
      hoverColor: 'bg-indigo-600',
      textColor: 'text-indigo-700'
    },
    consensus: {
      name: 'Consensus Layer',
      description: 'Agrees on transaction order and validity',
      color: 'bg-emerald-500',
      hoverColor: 'bg-emerald-600',
      textColor: 'text-emerald-700'
    },
    dataAvailability: {
      name: 'Data Availability',
      description: 'Stores and provides access to transaction data',
      color: 'bg-amber-500',
      hoverColor: 'bg-amber-600',
      textColor: 'text-amber-700'
    }
  };

  const handleArchitectureSwitch = () => {
    setAnimating(true);
    setTimeout(() => {
      setArchitecture(prev => prev === 'monolithic' ? 'modular' : 'monolithic');
      setAnimating(false);
    }, 300);
  };

  const getBottleneckSeverity = () => {
    if (transactionLoad < 120) return 'low';
    if (transactionLoad < 200) return 'medium';
    return 'high';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Modular Blockchain Architecture</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare monolithic vs modular blockchain architectures. Adjust transaction load to see how specialization improves scalability.
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-slate-700">Transaction Load:</label>
        <input
          type="range"
          min="50"
          max="300"
          value={transactionLoad}
          onChange={(e) => setTransactionLoad(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-sm text-slate-600 w-16">{transactionLoad} TPS</span>
      </div>

      <div className="flex gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h4 className="text-lg font-semibold text-slate-800">Architecture:</h4>
            <button
              onClick={handleArchitectureSwitch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Switch to {architecture === 'monolithic' ? 'Modular' : 'Monolithic'}
            </button>
          </div>

          <div className={`transition-all duration-300 ${animating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {architecture === 'monolithic' ? (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h5 className="text-lg font-semibold text-slate-800 mb-4">Monolithic Blockchain</h5>
                <div className="relative">
                  <div className="h-48 bg-slate-300 rounded-lg flex items-center justify-center border-4 border-rose-400">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">Single Chain</div>
                      <div className="text-sm text-slate-600 mt-2">All functions bundled together</div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {Object.entries(layers).map(([key, layer]) => (
                          <div key={key} className={`text-xs p-2 rounded text-white ${layer.color}`}>
                            {layer.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {getBottleneckSeverity() !== 'low' && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Bottleneck!
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-rose-600">{monolithicThroughput.toFixed(0)} TPS</div>
                  <div className="text-sm text-slate-600">Actual Throughput</div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h5 className="text-lg font-semibold text-slate-800 mb-4">Modular Blockchain</h5>
                <div className="space-y-3">
                  {Object.entries(layers).map(([key, layer]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        activeLayer === key ? layer.hoverColor : layer.color
                      } text-white transform hover:scale-105`}
                      onClick={() => setActiveLayer(activeLayer === key ? null : key)}
                    >
                      <div className="font-semibold">{layer.name}</div>
                      <div className="text-sm opacity-90">{layer.description}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{modularThroughput.toFixed(0)} TPS</div>
                  <div className="text-sm text-slate-600">Optimized Throughput</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h5 className="text-lg font-semibold text-slate-800 mb-4">Performance Comparison</h5>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Monolithic</span>
                <span className="text-sm text-rose-600">{monolithicThroughput.toFixed(0)} TPS</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-rose-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(monolithicThroughput / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Modular</span>
                <span className="text-sm text-emerald-600">{modularThroughput.toFixed(0)} TPS</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(modularThroughput / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Scalability Improvement:</div>
              <div className="text-2xl font-bold text-blue-600">
                {((modularThroughput / monolithicThroughput) - 1).toFixed(1)}x
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className={`p-3 rounded-lg ${
                getBottleneckSeverity() === 'high' ? 'bg-rose-100 text-rose-700' :
                getBottleneckSeverity() === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                <div className="font-medium">
                  {getBottleneckSeverity() === 'high' ? 'Severe Bottleneck' :
                   getBottleneckSeverity() === 'medium' ? 'Moderate Load' :
                   'Optimal Performance'}
                </div>
                <div>
                  {getBottleneckSeverity() === 'high' ? 'Monolithic chains struggle with high loads' :
                   getBottleneckSeverity() === 'medium' ? 'Performance differences becoming apparent' :
                   'Both architectures performing well at low loads'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeLayer && (
        <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-slate-200">
          <h6 className={`text-lg font-semibold ${layers[activeLayer as keyof typeof layers].textColor} mb-3`}>
            {layers[activeLayer as keyof typeof layers].name}
          </h6>
          <p className="text-slate-600 mb-4">
            {layers[activeLayer as keyof typeof layers].description}
          </p>
          <div className="text-sm text-slate-500">
            In modular architecture, this layer can be optimized independently and even handled by specialized networks, 
            leading to better overall performance and scalability.
          </div>
        </div>
      )}
    </div>
  );
}