"use client";

import React, { useState, useEffect } from 'react';

export function AgenticWorkflowVisualizer() {
  const [mode, setMode] = useState<'traditional' | 'agentic'>('traditional');
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  const traditionalSteps = [
    { title: "Single Prompt", desc: "Write entire app", status: "processing" },
    { title: "Generate Code", desc: "Attempt full solution", status: "processing" },
    { title: "Context Overflow", desc: "Fails with complex logic", status: "error" }
  ];

  const agenticSteps = [
    { title: "Parse Goal", desc: "Break down requirements", status: "success" },
    { title: "Create Plan", desc: "Define sub-tasks", status: "success" },
    { title: "Write Code", desc: "Small, focused piece", status: "success" },
    { title: "Test & Validate", desc: "Check current progress", status: "success" },
    { title: "Get Feedback", desc: "Analyze results", status: "success" },
    { title: "Iterate", desc: "Refine and continue", status: "success" }
  ];

  const feedbackMessages = [
    "✓ Authentication module working",
    "✗ Database connection failing",
    "→ Adjusting connection string",
    "✓ API endpoints responding",
    "→ Adding error handling",
    "✓ Tests passing"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'traditional') {
          setCurrentStep(prev => {
            if (prev >= traditionalSteps.length - 1) {
              setIsRunning(false);
              return prev;
            }
            return prev + 1;
          });
        } else {
          setCurrentStep(prev => (prev + 1) % agenticSteps.length);
          if (Math.random() > 0.7) {
            setFeedback(prev => {
              const newFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
              return [newFeedback, ...prev].slice(0, 4);
            });
          }
        }
      }, 1200);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleStart = () => {
    setCurrentStep(0);
    setFeedback([]);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleModeSwitch = (newMode: 'traditional' | 'agentic') => {
    setMode(newMode);
    setIsRunning(false);
    setCurrentStep(0);
    setFeedback([]);
  };

  const steps = mode === 'traditional' ? traditionalSteps : agenticSteps;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-4">Agentic Workflow</h3>
        <p className="text-lg text-slate-600 max-w-3xl">
          Compare traditional single-shot AI prompts vs. iterative agentic workflows that break down complex problems into manageable loops with continuous feedback and refinement.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleModeSwitch('traditional')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mode === 'traditional'
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Traditional Approach
        </button>
        <button
          onClick={() => handleModeSwitch('agentic')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mode === 'agentic'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Agentic Workflow
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Start Process
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="px-6 py-2 bg-slate-500 text-white rounded-lg font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Stop
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg border-2 min-w-[180px] transition-all duration-500 ${
                index === currentStep && isRunning
                  ? mode === 'traditional'
                    ? index === steps.length - 1
                      ? 'border-rose-400 bg-rose-50 shadow-lg scale-105'
                      : 'border-amber-400 bg-amber-50 shadow-lg scale-105'
                    : 'border-emerald-400 bg-emerald-50 shadow-lg scale-105'
                  : index < currentStep
                  ? mode === 'traditional'
                    ? index === steps.length - 1
                      ? 'border-rose-300 bg-rose-25'
                      : 'border-slate-300 bg-slate-25'
                    : 'border-emerald-300 bg-emerald-25'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep && isRunning
                      ? mode === 'traditional'
                        ? index === steps.length - 1
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500 animate-pulse'
                      : index < currentStep
                      ? mode === 'traditional'
                        ? index === steps.length - 1
                          ? 'bg-rose-400'
                          : 'bg-slate-400'
                        : 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
                <h4 className="font-semibold text-slate-800">{step.title}</h4>
              </div>
              <p className="text-sm text-slate-600">{step.desc}</p>
              {index === steps.length - 1 && mode === 'traditional' && index <= currentStep && (
                <div className="mt-2 text-xs text-rose-600 font-semibold">❌ Failed</div>
              )}
            </div>
          ))}
        </div>

        {mode === 'agentic' && (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg border border-slate-200 p-4 w-full max-w-md">
              <h4 className="font-semibold text-slate-800 mb-3">Feedback Loop</h4>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {feedback.map((msg, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded transition-all ${
                      msg.startsWith('✓')
                        ? 'bg-emerald-50 text-emerald-700'
                        : msg.startsWith('✗')
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {msg}
                  </div>
                ))}
                {feedback.length === 0 && (
                  <div className="text-sm text-slate-400 italic">
                    Feedback will appear here during execution...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mode === 'agentic' && isRunning && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-sm font-semibold">Continuous iteration active</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
            <h5 className="font-semibold text-rose-800 mb-2">Traditional Approach</h5>
            <p className="text-rose-700">Single attempt, context overflow, brittle failure</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h5 className="font-semibold text-emerald-800 mb-2">Agentic Workflow</h5>
            <p className="text-emerald-700">Iterative loops, continuous feedback, adaptive refinement</p>
          </div>
        </div>
      </div>
    </div>
  );
}