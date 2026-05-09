"use client";

import { useState, useEffect } from 'react';

export function ServerlessVisualizer() {
  const [requestsPerSecond, setRequestsPerSecond] = useState(10);
  const [isTraditional, setIsTraditional] = useState(true);
  const [animatingRequests, setAnimatingRequests] = useState<number[]>([]);
  const [executedFunctions, setExecutedFunctions] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const maxCapacity = 100;
  const traditionalCost = 0.10; // $0.10 per hour for always-on server
  const serverlessCostPerExecution = 0.0000002; // $0.0000002 per execution

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTraditional) {
        const newRequests = Array.from({ length: Math.min(requestsPerSecond, 50) }, (_, i) => Date.now() + i);
        setAnimatingRequests(newRequests);
        setExecutedFunctions(prev => prev + requestsPerSecond);
        setTotalCost(prev => prev + (requestsPerSecond * serverlessCostPerExecution));
        
        setTimeout(() => {
          setAnimatingRequests([]);
        }, 800);
      } else {
        setTotalCost(prev => prev + (traditionalCost / 3600)); // Per second cost
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [requestsPerSecond, isTraditional]);

  const resetStats = () => {
    setExecutedFunctions(0);
    setTotalCost(0);
    setAnimatingRequests([]);
  };

  const utilizationPercentage = Math.min((requestsPerSecond / maxCapacity) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Serverless vs Traditional Architecture</h3>
        <p className="text-slate-600">Compare auto-scaling serverless functions with always-on traditional servers</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Traffic Load: {requestsPerSecond} requests/second
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={requestsPerSecond}
              onChange={(e) => setRequestsPerSecond(parseInt(e.target.value))}
              className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsTraditional(!isTraditional);
                resetStats();
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isTraditional 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isTraditional ? 'Traditional Server' : 'Serverless Functions'}
            </button>
            <button
              onClick={resetStats}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Architecture Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Architecture */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">
              {isTraditional ? 'Traditional Server' : 'Serverless Functions'}
            </h4>
            
            {isTraditional ? (
              <div className="space-y-4">
                <div className="bg-rose-100 border-2 border-rose-300 rounded-lg p-4">
                  <div className="text-rose-800 font-medium mb-2">Always-On Server</div>
                  <div className="bg-rose-200 rounded h-8 relative overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${utilizationPercentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-rose-800">
                      {utilizationPercentage.toFixed(1)}% utilized
                    </div>
                  </div>
                  <div className="text-sm text-rose-600 mt-2">
                    Fixed capacity: {maxCapacity} req/sec
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-emerald-800 font-medium">Auto-Scaling Functions</div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: Math.min(Math.ceil(requestsPerSecond / 2), 25) }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded transition-all duration-500 ${
                        animatingRequests.length > 0
                          ? 'bg-emerald-500 scale-110'
                          : 'bg-emerald-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-emerald-600">
                  Active instances: {Math.min(Math.ceil(requestsPerSecond / 2), 25)}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Performance & Cost</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Current Load:</span>
                <span className="font-medium text-slate-800">{requestsPerSecond} req/sec</span>
              </div>
              
              {!isTraditional && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Executions:</span>
                  <span className="font-medium text-emerald-600">{executedFunctions.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Cost per Hour:</span>
                <span className={`font-medium ${isTraditional ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ${isTraditional ? traditionalCost.toFixed(4) : (totalCost * 3600).toFixed(6)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Cost:</span>
                <span className={`font-bold ${isTraditional ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ${totalCost.toFixed(6)}
                </span>
              </div>

              {/* Efficiency indicator */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600 mb-2">Efficiency</div>
                <div className={`text-lg font-bold ${
                  isTraditional 
                    ? utilizationPercentage < 50 ? 'text-rose-500' : 'text-amber-500'
                    : 'text-emerald-500'
                }`}>
                  {isTraditional 
                    ? utilizationPercentage < 50 ? 'Underutilized' : 'Moderate'
                    : 'Optimal'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h5 className="font-semibold text-blue-800 mb-3">Serverless Benefits</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-blue-700">Auto-scaling (0 to thousands)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-blue-700">Pay per execution only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-blue-700">Zero infrastructure management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}