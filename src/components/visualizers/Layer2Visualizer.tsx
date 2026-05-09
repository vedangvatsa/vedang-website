"use client";

import React, { useState, useEffect } from 'react';

export function Layer2Visualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [layer1Txs, setLayer1Txs] = useState<number[]>([]);
  const [layer2Txs, setLayer2Txs] = useState<number[]>([]);
  const [batchedTxs, setBatchedTxs] = useState<number[][]>([]);
  const [currentBatch, setCurrentBatch] = useState<number[]>([]);
  const [batchSize, setBatchSize] = useState(5);
  const [speed, setSpeed] = useState(1000);
  const [layer1Count, setLayer1Count] = useState(0);
  const [layer2Count, setLayer2Count] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTotalTime(prev => prev + speed);
      
      // Layer 1: ~15 TPS (1 tx per interval at 1000ms = 1 TPS, so we'll add 1 every few intervals)
      if (Math.random() < 0.15) {
        const newTx = Date.now() + Math.random();
        setLayer1Txs(prev => [...prev.slice(-10), newTx]);
        setLayer1Count(prev => prev + 1);
      }

      // Layer 2: Much higher TPS
      if (Math.random() < 0.8) {
        const newTx = Date.now() + Math.random();
        setLayer2Txs(prev => [...prev.slice(-20), newTx]);
        setLayer2Count(prev => prev + 1);
        setCurrentBatch(prev => {
          const updated = [...prev, newTx];
          if (updated.length >= batchSize) {
            setBatchedTxs(batches => [...batches.slice(-5), updated]);
            return [];
          }
          return updated;
        });
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, batchSize, speed]);

  const reset = () => {
    setIsRunning(false);
    setLayer1Txs([]);
    setLayer2Txs([]);
    setBatchedTxs([]);
    setCurrentBatch([]);
    setLayer1Count(0);
    setLayer2Count(0);
    setTotalTime(0);
  };

  const layer1TPS = totalTime > 0 ? (layer1Count / (totalTime / 1000)).toFixed(1) : '0';
  const layer2TPS = totalTime > 0 ? (layer2Count / (totalTime / 1000)).toFixed(1) : '0';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Layer 2 Scaling Solutions</h3>
        <p className="text-slate-600">Interactive visualization of how Layer 2 improves blockchain scalability through batching</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 min-w-64">
          <h4 className="font-semibold text-slate-800">Simulation Controls</h4>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Batch Size: {batchSize}</label>
            <input
              type="range"
              min="3"
              max="10"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Speed: {speed}ms</label>
            <input
              type="range"
              min="200"
              max="2000"
              step="200"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isRunning 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg font-medium bg-slate-500 hover:bg-slate-600 text-white"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Layer 1 TPS:</span>
                <span className="font-mono text-blue-600">{layer1TPS}</span>
              </div>
              <div className="flex justify-between">
                <span>Layer 2 TPS:</span>
                <span className="font-mono text-indigo-600">{layer2TPS}</span>
              </div>
              <div className="flex justify-between">
                <span>Improvement:</span>
                <span className="font-mono text-emerald-600">
                  {layer1TPS !== '0' ? `${(parseFloat(layer2TPS) / parseFloat(layer1TPS)).toFixed(1)}x` : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="flex-1 space-y-6">
          {/* Layer 1 */}
          <div className="bg-white p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-blue-800">Layer 1 (Ethereum)</h4>
              <div className="text-sm text-blue-600">
                {layer1Count} transactions • ~15 TPS limit
              </div>
            </div>
            <div className="flex flex-wrap gap-2 min-h-12">
              {layer1Txs.map((tx, i) => (
                <div
                  key={tx}
                  className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white text-xs animate-pulse"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2 Processing */}
          <div className="bg-white p-6 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-indigo-800">Layer 2 Processing</h4>
              <div className="text-sm text-indigo-600">
                {layer2Count} transactions • High TPS
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-2">Current Batch ({currentBatch.length}/{batchSize})</div>
                <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200">
                  {currentBatch.map((tx, i) => (
                    <div
                      key={tx}
                      className="w-6 h-6 bg-indigo-400 rounded-sm flex items-center justify-center text-white text-xs"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-600 mb-2">Ready Batches</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {batchedTxs.map((batch, batchIndex) => (
                    <div
                      key={batchIndex}
                      className="flex gap-1 p-2 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <div className="text-xs text-emerald-600 mr-2 font-medium">
                        Batch {batchIndex + 1}:
                      </div>
                      {batch.slice(0, 8).map((tx, i) => (
                        <div
                          key={tx}
                          className="w-4 h-4 bg-emerald-500 rounded-sm"
                        />
                      ))}
                      {batch.length > 8 && (
                        <div className="text-xs text-emerald-600 ml-1">
                          +{batch.length - 8}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Arrow and Explanation */}
          <div className="flex items-center gap-4 px-4">
            <div className="flex-1 h-1 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full"></div>
            <div className="text-sm text-slate-600 bg-white px-3 py-1 rounded-full border">
              Batches submitted to Layer 1 for security
            </div>
            <div className="w-0 h-0 border-l-8 border-l-blue-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-4xl text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
        <strong>How it works:</strong> Layer 2 processes transactions quickly off-chain, batches them together, 
        then submits the entire batch to Layer 1 for security. This dramatically increases throughput while 
        maintaining the security guarantees of the main blockchain.
      </div>
    </div>
  );
}