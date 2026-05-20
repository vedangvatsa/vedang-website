"use client";

import { useState } from 'react';

export function AiAlignmentVisualizer() {
  const [humanIntent, setHumanIntent] = useState(50);
  const [aiCapability, setAiCapability] = useState(30);
  const [alignmentEffort, setAlignmentEffort] = useState(20);
  const [scenario, setScenario] = useState<'recommendation' | 'hiring' | 'trading'>('recommendation');
  const [isRunning, setIsRunning] = useState(false);

  const scenarios = {
    recommendation: {
      name: 'Content Recommendation',
      humanGoal: 'Show users helpful, educational content',
      description: 'AI recommends content to users'
    },
    hiring: {
      name: 'Hiring Assistant',
      humanGoal: 'Find qualified candidates fairly',
      description: 'AI screens job applications'
    },
    trading: {
      name: 'Financial Trading',
      humanGoal: 'Maximize returns with reasonable risk',
      description: 'AI makes trading decisions'
    }
  };

  const calculateAlignment = () => {
    const baseAlignment = alignmentEffort / 100;
    const capabilityGap = Math.max(0, (aiCapability - alignmentEffort) / 100);
    const intentClarity = humanIntent / 100;
    return Math.max(0, Math.min(100, (baseAlignment * intentClarity - capabilityGap * 50) * 100));
  };

  const getOutcome = () => {
    const alignment = calculateAlignment();
    const capability = aiCapability;
    
    if (alignment > 70) {
      return {
        type: 'success',
        color: 'emerald',
        message: 'AI behaves as intended',
        details: scenario === 'recommendation' ? 'Shows diverse, educational content' :
                scenario === 'hiring' ? 'Fairly evaluates all candidates' :
                'Makes profitable trades within risk limits'
      };
    } else if (alignment > 40) {
      return {
        type: 'partial',
        color: 'amber',
        message: 'Mixed results - some misalignment',
        details: scenario === 'recommendation' ? 'Optimizes for engagement over education' :
                scenario === 'hiring' ? 'Subtle bias in candidate selection' :
                'Occasionally exceeds risk tolerance'
      };
    } else {
      return {
        type: 'misaligned',
        color: 'rose',
        message: 'Significant misalignment detected',
        details: scenario === 'recommendation' ? 'Creates filter bubbles and addiction' :
                scenario === 'hiring' ? 'Systematically discriminates' :
                'Takes excessive risks for short-term gains'
      };
    }
  };

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const alignment = calculateAlignment();
  const outcome = getOutcome();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Alignment Interactive Simulator</h3>
        <p className="text-slate-600">Explore how AI capability, human intent clarity, and alignment effort affect outcomes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Controls Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Scenario Selection</h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(scenarios).map(([key, scen]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key as 'recommendation' | 'hiring' | 'trading')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    scenario === key
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium">{scen.name}</div>
                  <div className="text-sm text-slate-600">{scen.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-semibold text-slate-800">Parameters</h4>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Human Intent Clarity: {humanIntent}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={humanIntent}
                onChange={(e) => setHumanIntent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">How clearly humans specify their goals</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                AI Capability Level: {aiCapability}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={aiCapability}
                onChange={(e) => setAiCapability(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">How powerful the AI system is</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alignment Research Effort: {alignmentEffort}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={alignmentEffort}
                onChange={(e) => setAlignmentEffort(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">Resources devoted to ensuring alignment</div>
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isRunning ? 'Running Simulation...' : 'Run AI System'}
            </button>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Current Scenario</h4>
            <div className="space-y-3">
              <div className="font-medium text-slate-700">{scenarios[scenario].name}</div>
              <div className="text-sm text-slate-600">
                <strong>Human Goal:</strong> {scenarios[scenario].humanGoal}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Alignment Meter</h4>
            <div className="relative">
              <div className="w-full h-8 bg-slate-200 rounded-lg overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    outcome.color === 'emerald' ? 'bg-emerald-500' :
                    outcome.color === 'amber' ? 'bg-amber-500' :
                    'bg-rose-500'
                  } ${isRunning ? 'animate-pulse' : ''}`}
                  style={{ width: `${alignment}%` }}
                />
              </div>
              <div className="text-center mt-2 font-medium">
                {Math.round(alignment)}% Aligned
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">System Outcome</h4>
            <div className={`p-4 rounded-lg border-l-4 ${
              outcome.color === 'emerald' ? 'bg-emerald-50 border-emerald-500' :
              outcome.color === 'amber' ? 'bg-amber-50 border-amber-500' :
              'bg-rose-50 border-rose-500'
            }`}>
              <div className={`font-medium ${
                outcome.color === 'emerald' ? 'text-emerald-800' :
                outcome.color === 'amber' ? 'text-amber-800' :
                'text-rose-800'
              }`}>
                {outcome.message}
              </div>
              <div className={`text-sm mt-2 ${
                outcome.color === 'emerald' ? 'text-emerald-700' :
                outcome.color === 'amber' ? 'text-amber-700' :
                'text-rose-700'
              }`}>
                {outcome.details}
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg">
            <h5 className="font-medium text-slate-800 mb-2">Key Insight</h5>
            <div className="text-sm text-slate-700">
              {aiCapability > alignmentEffort + 30 
                ? "⚠️ Capability is advancing faster than alignment research"
                : aiCapability < 40
                ? "💡 Current AI capability level has manageable risks"
                : "✅ Alignment effort is keeping pace with capability growth"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}