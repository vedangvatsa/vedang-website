"use client";

import { useState, useEffect } from 'react';

export function SequencerVisualizer() {
  const [transactions, setTransactions] = useState([]);
  const [batchedTxs, setBatchedTxs] = useState([]);
  const [isSequencerActive, setIsSequencerActive] = useState(false);
  const [sequencerType, setSequencerType] = useState('centralized');
  const [nextTxId, setNextTxId] = useState(1);
  const [l1Blocks, setL1Blocks] = useState([]);
  const [animatingTx, setAnimatingTx] = useState(null);

  const txTypes = ['Transfer', 'Swap', 'Mint', 'Bridge'];
  const colors = ['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];

  useEffect(() => {
    let interval;
    if (isSequencerActive && transactions.length > 0) {
      interval = setInterval(() => {
        setTransactions(prev => {
          if (prev.length === 0) return prev;
          const txToProcess = prev[0];
          setAnimatingTx(txToProcess.id);
          
          setTimeout(() => {
            setBatchedTxs(prevBatch => {
              const newBatch = [...prevBatch, txToProcess];
              if (newBatch.length >= 3) {
                setL1Blocks(prevBlocks => [
                  ...prevBlocks,
                  { id: Date.now(), txs: newBatch, timestamp: Date.now() }
                ]);
                return [];
              }
              return newBatch;
            });
            setAnimatingTx(null);
          }, 1000);

          return prev.slice(1);
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSequencerActive, transactions.length]);

  const addTransaction = () => {
    const txType = txTypes[Math.floor(Math.random() * txTypes.length)];
    const color = colors[txTypes.indexOf(txType)];
    const newTx = {
      id: nextTxId,
      type: txType,
      color,
      fee: Math.random() * 0.01 + 0.001,
      priority: sequencerType === 'centralized' ? Math.random() : Math.random() * 0.01 + 0.001
    };
    
    setTransactions(prev => {
      const updated = [...prev, newTx];
      if (sequencerType === 'centralized') {
        return updated.sort((a, b) => b.priority - a.priority);
      } else {
        return updated.sort((a, b) => b.fee - a.fee);
      }
    });
    setNextTxId(prev => prev + 1);
  };

  const toggleSequencer = () => {
    setIsSequencerActive(!isSequencerActive);
  };

  const resetVisualization = () => {
    setTransactions([]);
    setBatchedTxs([]);
    setL1Blocks([]);
    setIsSequencerActive(false);
    setNextTxId(1);
    setAnimatingTx(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Rollup Sequencer</h3>
        <p className="text-slate-600">
          Watch how sequencers order and batch transactions before posting to Layer 1
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSequencerType('centralized')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sequencerType === 'centralized'
              ? 'bg-rose-500 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Centralized Sequencer
        </button>
        <button
          onClick={() => setSequencerType('decentralized')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sequencerType === 'decentralized'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Decentralized Sequencer
        </button>
      </div>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Transaction Pool */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4">Transaction Pool</h4>
            <div className="space-y-2 min-h-[200px]">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className={`${tx.color} ${animatingTx === tx.id ? 'animate-pulse scale-105' : ''} 
                    text-white p-3 rounded-lg shadow transition-all duration-500`}
                >
                  <div className="text-sm font-medium">{tx.type} #{tx.id}</div>
                  <div className="text-xs opacity-90">
                    Fee: {tx.fee.toFixed(4)} ETH
                    {sequencerType === 'centralized' && (
                      <span className="ml-2">Priority: {tx.priority.toFixed(3)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={addTransaction}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>

          {/* Sequencer */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4">
              {sequencerType === 'centralized' ? 'Centralized' : 'Decentralized'} Sequencer
            </h4>
            <div className={`p-4 rounded-lg mb-4 ${isSequencerActive ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              <div className={`w-8 h-8 rounded-full mx-auto ${isSequencerActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <div className="text-center text-sm mt-2">
                {isSequencerActive ? 'Processing' : 'Inactive'}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-slate-700 mb-2">Current Batch</h5>
              <div className="space-y-2 min-h-[100px]">
                {batchedTxs.map(tx => (
                  <div
                    key={tx.id}
                    className={`${tx.color} text-white p-2 rounded text-sm`}
                  >
                    {tx.type} #{tx.id}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {batchedTxs.length}/3 transactions batched
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={toggleSequencer}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isSequencerActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isSequencerActive ? 'Stop Sequencer' : 'Start Sequencer'}
              </button>
              <button
                onClick={resetVisualization}
                className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xs text-amber-800">
                <strong>{sequencerType === 'centralized' ? 'Centralized' : 'Decentralized'}:</strong>
                <br />
                {sequencerType === 'centralized' 
                  ? 'Orders by arbitrary priority (MEV risk, censorship possible)'
                  : 'Orders by fee amount (fair ordering, censorship resistant)'
                }
              </div>
            </div>
          </div>

          {/* Layer 1 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4">Layer 1 (Ethereum)</h4>
            <div className="space-y-3 min-h-[300px] overflow-y-auto">
              {l1Blocks.slice(-5).map(block => (
                <div
                  key={block.id}
                  className="bg-blue-100 border border-blue-200 rounded-lg p-3"
                >
                  <div className="text-sm font-medium text-blue-800 mb-2">
                    Block #{l1Blocks.indexOf(block) + 1}
                  </div>
                  <div className="space-y-1">
                    {block.txs.map(tx => (
                      <div
                        key={tx.id}
                        className="text-xs bg-white px-2 py-1 rounded border"
                      >
                        {tx.type} #{tx.id}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    {block.txs.length} transactions finalized
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-slate-500">
              Total L1 blocks: {l1Blocks.length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-4xl">
        <h5 className="font-bold text-blue-800 mb-2">How It Works</h5>
        <div className="text-sm text-blue-700 space-y-2">
          <p>1. Users submit transactions to the rollup's transaction pool</p>
          <p>2. The sequencer orders and batches transactions (3 per batch in this demo)</p>
          <p>3. Completed batches are posted to Layer 1 for finalization</p>
          <p><strong>Key Difference:</strong> Centralized sequencers can manipulate order for MEV or censorship, while decentralized sequencers use transparent fee-based ordering</p>
        </div>
      </div>
    </div>
  );
}