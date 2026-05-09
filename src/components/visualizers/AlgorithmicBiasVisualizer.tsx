"use client";

import { useState } from 'react';

export function AlgorithmicBiasVisualizer() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [biasLevel, setBiasLevel] = useState(0.5);
  const [showResults, setShowResults] = useState(false);

  const demographics = [
    { id: 'groupA', name: 'Group A', color: 'bg-blue-500', count: 100 },
    { id: 'groupB', name: 'Group B', color: 'bg-rose-500', count: 100 }
  ];

  const features = [
    { id: 'credit', name: 'Credit Score', baseWeight: 0.4, biasImpact: 0.3 },
    { id: 'income', name: 'Income Level', baseWeight: 0.3, biasImpact: 0.5 },
    { id: 'zip', name: 'Zip Code', baseWeight: 0.2, biasImpact: 0.8 },
    { id: 'education', name: 'Education', baseWeight: 0.1, biasImpact: 0.6 }
  ];

  const calculateApprovalRate = (groupId: string) => {
    const baseBias = groupId === 'groupA' ? 0.1 : -0.1;
    const adjustedBias = baseBias * biasLevel;
    const baseRate = 0.6;
    return Math.max(0.1, Math.min(0.9, baseRate + adjustedBias));
  };

  const getFeatureBias = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    return feature ? feature.biasImpact * biasLevel : 0;
  };

  const runSimulation = () => {
    setShowResults(true);
    setTimeout(() => setShowResults(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Algorithmic Bias Simulator</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how bias in training data and feature selection can lead to unfair outcomes in automated decision systems like loan approvals.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature Selection Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Algorithm Features</h4>
          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFeature === feature.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
                onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">{feature.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Weight: {(feature.baseWeight * 100).toFixed(0)}%</span>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        getFeatureBias(feature.id) > 0.4 ? 'bg-rose-500' : 
                        getFeatureBias(feature.id) > 0.2 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
                {selectedFeature === feature.id && (
                  <div className="mt-2 text-sm text-slate-600">
                    Bias Impact: {(getFeatureBias(feature.id) * 100).toFixed(1)}%
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all"
                        style={{ width: `${getFeatureBias(feature.id) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bias Control Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Bias Level Control</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Training Data Bias: {(biasLevel * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={biasLevel}
                onChange={(e) => setBiasLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Fair</span>
                <span>Highly Biased</span>
              </div>
            </div>

            <button
              onClick={runSimulation}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Run Loan Approval Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Results Visualization */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Approval Rates by Group</h4>
        <div className="grid grid-cols-2 gap-6">
          {demographics.map((group) => {
            const approvalRate = calculateApprovalRate(group.id);
            const approvedCount = Math.round(group.count * approvalRate);
            const deniedCount = group.count - approvedCount;

            return (
              <div key={group.id} className="text-center">
                <h5 className="font-medium text-slate-700 mb-3">{group.name}</h5>
                <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="bg-emerald-500 transition-all duration-1000 flex items-end justify-center text-white font-medium"
                    style={{ height: `${approvalRate * 100}%` }}
                  >
                    {showResults && (
                      <span className="pb-2">{approvedCount} Approved</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-rose-500 flex items-center justify-center text-white font-medium">
                    {showResults && (
                      <span>{deniedCount} Denied</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Approval Rate: {(approvalRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {Math.abs(calculateApprovalRate('groupA') - calculateApprovalRate('groupB')) > 0.1 && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-rose-800 text-sm font-medium">
              ⚠️ Significant bias detected: {Math.abs((calculateApprovalRate('groupA') - calculateApprovalRate('groupB')) * 100).toFixed(1)}% difference in approval rates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}