"use client";

import React, { useState, useEffect } from 'react';

export function PromptTuningVisualizer() {
  const [stage, setStage] = useState<'manual' | 'soft' | 'training'>('manual');
  const [trainingStep, setTrainingStep] = useState(0);
  const [softPromptValues, setSoftPromptValues] = useState([0.2, -0.5, 0.8, -0.3, 0.6]);
  const [isTraining, setIsTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(0.65);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingStep(prev => {
          const newStep = prev + 1;
          if (newStep >= 100) {
            setIsTraining(false);
            return 100;
          }
          
          // Simulate learning better prompt embeddings
          setSoftPromptValues(prev => prev.map(val => 
            val + (Math.random() - 0.5) * 0.1
          ));
          
          // Simulate improving accuracy
          setAccuracy(0.65 + (newStep / 100) * 0.25);
          
          return newStep;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
    setAccuracy(0.65);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setTrainingStep(0);
    setAccuracy(0.65);
    setSoftPromptValues([0.2, -0.5, 0.8, -0.3, 0.6]);
  };

  const adjustPromptValue = (index: number, delta: number) => {
    setSoftPromptValues(prev => 
      prev.map((val, i) => i === index ? Math.max(-1, Math.min(1, val + delta)) : val)
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Prompt Tuning Visualization</h3>
        <p className="text-slate-600">Learn continuous soft prompt embeddings while keeping model weights frozen</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setStage('manual')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            stage === 'manual' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Manual Prompting
        </button>
        <button
          onClick={() => setStage('soft')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            stage === 'soft' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Soft Prompts
        </button>
        <button
          onClick={() => setStage('training')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            stage === 'training' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Training Process
        </button>
      </div>

      {stage === 'manual' && (
        <div className="w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Manual Prompt Engineering</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-slate-600 min-w-0 flex-1">Prompt:</span>
                <div className="bg-amber-100 p-3 rounded-lg flex-[3] border border-amber-200">
                  <span className="text-amber-800">"Classify this sentiment as positive or negative:"</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 min-w-0 flex-1">Input:</span>
                <div className="bg-slate-100 p-3 rounded-lg flex-[3] border border-slate-300">
                  <span className="text-slate-700">"This movie was amazing!"</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 min-w-0 flex-1">Model Output:</span>
                <div className="bg-emerald-100 p-3 rounded-lg flex-[3] border border-emerald-200">
                  <span className="text-emerald-800">Positive (65% accuracy)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Manual prompts are discrete text tokens that require careful engineering</p>
          </div>
        </div>
      )}

      {stage === 'soft' && (
        <div className="w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Soft Prompt Embeddings</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-slate-600 min-w-0 flex-1">Soft Prompt Vectors:</span>
                <div className="flex gap-2 flex-[3]">
                  {softPromptValues.map((val, idx) => (
                    <div
                      key={idx}
                      className={`relative cursor-pointer transition-all ${
                        selectedPromptIndex === idx ? 'scale-110' : 'hover:scale-105'
                      }`}
                      onClick={() => setSelectedPromptIndex(selectedPromptIndex === idx ? null : idx)}
                    >
                      <div
                        className={`w-16 h-24 rounded-lg border-2 transition-colors ${
                          val >= 0 ? 'bg-indigo-500' : 'bg-rose-500'
                        } ${
                          selectedPromptIndex === idx ? 'border-amber-400' : 'border-slate-300'
                        }`}
                        style={{
                          opacity: 0.3 + Math.abs(val) * 0.7
                        }}
                      />
                      <div className="text-xs text-center mt-1 text-slate-600">
                        {val.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedPromptIndex !== null && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h5 className="text-sm font-semibold text-slate-700 mb-2">
                    Adjust Vector {selectedPromptIndex + 1}
                  </h5>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustPromptValue(selectedPromptIndex, -0.1)}
                      className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                    >
                      -0.1
                    </button>
                    <span className="mx-4 font-mono text-slate-700">
                      {softPromptValues[selectedPromptIndex].toFixed(2)}
                    </span>
                    <button
                      onClick={() => adjustPromptValue(selectedPromptIndex, 0.1)}
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                    >
                      +0.1
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-slate-600 min-w-0 flex-1">Input Text:</span>
                <div className="bg-slate-100 p-3 rounded-lg flex-[3] border border-slate-300">
                  <span className="text-slate-700">"This movie was amazing!"</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Soft prompts are continuous vectors in embedding space, not human-readable text
            </p>
          </div>
        </div>
      )}

      {stage === 'training' && (
        <div className="w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Training Process</h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-slate-600">Training Progress:</div>
                <div className="text-2xl font-bold text-blue-600">{trainingStep}%</div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-100"
                  style={{ width: `${trainingStep}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-600 mb-2">Model Weights</div>
                  <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
                    <div className="flex items-center justify-center h-16">
                      <div className="w-8 h-8 bg-slate-400 rounded flex items-center justify-center">
                        <span className="text-white text-sm">🔒</span>
                      </div>
                      <span className="ml-2 text-slate-600 font-semibold">FROZEN</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-600 mb-2">Soft Prompt Embeddings</div>
                  <div className="bg-emerald-100 p-4 rounded-lg border border-emerald-300">
                    <div className="flex justify-center gap-1">
                      {softPromptValues.map((val, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-12 rounded ${
                            val >= 0 ? 'bg-indigo-400' : 'bg-rose-400'
                          } ${isTraining ? 'animate-pulse' : ''}`}
                          style={{
                            opacity: 0.4 + Math.abs(val) * 0.6,
                            transform: isTraining ? `translateY(${Math.sin(Date.now() * 0.01 + idx) * 2}px)` : 'none'
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center mt-2 text-emerald-700 font-semibold">LEARNING</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Task Accuracy:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {(accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-100"
                    style={{ width: `${accuracy * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </button>
                <button
                  onClick={resetTraining}
                  className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}