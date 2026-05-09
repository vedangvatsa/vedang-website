"use client";

import React, { useState, useEffect } from 'react';

export function GeneralizationVisualizer() {
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [modelComplexity, setModelComplexity] = useState(3);
  const [showTestData, setShowTestData] = useState(false);
  
  // Generate training data points (simple pattern: y = 2x + noise)
  const generateTrainingData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: i * 0.5,
      y: 2 * (i * 0.5) + (Math.random() - 0.5) * 2,
      id: i
    }));
  };
  
  // Generate test data points (same distribution)
  const generateTestData = () => {
    return Array.from({ length: 15 }, (_, i) => ({
      x: (i + 0.3) * 0.5,
      y: 2 * ((i + 0.3) * 0.5) + (Math.random() - 0.5) * 2,
      id: i + 100
    }));
  };
  
  const [trainingData] = useState(generateTrainingData());
  const [testData] = useState(generateTestData());
  
  // Calculate model predictions based on complexity and training progress
  const getModelPrediction = (x: number) => {
    const baseProgress = trainingProgress / 100;
    
    if (modelComplexity === 1) {
      // Underfitting: too simple, can't capture pattern
      return 1 + baseProgress * 0.5 * x;
    } else if (modelComplexity === 2) {
      // Good fit: captures the underlying pattern
      return baseProgress * 2 * x;
    } else if (modelComplexity === 3) {
      // Slight overfitting
      return baseProgress * (2 * x + Math.sin(x * 2) * 0.5);
    } else {
      // High overfitting: memorizes training data
      return baseProgress * (2 * x + Math.sin(x * 5) * 1.5 + Math.cos(x * 3) * 1);
    }
  };
  
  // Calculate accuracy for a dataset
  const calculateAccuracy = (data: any[]) => {
    if (trainingProgress === 0) return 0;
    
    const errors = data.map(point => {
      const predicted = getModelPrediction(point.x);
      return Math.abs(predicted - point.y);
    });
    
    const avgError = errors.reduce((sum, error) => sum + error, 0) / errors.length;
    return Math.max(0, 100 - avgError * 10);
  };
  
  const trainingAccuracy = calculateAccuracy(trainingData);
  const testAccuracy = calculateAccuracy(testData);
  const generalizationGap = Math.abs(trainingAccuracy - testAccuracy);
  
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
  };
  
  useEffect(() => {
    if (isTraining && trainingProgress < 100) {
      const timer = setTimeout(() => {
        setTrainingProgress(prev => prev + 2);
      }, 100);
      return () => clearTimeout(timer);
    } else if (trainingProgress >= 100) {
      setIsTraining(false);
    }
  }, [isTraining, trainingProgress]);
  
  const complexityLabels = {
    1: "Too Simple (Underfitting)",
    2: "Just Right",
    3: "Complex",
    4: "Too Complex (Overfitting)"
  };
  
  const getComplexityColor = () => {
    if (modelComplexity === 1) return "text-amber-600";
    if (modelComplexity === 2) return "text-emerald-600";
    if (modelComplexity === 3) return "text-blue-600";
    return "text-rose-600";
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Generalization in Machine Learning</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how model complexity affects generalization. Good models perform well on both training and unseen test data.
        </p>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Model Configuration</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Model Complexity: <span className={`font-semibold ${getComplexityColor()}`}>
                    {complexityLabels[modelComplexity as keyof typeof complexityLabels]}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={modelComplexity}
                  onChange={(e) => {
                    setModelComplexity(Number(e.target.value));
                    setTrainingProgress(0);
                    setIsTraining(false);
                  }}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </button>
                
                <button
                  onClick={() => setShowTestData(!showTestData)}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 font-medium"
                >
                  {showTestData ? 'Hide' : 'Show'} Test Data
                </button>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Performance Metrics</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Training Accuracy:</span>
                <span className="font-semibold text-blue-600">{trainingAccuracy.toFixed(1)}%</span>
              </div>
              
              {showTestData && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Test Accuracy:</span>
                  <span className="font-semibold text-emerald-600">{testAccuracy.toFixed(1)}%</span>
                </div>
              )}
              
              {showTestData && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Generalization Gap:</span>
                  <span className={`font-semibold ${generalizationGap > 15 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {generalizationGap.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">Training Progress</h4>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-100"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-2">{trainingProgress}% complete</p>
          </div>
        </div>
        
        {/* Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Model Fit Visualization</h4>
          
          <div className="relative w-full h-80 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Grid lines */}
              {Array.from({ length: 9 }, (_, i) => (
                <g key={i}>
                  <line x1={i * 50} y1={0} x2={i * 50} y2={300} stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1={0} y1={i * 37.5} x2={400} y2={i * 37.5} stroke="#e2e8f0" strokeWidth="0.5" />
                </g>
              ))}
              
              {/* Model prediction curve */}
              {trainingProgress > 0 && (
                <path
                  d={`M ${Array.from({ length: 100 }, (_, i) => {
                    const x = i * 4;
                    const realX = i * 0.1;
                    const y = 280 - getModelPrediction(realX) * 25;
                    return `${x},${Math.max(20, Math.min(280, y))}`;
                  }).join(' L ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity={trainingProgress / 100}
                />
              )}
              
              {/* Training data points */}
              {trainingData.map(point => (
                <circle
                  key={point.id}
                  cx={point.x * 40}
                  cy={280 - point.y * 25}
                  r="4"
                  fill="#1e40af"
                  opacity="0.8"
                />
              ))}
              
              {/* Test data points */}
              {showTestData && testData.map(point => (
                <circle
                  key={point.id}
                  cx={point.x * 40}
                  cy={280 - point.y * 25}
                  r="4"
                  fill="#10b981"
                  opacity="0.8"
                />
              ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg border border-slate-200 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                <span>Training Data</span>
              </div>
              {showTestData && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Test Data</span>
                </div>
              )}
              {trainingProgress > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Model Prediction</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}