"use client";

import { useState, useEffect } from 'react';

export function GenerativeModelVisualizer() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [learnedDistribution, setLearnedDistribution] = useState<number[]>([]);
  const [generatedSamples, setGeneratedSamples] = useState<{ x: number; y: number; color: string }[]>([]);
  const [temperature, setTemperature] = useState(1.0);
  const [mode, setMode] = useState<'discriminative' | 'generative'>('generative');

  // Training data points (two clusters representing different classes)
  const trainingData = [
    // Class A (blue cluster)
    { x: 30, y: 40, class: 'A', color: 'bg-blue-500' },
    { x: 35, y: 45, class: 'A', color: 'bg-blue-500' },
    { x: 40, y: 35, class: 'A', color: 'bg-blue-500' },
    { x: 25, y: 50, class: 'A', color: 'bg-blue-500' },
    { x: 45, y: 40, class: 'A', color: 'bg-blue-500' },
    { x: 32, y: 38, class: 'A', color: 'bg-blue-500' },
    // Class B (rose cluster)
    { x: 70, y: 60, class: 'B', color: 'bg-rose-500' },
    { x: 75, y: 65, class: 'B', color: 'bg-rose-500' },
    { x: 80, y: 55, class: 'B', color: 'bg-rose-500' },
    { x: 65, y: 70, class: 'B', color: 'bg-rose-500' },
    { x: 85, y: 60, class: 'B', color: 'bg-rose-500' },
    { x: 72, y: 58, class: 'B', color: 'bg-rose-500' },
  ];

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setLearnedDistribution([]);
    setGeneratedSamples([]);

    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          // Create learned distribution approximation
          const distribution = [];
          for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
              // Gaussian mixture model approximation
              const probA = Math.exp(-((i-35)**2 + (j-42)**2) / 200);
              const probB = Math.exp(-((i-75)**2 + (j-62)**2) / 200);
              distribution.push(probA + probB);
            }
          }
          setLearnedDistribution(distribution);
        }
        return newProgress;
      });
    }, 200);
  };

  const generateSample = () => {
    if (learnedDistribution.length === 0) return;

    const samples = [];
    for (let i = 0; i < 5; i++) {
      // Sample from learned distribution with temperature control
      let x, y, attempts = 0;
      let adjustedProb = 0;
      do {
        x = Math.random() * 100;
        y = Math.random() * 100;
        const idx = Math.floor(y) * 100 + Math.floor(x);
        const prob = learnedDistribution[idx] || 0;
        adjustedProb = Math.pow(prob, 1/temperature);
        attempts++;
      } while (Math.random() > adjustedProb && attempts < 50);

      // Determine color based on proximity to training clusters
      const distToA = Math.sqrt((x-35)**2 + (y-42)**2);
      const distToB = Math.sqrt((x-75)**2 + (y-62)**2);
      const color = distToA < distToB ? 'bg-blue-300' : 'bg-rose-300';
      
      samples.push({ x, y, color });
    }
    setGeneratedSamples(samples);
  };

  const getDistributionIntensity = (x: number, y: number) => {
    if (learnedDistribution.length === 0) return 0;
    const idx = Math.floor(y) * 100 + Math.floor(x);
    return learnedDistribution[idx] || 0;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Generative Model</h3>
        <p className="text-slate-600">Learn probability distributions to generate new data samples</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('generative')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'generative' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Generative Model
        </button>
        <button
          onClick={() => setMode('discriminative')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'discriminative' 
              ? 'bg-amber-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Discriminative Model
        </button>
      </div>

      <div className="relative w-96 h-80 bg-white border-2 border-slate-300 rounded-lg overflow-hidden">
        {/* Background probability heatmap for generative mode */}
        {mode === 'generative' && learnedDistribution.length > 0 && (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }, (_, i) =>
              Array.from({ length: 20 }, (_, j) => {
                const intensity = getDistributionIntensity(i * 5, j * 5);
                const opacity = Math.min(intensity * 0.3, 0.6);
                return (
                  <div
                    key={`${i}-${j}`}
                    className="absolute bg-emerald-200"
                    style={{
                      left: `${i * 5}%`,
                      top: `${j * 5}%`,
                      width: '5%',
                      height: '5%',
                      opacity
                    }}
                  />
                );
              })
            )}
          </div>
        )}

        {/* Decision boundary for discriminative mode */}
        {mode === 'discriminative' && (
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="20%"
              y1="20%"
              x2="80%"
              y2="80%"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
            <text x="50%" y="15%" textAnchor="middle" className="fill-amber-600 text-sm font-bold">
              Decision Boundary
            </text>
          </svg>
        )}

        {/* Training data points */}
        {trainingData.map((point, idx) => (
          <div
            key={idx}
            className={`absolute w-3 h-3 rounded-full ${point.color} border-2 border-white transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`
            }}
          />
        ))}

        {/* Generated samples */}
        {generatedSamples.map((sample, idx) => (
          <div
            key={`gen-${idx}`}
            className={`absolute w-2 h-2 rounded-full ${sample.color} border border-slate-400 transform -translate-x-1/2 -translate-y-1/2 animate-pulse`}
            style={{
              left: `${sample.x}%`,
              top: `${sample.y}%`
            }}
          />
        ))}

        {/* Training progress overlay */}
        {isTraining && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-slate-700 font-medium mb-2">Learning Distribution...</div>
              <div className="w-48 h-2 bg-slate-200 rounded-full">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-200"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={startTraining}
          disabled={isTraining}
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isTraining ? 'Training...' : 'Train Model'}
        </button>

        {mode === 'generative' && (
          <button
            onClick={generateSample}
            disabled={learnedDistribution.length === 0}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Generate Samples
          </button>
        )}
      </div>

      {mode === 'generative' && (
        <div className="flex items-center gap-4">
          <label className="text-slate-700 font-medium">Temperature:</label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-slate-600 w-12">{temperature}</span>
        </div>
      )}

      <div className="text-center max-w-2xl">
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Training Data A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-sm text-slate-600">Training Data B</span>
          </div>
          {mode === 'generative' && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
              <span className="text-sm text-slate-600">Generated Samples</span>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-600">
          {mode === 'generative' 
            ? "Generative models learn the full data distribution (green heatmap), enabling creation of new samples that follow the same patterns."
            : "Discriminative models only learn decision boundaries between classes, focusing on classification rather than data generation."
          }
        </p>
      </div>
    </div>
  );
}