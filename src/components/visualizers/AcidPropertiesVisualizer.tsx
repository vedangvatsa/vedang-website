"use client";

import { useState } from 'react';

export function AcidPropertiesVisualizer() {
  const [activeProperty, setActiveProperty] = useState<'atomicity' | 'consistency' | 'isolation' | 'durability'>('atomicity');
  const [simulationStep, setSimulationStep] = useState(0);
  const [accountA, setAccountA] = useState(1000);
  const [accountB, setAccountB] = useState(500);
  const [transferAmount, setTransferAmount] = useState(200);
  const [isRunning, setIsRunning] = useState(false);
  const [failureMode, setFailureMode] = useState(false);

  const properties = {
    atomicity: {
      title: 'Atomicity',
      description: 'All or nothing - transactions complete entirely or not at all',
      color: 'blue'
    },
    consistency: {
      title: 'Consistency',
      description: 'Database remains in valid state before and after transaction',
      color: 'emerald'
    },
    isolation: {
      title: 'Isolation',
      description: 'Concurrent transactions don\'t interfere with each other',
      color: 'indigo'
    },
    durability: {
      title: 'Durability',
      description: 'Committed changes persist even after system failures',
      color: 'rose'
    }
  };

  const runSimulation = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setSimulationStep(1);
    
    const steps = [
      () => setSimulationStep(2), // Start transaction
      () => {
        if (activeProperty === 'atomicity' && failureMode) {
          setSimulationStep(5); // Simulate failure
        } else {
          setAccountA(prev => prev - transferAmount);
          setSimulationStep(3);
        }
      },
      () => {
        if (activeProperty === 'atomicity' && failureMode) {
          // Rollback
          setAccountA(1000);
          setSimulationStep(6);
        } else {
          setAccountB(prev => prev + transferAmount);
          setSimulationStep(4);
        }
      },
      () => {
        setSimulationStep(0);
        setIsRunning(false);
      }
    ];

    steps.forEach((step, index) => {
      setTimeout(step, (index + 1) * 1000);
    });
  };

  const resetSimulation = () => {
    setAccountA(1000);
    setAccountB(500);
    setSimulationStep(0);
    setIsRunning(false);
  };

  const getStepDescription = () => {
    const steps: Record<number, string> = {
      0: 'Ready to start transaction',
      1: 'Transaction initiated',
      2: 'Deducting from Account A',
      3: 'Adding to Account B',
      4: 'Transaction committed successfully',
      5: 'System failure detected!',
      6: 'Transaction rolled back completely'
    };
    return steps[simulationStep] || '';
  };

  const getCurrentColor = () => properties[activeProperty].color;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">ACID Properties Database Simulator</h3>
        <p className="text-slate-600">Interactive demonstration of database transaction guarantees</p>
      </div>

      {/* Property Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {Object.entries(properties).map(([key, prop]) => (
          <button
            key={key}
            onClick={() => {
              setActiveProperty(key as 'atomicity' | 'consistency' | 'isolation' | 'durability');
              resetSimulation();
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              activeProperty === key
                ? `bg-${prop.color}-100 border-${prop.color}-500 text-${prop.color}-700`
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-lg">{prop.title}</div>
            <div className="text-sm mt-1">{prop.description}</div>
          </button>
        ))}
      </div>

      {/* Active Property Details */}
      <div className={`w-full max-w-4xl bg-${getCurrentColor()}-50 border border-${getCurrentColor()}-200 rounded-xl p-6`}>
        <h4 className={`text-xl font-bold text-${getCurrentColor()}-700 mb-4`}>
          {properties[activeProperty].title} Demonstration
        </h4>

        {/* Bank Transfer Simulation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Account A */}
          <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Account A</div>
              <div className={`text-2xl font-bold ${simulationStep === 2 ? `text-${getCurrentColor()}-600 animate-pulse` : 'text-slate-800'}`}>
                ${accountA}
              </div>
            </div>
          </div>

          {/* Transaction Flow */}
          <div className="flex flex-col items-center gap-4">
            <div className={`bg-${getCurrentColor()}-100 rounded-lg p-4 text-center border-2 border-${getCurrentColor()}-300`}>
              <div className="text-sm text-slate-600 mb-2">Transfer Amount</div>
              <input
                type="range"
                min="50"
                max="500"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                disabled={isRunning}
                className="w-full mb-2"
              />
              <div className="font-bold text-lg">${transferAmount}</div>
            </div>
            
            <div className="text-center">
              <div className={`text-sm ${simulationStep > 0 ? `text-${getCurrentColor()}-600 font-semibold` : 'text-slate-500'}`}>
                {getStepDescription()}
              </div>
            </div>

            {/* Arrow */}
            <div className={`text-3xl ${isRunning ? `text-${getCurrentColor()}-500 animate-bounce` : 'text-slate-300'}`}>
              →
            </div>
          </div>

          {/* Account B */}
          <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Account B</div>
              <div className={`text-2xl font-bold ${simulationStep === 3 ? `text-${getCurrentColor()}-600 animate-pulse` : 'text-slate-800'}`}>
                ${accountB}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center justify-center">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`px-6 py-3 bg-${getCurrentColor()}-500 text-white rounded-lg font-semibold hover:bg-${getCurrentColor()}-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {isRunning ? 'Running...' : 'Start Transaction'}
          </button>
          
          <button
            onClick={resetSimulation}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all"
          >
            Reset
          </button>

          {activeProperty === 'atomicity' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={failureMode}
                onChange={(e) => setFailureMode(e.target.checked)}
                disabled={isRunning}
                className="rounded"
              />
              <span className="text-sm text-slate-600">Simulate Failure</span>
            </label>
          )}
        </div>

        {/* Property-specific Info */}
        <div className={`mt-6 p-4 bg-${getCurrentColor()}-100 rounded-lg border border-${getCurrentColor()}-200`}>
          <div className={`text-${getCurrentColor()}-700 text-sm`}>
            {activeProperty === 'atomicity' && 'Watch how the transaction either completes fully or rolls back completely when failure mode is enabled.'}
            {activeProperty === 'consistency' && 'The total money (Account A + Account B) remains constant throughout the transaction.'}
            {activeProperty === 'isolation' && 'Each transaction runs independently without interference from other concurrent operations.'}
            {activeProperty === 'durability' && 'Once committed, the transaction results persist even if the system crashes immediately after.'}
          </div>
          
          {activeProperty === 'consistency' && (
            <div className={`mt-2 text-${getCurrentColor()}-600 font-semibold`}>
              Total Balance: ${accountA + accountB} (Should always equal $1,500)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}