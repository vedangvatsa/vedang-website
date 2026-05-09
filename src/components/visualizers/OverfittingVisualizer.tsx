"use client";

import { useState, useEffect } from 'react';

export function OverfittingVisualizer() {
  const [complexity, setComplexity] = useState(3);
  const [trainingStep, setTrainingStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('training');

  // Generate training data points with some noise
  const trainingData = [
    { x: 1, y: 2.1 }, { x: 2, y: 4.2 }, { x: 3, y: 6.0 }, { x: 4, y: 7.8 },
    { x: 5, y: 10.2 }, { x: 6, y: 11.9 }, { x: 7, y: 14.1 }, { x: 8, y: 15.8 }
  ];

  // Generate test data (similar pattern but different points)
  const testData = [
    { x: 1.5, y: 3.0 }, { x: 2.5, y: 5.1 }, { x: 3.5, y: 6.8 }, { x: 4.5, y: 8.9 },
    { x: 5.5, y: 11.0 }, { x: 6.5, y: 13.2 }, { x: 7.5, y: 15.0 }, { x: 8.5, y: 16.8 }
  ];

  // Generate model predictions based on complexity
  const generatePredictions = (data: typeof trainingData) => {
    return data.map(point => {
      let prediction;
      if (complexity === 1) {
        // Simple linear model
        prediction = 2 * point.x;
      } else if (complexity === 5) {
        // Medium complexity - follows general trend with some fitting
        prediction = 2 * point.x + 0.1 * Math.sin(point.x * 2) * trainingStep / 100;
      } else if (complexity === 9) {
        // High complexity - overfits to training data
        if (selectedDataset === 'training') {
          prediction = point.y + (trainingStep / 100) * 0.2 * Math.sin(point.x * 5);
        } else {
          prediction = 2 * point.x + Math.sin(point.x * 3) * 2 + Math.cos(point.x * 7) * 1.5;
        }
      } else {
        prediction = 2 * point.x + 0.3 * Math.sin(point.x);
      }
      return { ...point, prediction };
    });
  };

  const currentData = selectedDataset === 'training' ? trainingData : testData;
  const predictions = generatePredictions(currentData);

  // Calculate accuracy
  const accuracy = predictions.reduce((sum, point) => {
    const error = Math.abs(point.y - point.prediction);
    return sum + Math.max(0, 100 - error * 10);
  }, 0) / predictions.length;

  const trainingAccuracy = generatePredictions(trainingData).reduce((sum, point) => {
    const error = Math.abs(point.y - point.prediction);
    return sum + Math.max(0, 100 - error * 10);
  }, 0) / trainingData.length;

  const testAccuracy = generatePredictions(testData).reduce((sum, point) => {
    const error = Math.abs(point.y - point.prediction);
    return sum + Math.max(0, 100 - error * 10);
  }, 0) / testData.length;

  const startTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
  };

  useEffect(() => {
    if (isTraining && trainingStep < 100) {
      const timer = setTimeout(() => {
        setTrainingStep(prev => prev + 2);
      }, 50);
      return () => clearTimeout(timer);
    } else if (trainingStep >= 100) {
      setIsTraining(false);
    }
  }, [isTraining, trainingStep]);

  const getComplexityLabel = () => {
    if (complexity <= 3) return 'Simple Model';
    if (complexity <= 6) return 'Medium Model';
    return 'Complex Model';
  };

  const getOverfittingStatus = () => {
    const gap = trainingAccuracy - testAccuracy;
    if (gap < 10) return { label: 'Good Fit', color: 'emerald' };
    if (gap < 25) return { label: 'Slight Overfitting', color: 'amber' };
    return { label: 'Severe Overfitting', color: 'rose' };
  };

  const status = getOverfittingStatus();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Overfitting Visualizer</h3>
        <p className="text-slate-600">Adjust model complexity and see how it affects training vs test performance</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Model Complexity: {getComplexityLabel()}
            </label>
            <input
              type="range"
              min="1"
              max="9"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Simple</span>
              <span>Complex</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedDataset('training')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  selectedDataset === 'training'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Training Data
              </button>
              <button
                onClick={() => setSelectedDataset('test')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  selectedDataset === 'test'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Test Data
              </button>
            </div>
            
            <button
              onClick={startTraining}
              disabled={isTraining}
              className={`w-full py-2 px-4 rounded font-medium ${
                isTraining
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isTraining ? `Training... ${trainingStep}%` : 'Start Training'}
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Training Accuracy</span>
                  <span className="font-semibold">{trainingAccuracy.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingAccuracy}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Test Accuracy</span>
                  <span className="font-semibold">{testAccuracy.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${testAccuracy}%` }}
                  />
                </div>
              </div>

              <div className={`p-2 rounded text-center text-sm font-medium bg-${status.color}-100 text-${status.color}-700`}>
                {status.label}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-lg border border-slate-200 h-96">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">
              Model Predictions on {selectedDataset === 'training' ? 'Training' : 'Test'} Data
            </h4>
            
            <svg viewBox="0 0 400 250" className="w-full h-full">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <g key={i}>
                  <line
                    x1={50 + i * 60}
                    y1={30}
                    x2={50 + i * 60}
                    y2={220}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <line
                    x1={50}
                    y1={30 + i * 35}
                    x2={350}
                    y2={30 + i * 35}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Axes */}
              <line x1="50" y1="220" x2="350" y2="220" stroke="#374151" strokeWidth="2"/>
              <line x1="50" y1="30" x2="50" y2="220" stroke="#374151" strokeWidth="2"/>

              {/* Data points and predictions */}
              {predictions.map((point, i) => {
                const x = 50 + (point.x * 35);
                const actualY = 220 - (point.y * 10);
                const predY = 220 - (point.prediction * 10);
                
                return (
                  <g key={i}>
                    {/* Error line */}
                    <line
                      x1={x}
                      y1={actualY}
                      x2={x}
                      y2={predY}
                      stroke="#ef4444"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    
                    {/* Actual data point */}
                    <circle
                      cx={x}
                      cy={actualY}
                      r="4"
                      fill={selectedDataset === 'training' ? '#3b82f6' : '#6366f1'}
                      stroke="white"
                      strokeWidth="2"
                    />
                    
                    {/* Prediction point */}
                    <circle
                      cx={x}
                      cy={predY}
                      r="3"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}

              {/* Legend */}
              <g transform="translate(280, 45)">
                <circle cx="0" cy="0" r="4" fill={selectedDataset === 'training' ? '#3b82f6' : '#6366f1'} stroke="white" strokeWidth="2"/>
                <text x="10" y="4" fontSize="12" fill="#374151">Actual</text>
                
                <circle cx="0" cy="20" r="3" fill="#10b981" stroke="white" strokeWidth="2"/>
                <text x="10" y="24" fontSize="12" fill="#374151">Predicted</text>
                
                <line x1="-5" y1="40" x2="5" y2="40" stroke="#ef4444" strokeWidth="2"/>
                <text x="10" y="44" fontSize="12" fill="#374151">Error</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-600 max-w-4xl text-center">
        <strong>Interactive Learning:</strong> Increase model complexity to see overfitting emerge. 
        Complex models memorize training data (high training accuracy) but fail on new test data (low test accuracy).
        The gap between training and test performance indicates overfitting severity.
      </div>
    </div>
  );
}