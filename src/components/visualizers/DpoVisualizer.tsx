"use client";

import { useState } from 'react';

export function DpoVisualizer() {
  const [activeMethod, setActiveMethod] = useState('rlhf');
  const [currentStep, setCurrentStep] = useState(0);
  const [preferenceStrength, setPreferenceStrength] = useState(0.5);
  const [showMath, setShowMath] = useState(false);

  const rlhfSteps = [
    { name: 'Collect Preferences', color: 'bg-blue-500', description: 'Gather human preference data' },
    { name: 'Train Reward Model', color: 'bg-indigo-500', description: 'Learn to predict human preferences' },
    { name: 'RL Optimization', color: 'bg-rose-500', description: 'Optimize LM using reward model' }
  ];

  const dpoSteps = [
    { name: 'Direct Optimization', color: 'bg-emerald-500', description: 'Optimize directly on preferences' }
  ];

  const generatePreferenceData = () => {
    const responses = [
      { text: 'Response A: Helpful and accurate', preferred: preferenceStrength > 0.3 },
      { text: 'Response B: Less helpful', preferred: preferenceStrength <= 0.3 }
    ];
    return responses;
  };

  const calculateDpoLoss = (beta = 0.1) => {
    const logRatio = Math.log(preferenceStrength / (1 - preferenceStrength));
    return -Math.log(1 / (1 + Math.exp(-beta * logRatio)));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Direct Preference Optimization (DPO)</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive comparison of RLHF vs DPO training methods. DPO simplifies the pipeline by optimizing directly on preferences.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveMethod('rlhf')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeMethod === 'rlhf' 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Traditional RLHF
        </button>
        <button
          onClick={() => setActiveMethod('dpo')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeMethod === 'dpo' 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          DPO Method
        </button>
      </div>

      {/* Pipeline Visualization */}
      <div className="w-full max-w-4xl">
        <h4 className="text-xl font-semibold text-slate-800 mb-4">Training Pipeline</h4>
        <div className="flex items-center justify-center gap-4">
          {activeMethod === 'rlhf' ? (
            <>
              {rlhfSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className={`w-32 h-20 ${step.color} rounded-lg flex items-center justify-center text-white font-medium text-sm text-center p-2 cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => setCurrentStep(index)}
                  >
                    {step.name}
                  </div>
                  {index < rlhfSteps.length - 1 && (
                    <div className="w-8 h-1 bg-slate-300 mx-2"></div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div 
              className="w-64 h-20 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-medium text-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowMath(!showMath)}
            >
              Single Supervised Step
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-slate-600">
            {activeMethod === 'rlhf' ? (
              `Step ${currentStep + 1}: ${rlhfSteps[currentStep].description}`
            ) : (
              'Click to toggle DPO loss function'
            )}
          </p>
        </div>
      </div>

      {/* Preference Data Simulation */}
      <div className="w-full max-w-2xl">
        <h4 className="text-xl font-semibold text-slate-800 mb-4">Preference Strength</h4>
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={preferenceStrength}
            onChange={(e) => setPreferenceStrength(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-slate-600 mt-2">
            <span>Weak Preference</span>
            <span className="font-medium">{preferenceStrength.toFixed(1)}</span>
            <span>Strong Preference</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {generatePreferenceData().map((response, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                response.preferred 
                  ? 'border-emerald-400 bg-emerald-50' 
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              <div className="text-sm font-medium text-slate-800">{response.text}</div>
              {response.preferred && (
                <div className="text-xs text-emerald-600 mt-2">✓ Preferred</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DPO Math Display */}
      {activeMethod === 'dpo' && showMath && (
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">DPO Loss Function</h4>
          <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2">L(π) = -E[(x,y_w,y_l)~D][log σ(β log π(y_w|x)/π_ref(y_w|x) - β log π(y_l|x)/π_ref(y_l|x))]</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Current Loss:</span>
              <div className="text-lg text-blue-600 font-mono">{calculateDpoLoss().toFixed(4)}</div>
            </div>
            <div>
              <span className="font-medium">Preference Ratio:</span>
              <div className="text-lg text-indigo-600 font-mono">{(preferenceStrength / (1 - preferenceStrength)).toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-600">
            <strong>Key insight:</strong> DPO directly optimizes the language model using a classification loss on preference pairs, 
            eliminating the need for a separate reward model while maintaining theoretical guarantees.
          </div>
        </div>
      )}

      {/* Comparison Metrics */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-slate-600">RLHF Stages</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-emerald-600">1</div>
          <div className="text-sm text-slate-600">DPO Stage</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-amber-600">~3x</div>
          <div className="text-sm text-slate-600">Training Speedup</div>
        </div>
      </div>
    </div>
  );
}