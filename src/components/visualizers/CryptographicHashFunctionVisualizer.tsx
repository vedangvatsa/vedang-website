"use client";

import { useState, useEffect } from 'react';

export function CryptographicHashFunctionVisualizer() {
  const [inputText, setInputText] = useState('Hello, World!');
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Simple hash function for demonstration (not cryptographically secure)
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to hex and pad to fixed length
    return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
  };

  const hash = simpleHash(inputText);

  const steps = [
    { title: 'Input Processing', description: 'Converting input to binary representation' },
    { title: 'Compression Function', description: 'Applying mathematical transformations' },
    { title: 'Bit Manipulation', description: 'Scrambling bits through XOR and shifts' },
    { title: 'Final Hash', description: 'Producing fixed-length output' }
  ];

  const presetInputs = [
    'Hello, World!',
    'Hello, World',
    'blockchain',
    'bitcoin',
    'ethereum',
    'A very long string that demonstrates how hash functions handle variable input sizes'
  ];

  useEffect(() => {
    if (showSteps && animating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showSteps, animating, steps.length]);

  const startAnimation = () => {
    setCurrentStep(0);
    setAnimating(true);
    setShowSteps(true);
  };

  const resetAnimation = () => {
    setShowSteps(false);
    setCurrentStep(0);
    setAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cryptographic Hash Function</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how hash functions transform any input into a fixed-length digest with deterministic, one-way, and collision-resistant properties.
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-4xl space-y-4">
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-3">Input Text</h4>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Enter any text to hash..."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {presetInputs.map((preset, index) => (
              <button
                key={index}
                onClick={() => setInputText(preset)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                {preset.length > 30 ? preset.substring(0, 30) + '...' : preset}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Input length: {inputText.length} characters
          </div>
        </div>

        {/* Hash Processing Visualization */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-700">Hash Processing</h4>
            <div className="space-x-2">
              <button
                onClick={startAnimation}
                disabled={animating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
              >
                {animating ? 'Processing...' : 'Show Steps'}
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {showSteps && (
            <div className="space-y-4 mb-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                    index <= currentStep
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        index <= currentStep
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{step.title}</div>
                      <div className="text-sm text-slate-600">{step.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hash Output */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-indigo-700 mb-2">Fixed-Length Hash Output (8 hex digits)</div>
            <div className="font-mono text-2xl text-indigo-900 bg-white p-3 rounded border">
              {hash}
            </div>
          </div>
        </div>

        {/* Properties Demonstration */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <h5 className="font-semibold text-slate-700">Deterministic</h5>
            </div>
            <p className="text-sm text-slate-600 mb-3">Same input always produces the same hash.</p>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded">
              "{inputText}" → {hash}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
              <h5 className="font-semibold text-slate-700">One-Way</h5>
            </div>
            <p className="text-sm text-slate-600 mb-3">Cannot reverse hash to get original input.</p>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded">
              {hash} →? "unknown"
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <h5 className="font-semibold text-slate-700">Collision-Resistant</h5>
            </div>
            <p className="text-sm text-slate-600 mb-3">Very unlikely for different inputs to produce same hash.</p>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded">
              Try changing one character!
            </div>
          </div>
        </div>

        {/* Avalanche Effect Demo */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h5 className="font-semibold text-amber-800 mb-3">Avalanche Effect</h5>
          <p className="text-sm text-amber-700 mb-4">
            Small changes in input cause dramatic changes in output. Compare these similar inputs:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
            <div className="bg-white p-3 rounded border">
              <div className="text-slate-600">"Hello, World!"</div>
              <div className="text-amber-800">→ {simpleHash("Hello, World!")}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-slate-600">"Hello, World?"</div>
              <div className="text-amber-800">→ {simpleHash("Hello, World?")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}