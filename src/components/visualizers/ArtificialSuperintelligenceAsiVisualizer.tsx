"use client";

import { useState } from 'react';

export function ArtificialSuperintelligenceAsiVisualizer() {
  const [currentCapability, setCurrentCapability] = useState(0);
  const [asiLevel, setAsiLevel] = useState(1);
  const [isEvolutionRunning, setIsEvolutionRunning] = useState(false);
  const [evolutionStep, setEvolutionStep] = useState(0);

  const capabilities = [
    { name: 'Scientific Research', human: 65, current: 85, asi: 99, color: 'bg-blue-500' },
    { name: 'Creative Arts', human: 70, current: 40, asi: 95, color: 'bg-rose-500' },
    { name: 'Mathematical Reasoning', human: 60, current: 90, asi: 99, color: 'bg-indigo-500' },
    { name: 'Social Intelligence', human: 75, current: 25, asi: 90, color: 'bg-emerald-500' },
    { name: 'Strategic Planning', human: 55, current: 70, asi: 98, color: 'bg-amber-500' },
    { name: 'Self-Improvement', human: 20, current: 15, asi: 99, color: 'bg-slate-500' }
  ];

  const evolutionStages = [
    'Narrow AI (Current)',
    'Advanced AI Systems',
    'Artificial General Intelligence',
    'Early Superintelligence',
    'Advanced Superintelligence'
  ];

  const runEvolution = () => {
    if (isEvolutionRunning) return;
    setIsEvolutionRunning(true);
    setEvolutionStep(0);
    
    const interval = setInterval(() => {
      setEvolutionStep(prev => {
        if (prev >= 4) {
          setIsEvolutionRunning(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const getCapabilityValue = (capability: any, type: string) => {
    if (type === 'human') return capability.human;
    if (type === 'current') return capability.current;
    
    const baseAsi = capability.asi;
    const levelMultiplier = 0.7 + (asiLevel * 0.1);
    return Math.min(99, Math.floor(baseAsi * levelMultiplier));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Artificial Superintelligence (ASI) Explorer
        </h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how ASI would surpass human cognitive abilities across all domains. 
          Click capabilities, adjust ASI levels, and watch the evolution of intelligence.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Capability Comparison */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Cognitive Capabilities Comparison</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {capabilities.map((capability, index) => (
              <div
                key={capability.name}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  currentCapability === index 
                    ? 'bg-blue-100 border-2 border-blue-300' 
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                }`}
                onClick={() => setCurrentCapability(index)}
              >
                <h5 className="font-medium text-slate-800 mb-3">{capability.name}</h5>
                
                {/* Human Level */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Human Average</span>
                    <span>{capability.human}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${capability.human}%` }}
                    />
                  </div>
                </div>

                {/* Current AI */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Current AI</span>
                    <span>{capability.current}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${capability.current}%` }}
                    />
                  </div>
                </div>

                {/* ASI Level */}
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>ASI (Level {asiLevel})</span>
                    <span>{getCapabilityValue(capability, 'asi')}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`${capability.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${getCapabilityValue(capability, 'asi')}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ASI Level Slider */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ASI Development Level: {asiLevel}/3
            </label>
            <input
              type="range"
              min="1"
              max="3"
              value={asiLevel}
              onChange={(e) => setAsiLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Early ASI</span>
              <span>Moderate ASI</span>
              <span>Advanced ASI</span>
            </div>
          </div>
        </div>

        {/* Evolution Timeline */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Intelligence Evolution Timeline</h4>
            <button
              onClick={runEvolution}
              disabled={isEvolutionRunning}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-slate-400 transition-colors"
            >
              {isEvolutionRunning ? 'Evolving...' : 'Animate Evolution'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            {evolutionStages.map((stage, index) => (
              <div key={stage} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index <= evolutionStep 
                      ? 'bg-indigo-500 scale-125' 
                      : 'bg-slate-300'
                  }`}
                />
                <div 
                  className={`mt-2 text-xs text-center transition-all duration-500 ${
                    index === evolutionStep 
                      ? 'text-indigo-600 font-semibold' 
                      : 'text-slate-500'
                  }`}
                >
                  {stage}
                </div>
                {index < evolutionStages.length - 1 && (
                  <div 
                    className={`h-0.5 w-full mt-2 transition-all duration-500 ${
                      index < evolutionStep 
                        ? 'bg-indigo-500' 
                        : 'bg-slate-300'
                    }`}
                    style={{ 
                      position: 'absolute',
                      top: '8px',
                      left: '50%',
                      width: `${100 / (evolutionStages.length - 1)}%`,
                      zIndex: -1
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Evolution Description */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-800">
              {evolutionStep === 0 && "Current AI excels at specific tasks but lacks general intelligence."}
              {evolutionStep === 1 && "AI systems begin to show broader capabilities across multiple domains."}
              {evolutionStep === 2 && "Artificial General Intelligence matches human-level performance across all cognitive tasks."}
              {evolutionStep === 3 && "Early superintelligence begins to exceed human capabilities in most domains."}
              {evolutionStep === 4 && "Advanced ASI operates at levels far beyond human comprehension, capable of recursive self-improvement."}
            </p>
          </div>
        </div>

        {/* Key Properties */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">ASI Key Properties</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">∞</div>
              <div className="text-sm font-medium text-emerald-800">Speed</div>
              <div className="text-xs text-emerald-600 mt-1">Processes information millions of times faster</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">🧠</div>
              <div className="text-sm font-medium text-blue-800">Memory</div>
              <div className="text-xs text-blue-600 mt-1">Perfect recall and infinite storage capacity</div>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <div className="text-2xl font-bold text-rose-600">⚡</div>
              <div className="text-sm font-medium text-rose-800">Self-Improvement</div>
              <div className="text-xs text-rose-600 mt-1">Recursively enhances its own capabilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}