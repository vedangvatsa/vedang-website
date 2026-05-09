"use client";

import React, { useState } from 'react';

export function ChainOfThoughtVisualizer() {
  const [currentMode, setCurrentMode] = useState<'direct' | 'cot'>('direct');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const problem = "What is 17% of 340?";
  
  const directResponse = {
    thinking: "Quick calculation...",
    answer: "61.8",
    steps: []
  };

  const cotSteps = [
    "I need to calculate 17% of 340",
    "17% can be written as 17/100 or 0.17",
    "So I need to multiply 340 × 0.17",
    "340 × 0.17 = 340 × (0.1 + 0.07)",
    "= (340 × 0.1) + (340 × 0.07)",
    "= 34 + 23.8",
    "= 57.8"
  ];

  const cotResponse = {
    thinking: "Let me think through this step by step...",
    answer: "57.8",
    steps: cotSteps
  };

  const runAnimation = (mode: 'direct' | 'cot') => {
    setCurrentMode(mode);
    setCurrentStep(0);
    setIsAnimating(true);
    
    const maxSteps = mode === 'cot' ? cotSteps.length : 1;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      
      if (step >= maxSteps) {
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, mode === 'cot' ? 800 : 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Chain-of-Thought Prompting</h3>
        <p className="text-slate-600">Compare direct prompting vs. step-by-step reasoning for better accuracy</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-300 text-center">
        <div className="text-lg font-semibold text-slate-700 mb-2">Problem:</div>
        <div className="text-xl text-indigo-600 font-mono">{problem}</div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => runAnimation('direct')}
          disabled={isAnimating}
          className="px-6 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Direct Prompting
        </button>
        <button
          onClick={() => runAnimation('cot')}
          disabled={isAnimating}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Chain-of-Thought
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg border border-slate-300 p-6 min-h-64">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${isAnimating ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`}></div>
            <div className="font-semibold text-slate-700">
              {currentMode === 'direct' ? 'Direct Response' : 'Step-by-Step Reasoning'}
            </div>
          </div>

          {isAnimating && (
            <div className="text-slate-600 mb-4 italic">
              {currentMode === 'direct' ? directResponse.thinking : cotResponse.thinking}
            </div>
          )}

          {currentMode === 'cot' && (
            <div className="space-y-3 mb-6">
              {cotSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-500 ${
                    index < currentStep 
                      ? 'bg-emerald-50 border-l-4 border-emerald-400 text-emerald-800' 
                      : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < currentStep 
                      ? 'bg-emerald-400 text-white' 
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">{step}</div>
                  {index < currentStep && (
                    <div className="text-emerald-600">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {((currentMode === 'direct' && currentStep >= 1) || 
            (currentMode === 'cot' && currentStep >= cotSteps.length)) && (
            <div className={`p-4 rounded-lg border-2 ${
              currentMode === 'direct' 
                ? 'bg-rose-50 border-rose-300' 
                : 'bg-emerald-50 border-emerald-300'
            }`}>
              <div className="font-semibold mb-2">Final Answer:</div>
              <div className={`text-2xl font-mono font-bold ${
                currentMode === 'direct' ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {currentMode === 'direct' ? directResponse.answer : cotResponse.answer}
              </div>
              <div className={`text-sm mt-2 ${
                currentMode === 'direct' ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {currentMode === 'direct' 
                  ? '❌ Incorrect (common error without showing work)' 
                  : '✅ Correct (verified through step-by-step reasoning)'}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-xl">
        <strong>Key Insight:</strong> Chain-of-thought prompting forces the model to show its work, 
        leading to more accurate results by catching errors in intermediate steps.
      </div>
    </div>
  );
}