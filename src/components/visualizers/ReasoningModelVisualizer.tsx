"use client";

import { useState } from 'react';

export function ReasoningModelVisualizer() {
  const [isReasoning, setIsReasoning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [modelType, setModelType] = useState<'standard' | 'reasoning'>('standard');
  const [problem, setProblem] = useState("What's 15% of 240?");
  const [finalAnswer, setFinalAnswer] = useState("");

  const standardSteps = [
    { thought: "15% of 240", action: "Direct calculation", confidence: 65 },
    { thought: "0.15 × 240 = 36", action: "Generate answer", confidence: 65 }
  ];

  const reasoningSteps = [
    { thought: "Need to find 15% of 240", action: "Understanding problem", confidence: 90 },
    { thought: "15% = 15/100 = 0.15", action: "Converting percentage", confidence: 95 },
    { thought: "Method 1: 0.15 × 240", action: "Exploring approach", confidence: 85 },
    { thought: "Method 2: 10% + 5% of 240", action: "Alternative approach", confidence: 90 },
    { thought: "10% of 240 = 24, 5% of 240 = 12", action: "Breaking down", confidence: 95 },
    { thought: "24 + 12 = 36", action: "Combining results", confidence: 98 },
    { thought: "Cross-check: 0.15 × 240 = 36 ✓", action: "Verification", confidence: 99 }
  ];

  const problems = [
    "What's 15% of 240?",
    "If a train travels 120km in 1.5 hours, what's its speed?",
    "A rectangle has area 48 and width 6. What's the perimeter?"
  ];

  const handleStartReasoning = () => {
    setIsReasoning(true);
    setCurrentStep(0);
    setFinalAnswer("");
    
    const steps = modelType === 'standard' ? standardSteps : reasoningSteps;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsReasoning(false);
          setFinalAnswer(modelType === 'standard' ? "36 (quick guess)" : "36 (verified answer)");
          return prev;
        }
        return prev + 1;
      });
    }, modelType === 'standard' ? 800 : 1200);
  };

  const currentSteps = modelType === 'standard' ? standardSteps : reasoningSteps;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Reasoning Model vs Standard LLM</h3>
        <p className="text-slate-600">Compare how different AI models approach problem-solving</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setModelType('standard')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            modelType === 'standard'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Standard LLM
        </button>
        <button
          onClick={() => setModelType('reasoning')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            modelType === 'reasoning'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Reasoning Model
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Problem:</label>
          <select
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white"
            disabled={isReasoning}
          >
            {problems.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 min-h-80">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg text-slate-800">
              {modelType === 'standard' ? 'Standard LLM Process' : 'Reasoning Model Process'}
            </h4>
            <button
              onClick={handleStartReasoning}
              disabled={isReasoning}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isReasoning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
              }`}
            >
              {isReasoning ? 'Processing...' : 'Start Processing'}
            </button>
          </div>

          <div className="space-y-3">
            {currentSteps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  index <= currentStep
                    ? index === currentStep && isReasoning
                      ? 'bg-amber-50 border-amber-300 shadow-md'
                      : 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{step.thought}</div>
                    <div className="text-sm text-slate-600 mt-1">{step.action}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-600">Confidence:</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      step.confidence >= 95 ? 'bg-emerald-100 text-emerald-800' :
                      step.confidence >= 85 ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {step.confidence}%
                    </div>
                  </div>
                </div>
                {index === currentStep && isReasoning && (
                  <div className="mt-2 h-1 bg-amber-200 rounded overflow-hidden">
                    <div className="h-full bg-amber-500 rounded animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {finalAnswer && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-300 rounded-lg">
              <div className="font-semibold text-indigo-800">Final Answer:</div>
              <div className="text-indigo-700 mt-1">{finalAnswer}</div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          {modelType === 'standard' 
            ? "Standard LLMs generate responses immediately, token by token"
            : "Reasoning models take time to think, explore, and verify before responding"
          }
        </div>
      </div>
    </div>
  );
}