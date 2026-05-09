"use client";

import { useState, useEffect } from 'react';

export function VaeVisualizer() {
  const [encoderOutput, setEncoderOutput] = useState({ mean: 0, variance: 1 });
  const [sampledPoint, setSampledPoint] = useState(0);
  const [inputValue, setInputValue] = useState(50);
  const [isTraining, setIsTraining] = useState(false);
  const [latentPoints, setLatentPoints] = useState<Array<{x: number, y: number, original: number}>>([]);
  const [selectedPoint, setSelectedPoint] = useState<{x: number, y: number} | null>(null);
  const [generatedValue, setGeneratedValue] = useState(50);

  useEffect(() => {
    // Simulate encoder: input -> mean and variance
    const normalizedInput = inputValue / 100;
    const mean = (normalizedInput - 0.5) * 4; // Map to [-2, 2]
    const variance = 0.5 + Math.sin(normalizedInput * Math.PI) * 0.3; // Vary between 0.2-0.8
    setEncoderOutput({ mean, variance });

    // Sample from distribution (reparameterization trick)
    const epsilon = (Math.random() - 0.5) * 2; // Random noise
    const sample = mean + Math.sqrt(variance) * epsilon;
    setSampledPoint(sample);
  }, [inputValue]);

  useEffect(() => {
    if (selectedPoint) {
      // Decode selected latent point
      const decoded = Math.max(0, Math.min(100, (selectedPoint.x / 4 + 0.5) * 100 + selectedPoint.y * 10));
      setGeneratedValue(Math.round(decoded));
    }
  }, [selectedPoint]);

  const handleTrain = () => {
    setIsTraining(true);
    const newPoints = [];
    for (let i = 0; i < 20; i++) {
      const input = Math.random() * 100;
      const norm = input / 100;
      const mean = (norm - 0.5) * 4;
      const variance = 0.5 + Math.sin(norm * Math.PI) * 0.3;
      const x = mean + Math.sqrt(variance) * (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 2;
      newPoints.push({ x, y, original: input });
    }
    setLatentPoints(newPoints);
    setTimeout(() => setIsTraining(false), 1000);
  };

  const getDistributionPoints = () => {
    const points = [];
    for (let i = -3; i <= 3; i += 0.2) {
      const prob = Math.exp(-0.5 * Math.pow((i - encoderOutput.mean) / Math.sqrt(encoderOutput.variance), 2));
      points.push({ x: (i + 3) * 20, y: 80 - prob * 60 });
    }
    return points;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Variational Autoencoder</h3>
        <p className="text-slate-600 text-lg">Interactive exploration of probabilistic encoding and latent space generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Encoder Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-blue-700 mb-4">1. Encoder</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Input Value</label>
              <input
                type="range"
                min="0"
                max="100"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center mt-2 text-slate-600">{inputValue}</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-700">Encoded Distribution:</div>
              <div className="text-indigo-600 font-mono">μ = {encoderOutput.mean.toFixed(2)}</div>
              <div className="text-indigo-600 font-mono">σ² = {encoderOutput.variance.toFixed(2)}</div>
            </div>

            {/* Distribution Visualization */}
            <div className="relative h-24 bg-slate-100 rounded-lg">
              <svg width="100%" height="100%" viewBox="0 0 120 80">
                <path
                  d={`M ${getDistributionPoints().map(p => `${p.x},${p.y}`).join(' L ')}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="rgba(59, 130, 246, 0.1)"
                />
                <circle
                  cx={(sampledPoint + 3) * 20}
                  cy="40"
                  r="3"
                  fill="#ef4444"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Latent Space Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-indigo-700 mb-4">2. Latent Space</h4>
          <div className="relative h-64 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 cursor-crosshair"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                 const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
                 setSelectedPoint({ x, y });
               }}>
            <svg width="100%" height="100%" viewBox="-4 -4 8 8" className="overflow-visible">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
                  <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#e2e8f0" strokeWidth="0.1"/>
                </pattern>
              </defs>
              <rect x="-4" y="-4" width="8" height="8" fill="url(#grid)" />
              
              {/* Training points */}
              {latentPoints.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="0.15"
                  fill="#10b981"
                  opacity="0.7"
                  className="hover:opacity-1 cursor-pointer"
                  onClick={() => setSelectedPoint(point)}
                />
              ))}
              
              {/* Current encoded sample */}
              <circle
                cx={sampledPoint}
                cy="0"
                r="0.2"
                fill="#ef4444"
                className="animate-pulse"
              />
              
              {/* Selected point */}
              {selectedPoint && (
                <circle
                  cx={selectedPoint.x}
                  cy={selectedPoint.y}
                  r="0.25"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="0.1"
                />
              )}
            </svg>
          </div>
          
          <button
            onClick={handleTrain}
            disabled={isTraining}
            className={`mt-4 w-full px-4 py-2 rounded-lg font-medium ${
              isTraining 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isTraining ? 'Training...' : 'Train VAE'}
          </button>
          <p className="text-xs text-slate-500 mt-2">Click to sample from latent space</p>
        </div>

        {/* Decoder Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-rose-700 mb-4">3. Decoder</h4>
          <div className="space-y-4">
            {selectedPoint ? (
              <>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-700">Latent Point:</div>
                  <div className="text-rose-600 font-mono">x = {selectedPoint.x.toFixed(2)}</div>
                  <div className="text-rose-600 font-mono">y = {selectedPoint.y.toFixed(2)}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-slate-700 mb-2">Generated Output</div>
                  <div className="text-3xl font-bold text-rose-600 bg-rose-50 p-4 rounded-lg">
                    {generatedValue}
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <div className="text-xs text-amber-800">
                    <strong>New Sample!</strong> This value was generated by decoding a point from the latent space.
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 bg-slate-50 p-8 rounded-lg">
                <div className="text-lg mb-2">🎯</div>
                <div>Click a point in the latent space to generate new data</div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="text-xs text-blue-800">
                <strong>VAE Key:</strong> Unlike regular autoencoders, VAEs learn smooth probability distributions, enabling generation of new samples.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-800">Probabilistic Encoding</div>
            <div className="text-blue-600">Inputs map to distributions (μ, σ²) not fixed points</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="font-semibold text-indigo-800">Reparameterization</div>
            <div className="text-indigo-600">Sample z = μ + σ × ε for backpropagation</div>
          </div>
          <div className="bg-rose-50 p-4 rounded-lg">
            <div className="font-semibold text-rose-800">Generative Capability</div>
            <div className="text-rose-600">Sample any latent point to generate new data</div>
          </div>
        </div>
      </div>
    </div>
  );
}