"use client";

import { useState, useEffect } from 'react';

export function RandomForestVisualizer() {
  const [numTrees, setNumTrees] = useState(5);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTree, setCurrentTree] = useState(0);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [finalPrediction, setFinalPrediction] = useState<number | null>(null);
  const [hoveredTree, setHoveredTree] = useState<number | null>(null);

  // Sample data points for visualization
  const dataPoints = [
    { x: 2, y: 3, class: 0 },
    { x: 3, y: 4, class: 0 },
    { x: 1, y: 2, class: 0 },
    { x: 7, y: 8, class: 1 },
    { x: 8, y: 7, class: 1 },
    { x: 6, y: 9, class: 1 },
    { x: 5, y: 2, class: 2 },
    { x: 4, y: 1, class: 2 },
    { x: 6, y: 3, class: 2 }
  ];

  const testPoint = { x: 5, y: 5 };

  useEffect(() => {
    if (isTraining) {
      const timer = setInterval(() => {
        setCurrentTree((prev) => {
          if (prev >= numTrees - 1) {
            setIsTraining(false);
            // Generate final prediction by majority vote
            const votes = [0, 0, 0];
            predictions.forEach(pred => votes[pred]++);
            const finalClass = votes.indexOf(Math.max(...votes));
            setFinalPrediction(finalClass);
            return 0;
          }
          return prev + 1;
        });
      }, 800);

      return () => clearInterval(timer);
    }
  }, [isTraining, numTrees, predictions]);

  const trainForest = () => {
    setIsTraining(true);
    setCurrentTree(0);
    setPredictions([]);
    setFinalPrediction(null);
    
    // Simulate training each tree with random predictions
    const newPredictions: number[] = [];
    for (let i = 0; i < numTrees; i++) {
      // Simulate decision tree prediction with some randomness
      const distance0 = Math.sqrt((testPoint.x - 2) ** 2 + (testPoint.y - 3) ** 2);
      const distance1 = Math.sqrt((testPoint.x - 7) ** 2 + (testPoint.y - 8) ** 2);
      const distance2 = Math.sqrt((testPoint.x - 5) ** 2 + (testPoint.y - 2) ** 2);
      
      const noise = (Math.random() - 0.5) * 2;
      let prediction = 0;
      if (distance1 + noise < distance0 && distance1 + noise < distance2) prediction = 1;
      else if (distance2 + noise < distance0 && distance2 + noise < distance1) prediction = 2;
      
      newPredictions.push(prediction);
    }
    setPredictions(newPredictions);
  };

  const getClassColor = (classNum: number) => {
    switch (classNum) {
      case 0: return 'bg-blue-500';
      case 1: return 'bg-emerald-500';
      case 2: return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getClassBorder = (classNum: number) => {
    switch (classNum) {
      case 0: return 'border-blue-500';
      case 1: return 'border-emerald-500';
      case 2: return 'border-rose-500';
      default: return 'border-slate-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Random Forest Classifier</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how multiple decision trees work together. Each tree makes its own prediction, then they vote for the final result.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 min-w-64">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of Trees: {numTrees}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={numTrees}
              onChange={(e) => setNumTrees(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              disabled={isTraining}
            />
          </div>
          
          <button
            onClick={trainForest}
            disabled={isTraining}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isTraining
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            {isTraining ? 'Training...' : 'Train Forest'}
          </button>

          {predictions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-slate-700 mb-2">Tree Predictions:</h4>
              <div className="flex flex-wrap gap-2">
                {predictions.slice(0, isTraining ? currentTree + 1 : predictions.length).map((pred, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-lg ${getClassColor(pred)} flex items-center justify-center text-white text-sm font-medium`}
                  >
                    {pred}
                  </div>
                ))}
              </div>
              
              {finalPrediction !== null && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-medium text-amber-800">Final Prediction (Majority Vote):</div>
                  <div className={`inline-flex items-center gap-2 mt-1`}>
                    <div className={`w-6 h-6 rounded ${getClassColor(finalPrediction)}`}></div>
                    <span className="font-bold text-amber-900">Class {finalPrediction}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-medium text-slate-700 mb-4">Data Visualization</h4>
            
            <div className="relative w-full h-96 border-2 border-slate-200 rounded-lg overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="bg-slate-50">
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Data points */}
                {dataPoints.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={point.x * 40}
                    cy={400 - point.y * 40}
                    r="8"
                    className={`${getClassColor(point.class)} opacity-80`}
                  />
                ))}
                
                {/* Test point */}
                <circle
                  cx={testPoint.x * 40}
                  cy={400 - testPoint.y * 40}
                  r="12"
                  className="fill-amber-400 stroke-amber-600"
                  strokeWidth="3"
                />
                <text
                  x={testPoint.x * 40}
                  y={400 - testPoint.y * 40 - 20}
                  textAnchor="middle"
                  className="text-xs font-medium fill-slate-700"
                >
                  Test Point
                </text>
              </svg>
            </div>
            
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Class 0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Class 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Class 2</span>
              </div>
            </div>
          </div>

          {/* Forest visualization */}
          <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-medium text-slate-700 mb-4">Decision Trees</h4>
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: numTrees }).map((_, idx) => (
                <div
                  key={idx}
                  className={`relative h-20 rounded-lg border-2 transition-all duration-300 ${
                    isTraining && idx === currentTree
                      ? 'border-indigo-500 bg-indigo-50 animate-pulse'
                      : idx < (isTraining ? currentTree : predictions.length)
                      ? `${getClassBorder(predictions[idx])} bg-opacity-10 ${getClassColor(predictions[idx])}`
                      : 'border-slate-200 bg-slate-50'
                  }`}
                  onMouseEnter={() => setHoveredTree(idx)}
                  onMouseLeave={() => setHoveredTree(null)}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-slate-600">Tree {idx + 1}</div>
                    {predictions[idx] !== undefined && (
                      <div className={`mt-1 w-6 h-6 rounded ${getClassColor(predictions[idx])} flex items-center justify-center text-white text-xs font-bold`}>
                        {predictions[idx]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}