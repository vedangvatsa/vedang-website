"use client";

import { useState } from 'react';

export function LiquidRestakingVisualizer() {
  const [ethAmount, setEthAmount] = useState(10);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAVS, setSelectedAVS] = useState<string[]>([]);
  const [showRisks, setShowRisks] = useState(false);

  const steps = [
    'Initial ETH',
    'Liquid Staking',
    'Liquid Restaking',
    'Multiple AVS',
    'Risk Analysis'
  ];

  const avsOptions = [
    { id: 'bridge', name: 'Cross-chain Bridge', reward: 3.2, risk: 'Medium' },
    { id: 'oracle', name: 'Oracle Network', reward: 2.8, risk: 'Low' },
    { id: 'sequencer', name: 'Rollup Sequencer', reward: 4.1, risk: 'High' },
    { id: 'data', name: 'Data Availability', reward: 2.5, risk: 'Low' }
  ];

  const baseStakingReward = 4.0;
  const totalReward = selectedAVS.reduce((acc, avsId) => {
    const avs = avsOptions.find(a => a.id === avsId);
    return acc + (avs ? avs.reward : 0);
  }, baseStakingReward);

  const slashingRisk = selectedAVS.length * 15 + 5;

  const toggleAVS = (avsId: string) => {
    setSelectedAVS(prev => 
      prev.includes(avsId) 
        ? prev.filter(id => id !== avsId)
        : [...prev, avsId]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Liquid Restaking Visualizer</h3>
        <p className="text-slate-600">Explore how ETH can be staked multiple times across different networks for enhanced yields and risks</p>
      </div>

      <div className="w-full max-w-4xl">
        {/* ETH Amount Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ETH Amount: {ethAmount} ETH
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={ethAmount}
            onChange={(e) => setEthAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <button
                key={step}
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 min-h-96">
          {currentStep === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">ETH</span>
              </div>
              <p className="text-lg font-medium text-slate-800">{ethAmount} ETH</p>
              <p className="text-slate-600">Currently earning 0% yield</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex items-center justify-center h-full space-x-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">ETH</span>
                </div>
                <p className="text-sm text-slate-600">{ethAmount} ETH</p>
              </div>
              <div className="text-2xl text-slate-400">→</div>
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">stETH</span>
                </div>
                <p className="text-sm text-slate-600">{ethAmount} stETH</p>
                <p className="text-emerald-600 font-medium">{baseStakingReward}% APY</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex items-center justify-center h-full space-x-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-xs">stETH</span>
                </div>
                <p className="text-sm text-slate-600">{ethAmount} stETH</p>
              </div>
              <div className="text-xl text-slate-400">→</div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-xs">AVS</span>
                </div>
                <p className="text-sm text-slate-600">Bridge Network</p>
                <p className="text-blue-600 font-medium">+3.2% APY</p>
              </div>
              <div className="text-center bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-800 font-medium">Total APY: {(baseStakingReward + 3.2).toFixed(1)}%</p>
                <p className="text-amber-600 text-sm">Same ETH, multiple yields!</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Select Actively Validated Services (AVS)</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {avsOptions.map(avs => (
                  <button
                    key={avs.id}
                    onClick={() => toggleAVS(avs.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAVS.includes(avs.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-slate-800">{avs.name}</h5>
                      <div className={`w-3 h-3 rounded-full ${
                        avs.risk === 'Low' ? 'bg-emerald-400' : 
                        avs.risk === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                      }`}></div>
                    </div>
                    <p className="text-blue-600 font-medium">+{avs.reward}% APY</p>
                    <p className="text-sm text-slate-500">{avs.risk} Risk</p>
                  </button>
                ))}
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-800">Total APY:</span>
                  <span className="text-xl font-bold text-emerald-600">{totalReward.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-600">Annual Yield:</span>
                  <span className="font-medium text-slate-800">{(ethAmount * totalReward / 100).toFixed(2)} ETH</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-slate-800">Risk Analysis</h4>
                <button
                  onClick={() => setShowRisks(!showRisks)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  {showRisks ? 'Hide' : 'Show'} Slashing Scenario
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h5 className="font-medium text-emerald-800 mb-2">Rewards</h5>
                  <p className="text-2xl font-bold text-emerald-600">{totalReward.toFixed(1)}% APY</p>
                  <p className="text-emerald-700">≈ {(ethAmount * totalReward / 100).toFixed(2)} ETH/year</p>
                </div>
                
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h5 className="font-medium text-rose-800 mb-2">Slashing Risk</h5>
                  <p className="text-2xl font-bold text-rose-600">{slashingRisk}%</p>
                  <p className="text-rose-700">Max potential loss: {(ethAmount * slashingRisk / 100).toFixed(2)} ETH</p>
                </div>
              </div>

              {showRisks && (
                <div className="mt-6 bg-rose-100 p-4 rounded-lg border border-rose-200">
                  <h5 className="font-medium text-rose-800 mb-2">Slashing Event Simulation</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-rose-700">Original ETH:</span>
                      <span className="font-medium">{ethAmount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-rose-700">After 30% Slashing:</span>
                      <span className="font-medium text-rose-800">{(ethAmount * 0.7).toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between border-t border-rose-200 pt-2">
                      <span className="text-rose-700 font-medium">Loss:</span>
                      <span className="font-bold text-rose-800">-{(ethAmount * 0.3).toFixed(2)} ETH</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}