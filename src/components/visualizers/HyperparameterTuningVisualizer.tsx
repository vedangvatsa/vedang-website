"use client";

import { useState } from 'react';

export function HyperparameterTuningVisualizer() {
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(32);
  const [hiddenUnits, setHiddenUnits] = useState(64);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [searchMethod, setSearchMethod] = useState('manual');
  const [autoSearchActive, setAutoSearchActive] = useState(false);

  // Simulate model performance based on hyperparameters
  const calculateAccuracy = (lr: number, bs: number, hu: number, ep: number) => {
    const lrPenalty = Math.abs(0.01 - lr) * 50;
    const bsPenalty = Math.abs(32 - bs) * 0.5;
    const huBonus = Math.min(hu / 128, 1) * 10;
    const epochBonus = Math.min(ep / 50, 1) * 20;
    const noise = Math.sin(ep * 0.3) * 5;
    
    return Math.max(0, Math.min(100, 85 - lrPenalty - bsPenalty + huBonus + epochBonus + noise));
  };

  const startTraining = () => {
    setIsTraining(true);
    setEpoch(0);
    setCurrentAccuracy(0);
    
    const interval = setInterval(() => {
      setEpoch(prev => {
        const newEpoch = prev + 1;
        const accuracy = calculateAccuracy(learningRate, batchSize, hiddenUnits, newEpoch);
        setCurrentAccuracy(accuracy);
        
        if (accuracy > bestAccuracy) {
          setBestAccuracy(accuracy);
        }
        
        if (newEpoch >= 50) {
          setIsTraining(false);
          clearInterval(interval);
        }
        
        return newEpoch;
      });
    }, 100);
  };

  const startRandomSearch = () => {
    setAutoSearchActive(true);
    let searches = 0;
    
    const searchInterval = setInterval(() => {
      const randomLr = Math.random() * 0.1;
      const randomBs = Math.pow(2, Math.floor(Math.random() * 6) + 3);
      const randomHu = Math.pow(2, Math.floor(Math.random() * 7) + 3);
      
      setLearningRate(randomLr);
      setBatchSize(randomBs);
      setHiddenUnits(randomHu);
      
      const accuracy = calculateAccuracy(randomLr, randomBs, randomHu, 50);
      setCurrentAccuracy(accuracy);
      
      if (accuracy > bestAccuracy) {
        setBestAccuracy(accuracy);
      }
      
      searches++;
      if (searches >= 10) {
        setAutoSearchActive(false);
        clearInterval(searchInterval);
      }
    }, 800);
  };

  const gridSearchCombinations = [
    { lr: 0.001, bs: 16, hu: 32 },
    { lr: 0.001, bs: 32, hu: 64 },
    { lr: 0.01, bs: 16, hu: 32 },
    { lr: 0.01, bs: 32, hu: 64 },
    { lr: 0.1, bs: 16, hu: 32 },
    { lr: 0.1, bs: 32, hu: 64 }
  ];

  const startGridSearch = () => {
    setAutoSearchActive(true);
    let searchIndex = 0;
    
    const gridInterval = setInterval(() => {
      if (searchIndex < gridSearchCombinations.length) {
        const combo = gridSearchCombinations[searchIndex];
        setLearningRate(combo.lr);
        setBatchSize(combo.bs);
        setHiddenUnits(combo.hu);
        
        const accuracy = calculateAccuracy(combo.lr, combo.bs, combo.hu, 50);
        setCurrentAccuracy(accuracy);
        
        if (accuracy > bestAccuracy) {
          setBestAccuracy(accuracy);
        }
        
        searchIndex++;
      } else {
        setAutoSearchActive(false);
        clearInterval(gridInterval);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Hyperparameter Tuning</h3>
        <p className="text-slate-600 max-w-2xl">
          Adjust hyperparameters and observe their effect on model performance. Try manual tuning or automated search methods.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 w-full max-w-6xl">
        {/* Hyperparameter Controls */}
        <div className="flex-1 min-w-80 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Hyperparameters</h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Learning Rate: {learningRate.toFixed(4)}
              </label>
              <input
                type="range"
                min="0.0001"
                max="0.1"
                step="0.0001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isTraining || autoSearchActive}
              />
              <div className="text-xs text-slate-500 mt-1">Controls how fast the model learns</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Batch Size: {batchSize}
              </label>
              <input
                type="range"
                min="8"
                max="128"
                step="8"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isTraining || autoSearchActive}
              />
              <div className="text-xs text-slate-500 mt-1">Number of samples per training step</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hidden Units: {hiddenUnits}
              </label>
              <input
                type="range"
                min="16"
                max="256"
                step="16"
                value={hiddenUnits}
                onChange={(e) => setHiddenUnits(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isTraining || autoSearchActive}
              />
              <div className="text-xs text-slate-500 mt-1">Model capacity and complexity</div>
            </div>
          </div>
        </div>

        {/* Training Visualization */}
        <div className="flex-1 min-w-80 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Training Progress</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Epoch:</span>
              <span className="font-medium text-slate-800">{epoch}/50</span>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(epoch / 50) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Current Accuracy:</span>
              <span className={`font-medium ${currentAccuracy > 80 ? 'text-emerald-600' : currentAccuracy > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                {currentAccuracy.toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Best Accuracy:</span>
              <span className="font-medium text-emerald-600">{bestAccuracy.toFixed(1)}%</span>
            </div>

            <div className="mt-6">
              <div className="w-full h-32 bg-slate-100 rounded border relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-300"
                  style={{ 
                    width: '100%',
                    height: `${currentAccuracy}%`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-slate-700 font-medium">{currentAccuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Methods */}
      <div className="w-full max-w-6xl bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Search Methods</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={startTraining}
            disabled={isTraining || autoSearchActive}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isTraining ? 'Training...' : 'Manual Training'}
          </button>
          
          <button
            onClick={startRandomSearch}
            disabled={isTraining || autoSearchActive}
            className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {autoSearchActive && searchMethod === 'random' ? 'Searching...' : 'Random Search'}
          </button>
          
          <button
            onClick={startGridSearch}
            disabled={isTraining || autoSearchActive}
            className="px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {autoSearchActive && searchMethod === 'grid' ? 'Searching...' : 'Grid Search'}
          </button>
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>Manual: Set parameters yourself</div>
            <div>Random: Try random combinations</div>
            <div>Grid: Systematically test all combinations</div>
          </div>
        </div>
      </div>
    </div>
  );
}