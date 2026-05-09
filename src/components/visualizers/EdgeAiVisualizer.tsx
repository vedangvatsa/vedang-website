"use client";

import { useState, useEffect } from 'react';

export function EdgeAiVisualizer() {
  const [processingMode, setProcessingMode] = useState<'cloud' | 'edge'>('cloud');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataSize, setDataSize] = useState(50);
  const [latencyResults, setLatencyResults] = useState({ cloud: 0, edge: 0 });
  const [bandwidthSaved, setBandwidthSaved] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  const calculateMetrics = () => {
    // Cloud processing: network latency + processing time
    const networkLatency = 100 + (dataSize / 10); // Base 100ms + data transfer time
    const cloudProcessingTime = 50;
    const cloudTotal = networkLatency + cloudProcessingTime;

    // Edge processing: local processing only (faster but limited)
    const edgeProcessingTime = 15 + (dataSize / 20); // Scales with complexity
    
    // Bandwidth calculation: edge sends only results vs full data
    const fullDataMB = dataSize;
    const resultDataMB = 2; // Small result payload
    const saved = ((fullDataMB - resultDataMB) / fullDataMB) * 100;

    return {
      cloud: Math.round(cloudTotal),
      edge: Math.round(edgeProcessingTime),
      bandwidth: Math.round(saved)
    };
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setAnimationStep(0);
    
    const metrics = calculateMetrics();
    const totalTime = processingMode === 'cloud' ? metrics.cloud : metrics.edge;
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setLatencyResults(prev => ({
            ...prev,
            [processingMode]: metrics[processingMode]
          }));
          setBandwidthSaved(metrics.bandwidth);
          return 100;
        }
        return prev + (100 / (totalTime / 100));
      });
    }, 100);
  };

  const devices = [
    { name: 'Smartphone', icon: '📱', x: 20, y: 30 },
    { name: 'IoT Sensor', icon: '📊', x: 80, y: 20 },
    { name: 'Camera', icon: '📷', x: 15, y: 70 },
    { name: 'Drone', icon: '🚁', x: 75, y: 75 }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Edge AI Processing</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare cloud vs edge AI processing. Adjust data size and see how edge computing reduces latency and bandwidth usage.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setProcessingMode('cloud')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                processingMode === 'cloud'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ☁️ Cloud AI
            </button>
            <button
              onClick={() => setProcessingMode('edge')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                processingMode === 'edge'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              📱 Edge AI
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Data Size:</label>
            <input
              type="range"
              min="10"
              max="100"
              value={dataSize}
              onChange={(e) => setDataSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-slate-600 w-12">{dataSize}MB</span>
          </div>

          <button
            onClick={startProcessing}
            disabled={isProcessing}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? 'Processing...' : 'Start Processing'}
          </button>
        </div>

        {/* Visualization */}
        <div className="relative bg-white rounded-xl border border-slate-200 p-6 h-96">
          {/* Devices */}
          {devices.map((device, index) => (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isProcessing ? 'scale-110' : ''
              }`}
              style={{ left: `${device.x}%`, top: `${device.y}%` }}
            >
              <div className="text-center">
                <div className={`text-3xl mb-1 ${isProcessing ? 'animate-pulse' : ''}`}>
                  {device.icon}
                </div>
                <div className="text-xs text-slate-600 whitespace-nowrap">{device.name}</div>
              </div>
            </div>
          ))}

          {/* Cloud Server */}
          {processingMode === 'cloud' && (
            <div className="absolute top-4 right-4">
              <div className="text-center">
                <div className={`text-4xl mb-1 ${isProcessing ? 'animate-bounce' : ''}`}>
                  ☁️
                </div>
                <div className="text-sm font-medium text-blue-600">Cloud Server</div>
              </div>
            </div>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <>
              {processingMode === 'cloud' ? (
                // Cloud processing animation
                <div className="absolute inset-0 pointer-events-none">
                  {devices.map((device, index) => (
                    <svg
                      key={index}
                      className="absolute inset-0 w-full h-full"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <path
                        d={`M ${device.x}% ${device.y}% Q 70% 10% 85% 20%`}
                        stroke={animationStep > 25 ? '#3b82f6' : '#e2e8f0'}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        className={animationStep > 25 ? 'animate-pulse' : ''}
                      />
                    </svg>
                  ))}
                </div>
              ) : (
                // Edge processing animation
                <div className="absolute inset-0 pointer-events-none">
                  {devices.map((device, index) => (
                    <div
                      key={index}
                      className="absolute w-16 h-16 bg-emerald-200 rounded-full opacity-30 animate-ping"
                      style={{
                        left: `${device.x}%`,
                        top: `${device.y}%`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${index * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Progress bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      processingMode === 'cloud' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${animationStep}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Processing: {Math.round(animationStep)}%
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{latencyResults.cloud}ms</div>
            <div className="text-sm text-slate-600">Cloud Latency</div>
            <div className="text-xs text-slate-500 mt-1">Network + Processing</div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{latencyResults.edge}ms</div>
            <div className="text-sm text-slate-600">Edge Latency</div>
            <div className="text-xs text-slate-500 mt-1">Local Processing Only</div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{bandwidthSaved}%</div>
            <div className="text-sm text-slate-600">Bandwidth Saved</div>
            <div className="text-xs text-slate-500 mt-1">Results vs Full Data</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
            <div className="text-rose-600 font-semibold mb-1">⚡ Low Latency</div>
            <div className="text-xs text-slate-600">Critical for autonomous vehicles, robotics</div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="text-emerald-600 font-semibold mb-1">📊 Less Bandwidth</div>
            <div className="text-xs text-slate-600">Send results, not raw data streams</div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="text-indigo-600 font-semibold mb-1">🔒 Privacy</div>
            <div className="text-xs text-slate-600">Data stays on device, enhanced security</div>
          </div>
        </div>
      </div>
    </div>
  );
}