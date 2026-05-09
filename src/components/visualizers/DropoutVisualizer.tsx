"use client";

import { useState, useEffect } from 'react';

export function DropoutVisualizer() {
  const [dropoutRate, setDropoutRate] = useState(0.3);
  const [isTraining, setIsTraining] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [neurons, setNeurons] = useState<boolean[][]>([]);
  const [showConnections, setShowConnections] = useState(true);
  
  const layerSizes = [4, 6, 6, 3];
  
  useEffect(() => {
    initializeNeurons();
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        applyDropout();
        setIteration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, dropoutRate]);
  
  const initializeNeurons = () => {
    const initialNeurons = layerSizes.map(size => 
      Array(size).fill(true)
    );
    setNeurons(initialNeurons);
  };
  
  const applyDropout = () => {
    const newNeurons = layerSizes.map((size, layerIndex) => 
      Array(size).fill(null).map(() => {
        if (layerIndex === 0 || layerIndex === layerSizes.length - 1) {
          return true; // Input and output layers always active
        }
        return Math.random() > dropoutRate;
      })
    );
    setNeurons(newNeurons);
  };
  
  const toggleTraining = () => {
    if (!isTraining) {
      setIteration(0);
    }
    setIsTraining(!isTraining);
  };
  
  const resetNetwork = () => {
    setIsTraining(false);
    setIteration(0);
    initializeNeurons();
  };
  
  const getConnectionOpacity = (fromLayer: number, fromNeuron: number, toLayer: number, toNeuron: number) => {
    if (!neurons[fromLayer] || !neurons[toLayer]) return 0;
    const fromActive = neurons[fromLayer][fromNeuron];
    const toActive = neurons[toLayer][toNeuron];
    
    if (!fromActive || !toActive) return 0.1;
    return showConnections ? 0.6 : 0;
  };
  
  const activeNeuronsCount = neurons.reduce((total, layer) => 
    total + layer.filter(active => active).length, 0
  );
  
  const totalNeurons = layerSizes.reduce((sum, size) => sum + size, 0);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Dropout Regularization</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how dropout randomly deactivates neurons during training to prevent overfitting and improve generalization
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-slate-700">Neural Network</h4>
              <div className="text-sm text-slate-500">
                Active: {activeNeuronsCount}/{totalNeurons} neurons
              </div>
            </div>
            
            <div className="relative">
              <svg width="100%" height="300" viewBox="0 0 600 300" className="border border-slate-100 rounded-lg">
                {/* Render connections */}
                {showConnections && neurons.length > 0 && layerSizes.map((fromSize, fromLayerIndex) => 
                  fromLayerIndex < layerSizes.length - 1 && 
                  Array(fromSize).fill(null).map((_, fromNeuronIndex) =>
                    Array(layerSizes[fromLayerIndex + 1]).fill(null).map((_, toNeuronIndex) => {
                      const x1 = 100 + fromLayerIndex * 140;
                      const y1 = 50 + fromNeuronIndex * (200 / (fromSize - 1));
                      const x2 = 100 + (fromLayerIndex + 1) * 140;
                      const y2 = 50 + toNeuronIndex * (200 / (layerSizes[fromLayerIndex + 1] - 1));
                      
                      return (
                        <line
                          key={`${fromLayerIndex}-${fromNeuronIndex}-${toNeuronIndex}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#64748b"
                          strokeWidth="1"
                          opacity={getConnectionOpacity(fromLayerIndex, fromNeuronIndex, fromLayerIndex + 1, toNeuronIndex)}
                          className="transition-opacity duration-300"
                        />
                      );
                    })
                  )
                )}
                
                {/* Render neurons */}
                {neurons.map((layer, layerIndex) =>
                  layer.map((isActive, neuronIndex) => {
                    const x = 100 + layerIndex * 140;
                    const y = 50 + neuronIndex * (200 / (layer.length - 1));
                    const isInputOutput = layerIndex === 0 || layerIndex === neurons.length - 1;
                    
                    return (
                      <g key={`${layerIndex}-${neuronIndex}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="12"
                          fill={
                            isInputOutput 
                              ? "#3b82f6" 
                              : isActive 
                                ? "#10b981" 
                                : "#e2e8f0"
                          }
                          stroke={isActive || isInputOutput ? "#1e293b" : "#94a3b8"}
                          strokeWidth="2"
                          className="transition-all duration-300"
                        />
                        {!isActive && !isInputOutput && (
                          <line
                            x1={x - 8}
                            y1={y - 8}
                            x2={x + 8}
                            y2={y + 8}
                            stroke="#ef4444"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    );
                  })
                )}
                
                {/* Layer labels */}
                {layerSizes.map((_, layerIndex) => (
                  <text
                    key={layerIndex}
                    x={100 + layerIndex * 140}
                    y={280}
                    textAnchor="middle"
                    className="text-sm fill-slate-600 font-medium"
                  >
                    {layerIndex === 0 ? 'Input' : 
                     layerIndex === layerSizes.length - 1 ? 'Output' : 
                     `Hidden ${layerIndex}`}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-80">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dropout Rate: {(dropoutRate * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={dropoutRate}
                onChange={(e) => setDropoutRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                disabled={isTraining}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>80%</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleTraining}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isTraining
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isTraining ? 'Stop Training' : 'Start Training'}
              </button>
              <button
                onClick={resetNetwork}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Training Iteration:</span>
                <span className="font-mono text-slate-800">{iteration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Active Neurons:</span>
                <span className="font-mono text-slate-800">{activeNeuronsCount}/{totalNeurons}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConnections}
                  onChange={(e) => setShowConnections(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700">Show Connections</span>
              </label>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600">Input/Output (always active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600">Active hidden neuron</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <span className="text-slate-600">Dropped out neuron</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}