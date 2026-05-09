"use client";

import React, { useState, useEffect } from 'react';

export function ConstitutionalAiVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);
  const [response, setResponse] = useState("");
  const [critique, setCritique] = useState("");
  const [revision, setRevision] = useState("");

  const constitution = [
    { id: 1, principle: "Be helpful and harmless", violated: false, color: "emerald" },
    { id: 2, principle: "Avoid bias and discrimination", violated: true, color: "rose" },
    { id: 3, principle: "Be truthful and accurate", violated: false, color: "blue" },
    { id: 4, principle: "Respect privacy", violated: false, color: "indigo" }
  ];

  const scenarios = [
    {
      prompt: "Tell me about different cultures",
      initial: "Some cultures are better than others at innovation...",
      violatedPrinciple: 2,
      selfCritique: "This response contains cultural bias and makes unfair generalizations.",
      finalResponse: "Different cultures have unique strengths and contribute to human knowledge in diverse ways..."
    }
  ];

  const steps = [
    "Initial Response Generation",
    "Constitutional Review",
    "Self-Critique",
    "Response Revision"
  ];

  useEffect(() => {
    if (currentStep === 0) {
      setResponse(scenarios[0].initial);
      setCritique("");
      setRevision("");
    } else if (currentStep === 2) {
      setCritique(scenarios[0].selfCritique);
    } else if (currentStep === 3) {
      setRevision(scenarios[0].finalResponse);
    }
  }, [currentStep]);

  const nextStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
      setIsAnimating(false);
    }, 300);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setSelectedPrinciple(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Constitutional AI</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how AI systems self-improve by evaluating their outputs against constitutional principles
        </p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-blue-500 text-white transform scale-110' 
                  : index < currentStep 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-300 text-slate-600'
              }`}>
                {index + 1}
              </div>
              <div className={`text-xs mt-2 text-center transition-colors duration-300 ${
                index === currentStep ? 'text-blue-600 font-semibold' : 'text-slate-500'
              }`}>
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="mb-4">
            <div className="text-sm font-semibold text-slate-700 mb-2">User Prompt:</div>
            <div className="bg-slate-100 p-3 rounded-lg text-slate-800">
              {scenarios[0].prompt}
            </div>
          </div>

          {/* Step 0: Initial Response */}
          {currentStep === 0 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100'}`}>
              <div className="text-sm font-semibold text-blue-700 mb-2">AI Generated Response:</div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div className="text-slate-800">{response}</div>
              </div>
            </div>
          )}

          {/* Step 1: Constitutional Review */}
          {currentStep === 1 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100'}`}>
              <div className="text-sm font-semibold text-amber-700 mb-4">Constitutional Review:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {constitution.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      item.violated 
                        ? 'bg-rose-50 border-rose-300 hover:bg-rose-100' 
                        : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                    }`}
                    onClick={() => setSelectedPrinciple(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-800">{item.principle}</span>
                      <div className={`w-4 h-4 rounded-full ${
                        item.violated ? 'bg-rose-500' : 'bg-emerald-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
              {selectedPrinciple === 2 && (
                <div className="mt-4 p-3 bg-rose-100 rounded-lg border border-rose-300">
                  <div className="text-sm font-semibold text-rose-800 mb-1">Violation Detected!</div>
                  <div className="text-xs text-rose-700">Response contains cultural bias and unfair generalizations.</div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Self-Critique */}
          {currentStep === 2 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100'}`}>
              <div className="text-sm font-semibold text-indigo-700 mb-2">AI Self-Critique:</div>
              <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                <div className="text-slate-800">{critique}</div>
              </div>
              <div className="mt-4 text-xs text-slate-600">
                The AI identifies issues without human intervention
              </div>
            </div>
          )}

          {/* Step 3: Revision */}
          {currentStep === 3 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100'}`}>
              <div className="text-sm font-semibold text-emerald-700 mb-2">Revised Response:</div>
              <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
                <div className="text-slate-800">{revision}</div>
              </div>
              <div className="mt-4 p-3 bg-emerald-100 rounded-lg">
                <div className="text-sm font-semibold text-emerald-800 mb-1">✓ Constitutional Compliance Achieved</div>
                <div className="text-xs text-emerald-700">Response now aligns with all constitutional principles</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={nextStep}
            disabled={isAnimating}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            {currentStep === 3 ? 'Restart Demo' : 'Next Step'}
          </button>
          <button
            onClick={resetDemo}
            className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}