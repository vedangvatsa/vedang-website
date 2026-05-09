"use client";

import { useState } from 'react';

export function RestakingVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ethAmount, setEthAmount] = useState(32);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const services = [
    { id: 0, name: 'Oracle Network', reward: 0.08, color: 'bg-blue-500', risk: 'Medium' },
    { id: 1, name: 'Data Availability', reward: 0.12, color: 'bg-emerald-500', risk: 'Low' },
    { id: 2, name: 'Bridge Protocol', reward: 0.15, color: 'bg-amber-500', risk: 'High' },
    { id: 3, name: 'Rollup Chain', reward: 0.10, color: 'bg-indigo-500', risk: 'Medium' }
  ];

  const steps = [
    'Stake ETH on Ethereum',
    'Choose Additional Services',
    'Restake for Multiple Rewards',
    'Monitor Risk & Rewards'
  ];

  const baseReward = 0.05; // 5% base staking reward
  const totalAdditionalReward = selectedServices.reduce((sum, id) => sum + services[id].reward, 0);
  const totalReward = baseReward + totalAdditionalReward;
  const annualRewards = ethAmount * totalReward;

  const toggleService = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Restaking Visualizer</h3>
        <p className="text-lg text-slate-600">Explore how staked ETH can secure multiple protocols simultaneously for additional rewards</p>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
        >
          Previous
        </button>
        <div className="text-slate-700 font-medium">
          Step {currentStep + 1}: {steps[currentStep]}
        </div>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>

      {/* ETH Amount Slider */}
      <div className="w-full max-w-md">
        <label className="block text-slate-700 font-medium mb-2">
          ETH Amount: {ethAmount} ETH
        </label>
        <input
          type="range"
          min="32"
          max="1000"
          value={ethAmount}
          onChange={(e) => setEthAmount(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Main Visualization */}
      <div className={`w-full max-w-4xl transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* Step 0: Basic Staking */}
        {currentStep === 0 && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              ETH
            </div>
            <div className="text-center">
              <div className="text-slate-700 mb-2">Ethereum Network</div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-sm text-slate-600">Base Staking Reward</div>
                <div className="text-xl font-bold text-slate-800">{(baseReward * 100).toFixed(1)}% APY</div>
                <div className="text-sm text-slate-600">≈ {(ethAmount * baseReward).toFixed(2)} ETH/year</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Choose Services */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-lg text-slate-700 mb-4">Select additional services to secure with your staked ETH:</div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedServices.includes(service.id)
                      ? `${service.color} text-white border-transparent shadow-lg scale-105`
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm opacity-90">+{(service.reward * 100).toFixed(1)}% APY</div>
                  <div className="text-xs opacity-75">Risk: {service.risk}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Restaking Visualization */}
        {currentStep === 2 && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                ETH
              </div>
              {selectedServices.map((serviceId, index) => {
                const service = services[serviceId];
                const angle = (index * 60) - 30;
                const radius = 120;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <div key={serviceId}>
                    {/* Connection Line */}
                    <div
                      className="absolute w-0.5 bg-slate-400 origin-left"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: `${radius}px`,
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: 'left center'
                      }}
                    />
                    {/* Service Node */}
                    <div
                      className={`absolute w-16 h-16 ${service.color} rounded-full flex items-center justify-center text-white text-xs font-medium shadow-lg`}
                      style={{
                        left: `calc(50% + ${x}px - 2rem)`,
                        top: `calc(50% + ${y}px - 2rem)`
                      }}
                    >
                      {service.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Rewards Summary */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
                <div className="text-sm text-slate-600 mb-2">Base Ethereum Staking</div>
                <div className="text-2xl font-bold text-blue-600">{(baseReward * 100).toFixed(1)}%</div>
                <div className="text-sm text-slate-600">{(ethAmount * baseReward).toFixed(2)} ETH/year</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
                <div className="text-sm text-slate-600 mb-2">Additional Restaking</div>
                <div className="text-2xl font-bold text-emerald-600">+{(totalAdditionalReward * 100).toFixed(1)}%</div>
                <div className="text-sm text-slate-600">{(ethAmount * totalAdditionalReward).toFixed(2)} ETH/year</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
                <div className="text-sm text-slate-600 mb-2">Total Annual Rewards</div>
                <div className="text-3xl font-bold text-indigo-600">{annualRewards.toFixed(2)} ETH</div>
                <div className="text-sm text-slate-600">{(totalReward * 100).toFixed(1)}% APY</div>
              </div>
            </div>
            
            {selectedServices.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg w-full max-w-2xl">
                <div className="text-sm text-rose-700">
                  ⚠️ <strong>Important:</strong> Restaking increases rewards but also increases slashing risk. 
                  Your ETH can be slashed if any of the secured services detect malicious behavior.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-slate-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}