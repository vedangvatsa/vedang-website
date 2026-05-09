"use client";

import { useState } from 'react';

export function ComposabilityVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);

  const protocols = [
    { id: 'aave', name: 'Aave', color: 'bg-blue-500', function: 'Lending' },
    { id: 'uniswap', name: 'Uniswap', color: 'bg-rose-500', function: 'DEX' },
    { id: 'curve', name: 'Curve', color: 'bg-emerald-500', function: 'Liquidity' },
    { id: 'compound', name: 'Compound', color: 'bg-amber-500', function: 'Yield' }
  ];

  const transactionSteps = [
    { protocol: 'aave', action: 'Borrow 1000 USDC', status: 'pending' },
    { protocol: 'uniswap', action: 'Swap USDC → ETH', status: 'pending' },
    { protocol: 'curve', action: 'Provide ETH liquidity', status: 'pending' },
    { protocol: 'compound', action: 'Stake LP tokens', status: 'pending' }
  ];

  const executeTransaction = async () => {
    if (selectedProtocols.length === 0) return;
    
    setIsAnimating(true);
    setCurrentStep(0);

    for (let i = 0; i < selectedProtocols.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(i + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAnimating(false);
  };

  const resetTransaction = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setSelectedProtocols([]);
  };

  const toggleProtocol = (protocolId: string) => {
    if (isAnimating) return;
    
    setSelectedProtocols(prev => {
      if (prev.includes(protocolId)) {
        return prev.filter(id => id !== protocolId);
      } else {
        return [...prev, protocolId];
      }
    });
  };

  const getStepStatus = (stepIndex: number) => {
    if (!isAnimating) return 'idle';
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DeFi Composability</h3>
        <p className="text-slate-600">Click protocols to compose them into a single atomic transaction</p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => toggleProtocol(protocol.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${selectedProtocols.includes(protocol.id) 
                  ? `${protocol.color} text-white border-transparent shadow-lg scale-105` 
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }
                ${isAnimating ? 'cursor-not-allowed opacity-70' : ''}
              `}
            >
              <div className="text-center">
                <div className="font-semibold">{protocol.name}</div>
                <div className="text-sm opacity-80">{protocol.function}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-slate-300 p-6 mb-6">
          <h4 className="font-semibold text-slate-800 mb-4">Transaction Flow</h4>
          
          <div className="space-y-3">
            {selectedProtocols.map((protocolId, index) => {
              const protocol = protocols.find(p => p.id === protocolId);
              const step = transactionSteps[index];
              const status = getStepStatus(index);
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                    ${status === 'completed' ? 'bg-emerald-500 text-white border-emerald-500' :
                      status === 'active' ? 'bg-blue-500 text-white border-blue-500 animate-pulse' :
                      'bg-slate-100 text-slate-500 border-slate-300'}
                  `}>
                    {status === 'completed' ? '✓' : index + 1}
                  </div>
                  
                  <div className={`flex-1 p-3 rounded-lg ${protocol?.color} bg-opacity-10`}>
                    <div className="font-medium text-slate-800">{protocol?.name}</div>
                    <div className="text-sm text-slate-600">{step?.action}</div>
                  </div>
                  
                  {index < selectedProtocols.length - 1 && (
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={executeTransaction}
            disabled={selectedProtocols.length === 0 || isAnimating}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${selectedProtocols.length > 0 && !isAnimating
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {isAnimating ? 'Executing...' : 'Execute Atomic Transaction'}
          </button>
          
          <button
            onClick={resetTransaction}
            disabled={isAnimating}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Atomic Transaction:</strong> All steps execute together or none at all. 
            {selectedProtocols.length > 0 && (
              <span className="block mt-1">
                Current composition: {selectedProtocols.length} protocol{selectedProtocols.length !== 1 ? 's' : ''} linked
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}