"use client";

import { useState } from 'react';

export function DepinVisualizer() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0);
  const [networkCoverage, setNetworkCoverage] = useState(0);

  const nodes = [
    { id: 1, x: 20, y: 30, owner: "Alice", status: "active", rewards: 125 },
    { id: 2, x: 40, y: 20, owner: "Bob", status: "active", rewards: 98 },
    { id: 3, x: 65, y: 45, owner: "Carol", status: "offline", rewards: 0 },
    { id: 4, x: 80, y: 25, owner: "Dave", status: "active", rewards: 156 },
    { id: 5, x: 35, y: 60, owner: "Eve", status: "active", rewards: 89 },
    { id: 6, x: 70, y: 70, owner: "Frank", status: "active", rewards: 134 }
  ];

  const handleNodeClick = (nodeId: number) => {
    setSelectedNode(nodeId);
  };

  const handleSimulateRewards = () => {
    setIsAnimating(true);
    setTotalRewards(0);
    setNetworkCoverage(0);

    const activeNodes = nodes.filter(n => n.status === "active");
    let currentReward = 0;
    let currentCoverage = 0;

    const interval = setInterval(() => {
      currentReward += Math.floor(Math.random() * 20) + 10;
      currentCoverage = Math.min(currentCoverage + 15, 85);
      
      setTotalRewards(currentReward);
      setNetworkCoverage(currentCoverage);

      if (currentCoverage >= 85) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 300);
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DePIN: Decentralized Physical Infrastructure Networks</h3>
        <p className="text-slate-600 max-w-2xl">
          Click on infrastructure nodes to see how individuals deploy hardware and earn tokens for providing network coverage
        </p>
      </div>

      <div className="flex gap-8 w-full max-w-4xl">
        <div className="flex-1">
          <div className="relative bg-white rounded-xl p-6 border border-slate-200 h-80">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Network Map</h4>
            
            {/* Coverage area visualization */}
            <div className="absolute inset-6 top-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg opacity-50"></div>
            
            {/* Network nodes */}
            {nodes.map(node => (
              <div key={node.id} className="absolute">
                <div 
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-125 ${
                    node.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                  } ${selectedNode === node.id ? 'ring-4 ring-blue-300 scale-125' : ''} ${
                    isAnimating && node.status === 'active' ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    left: `${node.x}%`, 
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleNodeClick(node.id)}
                />
                
                {/* Coverage radius */}
                {node.status === 'active' && (
                  <div 
                    className={`absolute border-2 border-blue-300 rounded-full opacity-30 ${
                      isAnimating ? 'animate-ping' : ''
                    }`}
                    style={{ 
                      left: `${node.x}%`, 
                      top: `${node.y}%`,
                      width: '60px',
                      height: '60px',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600">Active Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <span className="text-slate-600">Offline Node</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 space-y-4">
          {/* Node details */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Node Details</h4>
            {selectedNodeData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Owner:</span>
                  <span className="font-medium">{selectedNodeData.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    selectedNodeData.status === 'active' ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {selectedNodeData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tokens Earned:</span>
                  <span className="font-medium text-blue-600">{selectedNodeData.rewards}</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {selectedNodeData.status === 'active' 
                      ? `${selectedNodeData.owner} provides network coverage and earns tokens automatically`
                      : `${selectedNodeData.owner}'s node is offline - no rewards earned`
                    }
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Click a node to view details</p>
            )}
          </div>

          {/* Network metrics */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Network Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Coverage</span>
                  <span className="font-medium">{networkCoverage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${networkCoverage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Rewards</span>
                  <span className="font-medium text-blue-600">{totalRewards} tokens</span>
                </div>
              </div>

              <button
                onClick={handleSimulateRewards}
                disabled={isAnimating}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isAnimating 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAnimating ? 'Simulating...' : 'Simulate Network Activity'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-3xl">
        <p className="text-slate-600">
          In DePIN, individuals invest in physical hardware (hotspots, sensors, etc.) and are rewarded with tokens for providing real-world infrastructure services. This creates decentralized networks without traditional corporate ownership.
        </p>
      </div>
    </div>
  );
}