"use client";

import React, { useState, useEffect } from 'react';

export function SlashingVisualizer() {
  const [selectedValidator, setSelectedValidator] = useState<number | null>(null);
  const [slashingScenario, setSlashingScenario] = useState<'none' | 'double-sign' | 'surround-vote'>('none');
  const [animationStep, setAnimationStep] = useState(0);
  const [validators, setValidators] = useState([
    { id: 1, stake: 32, slashed: false, penalty: 0, honest: true },
    { id: 2, stake: 32, slashed: false, penalty: 0, honest: true },
    { id: 3, stake: 32, slashed: false, penalty: 0, honest: true },
    { id: 4, stake: 32, slashed: false, penalty: 0, honest: true }
  ]);

  const slashingRules = {
    'double-sign': { basePenalty: 1, description: 'Double Signing: Proposing conflicting blocks' },
    'surround-vote': { basePenalty: 0.5, description: 'Surround Voting: Contradictory attestations' }
  };

  const executeSlashing = () => {
    if (selectedValidator === null || slashingScenario === 'none') return;

    const penalty = slashingRules[slashingScenario].basePenalty;
    setValidators(prev => prev.map(v => 
      v.id === selectedValidator + 1 
        ? { ...v, slashed: true, penalty, stake: v.stake - penalty, honest: false }
        : v
    ));
    setAnimationStep(1);
    
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => setAnimationStep(0), 2000);
  };

  const resetSimulation = () => {
    setValidators(prev => prev.map(v => ({ 
      ...v, 
      stake: 32, 
      slashed: false, 
      penalty: 0, 
      honest: true 
    })));
    setSelectedValidator(null);
    setSlashingScenario('none');
    setAnimationStep(0);
  };

  const getValidatorColor = (validator: any, index: number) => {
    if (validator.slashed) return 'bg-rose-500';
    if (selectedValidator === index) return 'bg-amber-400';
    return validator.honest ? 'bg-emerald-500' : 'bg-slate-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Slashing Mechanism</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive simulation of how validators are penalized for malicious behavior in Proof of Stake networks
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Select Validator</label>
            <div className="flex gap-2">
              {validators.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedValidator(index)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    selectedValidator === index
                      ? 'border-amber-400 bg-amber-100'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Slashing Type</label>
            <select
              value={slashingScenario}
              onChange={(e) => setSlashingScenario(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="none">Select offense...</option>
              <option value="double-sign">Double Signing</option>
              <option value="surround-vote">Surround Voting</option>
            </select>
          </div>

          <button
            onClick={executeSlashing}
            disabled={selectedValidator === null || slashingScenario === 'none'}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Execute Slash
          </button>

          <button
            onClick={resetSimulation}
            className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Network Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Validator Network</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {validators.map((validator, index) => (
              <div
                key={validator.id}
                className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                  validator.slashed ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
                } ${selectedValidator === index ? 'ring-2 ring-amber-400' : ''}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${getValidatorColor(
                      validator,
                      index
                    )}`}
                  >
                    {validator.id}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-700">
                      Stake: {validator.stake} ETH
                    </div>
                    {validator.slashed && (
                      <div className="text-xs text-rose-600 font-medium">
                        Slashed: -{validator.penalty} ETH
                      </div>
                    )}
                  </div>

                  {validator.slashed && animationStep > 0 && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      SLASHED
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Description */}
        {slashingScenario !== 'none' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h5 className="font-semibold text-blue-800 mb-2">Slashing Rule</h5>
            <p className="text-blue-700 text-sm">
              {slashingRules[slashingScenario].description}
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Base Penalty: {slashingRules[slashingScenario].basePenalty} ETH
            </p>
          </div>
        )}

        {/* Network Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {validators.filter(v => v.honest).length}
            </div>
            <div className="text-sm text-emerald-600">Honest Validators</div>
          </div>
          
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-rose-700">
              {validators.filter(v => v.slashed).length}
            </div>
            <div className="text-sm text-rose-600">Slashed Validators</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {validators.reduce((sum, v) => sum + v.stake, 0)}
            </div>
            <div className="text-sm text-blue-600">Total Stake (ETH)</div>
          </div>
        </div>
      </div>
    </div>
  );
}