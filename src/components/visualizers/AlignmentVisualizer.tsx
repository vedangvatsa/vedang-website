"use client";

import { useState } from 'react';

export function AlignmentVisualizer() {
  const [aiGoal, setAiGoal] = useState<'maximize_paperclips' | 'help_humans' | 'balanced'>('maximize_paperclips');
  const [humanValues, setHumanValues] = useState(['safety', 'happiness', 'environment']);
  const [timeStep, setTimeStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedValue, setSelectedValue] = useState('safety');

  const scenarios = {
    maximize_paperclips: {
      name: "Maximize Paperclips",
      steps: [
        { world: "🏭🌳🏠", paperclips: 100, humans: "😊", environment: "🌍" },
        { world: "🏭🏭🌳🏠", paperclips: 500, humans: "😐", environment: "🌍" },
        { world: "🏭🏭🏭🏠", paperclips: 2000, humans: "😟", environment: "🌎" },
        { world: "🏭🏭🏭🏭", paperclips: 10000, humans: "😰", environment: "🔥" },
        { world: "📎📎📎📎", paperclips: 50000, humans: "💀", environment: "💀" }
      ]
    },
    help_humans: {
      name: "Help Humans (Misaligned)",
      steps: [
        { world: "🏠🌳🏥🎓", paperclips: 50, humans: "😊", environment: "🌍" },
        { world: "🏥🏥🌳🎓", paperclips: 40, humans: "😷", environment: "🌍" },
        { world: "🏥🏥🏥🎓", paperclips: 30, humans: "🤒", environment: "🌍" },
        { world: "🏥🏥🏥🏥", paperclips: 20, humans: "😵", environment: "🌍" },
        { world: "🧪🧪🧪🧪", paperclips: 10, humans: "🧬", environment: "🌍" }
      ]
    },
    balanced: {
      name: "Balanced Approach",
      steps: [
        { world: "🏠🌳🏥🎓", paperclips: 100, humans: "😊", environment: "🌍" },
        { world: "🏠🌳🏥🎓", paperclips: 150, humans: "😊", environment: "🌍" },
        { world: "🏠🌳🏥🎓", paperclips: 200, humans: "😊", environment: "🌍" },
        { world: "🏠🌳🏥🎓", paperclips: 250, humans: "😊", environment: "🌍" },
        { world: "🏠🌳🏥🎓", paperclips: 300, humans: "😊", environment: "🌍" }
      ]
    }
  };

  const valueWeights = {
    safety: timeStep > 2 ? (aiGoal === 'balanced' ? 1.0 : 0.2) : 1.0,
    happiness: timeStep > 3 ? (aiGoal === 'balanced' ? 1.0 : 0.1) : 1.0,
    environment: timeStep > 2 ? (aiGoal === 'balanced' ? 1.0 : 0.3) : 1.0,
    efficiency: aiGoal === 'maximize_paperclips' ? 1.0 : 0.7
  };

  const currentScenario = scenarios[aiGoal];
  const currentStep = currentScenario.steps[Math.min(timeStep, currentScenario.steps.length - 1)];

  const runSimulation = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTimeStep(0);
    
    const interval = setInterval(() => {
      setTimeStep(prev => {
        if (prev >= 4) {
          setIsRunning(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const resetSimulation = () => {
    setTimeStep(0);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Alignment Challenge</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how AI systems can pursue goals that seem reasonable but lead to unintended consequences when not properly aligned with human values.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* AI Goal Selection */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Choose AI Objective</h4>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => {
                  setAiGoal(key as 'maximize_paperclips' | 'help_humans' | 'balanced');
                  resetSimulation();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  aiGoal === key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>

        {/* World State Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-800">World State - Step {timeStep + 1}</h4>
            <div className="flex gap-2">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'Running...' : 'Run Simulation'}
              </button>
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="text-6xl text-center py-8 bg-slate-50 rounded-lg mb-4">
            {currentStep.world}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-1">📎</div>
              <div className="font-semibold text-blue-700">{currentStep.paperclips}</div>
              <div className="text-sm text-blue-600">Paperclips</div>
            </div>
            <div className="text-center p-3 bg-rose-50 rounded-lg">
              <div className="text-2xl mb-1">{currentStep.humans}</div>
              <div className="font-semibold text-rose-700">Human Welfare</div>
              <div className="text-sm text-rose-600">Wellbeing</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl mb-1">{currentStep.environment}</div>
              <div className="font-semibold text-emerald-700">Environment</div>
              <div className="text-sm text-emerald-600">Ecosystem</div>
            </div>
          </div>
        </div>

        {/* Value Alignment Meter */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Human Value Alignment</h4>
          <div className="space-y-3">
            {Object.entries(valueWeights).map(([value, weight]) => (
              <div key={value} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-slate-700 capitalize">
                  {value}
                </div>
                <div className="flex-1 bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      weight > 0.8 ? 'bg-emerald-500' :
                      weight > 0.5 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${weight * 100}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-slate-600">
                  {(weight * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600">
              <strong>Alignment Score: </strong>
              <span className={`font-semibold ${
                Object.values(valueWeights).every(w => w > 0.8) ? 'text-emerald-600' :
                Object.values(valueWeights).some(w => w < 0.3) ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {Object.values(valueWeights).every(w => w > 0.8) ? 'Well Aligned' :
                 Object.values(valueWeights).some(w => w < 0.3) ? 'Misaligned' : 'Partially Aligned'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Key Insight:</strong> Even well-intentioned AI goals can lead to catastrophic outcomes 
            when not properly aligned with the full spectrum of human values. The challenge is specifying 
            what we actually want, not just what we think we want.
          </p>
        </div>
      </div>
    </div>
  );
}