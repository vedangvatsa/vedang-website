"use client";

import { useState } from 'react';

export function CorsVisualizer() {
  const [selectedScenario, setSelectedScenario] = useState<'same-origin' | 'cors-blocked' | 'cors-allowed'>('same-origin');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const scenarios = {
    'same-origin': {
      title: 'Same Origin (Allowed)',
      from: 'https://app.example.com',
      to: 'https://app.example.com/api',
      corsHeader: null,
      blocked: false,
      color: 'emerald'
    },
    'cors-blocked': {
      title: 'Cross Origin (Blocked)',
      from: 'https://app.example.com',
      to: 'https://api.bank.com',
      corsHeader: null,
      blocked: true,
      color: 'rose'
    },
    'cors-allowed': {
      title: 'Cross Origin (CORS Enabled)',
      from: 'https://app.example.com',
      to: 'https://api.service.com',
      corsHeader: 'Access-Control-Allow-Origin: https://app.example.com',
      blocked: false,
      color: 'blue'
    }
  };

  const currentScenario = scenarios[selectedScenario];

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const steps = [1, 2, 3, 4];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnimationStep(step);
        if (step === 4) {
          setTimeout(() => {
            setIsAnimating(false);
            setAnimationStep(0);
          }, 1500);
        }
      }, (index + 1) * 800);
    });
  };

  const getStepColor = (step: number) => {
    if (animationStep >= step) {
      return currentScenario.blocked ? 'rose' : currentScenario.color;
    }
    return 'slate';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">CORS (Cross-Origin Resource Sharing)</h3>
        <p className="text-slate-600 text-lg">Browser security mechanism controlling cross-domain requests</p>
      </div>

      <div className="flex gap-4 mb-6">
        {Object.entries(scenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => setSelectedScenario(key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedScenario === key
                ? `bg-${scenario.color}-100 text-${scenario.color}-700 border-2 border-${scenario.color}-300`
                : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'
            }`}
          >
            {scenario.title}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
              <div className="text-2xl">🌐</div>
            </div>
            <div className="font-medium text-slate-700">Browser</div>
            <div className="text-sm text-slate-500">{currentScenario.from}</div>
          </div>

          <div className="flex-1 mx-8 relative">
            <div className="h-2 bg-slate-200 rounded-full relative overflow-hidden">
              <div 
                className={`h-full bg-${getStepColor(1)}-400 transition-all duration-300 ${
                  animationStep >= 1 ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            
            <div className="flex justify-between mt-4">
              <div className={`text-xs px-2 py-1 rounded transition-colors ${
                animationStep >= 1 ? `bg-${getStepColor(1)}-100 text-${getStepColor(1)}-700` : 'bg-slate-100 text-slate-500'
              }`}>
                1. Request
              </div>
              
              <div className={`text-xs px-2 py-1 rounded transition-colors ${
                animationStep >= 2 ? `bg-${getStepColor(2)}-100 text-${getStepColor(2)}-700` : 'bg-slate-100 text-slate-500'
              }`}>
                2. Check Origin
              </div>
              
              <div className={`text-xs px-2 py-1 rounded transition-colors ${
                animationStep >= 3 ? `bg-${getStepColor(3)}-100 text-${getStepColor(3)}-700` : 'bg-slate-100 text-slate-500'
              }`}>
                3. Server Response
              </div>
              
              <div className={`text-xs px-2 py-1 rounded transition-colors ${
                animationStep >= 4 ? `bg-${getStepColor(4)}-100 text-${getStepColor(4)}-700` : 'bg-slate-100 text-slate-500'
              }`}>
                4. Browser Decision
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-xl flex items-center justify-center mb-2">
              <div className="text-2xl">🖥️</div>
            </div>
            <div className="font-medium text-slate-700">Server</div>
            <div className="text-sm text-slate-500">{currentScenario.to}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Request Headers</h4>
              <div className="bg-slate-50 rounded-lg p-3 font-mono text-sm">
                <div className="text-slate-600">Origin: {currentScenario.from}</div>
                <div className="text-slate-600">Host: {new URL(currentScenario.to).host}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Response Headers</h4>
              <div className="bg-slate-50 rounded-lg p-3 font-mono text-sm">
                {currentScenario.corsHeader ? (
                  <div className="text-emerald-600">{currentScenario.corsHeader}</div>
                ) : (
                  <div className="text-slate-400 italic">No CORS headers</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg flex items-center gap-3">
            {animationStep >= 4 && (
              <>
                {currentScenario.blocked ? (
                  <>
                    <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-rose-600 text-sm">✕</span>
                    </div>
                    <div className="text-rose-700 font-medium">Request blocked by browser</div>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <div className="text-emerald-700 font-medium">Request allowed</div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnimating ? 'Animating...' : 'Simulate Request'}
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-600 text-center max-w-2xl">
        <strong>Same Origin:</strong> Protocol, domain, and port match - always allowed.
        <br />
        <strong>Cross Origin:</strong> Different domain - requires CORS headers to allow access.
      </div>
    </div>
  );
}