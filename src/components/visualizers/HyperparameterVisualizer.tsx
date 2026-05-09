"use client";

import React, { useState, useEffect } from 'react';

export function HyperparameterVisualizer() {
  const [learningRate, setLearningRate] = useState(0.1);
  const [batchSize, setBatchSize] = useState(32);
  const [hiddenLayers, setHiddenLayers] = useState(2);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [accuracy, setAccuracy] = useState(0.1);
  const [trainingHistory, setTrainingHistory] = useState<{epoch: number, loss: number, accuracy: number}[]>([]);

  const resetTraining = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(1.0);
    setAccuracy(0.1);
    setTrainingHistory([]);
  };

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setEpoch(prev => {
          const newEpoch = prev + 1;
          if (newEpoch >= 50) {
            setIsTraining(false);
            return 50;
          }
          
          // Simulate training dynamics based on hyperparameters
          const learningFactor = learningRate > 0.5 ? Math.random() * 2 : learningRate < 0.01 ? 0.995 : 0.92;
          const batchNoise = batchSize < 16 ? 0.1 : batchSize > 128 ? 0.02 : 0.05;
          const complexityBonus = hiddenLayers > 1 ? 0.98 : 0.99;
          
          setLoss(prevLoss => {
            let newLoss;
            if (learningRate > 0.5) {
              // Too high learning rate - divergence
              newLoss = prevLoss * (1 + Math.random() * 0.3);
            } else if (learningRate < 0.01) {
              // Too low learning rate - slow convergence
              newLoss = prevLoss * 0.999;
            } else {
              newLoss = prevLoss * learningFactor + (Math.random() - 0.5) * batchNoise;
            }
            return Math.max(0.01, newLoss);
          });
          
          setAccuracy(prevAcc => {
            let newAcc;
            if (learningRate > 0.5) {
              newAcc = Math.max(0.1, prevAcc - Math.random() * 0.1);
            } else {
              newAcc = Math.min(0.95, prevAcc + (1 - prevAcc) * 0.1 * complexityBonus);
            }
            return newAcc;
          });
          
          setTrainingHistory(prev => [...prev.slice(-20), {epoch: newEpoch, loss, accuracy}]);
          
          return newEpoch;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isTraining, learningRate, batchSize, hiddenLayers, loss, accuracy]);

  const getNetworkVisualization = () => {
    const layers = [3, ...Array(hiddenLayers).fill(4), 1];
    
    return (
      <div className="flex items-center gap-6">
        {layers.map((neurons, layerIdx) => (
          <div key={layerIdx} className="flex flex-col gap-2">
            {Array(neurons).fill(0).map((_, neuronIdx) => (
              <div
                key={neuronIdx}
                className={`w-6 h-6 rounded-full transition-colors duration-500 ${
                  isTraining 
                    ? 'bg-blue-500 animate-pulse' 
                    : layerIdx === 0 
                      ? 'bg-emerald-400' 
                      : layerIdx === layers.length - 1 
                        ? 'bg-rose-400' 
                        : 'bg-indigo-400'
                }`}
              />
            ))}
            {layerIdx < layers.length - 1 && (
              <div className="absolute ml-6 w-6 border-t border-slate-300" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const getTrainingStatus = () => {
    if (learningRate > 0.5) return { text: "Diverging!", color: "text-rose-600" };
    if (learningRate < 0.01) return { text: "Too Slow", color: "text-amber-600" };
    return { text: "Converging", color: "text-emerald-600" };
  };

  const status = getTrainingStatus();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Hyperparameter Explorer</h3>
        <p className="text-slate-600 text-lg">
          Adjust hyperparameters and see how they affect neural network training dynamics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Learning Rate: {learningRate.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.001"
            max="1"
            step="0.001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className={`text-sm font-medium mt-2 ${status.color}`}>
            {status.text}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Batch Size: {batchSize}
          </label>
          <input
            type="range"
            min="8"
            max="256"
            step="8"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-sm text-slate-500 mt-2">
            {batchSize < 32 ? "High noise" : batchSize > 128 ? "Low noise" : "Balanced"}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Hidden Layers: {hiddenLayers}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={hiddenLayers}
            onChange={(e) => setHiddenLayers(parseInt(e.target.value))}
            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-sm text-slate-500 mt-2">
            {hiddenLayers === 1 ? "Simple" : hiddenLayers > 3 ? "Complex" : "Moderate"}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Network Architecture</h4>
        <div className="flex justify-center mb-6">
          {getNetworkVisualization()}
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              if (isTraining) {
                setIsTraining(false);
              } else {
                setIsTraining(true);
              }
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isTraining 
                ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </button>
          
          <button
            onClick={resetTraining}
            className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-100 p-4 rounded-lg">
            <div className="text-sm text-slate-600">Epoch</div>
            <div className="text-xl font-bold text-slate-800">{epoch}/50</div>
          </div>
          <div className="bg-rose-100 p-4 rounded-lg">
            <div className="text-sm text-rose-600">Loss</div>
            <div className="text-xl font-bold text-rose-800">{loss.toFixed(4)}</div>
          </div>
          <div className="bg-emerald-100 p-4 rounded-lg">
            <div className="text-sm text-emerald-600">Accuracy</div>
            <div className="text-xl font-bold text-emerald-800">{(accuracy * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}