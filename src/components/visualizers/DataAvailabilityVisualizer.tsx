"use client";

import React, { useState, useEffect } from 'react';

export function DataAvailabilityVisualizer() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [verificationStep, setVerificationStep] = useState(0);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [samplingNodes, setSamplingNodes] = useState<Set<number>>(new Set());
  const [fraudDetected, setFraudDetected] = useState(false);
  const [animating, setAnimating] = useState(false);

  const nodes = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    hasData: dataAvailable || Math.random() > 0.3,
    x: (i % 4) * 80 + 40,
    y: Math.floor(i / 4) * 80 + 40
  }));

  const rollupData = [
    { id: 1, type: 'transfer', from: 'Alice', to: 'Bob', amount: 10 },
    { id: 2, type: 'swap', token: 'ETH→USDC', amount: 1.5 },
    { id: 3, type: 'transfer', from: 'Bob', to: 'Charlie', amount: 5 }
  ];

  useEffect(() => {
    if (animating) {
      const interval = setInterval(() => {
        setSamplingNodes(prev => {
          const newSet = new Set(prev);
          const availableNodes = nodes.filter(n => n.hasData && !newSet.has(n.id));
          if (availableNodes.length > 0) {
            const randomNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
            newSet.add(randomNode.id);
          }
          return newSet;
        });
      }, 500);

      const timeout = setTimeout(() => {
        setAnimating(false);
        setVerificationStep(2);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [animating]);

  const startVerification = () => {
    setVerificationStep(1);
    setSamplingNodes(new Set());
    setFraudDetected(false);
    setAnimating(true);
  };

  const toggleDataAvailability = () => {
    setDataAvailable(!dataAvailable);
    setVerificationStep(0);
    setSamplingNodes(new Set());
    setSelectedNode(null);
  };

  const checkFraud = () => {
    const sampledCount = samplingNodes.size;
    const availableData = nodes.filter(n => n.hasData).length;
    const dataIntegrity = availableData / nodes.length;
    
    if (dataIntegrity < 0.5) {
      setFraudDetected(true);
    }
    setVerificationStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Data Availability Challenge</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive simulation showing how rollups ensure transaction data is available for verification without requiring full downloads.
        </p>
      </div>

      <div className="flex gap-8 w-full max-w-4xl">
        {/* Rollup Data Panel */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Rollup Transactions</h4>
          <div className="space-y-3">
            {rollupData.map((tx) => (
              <div key={tx.id} className={`p-3 rounded-lg border-2 transition-all ${
                verificationStep > 0 ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="text-sm font-medium text-slate-700">{tx.type}</div>
                <div className="text-xs text-slate-500">
                  {tx.type === 'transfer' ? `${tx.from} → ${tx.to}: ${tx.amount} ETH` : 
                   tx.type === 'swap' ? `${tx.token}: ${tx.amount} ETH` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Visualization */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Network Nodes</h4>
          <div className="relative w-full h-80 border border-slate-200 rounded-lg bg-slate-50">
            <svg className="w-full h-full">
              {/* Connection lines */}
              {nodes.map((node, i) => 
                nodes.slice(i + 1).map((otherNode, j) => {
                  const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
                  );
                  if (distance < 120) {
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={node.x}
                        y1={node.y}
                        x2={otherNode.x}
                        y2={otherNode.y}
                        stroke={samplingNodes.has(node.id) && samplingNodes.has(otherNode.id) ? 
                               "#3b82f6" : "#e2e8f0"}
                        strokeWidth="1"
                        className="transition-all duration-300"
                      />
                    );
                  }
                  return null;
                })
              )}
              
              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    className={`cursor-pointer transition-all duration-300 ${
                      samplingNodes.has(node.id) ? 'fill-blue-500' :
                      node.hasData ? 'fill-emerald-500 hover:fill-emerald-600' : 'fill-rose-500'
                    }`}
                    onClick={() => setSelectedNode(node.id)}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium pointer-events-none"
                  >
                    {node.id}
                  </text>
                  {samplingNodes.has(node.id) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Data Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
              <span>Data Missing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Sampling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleDataAvailability}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              dataAvailable ? 
              'bg-emerald-500 hover:bg-emerald-600 text-white' : 
              'bg-rose-500 hover:bg-rose-600 text-white'
            }`}
          >
            {dataAvailable ? 'Simulate Data Withholding' : 'Restore Data Availability'}
          </button>
          
          <button
            onClick={startVerification}
            disabled={animating}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
          >
            {animating ? 'Sampling...' : 'Start DA Sampling'}
          </button>
          
          {verificationStep === 2 && (
            <button
              onClick={checkFraud}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
              Check Integrity
            </button>
          )}
        </div>

        {/* Status */}
        {verificationStep > 0 && (
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-slate-700">Verification Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                verificationStep === 3 ? 
                  (fraudDetected ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800') :
                  'bg-blue-100 text-blue-800'
              }`}>
                {verificationStep === 1 ? 'Sampling Network' :
                 verificationStep === 2 ? 'Sample Complete' :
                 fraudDetected ? 'Data Integrity Failed' : 'Verification Passed'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Nodes Sampled:</span>
                <div className="font-medium">{samplingNodes.size}/16</div>
              </div>
              <div>
                <span className="text-slate-500">Data Coverage:</span>
                <div className="font-medium">
                  {Math.round((nodes.filter(n => n.hasData).length / nodes.length) * 100)}%
                </div>
              </div>
              <div>
                <span className="text-slate-500">Efficiency:</span>
                <div className="font-medium">
                  {samplingNodes.size > 0 ? 
                   Math.round((samplingNodes.size / nodes.length) * 100) : 0}% downloaded
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}