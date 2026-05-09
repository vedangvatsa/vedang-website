"use client";

import { useState, useEffect } from 'react';

export function ProofOfStakeVisualizer() {
  const [validators, setValidators] = useState([
    { id: 1, name: 'Alice', stake: 32, isSelected: false, rewards: 0, slashed: false },
    { id: 2, name: 'Bob', stake: 64, isSelected: false, rewards: 0, slashed: false },
    { id: 3, name: 'Charlie', stake: 96, isSelected: false, rewards: 0, slashed: false },
    { id: 4, name: 'Dave', stake: 128, isSelected: false, rewards: 0, slashed: false },
  ]);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [animationStep, setAnimationStep] = useState('selection');
  const [selectedValidator, setSelectedValidator] = useState<number | null>(null);
  const [maliciousAction, setMaliciousAction] = useState(false);

  const totalStake = validators.reduce((sum, v) => sum + (v.slashed ? 0 : v.stake), 0);

  const selectValidator = () => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const validator of validators) {
      if (validator.slashed) continue;
      cumulative += validator.stake / totalStake;
      if (random <= cumulative) {
        setSelectedValidator(validator.id);
        setValidators(prev => prev.map(v => ({
          ...v,
          isSelected: v.id === validator.id
        })));
        return;
      }
    }
  };

  const processBlock = () => {
    if (selectedValidator === null) return;

    if (maliciousAction && Math.random() < 0.7) {
      // Slash the validator
      setValidators(prev => prev.map(v => 
        v.id === selectedValidator 
          ? { ...v, slashed: true, stake: Math.floor(v.stake * 0.5), isSelected: false }
          : v
      ));
      setAnimationStep('slashed');
    } else {
      // Reward the validator
      const reward = Math.floor(Math.random() * 3) + 1;
      setValidators(prev => prev.map(v => 
        v.id === selectedValidator 
          ? { ...v, rewards: v.rewards + reward, isSelected: false }
          : v
      ));
      setAnimationStep('rewarded');
    }

    setTimeout(() => {
      setAnimationStep('selection');
      setSelectedValidator(null);
      setCurrentBlock(prev => prev + 1);
      setMaliciousAction(false);
    }, 2000);
  };

  const resetSimulation = () => {
    setValidators([
      { id: 1, name: 'Alice', stake: 32, isSelected: false, rewards: 0, slashed: false },
      { id: 2, name: 'Bob', stake: 64, isSelected: false, rewards: 0, slashed: false },
      { id: 3, name: 'Charlie', stake: 96, isSelected: false, rewards: 0, slashed: false },
      { id: 4, name: 'Dave', stake: 128, isSelected: false, rewards: 0, slashed: false },
    ]);
    setCurrentBlock(1);
    setAnimationStep('selection');
    setSelectedValidator(null);
    setMaliciousAction(false);
  };

  const updateStake = (id: number, newStake: number) => {
    setValidators(prev => prev.map(v => 
      v.id === id ? { ...v, stake: newStake } : v
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Proof of Stake Consensus</h3>
        <p className="text-slate-600">Interactive simulation showing how validators are selected based on stake weight and economic incentives</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Validators Panel */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Validators</h4>
          <div className="space-y-4">
            {validators.map(validator => {
              const selectionProbability = validator.slashed ? 0 : (validator.stake / totalStake) * 100;
              
              return (
                <div
                  key={validator.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                    validator.isSelected
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : validator.slashed
                      ? 'border-rose-300 bg-rose-50 opacity-60'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-slate-800">{validator.name}</h5>
                    {validator.slashed && (
                      <span className="text-xs bg-rose-500 text-white px-2 py-1 rounded">SLASHED</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Stake:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="32"
                          max="200"
                          value={validator.stake}
                          onChange={(e) => updateStake(validator.id, parseInt(e.target.value))}
                          disabled={validator.slashed || animationStep !== 'selection'}
                          className="w-20"
                        />
                        <span className="font-medium text-indigo-600">{validator.stake} ETH</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Selection Probability:</span>
                      <span className="font-medium text-blue-600">{selectionProbability.toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rewards Earned:</span>
                      <span className="font-medium text-emerald-600">{validator.rewards} ETH</span>
                    </div>
                    
                    {/* Stake visualization bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          validator.slashed ? 'bg-rose-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${(validator.stake / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Consensus Simulation</h4>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Block #{currentBlock}</div>
              <div className="text-sm text-slate-600">
                Status: <span className="font-medium capitalize">{animationStep}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={selectValidator}
                disabled={animationStep !== 'selection'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Select Validator (Weighted Random)
              </button>

              {selectedValidator && animationStep === 'selection' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="malicious"
                      checked={maliciousAction}
                      onChange={(e) => setMaliciousAction(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="malicious" className="text-sm text-slate-700">
                      Simulate malicious behavior (70% slash chance)
                    </label>
                  </div>
                  
                  <button
                    onClick={processBlock}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Process Block
                  </button>
                </div>
              )}

              {animationStep === 'rewarded' && (
                <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-emerald-700 font-medium">✅ Block Validated Successfully!</div>
                  <div className="text-sm text-emerald-600">Validator earned rewards</div>
                </div>
              )}

              {animationStep === 'slashed' && (
                <div className="text-center p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <div className="text-rose-700 font-medium">⚠️ Malicious Behavior Detected!</div>
                  <div className="text-sm text-rose-600">Validator stake slashed by 50%</div>
                </div>
              )}

              <button
                onClick={resetSimulation}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reset Simulation
              </button>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h5 className="font-medium text-slate-800 mb-2">Network Stats</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Stake:</span>
                  <span className="font-medium text-indigo-600">{totalStake} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Validators:</span>
                  <span className="font-medium text-blue-600">
                    {validators.filter(v => !v.slashed).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Slashed Validators:</span>
                  <span className="font-medium text-rose-600">
                    {validators.filter(v => v.slashed).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center max-w-4xl">
        Adjust validator stakes with sliders to see how it affects selection probability. Higher stake = higher chance of being selected to validate blocks. 
        Malicious behavior results in stake slashing, providing economic security to the network.
      </div>
    </div>
  );
}