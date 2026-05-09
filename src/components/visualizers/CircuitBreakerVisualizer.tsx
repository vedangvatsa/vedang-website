"use client";

import { useState, useEffect } from 'react';

export function CircuitBreakerVisualizer() {
  const [circuitState, setCircuitState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [failureCount, setFailureCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [requests, setRequests] = useState<Array<{id: number, status: 'success' | 'failure' | 'blocked', timestamp: number}>>([]);
  const [serviceHealth, setServiceHealth] = useState(80);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [threshold] = useState(3);
  
  const sendRequest = () => {
    const requestId = Date.now() + Math.random();
    
    if (circuitState === 'OPEN') {
      setRequests(prev => [...prev.slice(-4), {
        id: requestId,
        status: 'blocked',
        timestamp: Date.now()
      }]);
      return;
    }
    
    const willSucceed = Math.random() * 100 < serviceHealth;
    
    if (willSucceed) {
      setSuccessCount(prev => prev + 1);
      setFailureCount(prev => Math.max(0, prev - 1));
      setRequests(prev => [...prev.slice(-4), {
        id: requestId,
        status: 'success',
        timestamp: Date.now()
      }]);
      
      if (circuitState === 'HALF_OPEN') {
        setCircuitState('CLOSED');
      }
    } else {
      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);
      setRequests(prev => [...prev.slice(-4), {
        id: requestId,
        status: 'failure',
        timestamp: Date.now()
      }]);
      
      if (newFailureCount >= threshold && circuitState === 'CLOSED') {
        setCircuitState('OPEN');
        setTimeout(() => setCircuitState('HALF_OPEN'), 2000);
      }
    }
  };
  
  useEffect(() => {
    if (isAutoMode) {
      const interval = setInterval(sendRequest, 800);
      return () => clearInterval(interval);
    }
  }, [isAutoMode, circuitState, failureCount, serviceHealth]);
  
  const resetCircuit = () => {
    setCircuitState('CLOSED');
    setFailureCount(0);
    setSuccessCount(0);
    setRequests([]);
  };
  
  const getCircuitColor = () => {
    switch (circuitState) {
      case 'CLOSED': return 'emerald';
      case 'OPEN': return 'rose';
      case 'HALF_OPEN': return 'amber';
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Circuit Breaker Pattern</h3>
        <p className="text-slate-600">Interactive visualization showing how circuit breakers prevent cascading failures in distributed systems</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Service Health Control</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Service B Health: {serviceHealth}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={serviceHealth}
                  onChange={(e) => setServiceHealth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Unhealthy</span>
                  <span>Healthy</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={sendRequest}
                  disabled={isAutoMode}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
                
                <button
                  onClick={() => setIsAutoMode(!isAutoMode)}
                  className={`px-4 py-2 rounded-lg text-white ${isAutoMode ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                >
                  {isAutoMode ? 'Stop Auto' : 'Start Auto'}
                </button>
                
                <button
                  onClick={resetCircuit}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Circuit State</h4>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-${getCircuitColor()}-100 border-4 border-${getCircuitColor()}-500 flex items-center justify-center`}>
                <div className={`w-6 h-6 rounded-full bg-${getCircuitColor()}-500`}></div>
              </div>
              <div>
                <div className={`text-xl font-bold text-${getCircuitColor()}-700`}>
                  {circuitState.replace('_', '-')}
                </div>
                <div className="text-sm text-slate-600">
                  {circuitState === 'CLOSED' && 'Requests flowing normally'}
                  {circuitState === 'OPEN' && 'Blocking requests to prevent failures'}
                  {circuitState === 'HALF_OPEN' && 'Testing if service has recovered'}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <div className="text-2xl font-bold text-rose-700">{failureCount}</div>
                <div className="text-sm text-rose-600">Failures</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">{successCount}</div>
                <div className="text-sm text-emerald-600">Successes</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">System Architecture</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-20 h-16 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-medium text-blue-700">Service A</span>
                </div>
                <div className="text-xs text-slate-600">Client</div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className={`h-1 bg-${circuitState === 'OPEN' ? 'rose' : 'emerald'}-300 rounded`}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-8 h-8 rounded-full bg-${getCircuitColor()}-500 flex items-center justify-center`}>
                      <span className="text-xs text-white font-bold">CB</span>
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-slate-600 mt-2">Circuit Breaker</div>
              </div>
              
              <div className="text-center">
                <div className={`w-20 h-16 border rounded-lg flex items-center justify-center mb-2 ${
                  serviceHealth > 50 ? 'bg-emerald-100 border-emerald-300' : 'bg-rose-100 border-rose-300'
                }`}>
                  <span className={`text-sm font-medium ${
                    serviceHealth > 50 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>Service B</span>
                </div>
                <div className="text-xs text-slate-600">
                  {serviceHealth > 50 ? 'Healthy' : 'Unhealthy'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Recent Requests</h4>
            <div className="space-y-2">
              {requests.length === 0 ? (
                <div className="text-center text-slate-400 py-4">No requests yet</div>
              ) : (
                requests.slice(-5).map((request) => (
                  <div key={request.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                    <div className={`w-3 h-3 rounded-full ${
                      request.status === 'success' ? 'bg-emerald-500' :
                      request.status === 'failure' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}></div>
                    <span className="text-sm text-slate-700 capitalize">{request.status}</span>
                    {request.status === 'blocked' && (
                      <span className="text-xs text-amber-600">(Circuit Open)</span>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 text-xs text-slate-600">
              <div>• Green: Successful request</div>
              <div>• Red: Failed request</div>
              <div>• Yellow: Blocked by circuit breaker</div>
              <div>• Circuit opens after {threshold} failures</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}