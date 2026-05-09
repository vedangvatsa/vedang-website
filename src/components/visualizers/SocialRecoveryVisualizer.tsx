"use client";

import React, { useState } from 'react';

export function SocialRecoveryVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [guardians, setGuardians] = useState([
    { id: 1, name: 'Alice (Sister)', approved: false, type: 'family' },
    { id: 2, name: 'Bob (Best Friend)', approved: false, type: 'friend' },
    { id: 3, name: 'Charlie (Colleague)', approved: false, type: 'friend' },
    { id: 4, name: 'Diana (Mom)', approved: false, type: 'family' },
    { id: 5, name: 'Eve (Hardware Wallet)', approved: false, type: 'institution' }
  ]);
  const [threshold, setThreshold] = useState(3);
  const [isRecovering, setIsRecovering] = useState(false);

  const steps = [
    'Setup Guardians',
    'Set Threshold',
    'Lose Access',
    'Contact Guardians',
    'Recovery Complete'
  ];

  const toggleGuardianApproval = (id: number) => {
    if (!isRecovering) return;
    setGuardians(prev => prev.map(g => 
      g.id === id ? { ...g, approved: !g.approved } : g
    ));
  };

  const approvedCount = guardians.filter(g => g.approved).length;
  const recoveryPossible = approvedCount >= threshold;

  const nextStep = () => {
    if (currentStep === 2) {
      setIsRecovering(true);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsRecovering(false);
    setGuardians(prev => prev.map(g => ({ ...g, approved: false })));
  };

  const getGuardianIcon = (type: string) => {
    switch (type) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friend': return '🤝';
      case 'institution': return '🏛️';
      default: return '👤';
    }
  };

  const getStepColor = (index: number) => {
    if (index < currentStep) return 'bg-emerald-500';
    if (index === currentStep) return 'bg-blue-500';
    return 'bg-slate-300';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Social Recovery Wallet</h3>
        <p className="text-slate-600">Interactive demonstration of guardian-based wallet recovery</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getStepColor(index)}`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${index < currentStep ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Display */}
      <div className="text-lg font-semibold text-slate-700 mb-4">
        Step {currentStep + 1}: {steps[currentStep]}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl">
        {currentStep === 0 && (
          <div className="text-center">
            <p className="text-slate-600 mb-6">Choose trusted guardians who can help recover your wallet</p>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {guardians.map((guardian) => (
                <div key={guardian.id} className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
                  <div className="text-2xl mb-2">{getGuardianIcon(guardian.type)}</div>
                  <div className="text-sm font-medium text-slate-700">{guardian.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="text-center">
            <p className="text-slate-600 mb-6">Set how many guardians need to approve recovery</p>
            <div className="bg-white p-6 rounded-lg border-2 border-indigo-200 max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-slate-700 font-medium mb-2">
                  Recovery Threshold: {threshold} of {guardians.length}
                </label>
                <input
                  type="range"
                  min="2"
                  max={guardians.length}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="text-sm text-slate-500">
                Security vs Usability: Higher threshold = more secure, but harder to recover
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <div className="bg-rose-100 border-2 border-rose-300 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">📱💥</div>
              <h4 className="text-xl font-bold text-rose-800 mb-2">Access Lost!</h4>
              <p className="text-rose-600">Your device is broken and you forgot your seed phrase</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <p className="text-slate-600 mb-6 text-center">Contact your guardians to approve wallet recovery</p>
            <div className="bg-white p-6 rounded-lg border-2 border-amber-200 mb-6">
              <div className="text-center mb-4">
                <span className="text-lg font-medium">Recovery Progress: </span>
                <span className={`text-lg font-bold ${recoveryPossible ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {approvedCount}/{threshold} approvals needed
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    recoveryPossible ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min((approvedCount / threshold) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {guardians.map((guardian) => (
                <div 
                  key={guardian.id} 
                  className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    guardian.approved 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-300 hover:border-blue-400'
                  }`}
                  onClick={() => toggleGuardianApproval(guardian.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{getGuardianIcon(guardian.type)}</div>
                    <div className="text-sm font-medium text-slate-700 mb-2">{guardian.name}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      guardian.approved ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {guardian.approved ? '✅ Approved' : '⏳ Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center">
            <div className="bg-emerald-100 border-2 border-emerald-300 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">🎉</div>
              <h4 className="text-xl font-bold text-emerald-800 mb-2">Recovery Complete!</h4>
              <p className="text-emerald-600 mb-4">Your wallet has been successfully recovered</p>
              <div className="text-sm text-emerald-700">
                {approvedCount} guardians approved your recovery request
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {currentStep < steps.length - 1 && (
          <button
            onClick={nextStep}
            disabled={currentStep === 3 && !recoveryPossible}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 3 && !recoveryPossible
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {currentStep === 3 ? 'Complete Recovery' : 'Next Step'}
          </button>
        )}
        
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg font-medium bg-slate-500 hover:bg-slate-600 text-white transition-colors"
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
}