"use client";

import { useState, useEffect } from 'react';

export function ContrastiveLearningVisualizer() {
  const [selectedAnchor, setSelectedAnchor] = useState<number | null>(null);
  const [temperature, setTemperature] = useState(0.5);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);

  // Sample data points with features
  const dataPoints = [
    { id: 0, label: 'Dog', features: [0.8, 0.2], color: 'bg-blue-500', category: 'animal' },
    { id: 1, label: 'Cat', features: [0.9, 0.1], color: 'bg-blue-400', category: 'animal' },
    { id: 2, label: 'Wolf', features: [0.7, 0.3], color: 'bg-blue-600', category: 'animal' },
    { id: 3, label: 'Car', features: [0.1, 0.8], color: 'bg-rose-500', category: 'vehicle' },
    { id: 4, label: 'Truck', features: [0.2, 0.9], color: 'bg-rose-400', category: 'vehicle' },
    { id: 5, label: 'Bus', features: [0.15, 0.85], color: 'bg-rose-600', category: 'vehicle' },
    { id: 6, label: 'Apple', features: [0.5, 0.1], color: 'bg-emerald-500', category: 'fruit' },
    { id: 7, label: 'Orange', features: [0.6, 0.05], color: 'bg-emerald-400', category: 'fruit' },
  ];

  const [embeddings, setEmbeddings] = useState(dataPoints.map(p => ({ x: p.features[0] * 300 + 50, y: p.features[1] * 300 + 50 })));

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const getPositiveNegativeExamples = (anchorId: number) => {
    const anchor = dataPoints[anchorId];
    const positives = dataPoints.filter(p => p.id !== anchorId && p.category === anchor.category);
    const negatives = dataPoints.filter(p => p.category !== anchor.category);
    return { positives, negatives };
  };

  const contrastiveLoss = (anchorId: number) => {
    if (anchorId === null) return 0;
    
    const anchorEmb = embeddings[anchorId];
    const { positives, negatives } = getPositiveNegativeExamples(anchorId);
    
    let positiveLoss = 0;
    positives.forEach(pos => {
      const distance = calculateDistance(anchorEmb, embeddings[pos.id]);
      positiveLoss += distance;
    });
    
    let negativeLoss = 0;
    negatives.forEach(neg => {
      const distance = calculateDistance(anchorEmb, embeddings[neg.id]);
      negativeLoss += Math.max(0, 100 - distance); // margin-based loss
    });
    
    return (positiveLoss + negativeLoss) / (positives.length + negatives.length);
  };

  const trainStep = () => {
    if (selectedAnchor === null) return;
    
    const newEmbeddings = [...embeddings];
    const anchorEmb = newEmbeddings[selectedAnchor];
    const { positives, negatives } = getPositiveNegativeExamples(selectedAnchor);
    
    // Pull positives closer
    positives.forEach(pos => {
      const posEmb = newEmbeddings[pos.id];
      const dx = anchorEmb.x - posEmb.x;
      const dy = anchorEmb.y - posEmb.y;
      const force = 0.05 * temperature;
      
      newEmbeddings[pos.id] = {
        x: Math.max(10, Math.min(390, posEmb.x + dx * force)),
        y: Math.max(10, Math.min(390, posEmb.y + dy * force))
      };
    });
    
    // Push negatives away
    negatives.forEach(neg => {
      const negEmb = newEmbeddings[neg.id];
      const dx = anchorEmb.x - negEmb.x;
      const dy = anchorEmb.y - negEmb.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        const force = 0.03 * temperature;
        const normalizedDx = dx / (distance || 1);
        const normalizedDy = dy / (distance || 1);
        
        newEmbeddings[neg.id] = {
          x: Math.max(10, Math.min(390, negEmb.x - normalizedDx * force * 20)),
          y: Math.max(10, Math.min(390, negEmb.y - normalizedDy * force * 20))
        };
      }
    });
    
    setEmbeddings(newEmbeddings);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && selectedAnchor !== null) {
      interval = setInterval(() => {
        trainStep();
        setEpoch(prev => prev + 1);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isTraining, selectedAnchor, temperature]);

  const currentLoss = selectedAnchor !== null ? contrastiveLoss(selectedAnchor) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Contrastive Learning</h3>
        <p className="text-lg text-slate-600">Learn representations by pulling similar items together and pushing dissimilar items apart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Controls</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Select Anchor Point:</label>
                <div className="grid grid-cols-2 gap-2">
                  {dataPoints.map(point => (
                    <button
                      key={point.id}
                      onClick={() => {
                        setSelectedAnchor(point.id);
                        setIsTraining(false);
                        setEpoch(0);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedAnchor === point.id
                          ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {point.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Learning Rate: {temperature.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsTraining(!isTraining)}
                  disabled={selectedAnchor === null}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedAnchor === null
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : isTraining
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {isTraining ? 'Stop Training' : 'Start Training'}
                </button>
                
                <button
                  onClick={() => {
                    setEmbeddings(dataPoints.map(p => ({ x: p.features[0] * 300 + 50, y: p.features[1] * 300 + 50 })));
                    setEpoch(0);
                    setIsTraining(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-amber-500 text-white hover:bg-amber-600 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2">Training Stats</h4>
            <div className="space-y-2 text-sm">
              <div>Epoch: <span className="font-mono">{epoch}</span></div>
              <div>Loss: <span className="font-mono">{currentLoss.toFixed(3)}</span></div>
              <div>Status: <span className={`font-medium ${isTraining ? 'text-emerald-600' : 'text-slate-600'}`}>
                {isTraining ? 'Training' : 'Stopped'}
              </span></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Animals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span>Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Fruits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-4 text-center">Embedding Space Visualization</h4>
            <div className="relative w-full h-96 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 400 384">
                {selectedAnchor !== null && (
                  <>
                    {/* Draw lines to positives (green) */}
                    {getPositiveNegativeExamples(selectedAnchor).positives.map(pos => (
                      <line
                        key={`pos-${pos.id}`}
                        x1={embeddings[selectedAnchor].x}
                        y1={embeddings[selectedAnchor].y}
                        x2={embeddings[pos.id].x}
                        y2={embeddings[pos.id].y}
                        stroke="#10b981"
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    ))}
                    {/* Draw lines to negatives (red) */}
                    {getPositiveNegativeExamples(selectedAnchor).negatives.map(neg => (
                      <line
                        key={`neg-${neg.id}`}
                        x1={embeddings[selectedAnchor].x}
                        y1={embeddings[selectedAnchor].y}
                        x2={embeddings[neg.id].x}
                        y2={embeddings[neg.id].y}
                        stroke="#ef4444"
                        strokeWidth="2"
                        opacity="0.4"
                      />
                    ))}
                  </>
                )}
                
                {/* Draw points */}
                {dataPoints.map((point, idx) => (
                  <g key={point.id}>
                    <circle
                      cx={embeddings[idx].x}
                      cy={embeddings[idx].y}
                      r={selectedAnchor === point.id ? "12" : "8"}
                      className={`${point.color} ${selectedAnchor === point.id ? 'ring-4 ring-indigo-300' : ''}`}
                      opacity="0.8"
                    />
                    <text
                      x={embeddings[idx].x}
                      y={embeddings[idx].y - 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#374151"
                      fontWeight="500"
                    >
                      {point.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              {selectedAnchor !== null ? (
                <>Green lines: pull together (positives) • Red lines: push apart (negatives)</>
              ) : (
                'Select an anchor point to start contrastive learning'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}