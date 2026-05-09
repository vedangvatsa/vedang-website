"use client";

import React, { useState, useEffect } from 'react';

export function FederatedLearningVisualizer() {
  const [trainingRound, setTrainingRound] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [showDataFlow, setShowDataFlow] = useState(false);

  const devices = [
    { id: 0, name: 'Hospital A', data: 'Medical Records', accuracy: 0.65, color: 'bg-blue-500' },
    { id: 1, name: 'Hospital B', data: 'Patient Data', accuracy: 0.72, color: 'bg-emerald-500' },
    { id: 2, name: 'Hospital C', data: 'Treatment History', accuracy: 0.68, color: 'bg-rose-500' },
    { id: 3, name: 'Hospital D', data: 'Diagnostic Images', accuracy: 0.71, color: 'bg-amber-500' }
  ];

  const [deviceAccuracies, setDeviceAccuracies] = useState(devices.map(d => d.accuracy));
  const [globalAccuracy, setGlobalAccuracy] = useState(0.69);

  useEffect(() => {
    if (isTraining) {
      const timer = setTimeout(() => {
        const newAccuracies = deviceAccuracies.map(acc => 
          Math.min(0.95, acc + (Math.random() * 0.03 + 0.01))
        );
        setDeviceAccuracies(newAccuracies);
        setGlobalAccuracy(newAccuracies.reduce((a, b) => a + b, 0) / newAccuracies.length);
        setTrainingRound(prev => prev + 1);
        setIsTraining(false);
        setShowDataFlow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTraining, deviceAccuracies]);

  const handleTraining = () => {
    if (!isTraining) {
      setIsTraining(true);
      setShowDataFlow(true);
    }
  };

  const resetTraining = () => {
    setTrainingRound(0);
    setDeviceAccuracies(devices.map(d => d.accuracy));
    setGlobalAccuracy(0.69);
    setIsTraining(false);
    setShowDataFlow(false);
    setSelectedDevice(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Federated Learning</h3>
        <p className="text-slate-600">Train AI models across distributed devices without sharing raw data</p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {/* Central Server */}
        <div className="relative">
          <div className={`w-24 h-24 rounded-full border-4 ${isTraining ? 'border-indigo-500 animate-pulse' : 'border-slate-400'} bg-indigo-100 flex flex-col items-center justify-center transition-all duration-300`}>
            <div className="text-xs font-bold text-indigo-700">Server</div>
            <div className="text-xs text-indigo-600">{(globalAccuracy * 100).toFixed(1)}%</div>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap">
            Global Model
          </div>
        </div>

        {/* Connection Lines */}
        <div className="relative w-full h-32">
          {devices.map((device, index) => {
            const angle = (index * 90 - 135) * (Math.PI / 180);
            const lineLength = 120;
            const x = Math.cos(angle) * lineLength;
            const y = Math.sin(angle) * lineLength;
            
            return (
              <div key={device.id}>
                {/* Connection Line */}
                <div 
                  className={`absolute top-1/2 left-1/2 origin-left h-0.5 transition-all duration-300 ${
                    showDataFlow ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'
                  }`}
                  style={{
                    width: `${lineLength}px`,
                    transform: `translate(-50%, -50%) rotate(${angle * (180 / Math.PI)}deg)`
                  }}
                />
                
                {/* Data Flow Animation */}
                {showDataFlow && (
                  <div 
                    className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-ping"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) translate(${x * 0.5}px, ${y * 0.5}px)`
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Devices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {devices.map((device, index) => (
            <div 
              key={device.id}
              className={`cursor-pointer transform transition-all duration-300 ${
                selectedDevice === device.id ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
            >
              <div className={`p-4 rounded-xl border-2 ${
                selectedDevice === device.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
              } ${isTraining ? 'animate-pulse' : ''}`}>
                <div className={`w-12 h-12 rounded-lg ${device.color} mx-auto mb-2 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-sm font-semibold text-slate-800 text-center">{device.name}</div>
                <div className="text-xs text-slate-600 text-center mt-1">{device.data}</div>
                <div className="text-sm font-bold text-center mt-2 text-indigo-600">
                  {(deviceAccuracies[index] * 100).toFixed(1)}%
                </div>
                {selectedDevice === device.id && (
                  <div className="mt-3 p-2 bg-slate-100 rounded text-xs text-slate-700">
                    <div className="font-semibold">Local Training:</div>
                    <div>• Data stays on device</div>
                    <div>• Only model updates shared</div>
                    <div>• Privacy preserved</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Training Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button 
              onClick={handleTraining}
              disabled={isTraining}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isTraining 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isTraining ? 'Training...' : 'Start Training Round'}
            </button>
            
            <button 
              onClick={resetTraining}
              className="px-6 py-3 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 text-white transition-all duration-300"
            >
              Reset
            </button>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">Round: {trainingRound}</div>
            <div className="text-sm text-slate-600 mt-2 max-w-md">
              {isTraining 
                ? "Devices training locally, then sharing encrypted model updates..." 
                : "Click 'Start Training Round' to simulate federated learning. Data never leaves each device!"
              }
            </div>
          </div>
        </div>

        {/* Accuracy Chart */}
        <div className="w-full max-w-2xl bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-sm font-semibold text-slate-800 mb-3">Model Accuracy Progress</div>
          <div className="flex items-end gap-2 h-20">
            {devices.map((device, index) => (
              <div key={device.id} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${device.color} rounded-t transition-all duration-500`}
                  style={{ height: `${deviceAccuracies[index] * 80}px` }}
                ></div>
                <div className="text-xs text-slate-600 mt-1">{device.name.split(' ')[1]}</div>
              </div>
            ))}
            <div className="flex-1 flex flex-col items-center ml-4">
              <div 
                className="w-full bg-indigo-600 rounded-t transition-all duration-500"
                style={{ height: `${globalAccuracy * 80}px` }}
              ></div>
              <div className="text-xs text-slate-600 mt-1">Global</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}