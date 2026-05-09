"use client";

import React, { useState } from 'react';

export function EdgeComputingVisualizer() {
  const [processingMode, setProcessingMode] = useState<'cloud' | 'edge'>('cloud');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dataSize, setDataSize] = useState(50);
  const [animationStep, setAnimationStep] = useState(0);

  const cloudLatency = Math.round(100 + (dataSize * 0.8));
  const edgeLatency = Math.round(5 + (dataSize * 0.1));
  const cloudBandwidth = Math.round(dataSize * 2);
  const edgeBandwidth = Math.round(dataSize * 0.2);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationStep(0);

    const steps = processingMode === 'cloud' ? 4 : 2;
    const stepDuration = processingMode === 'cloud' ? 800 : 300;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimationStep(currentStep);
      
      if (currentStep >= steps) {
        setTimeout(() => {
          setIsAnimating(false);
          setAnimationStep(0);
        }, stepDuration);
        clearInterval(interval);
      }
    }, stepDuration);
  };

  const getDataPacketPosition = () => {
    if (!isAnimating) return 'translate-x-0';
    
    if (processingMode === 'cloud') {
      switch (animationStep) {
        case 1: return 'translate-x-32';
        case 2: return 'translate-x-64';
        case 3: return 'translate-x-96';
        case 4: return 'translate-x-0';
        default: return 'translate-x-0';
      }
    } else {
      switch (animationStep) {
        case 1: return 'translate-x-16';
        case 2: return 'translate-x-0';
        default: return 'translate-x-0';
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Edge Computing Visualizer</h3>
        <p className="text-slate-600">Compare cloud vs edge processing performance interactively</p>
      </div>

      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setProcessingMode('cloud')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            processingMode === 'cloud'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Cloud Processing
        </button>
        <button
          onClick={() => setProcessingMode('edge')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            processingMode === 'edge'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Edge Processing
        </button>
      </div>

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Data Size: {dataSize} MB
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={dataSize}
          onChange={(e) => setDataSize(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          disabled={isAnimating}
        />
      </div>

      <div className="relative w-full max-w-4xl h-64 bg-white rounded-xl border-2 border-slate-200 p-6">
        {/* User Device */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="w-16 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="w-8 h-6 bg-slate-300 rounded"></div>
          </div>
          <p className="text-xs text-center mt-1 font-medium">Device</p>
        </div>

        {/* Edge Server (only visible in edge mode) */}
        {processingMode === 'edge' && (
          <div className="absolute left-32 top-1/2 transform -translate-y-1/2">
            <div className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
              animationStep === 1 ? 'bg-emerald-500 scale-110' : 'bg-emerald-400'
            }`}>
              <div className="w-6 h-2 bg-white rounded mb-1"></div>
              <div className="w-6 h-2 bg-white rounded mb-1"></div>
              <div className="w-6 h-2 bg-white rounded"></div>
            </div>
            <p className="text-xs text-center mt-1 font-medium">Edge</p>
          </div>
        )}

        {/* Cloud (only visible in cloud mode) */}
        {processingMode === 'cloud' && (
          <>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-12 bg-indigo-400 rounded-lg flex items-center justify-center">
                <div className="text-white text-xs">ISP</div>
              </div>
              <p className="text-xs text-center mt-1 font-medium">Internet</p>
            </div>
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className={`w-20 h-16 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                animationStep === 3 ? 'bg-blue-600 scale-110' : 'bg-blue-500'
              }`}>
                <div className="w-12 h-2 bg-white rounded mb-1"></div>
                <div className="w-12 h-2 bg-white rounded mb-1"></div>
                <div className="w-12 h-2 bg-white rounded mb-1"></div>
                <div className="w-8 h-2 bg-white rounded"></div>
              </div>
              <p className="text-xs text-center mt-1 font-medium text-white">Cloud</p>
            </div>
          </>
        )}

        {/* Data Packet */}
        <div className={`absolute left-20 top-1/2 transform -translate-y-1/2 transition-transform duration-700 ease-in-out ${getDataPacketPosition()}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            processingMode === 'cloud' ? 'bg-blue-400' : 'bg-emerald-400'
          }`}>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Connection Lines */}
        <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-slate-300 transform -translate-y-1/2"></div>
      </div>

      <button
        onClick={startAnimation}
        disabled={isAnimating}
        className={`px-8 py-3 rounded-lg font-medium transition-all ${
          isAnimating
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : processingMode === 'cloud'
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isAnimating ? 'Processing...' : 'Start Processing'}
      </button>

      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2">Latency</h4>
          <p className={`text-2xl font-bold ${
            processingMode === 'cloud' ? 'text-blue-600' : 'text-emerald-600'
          }`}>
            {processingMode === 'cloud' ? cloudLatency : edgeLatency}ms
          </p>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2">Bandwidth Used</h4>
          <p className={`text-2xl font-bold ${
            processingMode === 'cloud' ? 'text-blue-600' : 'text-emerald-600'
          }`}>
            {processingMode === 'cloud' ? cloudBandwidth : edgeBandwidth} MB
          </p>
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-sm text-slate-600">
          {processingMode === 'cloud' 
            ? 'Cloud processing: Data travels to remote servers, causing higher latency and bandwidth usage.'
            : 'Edge processing: Data is processed locally, reducing latency and bandwidth requirements.'
          }
        </p>
      </div>
    </div>
  );
}