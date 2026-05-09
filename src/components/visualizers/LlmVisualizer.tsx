"use client";

import { useState } from 'react';

export function LlmVisualizer() {
  const [modelSize, setModelSize] = useState(1);
  const [trainingStep, setTrainingStep] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isTraining, setIsTraining] = useState(false);

  const sampleText = ["The", "cat", "sat", "on", "the", "mat"];
  const modelSizes = [
    { name: "Small (125M)", params: 125, capabilities: ["Basic text completion"] },
    { name: "Medium (1.3B)", params: 1300, capabilities: ["Text completion", "Simple Q&A"] },
    { name: "Large (13B)", params: 13000, capabilities: ["Text completion", "Q&A", "Code generation"] },
    { name: "Very Large (175B)", params: 175000, capabilities: ["Text completion", "Q&A", "Code generation", "Reasoning", "Creative writing"] }
  ];

  const currentModel = modelSizes[modelSize];
  const attention = selectedWord !== null ? sampleText.map((_, i) => 
    Math.max(0.1, 1 - Math.abs(i - selectedWord) * 0.3 + Math.random() * 0.2)
  ) : [];

  const startTraining = () => {
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
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Large Language Model (LLM)</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization showing how model size affects capabilities and how attention mechanisms work during text processing.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Model Size Selector */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Model Scale</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="3"
                value={modelSize}
                onChange={(e) => setModelSize(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-slate-600 min-w-32">
                {currentModel.name}
              </span>
            </div>
            
            {/* Visual representation of model size */}
            <div className="flex items-end gap-2 h-24">
              {modelSizes.map((model, i) => (
                <div
                  key={i}
                  className={`rounded-t transition-all duration-300 ${
                    i === modelSize ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                  style={{ 
                    height: `${(model.params / 175000) * 100}%`,
                    width: '60px'
                  }}
                />
              ))}
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-600 mb-2">
                Parameters: {currentModel.params.toLocaleString()}M
              </div>
              <div className="text-sm text-slate-700">
                <strong>Capabilities:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentModel.capabilities.map((cap, i) => (
                    <span key={i} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Attention Mechanism</h4>
          <p className="text-sm text-slate-600 mb-4">
            Click on any word to see how the model pays attention to different parts of the text.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleText.map((word, i) => (
              <button
                key={i}
                onClick={() => setSelectedWord(i)}
                className={`px-3 py-2 rounded transition-all duration-300 ${
                  selectedWord === i 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                style={{
                  backgroundColor: selectedWord !== null && selectedWord !== i
                    ? `rgba(59, 130, 246, ${attention[i] || 0.1})`
                    : undefined,
                  color: selectedWord !== null && selectedWord !== i && attention[i] > 0.5
                    ? 'white'
                    : undefined
                }}
              >
                {word}
              </button>
            ))}
          </div>
          
          {selectedWord !== null && (
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
              When processing "{sampleText[selectedWord]}", the model attends to other words with varying intensity.
              Brighter colors indicate stronger attention weights.
            </div>
          )}
        </div>

        {/* Training Simulation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Training Process</h4>
          <div className="space-y-4">
            <button
              onClick={startTraining}
              disabled={isTraining}
              className={`px-4 py-2 rounded transition-all ${
                isTraining 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isTraining ? 'Training...' : 'Start Training Simulation'}
            </button>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>{trainingStep}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${trainingStep}%` }}
                />
              </div>
            </div>
            
            {trainingStep > 0 && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-rose-50 p-3 rounded-lg">
                  <div className="text-rose-600 font-semibold">Loss</div>
                  <div className="text-2xl font-bold text-rose-700">
                    {(4.5 - (trainingStep / 100) * 3.8).toFixed(2)}
                  </div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <div className="text-emerald-600 font-semibold">Accuracy</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {Math.min(95, 20 + (trainingStep / 100) * 75).toFixed(0)}%
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-amber-600 font-semibold">Perplexity</div>
                  <div className="text-2xl font-bold text-amber-700">
                    {(100 - (trainingStep / 100) * 80).toFixed(0)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}