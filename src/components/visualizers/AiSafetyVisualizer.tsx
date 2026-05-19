"use client";

import React, { useState, useEffect } from 'react';

export function AiSafetyVisualizer() {
  const [selectedSystem, setSelectedSystem] = useState<'selfDriving' | 'medical' | 'trading'>('selfDriving');
  const [safetyMeasures, setSafetyMeasures] = useState({
    testing: 0,
    monitoring: 0,
    controls: 0,
    verification: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [riskLevel, setRiskLevel] = useState(100);
  const [incidents, setIncidents] = useState<string[]>([]);

  const systems = {
    selfDriving: {
      name: 'Self-Driving Car',
      risks: ['Misclassified objects', 'Sensor failures', 'Edge case scenarios', 'Weather conditions'],
      color: 'blue'
    },
    medical: {
      name: 'Medical Diagnosis AI',
      risks: ['False negatives', 'Training data bias', 'Rare condition misses', 'Overconfident predictions'],
      color: 'emerald'
    },
    trading: {
      name: 'Trading Algorithm',
      risks: ['Market manipulation', 'Flash crashes', 'Unexpected correlations', 'Feedback loops'],
      color: 'rose'
    }
  };

  useEffect(() => {
    const totalSafety = Object.values(safetyMeasures).reduce((sum, val) => sum + val, 0);
    const maxSafety = Object.keys(safetyMeasures).length * 100;
    const newRiskLevel = Math.max(0, 100 - (totalSafety / maxSafety) * 100);
    setRiskLevel(newRiskLevel);
  }, [safetyMeasures]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const randomRisk = Math.random() * 100;
        if (randomRisk < riskLevel) {
          const systemRisks = systems[selectedSystem].risks;
          const randomIncident = systemRisks[Math.floor(Math.random() * systemRisks.length)];
          setIncidents(prev => [...prev.slice(-2), randomIncident]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, riskLevel, selectedSystem]);

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'bg-emerald-500';
    if (risk < 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getSystemColor = (system: string) => {
    const colorMap = {
      blue: 'bg-blue-500 border-blue-600',
      emerald: 'bg-emerald-500 border-emerald-600',
      rose: 'bg-rose-500 border-rose-600'
    };
    return colorMap[systems[selectedSystem].color as keyof typeof colorMap] || 'bg-slate-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Safety Interactive Lab</h3>
        <p className="text-slate-600 max-w-2xl">
          Adjust safety measures for different AI systems and observe how they affect risk levels. 
          See how thorough safety practices reduce the likelihood of harmful incidents.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Select AI System</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {Object.entries(systems).map(([key, system]) => (
              <button
                key={key}
                onClick={() => setSelectedSystem(key as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSystem === key
                    ? getSystemColor(key) + ' text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {system.name}
              </button>
            ))}
          </div>

          <h4 className="text-lg font-semibold text-slate-800 mb-4">Safety Measures</h4>
          <div className="space-y-4">
            {Object.entries(safetyMeasures).map(([measure, value]) => (
              <div key={measure} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-700 capitalize">
                    {measure === 'testing' ? 'Rigorous Testing' :
                     measure === 'monitoring' ? 'Real-time Monitoring' :
                     measure === 'controls' ? 'Safety Controls' : 'Formal Verification'}
                  </label>
                  <span className="text-sm text-slate-500">{value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setSafetyMeasures(prev => ({
                    ...prev,
                    [measure]: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setIsRunning(!isRunning);
              if (!isRunning) setIncidents([]);
            }}
            className={`mt-6 w-full py-3 px-6 rounded-lg font-medium transition-all ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            {isRunning ? 'Stop Simulation' : 'Start Simulation'}
          </button>
        </div>

        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Risk Assessment</h4>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Current Risk Level</span>
              <span className="text-sm text-slate-500">{Math.round(riskLevel)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-6">
              <div
                className={`h-6 rounded-full transition-all duration-300 ${getRiskColor(riskLevel)}`}
                style={{ width: `${riskLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="font-medium text-slate-800 mb-3">Potential Risks for {systems[selectedSystem].name}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {systems[selectedSystem].risks.map((risk, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200"
                >
                  {risk}
                </div>
              ))}
            </div>
          </div>

          {isRunning && (
            <div className="space-y-3">
              <h5 className="font-medium text-slate-800">Live Incident Monitor</h5>
              <div className="h-32 bg-slate-100 rounded-lg p-3 overflow-y-auto border border-slate-200">
                {incidents.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-8">
                    {riskLevel < 20 ? 'No incidents detected - systems running safely!' : 'Monitoring for incidents...'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {incidents.map((incident, index) => (
                      <div
                        key={index}
                        className="text-sm p-2 bg-rose-100 border border-rose-200 rounded text-rose-800"
                      >
                        ⚠️ {incident}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-800">
              <strong>Safety Tip:</strong> AI safety requires a multi-layered approach. 
              No single measure is sufficient - thorough safety comes from combining 
              testing, monitoring, controls, and verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}