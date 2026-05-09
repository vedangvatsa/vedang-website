"use client";

import { useState, useEffect } from 'react';

export function SemiSupervisedLearningVisualizer() {
  const [labeledData, setLabeledData] = useState(10);
  const [unlabeledData, setUnlabeledData] = useState(100);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  const [modelConfidence, setModelConfidence] = useState(0);
  const [pseudoLabels, setPseudoLabels] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingStep(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            return 0;
          }
          const newStep = prev + 2;
          const confidence = Math.min(95, newStep * 0.9);
          const newPseudoLabels = Math.floor((confidence / 100) * unlabeledData * 0.6);
          const totalLabeled = labeledData + newPseudoLabels;
          const newAccuracy = Math.min(95, 40 + (totalLabeled / (labeledData + unlabeledData)) * 50);
          
          setModelConfidence(confidence);
          setPseudoLabels(newPseudoLabels);
          setAccuracy(newAccuracy);
          
          return newStep;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTraining, labeledData, unlabeledData]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
    setModelConfidence(0);
    setPseudoLabels(0);
    setAccuracy(40);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setTrainingStep(0);
    setModelConfidence(0);
    setPseudoLabels(0);
    setAccuracy(0);
  };

  const renderDataPoints = (count: number, color: string, label: string) => {
    return Array.from({ length: Math.min(count, 50) }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full ${color} border border-slate-300 transition-all duration-300`}
        title={label}
      />
    ));
  };

  const renderPseudoLabeledPoints = () => {
    return Array.from({ length: Math.min(pseudoLabels, 30) }, (_, i) => (
      <div
        key={i}
        className="w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-600 transition-all duration-500 animate-pulse"
        title="Pseudo-labeled data"
      />
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Semi-Supervised Learning</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how a model leverages both labeled and unlabeled data to improve performance by generating pseudo-labels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Data Configuration</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Labeled Data: {labeledData} samples
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={labeledData}
                onChange={(e) => setLabeledData(Number(e.target.value))}
                disabled={isTraining}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Unlabeled Data: {unlabeledData} samples
              </label>
              <input
                type="range"
                min="50"
                max="200"
                value={unlabeledData}
                onChange={(e) => setUnlabeledData(Number(e.target.value))}
                disabled={isTraining}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={startTraining}
              disabled={isTraining}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isTraining ? 'Training...' : 'Start Training'}
            </button>
            <button
              onClick={resetTraining}
              className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Training Progress</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Training Progress</span>
                <span>{trainingStep}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${trainingStep}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-emerald-600">{modelConfidence.toFixed(1)}%</div>
                <div className="text-xs text-slate-600">Model Confidence</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{accuracy.toFixed(1)}%</div>
                <div className="text-xs text-slate-600">Estimated Accuracy</div>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-amber-600">{pseudoLabels}</div>
                <div className="text-xs text-slate-600">Pseudo-labels Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-700 mb-4">Data Visualization</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h5 className="text-sm font-medium text-blue-600 mb-3">Labeled Data</h5>
            <div className="flex flex-wrap gap-1 justify-center min-h-[120px] p-4 bg-blue-50 rounded-lg">
              {renderDataPoints(labeledData, 'bg-blue-500', 'Labeled data')}
            </div>
            <p className="text-xs text-slate-500 mt-2">Expensive but high-quality</p>
          </div>

          <div className="text-center">
            <h5 className="text-sm font-medium text-slate-600 mb-3">Unlabeled Data</h5>
            <div className="flex flex-wrap gap-1 justify-center min-h-[120px] p-4 bg-slate-100 rounded-lg">
              {renderDataPoints(Math.min(unlabeledData, 50), 'bg-slate-400', 'Unlabeled data')}
            </div>
            <p className="text-xs text-slate-500 mt-2">Abundant but unlabeled</p>
          </div>

          <div className="text-center">
            <h5 className="text-sm font-medium text-amber-600 mb-3">Pseudo-labeled</h5>
            <div className="flex flex-wrap gap-1 justify-center min-h-[120px] p-4 bg-amber-50 rounded-lg">
              {renderPseudoLabeledPoints()}
            </div>
            <p className="text-xs text-slate-500 mt-2">Model-generated labels</p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            The model initially trains on labeled data, then uses high-confidence predictions to create pseudo-labels for unlabeled data, 
            effectively expanding the training set and improving performance.
          </p>
        </div>
      </div>
    </div>
  );
}