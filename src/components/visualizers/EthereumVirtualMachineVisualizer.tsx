"use client";
import React, { useState, useEffect } from 'react';

interface Contract {
  id: string;
  name: string;
  bytecode: string[];
  gasCost: number;
  description: string;
}

interface EvmState {
  stack: string[];
  memory: Record<string, string>;
  storage: Record<string, string>;
  pc: number;
}

export function EthereumVirtualMachineVisualizer() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [gasUsed, setGasUsed] = useState(0);
  const [step, setStep] = useState(0);
  const [evmState, setEvmState] = useState<EvmState>({
    stack: [],
    memory: {},
    storage: {},
    pc: 0
  });

  const contracts = [
    {
      id: 'token',
      name: 'ERC-20 Token',
      bytecode: ['PUSH1 0x20', 'PUSH1 0x40', 'MSTORE', 'SLOAD', 'ADD', 'SSTORE'],
      gasCost: 21000,
      description: 'Transfer tokens between accounts'
    },
    {
      id: 'voting',
      name: 'Voting Contract',
      bytecode: ['PUSH1 0x01', 'CALLER', 'SLOAD', 'ADD', 'SSTORE', 'PUSH1 0x00'],
      gasCost: 45000,
      description: 'Record a vote on the blockchain'
    },
    {
      id: 'auction',
      name: 'Auction Contract',
      bytecode: ['CALLVALUE', 'SLOAD', 'GT', 'JUMPI', 'CALLER', 'SSTORE'],
      gasCost: 67000,
      description: 'Place a bid in an auction'
    }
  ];

  useEffect(() => {
    if (isExecuting && selectedContract) {
      const timer = setInterval(() => {
        setStep(prev => {
          const newStep = prev + 1;
          const bytecode = selectedContract.bytecode;
          
          if (newStep <= bytecode.length) {
            const instruction = bytecode[newStep - 1];
            setGasUsed(prev => prev + Math.floor(Math.random() * 100) + 50);
            
            // Simulate EVM state changes
            setEvmState(prevState => {
              const newState = { ...prevState };
              newState.pc = newStep - 1;
              
              if (instruction.includes('PUSH')) {
                newState.stack = [...prevState.stack, `0x${Math.floor(Math.random() * 256).toString(16)}`];
              } else if (instruction.includes('STORE')) {
                newState.storage[`slot_${newStep}`] = `0x${Math.floor(Math.random() * 1000).toString(16)}`;
              } else if (instruction.includes('LOAD')) {
                newState.memory[`addr_${newStep}`] = `0x${Math.floor(Math.random() * 1000).toString(16)}`;
              }
              
              return newState;
            });
            
            return newStep;
          } else {
            setIsExecuting(false);
            return newStep;
          }
        });
      }, 800);

      return () => clearInterval(timer);
    }
  }, [isExecuting, selectedContract]);

  const executeContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsExecuting(true);
    setGasUsed(21000); // Base transaction cost
    setStep(0);
    setEvmState({ stack: [], memory: {}, storage: {}, pc: 0 });
  };

  const resetExecution = () => {
    setIsExecuting(false);
    setStep(0);
    setGasUsed(0);
    setEvmState({ stack: [], memory: {}, storage: {}, pc: 0 });
    setSelectedContract(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Ethereum Virtual Machine (EVM)</h3>
        <p className="text-slate-600 text-lg">Interactive demonstration of how smart contracts execute on the EVM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Contract Selection */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Smart Contracts</h4>
          <div className="space-y-3">
            {contracts.map(contract => (
              <button
                key={contract.id}
                onClick={() => executeContract(contract)}
                disabled={isExecuting}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedContract?.id === contract.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                } ${isExecuting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-medium text-slate-800">{contract.name}</div>
                <div className="text-sm text-slate-600">{contract.description}</div>
                <div className="text-xs text-emerald-600 mt-1">Gas Estimate: {contract.gasCost.toLocaleString()}</div>
              </button>
            ))}
          </div>
          
          {selectedContract && (
            <button
              onClick={resetExecution}
              className="w-full mt-4 p-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Reset Execution
            </button>
          )}
        </div>

        {/* EVM State Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">EVM State</h4>
          
          {/* Gas Meter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Gas Used</span>
              <span className="text-sm text-emerald-600">{gasUsed.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((gasUsed / 100000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {selectedContract && (
            <>
              {/* Bytecode Execution */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-slate-700 mb-2">Bytecode Execution</h5>
                <div className="space-y-1">
                  {selectedContract.bytecode.map((instruction, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm font-mono ${
                        index < step
                          ? 'bg-emerald-100 text-emerald-800'
                          : index === step && isExecuting
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="text-xs text-slate-500 mr-2">{index}:</span>
                      {instruction}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-700 mb-2">Stack ({evmState.stack.length}/1024)</h5>
                <div className="bg-slate-50 p-3 rounded border min-h-16">
                  {evmState.stack.length === 0 ? (
                    <span className="text-slate-400 text-sm">Empty</span>
                  ) : (
                    <div className="space-y-1">
                      {evmState.stack.slice(-5).reverse().map((item, index) => (
                        <div key={index} className="text-xs font-mono bg-blue-100 text-blue-800 p-1 rounded">
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Storage */}
              <div>
                <h5 className="text-sm font-semibold text-slate-700 mb-2">Storage</h5>
                <div className="bg-slate-50 p-3 rounded border min-h-16">
                  {Object.keys(evmState.storage).length === 0 ? (
                    <span className="text-slate-400 text-sm">Empty</span>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(evmState.storage).map(([key, value]) => (
                        <div key={key} className="text-xs font-mono">
                          <span className="text-indigo-600">{key}:</span> 
                          <span className="text-indigo-800 ml-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {!selectedContract && (
            <div className="text-center py-8 text-slate-400">
              Select a smart contract to see EVM execution
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {isExecuting && (
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            <span className="text-sm font-medium">Executing on EVM...</span>
          </div>
        )}
        {selectedContract && !isExecuting && step > 0 && (
          <div className="text-emerald-600">
            <span className="text-sm font-medium">✅ Execution Complete</span>
          </div>
        )}
      </div>
    </div>
  );
}