"use client";

import { useState } from 'react';

export function KubernetesVisualizer() {
  const [desiredReplicas, setDesiredReplicas] = useState(3);
  const [currentReplicas, setCurrentReplicas] = useState(1);
  const [isScaling, setIsScaling] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const nodes = [
    { id: 1, name: 'Node 1', capacity: 4, used: 0 },
    { id: 2, name: 'Node 2', capacity: 3, used: 0 },
    { id: 3, name: 'Node 3', capacity: 5, used: 0 },
  ];

  const handleScale = () => {
    if (isScaling) return;
    setIsScaling(true);
    
    const interval = setInterval(() => {
      setCurrentReplicas(current => {
        if (current < desiredReplicas) {
          return current + 1;
        } else if (current > desiredReplicas) {
          return current - 1;
        } else {
          setIsScaling(false);
          clearInterval(interval);
          return current;
        }
      });
    }, 800);
  };

  const handleDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setCurrentReplicas(0);
    
    setTimeout(() => {
      setCurrentReplicas(desiredReplicas);
      setIsDeploying(false);
    }, 1500);
  };

  const getPodsForNode = (nodeId: number) => {
    const podsPerNode = Math.floor(currentReplicas / nodes.length);
    const extraPods = currentReplicas % nodes.length;
    return podsPerNode + (nodeId <= extraPods ? 1 : 0);
  };

  const renderPods = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`w-4 h-4 rounded border-2 transition-all duration-500 ${
          isDeploying || isScaling
            ? 'bg-amber-200 border-amber-400 animate-pulse'
            : 'bg-blue-200 border-blue-400'
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Kubernetes Container Orchestration</h3>
        <p className="text-slate-600 max-w-2xl">
          Interact with a Kubernetes cluster to see how it automatically distributes and manages containers across multiple nodes
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {/* Control Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 w-full">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Kubernetes Control Plane</h4>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Desired Replicas:</label>
              <input
                type="range"
                min="0"
                max="10"
                value={desiredReplicas}
                onChange={(e) => setDesiredReplicas(Number(e.target.value))}
                className="w-24"
                disabled={isScaling || isDeploying}
              />
              <span className="text-lg font-bold text-indigo-600 w-8">{desiredReplicas}</span>
            </div>
            
            <button
              onClick={handleScale}
              disabled={isScaling || isDeploying || currentReplicas === desiredReplicas}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isScaling || isDeploying || currentReplicas === desiredReplicas
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isScaling ? 'Scaling...' : 'Scale'}
            </button>
            
            <button
              onClick={handleDeploy}
              disabled={isScaling || isDeploying}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isScaling || isDeploying
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-slate-600">
            Current: <span className="font-bold text-slate-800">{currentReplicas}</span> pods running
          </div>
        </div>

        {/* Cluster Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 w-full">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Kubernetes Cluster</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map((node) => {
              const podCount = getPodsForNode(node.id);
              const isSelected = selectedNode === node.id;
              
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-slate-800">{node.name}</h5>
                    <span className="text-sm text-slate-600">
                      {podCount}/{node.capacity}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {renderPods(podCount)}
                    {Array.from({ length: node.capacity - podCount }, (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="w-4 h-4 rounded border border-slate-200 bg-slate-100"
                      />
                    ))}
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        podCount / node.capacity > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(podCount / node.capacity) * 100}%` }}
                    />
                  </div>
                  
                  {isSelected && (
                    <div className="mt-2 text-xs text-slate-600">
                      <div>CPU: {Math.round((podCount / node.capacity) * 100)}%</div>
                      <div>Memory: {Math.round((podCount / node.capacity) * 80 + 20)}%</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 w-full">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div>
              <span className="text-slate-700">Running Pod</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-200 border-2 border-amber-400 rounded"></div>
              <span className="text-slate-700">Pod Starting/Stopping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div>
              <span className="text-slate-700">Available Capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}