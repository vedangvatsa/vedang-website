"use client";

import React, { useState, useEffect } from 'react';

export function LatencyVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [networkLatency, setNetworkLatency] = useState(50);
  const [queueLatency, setQueueLatency] = useState(30);
  const [inferenceLatency, setInferenceLatency] = useState(120);
  const [currentPhase, setCurrentPhase] = useState('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tokens, setTokens] = useState<string[]>([]);
  const [firstTokenTime, setFirstTokenTime] = useState(0);

  const totalLatency = networkLatency + queueLatency + inferenceLatency;
  const firstTokenLatency = networkLatency + queueLatency + 40; // First token appears 40ms into inference

  const sampleTokens = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 10;
          
          if (newTime <= networkLatency) {
            setCurrentPhase('network');
          } else if (newTime <= networkLatency + queueLatency) {
            setCurrentPhase('queue');
          } else if (newTime <= totalLatency) {
            setCurrentPhase('inference');
            
            // Generate tokens during inference
            if (newTime >= firstTokenLatency) {
              const inferenceProgress = newTime - (networkLatency + queueLatency);
              const tokenInterval = (inferenceLatency - 40) / sampleTokens.length;
              const tokenIndex = Math.floor((inferenceProgress - 40) / tokenInterval);
              
              if (tokenIndex >= 0 && tokenIndex < sampleTokens.length) {
                setTokens(prev => {
                  if (prev.length === tokenIndex) {
                    if (tokenIndex === 0) setFirstTokenTime(newTime);
                    return [...prev, sampleTokens[tokenIndex]];
                  }
                  return prev;
                });
              }
            }
          } else {
            setCurrentPhase('complete');
            setIsRunning(false);
            return newTime;
          }
          
          return newTime;
        });
      }, 10);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, networkLatency, queueLatency, inferenceLatency, totalLatency, firstTokenLatency]);

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentPhase('idle');
    setElapsedTime(0);
    setTokens([]);
    setFirstTokenTime(0);
  };

  const startSimulation = () => {
    resetSimulation();
    setTimeout(() => setIsRunning(true), 100);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'network': return 'bg-blue-500';
      case 'queue': return 'bg-amber-500';
      case 'inference': return 'bg-emerald-500';
      case 'complete': return 'bg-indigo-500';
      default: return 'bg-slate-300';
    }
  };

  const isPhaseActive = (phase: string) => {
    return currentPhase === phase;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI System Latency Breakdown</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how network, queue, and inference latency combine to affect total response time and first-token latency in AI systems.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Latency Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Network Latency: {networkLatency}ms
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={networkLatency}
              onChange={(e) => setNetworkLatency(Number(e.target.value))}
              className="w-full"
              disabled={isRunning}
            />
            <p className="text-xs text-slate-500 mt-1">Time for request to reach server</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Queue Latency: {queueLatency}ms
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={queueLatency}
              onChange={(e) => setQueueLatency(Number(e.target.value))}
              className="w-full"
              disabled={isRunning}
            />
            <p className="text-xs text-slate-500 mt-1">Waiting time for processing resources</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Inference Latency: {inferenceLatency}ms
            </label>
            <input
              type="range"
              min="50"
              max="300"
              value={inferenceLatency}
              onChange={(e) => setInferenceLatency(Number(e.target.value))}
              className="w-full"
              disabled={isRunning}
            />
            <p className="text-xs text-slate-500 mt-1">Model processing time</p>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Latency Timeline</h4>
            <div className="text-sm text-slate-600">
              Total: {totalLatency}ms | First Token: {firstTokenLatency}ms
            </div>
          </div>

          <div className="relative h-16 bg-slate-100 rounded-lg overflow-hidden mb-4">
            {/* Network Phase */}
            <div 
              className={`absolute top-0 left-0 h-full ${getPhaseColor('network')} transition-opacity duration-200 ${isPhaseActive('network') ? 'opacity-100' : 'opacity-60'}`}
              style={{ width: `${(networkLatency / totalLatency) * 100}%` }}
            >
              <div className="flex items-center justify-center h-full text-white text-sm font-medium">
                Network
              </div>
            </div>

            {/* Queue Phase */}
            <div 
              className={`absolute top-0 h-full ${getPhaseColor('queue')} transition-opacity duration-200 ${isPhaseActive('queue') ? 'opacity-100' : 'opacity-60'}`}
              style={{ 
                left: `${(networkLatency / totalLatency) * 100}%`,
                width: `${(queueLatency / totalLatency) * 100}%` 
              }}
            >
              <div className="flex items-center justify-center h-full text-white text-sm font-medium">
                Queue
              </div>
            </div>

            {/* Inference Phase */}
            <div 
              className={`absolute top-0 h-full ${getPhaseColor('inference')} transition-opacity duration-200 ${isPhaseActive('inference') ? 'opacity-100' : 'opacity-60'}`}
              style={{ 
                left: `${((networkLatency + queueLatency) / totalLatency) * 100}%`,
                width: `${(inferenceLatency / totalLatency) * 100}%` 
              }}
            >
              <div className="flex items-center justify-center h-full text-white text-sm font-medium">
                Inference
              </div>
            </div>

            {/* Progress Indicator */}
            {isRunning && (
              <div 
                className="absolute top-0 w-1 h-full bg-rose-500 transition-all duration-100 ease-linear"
                style={{ left: `${(elapsedTime / totalLatency) * 100}%` }}
              />
            )}

            {/* First Token Marker */}
            <div 
              className="absolute top-0 w-0.5 h-full bg-indigo-600"
              style={{ left: `${(firstTokenLatency / totalLatency) * 100}%` }}
            >
              <div className="absolute -top-6 -left-8 text-xs text-indigo-600 font-medium whitespace-nowrap">
                First Token
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Current Phase:</span>
              <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${getPhaseColor(currentPhase)}`}>
                {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Elapsed Time:</span>
              <span className="ml-2 font-medium">{elapsedTime}ms</span>
            </div>
          </div>
        </div>

        {/* Token Output */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Token Generation</h4>
          <div className="min-h-[60px] p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <div className="flex flex-wrap gap-2">
              {tokens.map((token, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded animate-pulse"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {token}
                </span>
              ))}
              {currentPhase === 'inference' && tokens.length === 0 && (
                <span className="text-slate-400 italic">Waiting for first token...</span>
              )}
            </div>
          </div>
          {firstTokenTime > 0 && (
            <div className="mt-2 text-sm text-slate-600">
              First token appeared at {firstTokenTime}ms
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Running...' : 'Start Request'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}