"use client";

import React, { useState, useEffect } from 'react';

export function GanVisualizer() {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [generatorLoss, setGeneratorLoss] = useState(2.5);
  const [discriminatorLoss, setDiscriminatorLoss] = useState(0.3);
  const [noiseInput, setNoiseInput] = useState([0.2, 0.8, 0.1, 0.9]);
  const [realSamples] = useState([
    { x: 30, y: 40, color: 'bg-blue-500' },
    { x: 45, y: 60, color: 'bg-blue-500' },
    { x: 60, y: 35, color: 'bg-blue-500' },
    { x: 25, y: 70, color: 'bg-blue-500' },
  ]);
  const [generatedSamples, setGeneratedSamples] = useState([
    { x: 80, y: 80, color: 'bg-rose-400', confidence: 0.1 },
    { x: 90, y: 20, color: 'bg-rose-400', confidence: 0.2 },
    { x: 75, y: 60, color: 'bg-rose-400', confidence: 0.15 },
    { x: 85, y: 45, color: 'bg-rose-400', confidence: 0.25 },
  ]);
  const [discriminatorAccuracy, setDiscriminatorAccuracy] = useState(0.9);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setEpoch(prev => prev + 1);
        
        // Simulate adversarial training
        const newGenLoss = Math.max(0.1, generatorLoss - 0.05 + Math.random() * 0.1);
        const newDiscLoss = Math.max(0.1, discriminatorLoss + 0.02 + Math.random() * 0.05);
        const newAccuracy = Math.max(0.5, discriminatorAccuracy - 0.01 + Math.random() * 0.02);
        
        setGeneratorLoss(newGenLoss);
        setDiscriminatorLoss(newDiscLoss);
        setDiscriminatorAccuracy(newAccuracy);
        
        // Update generated samples to move closer to real samples
        setGeneratedSamples(prev => prev.map(sample => ({
          ...sample,
          x: Math.max(10, Math.min(90, sample.x + (Math.random() - 0.5) * 10 - 2)),
          y: Math.max(10, Math.min(90, sample.y + (Math.random() - 0.5) * 10 - 2)),
          confidence: Math.min(0.9, sample.confidence + 0.02),
          color: newGenLoss < 0.8 ? 'bg-emerald-400' : 'bg-rose-400'
        })));
        
        if (epoch > 50) {
          setIsTraining(false);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isTraining, epoch, generatorLoss, discriminatorLoss, discriminatorAccuracy]);

  const generateFromNoise = () => {
    const newSamples = noiseInput.map((noise, i) => ({
      x: 20 + noise * 60,
      y: 20 + ((noise * 1.5) % 1) * 60,
      color: generatorLoss < 1.0 ? 'bg-emerald-400' : 'bg-rose-400',
      confidence: Math.min(0.9, 0.1 + (1 - generatorLoss) * 0.8)
    }));
    setGeneratedSamples(newSamples);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setEpoch(0);
    setGeneratorLoss(2.5);
    setDiscriminatorLoss(0.3);
    setDiscriminatorAccuracy(0.9);
    setStep(0);
    setGeneratedSamples([
      { x: 80, y: 80, color: 'bg-rose-400', confidence: 0.1 },
      { x: 90, y: 20, color: 'bg-rose-400', confidence: 0.2 },
      { x: 75, y: 60, color: 'bg-rose-400', confidence: 0.15 },
      { x: 85, y: 45, color: 'bg-rose-400', confidence: 0.25 },
    ]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Generative Adversarial Network (GAN)
        </h3>
        <p className="text-slate-600 max-w-2xl">
          Watch the Generator (creates fake data) compete against the Discriminator (detects fake data) in an adversarial training process
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Training Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Data Distribution</h4>
          <div className="relative w-full h-64 bg-slate-100 rounded-lg border-2 border-slate-200 overflow-hidden">
            {/* Real samples */}
            {realSamples.map((sample, i) => (
              <div
                key={`real-${i}`}
                className={`absolute w-3 h-3 rounded-full ${sample.color} border-2 border-blue-700`}
                style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                title="Real Sample"
              />
            ))}
            
            {/* Generated samples */}
            {generatedSamples.map((sample, i) => (
              <div
                key={`gen-${i}`}
                className={`absolute w-3 h-3 rounded-full ${sample.color} border-2 border-slate-600 transition-all duration-200`}
                style={{ 
                  left: `${sample.x}%`, 
                  top: `${sample.y}%`,
                  opacity: 0.5 + sample.confidence * 0.5
                }}
                title={`Generated Sample (Confidence: ${(sample.confidence * 100).toFixed(1)}%)`}
              />
            ))}
            
            {/* Legend */}
            <div className="absolute top-2 left-2 bg-white p-2 rounded shadow-sm text-xs">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full border border-blue-700"></div>
                <span>Real Data</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-rose-400 rounded-full border border-slate-600"></div>
                <span>Generated Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Metrics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Training Control</h4>
          
          <div className="space-y-4">
            {/* Noise Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Noise Input (Generator Input)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {noiseInput.map((value, i) => (
                  <input
                    key={i}
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => {
                      const newNoise = [...noiseInput];
                      newNoise[i] = parseFloat(e.target.value);
                      setNoiseInput(newNoise);
                    }}
                    className="w-full"
                  />
                ))}
              </div>
              <button
                onClick={generateFromNoise}
                className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
              >
                Generate from Noise
              </button>
            </div>

            {/* Training Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsTraining(!isTraining)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isTraining 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {isTraining ? 'Stop Training' : 'Start Training'}
              </button>
              <button
                onClick={resetTraining}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                Reset
              </button>
            </div>

            {/* Metrics */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Epoch:</span>
                <span className="font-mono font-bold text-slate-800">{epoch}</span>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600">Generator Loss:</span>
                  <span className="font-mono text-emerald-600">{generatorLoss.toFixed(3)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${Math.max(0, 100 - (generatorLoss / 3) * 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600">Discriminator Loss:</span>
                  <span className="font-mono text-rose-600">{discriminatorLoss.toFixed(3)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-rose-500 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${(discriminatorLoss / 3) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600">Discriminator Accuracy:</span>
                  <span className="font-mono text-blue-600">{(discriminatorAccuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${discriminatorAccuracy * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Architecture */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">GAN Architecture</h4>
        <div className="flex items-center justify-between">
          {/* Noise Input */}
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-300 rounded-lg flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-slate-700">Noise</span>
            </div>
            <p className="text-xs text-slate-600">Random Input</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-slate-400"></div>
          </div>

          {/* Generator */}
          <div className="text-center">
            <div className={`w-20 h-16 rounded-lg flex items-center justify-center mb-2 transition-colors ${
              isTraining ? 'bg-emerald-200 animate-pulse' : 'bg-emerald-100'
            }`}>
              <span className="text-xs font-bold text-emerald-800">Generator</span>
            </div>
            <p className="text-xs text-slate-600">Creates Fake Data</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-slate-400"></div>
          </div>

          {/* Discriminator */}
          <div className="text-center">
            <div className={`w-20 h-16 rounded-lg flex items-center justify-center mb-2 transition-colors ${
              isTraining ? 'bg-rose-200 animate-pulse' : 'bg-rose-100'
            }`}>
              <span className="text-xs font-bold text-rose-800">Discriminator</span>
            </div>
            <p className="text-xs text-slate-600">Real vs Fake?</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-slate-400"></div>
          </div>

          {/* Output */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-blue-800">
                {(discriminatorAccuracy * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">Classification</p>
          </div>
        </div>
      </div>
    </div>
  );
}