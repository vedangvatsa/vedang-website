"use client";

import { useState } from 'react';

interface Solver {
  id: number;
  name: string;
  output: number;
  fee: number;
  route: string;
  time: number;
}

export function IntentVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [intentAmount, setIntentAmount] = useState(1);
  const [minOutput, setMinOutput] = useState(2000);
  const [timeLimit, setTimeLimit] = useState(30);
  const [selectedSolver, setSelectedSolver] = useState<Solver | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const solvers = [
    { id: 1, name: 'Solver A', output: 2100, fee: 5, route: 'Uniswap V3', time: 15 },
    { id: 2, name: 'Solver B', output: 2080, fee: 3, route: 'Curve + 1inch', time: 20 },
    { id: 3, name: 'Solver C', output: 2120, fee: 8, route: 'Multi-DEX', time: 12 }
  ];

  const steps = [
    'Create Intent',
    'Solvers Compete',
    'Best Solution',
    'Execute Trade'
  ];

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setCurrentStep(3);
    }, 2000);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setSelectedSolver(null);
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Intent-Based Trading</h3>
        <p className="text-lg text-slate-600">Express what you want, let solvers figure out how to get it</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              index <= currentStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {index + 1}. {step}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 w-full max-w-md">
          <h4 className="text-xl font-semibold mb-4 text-slate-800">Create Your Intent</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount to Trade: {intentAmount} ETH
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={intentAmount}
                onChange={(e) => setIntentAmount(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimum USDC: {minOutput}
              </label>
              <input
                type="range"
                min="1000"
                max="5000"
                step="50"
                value={minOutput}
                onChange={(e) => setMinOutput(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time Limit: {timeLimit}s
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <p className="text-sm text-slate-700">
              <strong>Intent:</strong> "Trade {intentAmount} ETH for at least {minOutput} USDC within {timeLimit} seconds"
            </p>
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Submit Intent
          </button>
        </div>
      )}

      {currentStep === 1 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 w-full max-w-2xl">
          <h4 className="text-xl font-semibold mb-4 text-slate-800">Solvers Competing</h4>
          <p className="text-slate-600 mb-6">Multiple solvers analyze your intent and propose solutions:</p>
          
          <div className="space-y-4">
            {solvers.map((solver) => (
              <div
                key={solver.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedSolver?.id === solver.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedSolver(solver)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-slate-800">{solver.name}</h5>
                    <p className="text-sm text-slate-600">Route: {solver.route}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{solver.output} USDC</p>
                    <p className="text-sm text-slate-600">Fee: {solver.fee} USDC</p>
                    <p className="text-sm text-slate-600">Est: {solver.time}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedSolver && (
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Select {selectedSolver.name}
            </button>
          )}
        </div>
      )}

      {currentStep === 2 && selectedSolver && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 w-full max-w-md">
          <h4 className="text-xl font-semibold mb-4 text-slate-800">Best Solution Found</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Solver:</span>
              <span className="font-semibold">{selectedSolver.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">You'll receive:</span>
              <span className="font-semibold text-emerald-600">{selectedSolver.output} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Fee:</span>
              <span className="font-semibold">{selectedSolver.fee} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Net amount:</span>
              <span className="font-semibold text-blue-600">{selectedSolver.output - selectedSolver.fee} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Execution time:</span>
              <span className="font-semibold">~{selectedSolver.time}s</span>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={`w-full mt-6 font-medium py-3 rounded-lg transition-all ${
              isExecuting
                ? 'bg-amber-500 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isExecuting ? 'Executing...' : 'Execute Trade'}
          </button>

          {isExecuting && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <span className="ml-2 text-amber-600">Processing transaction...</span>
            </div>
          )}
        </div>
      )}

      {currentStep === 3 && selectedSolver && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 w-full max-w-md">
          <h4 className="text-xl font-semibold mb-4 text-slate-800">Trade Completed!</h4>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <p className="text-lg font-semibold text-emerald-600 mb-2">
              Successfully received {selectedSolver.output - selectedSolver.fee} USDC
            </p>
            <p className="text-slate-600 mb-6">
              Your intent was fulfilled optimally without you needing to specify the exact route or handle complex DeFi interactions.
            </p>
          </div>

          <button
            onClick={resetDemo}
            className="w-full bg-slate-500 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Try Another Intent
          </button>
        </div>
      )}
    </div>
  );
}