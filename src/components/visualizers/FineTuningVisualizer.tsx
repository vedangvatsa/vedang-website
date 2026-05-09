"use client";

import React, { useState, useEffect } from 'react';

export function FineTuningVisualizer() {
  const [trainingStep, setTrainingStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('medical');
  const [modelAccuracy, setModelAccuracy] = useState({ general: 75, specialized: 45 });

  const domains = {
    medical: { 
      name: 'Medical', 
      color: 'rose', 
      data: ['patient symptoms', 'drug interactions', 'medical terminology', 'diagnosis patterns'],
      finalAccuracy: 92
    },
    legal: { 
      name: 'Legal', 
      color: 'indigo', 
      data: ['contract clauses', 'legal precedents', 'statutory language', 'case law'],
      finalAccuracy: 89
    },
    code: { 
      name: 'Programming', 
      color: 'emerald', 
      data: ['code syntax', 'debugging patterns', 'API documentation', 'algorithm logic'],
      finalAccuracy: 94
    }
  };

  const maxSteps = 8;

  useEffect(() => {
    if (isTraining && trainingStep < maxSteps) {
      const timer = setTimeout(() => {
        setTrainingStep(prev => prev + 1);
        const progress = (trainingStep + 1) / maxSteps;
        const targetAccuracy = domains[selectedDomain].finalAccuracy;
        const currentSpecialized = Math.round(45 + (targetAccuracy - 45) * progress);
        setModelAccuracy(prev => ({
          ...prev,
          specialized: currentSpecialized
        }));
      }, 800);
      return () => clearTimeout(timer);
    } else if (trainingStep >= maxSteps) {
      setIsTraining(false);
    }
  }, [isTraining, trainingStep, selectedDomain]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
    setModelAccuracy(prev => ({ ...prev, specialized: 45 }));
  };

  const resetTraining = () => {
    setIsTraining(false);
    setTrainingStep(0);
    setModelAccuracy(prev => ({ ...prev, specialized: 45 }));
  };

  const getColorClasses = (domain) => {
    const colorMap = {
      rose: 'bg-rose-100 border-rose-300 text-rose-800',
      indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
      emerald: 'bg-emerald-100 border-emerald-300 text-emerald-800'
    };
    return colorMap[domains[domain].color];
  };

  const getAccuracyBarColor = (accuracy) => {
    if (accuracy >= 90) return 'bg-emerald-500';
    if (accuracy >= 80) return 'bg-amber-500';
    if (accuracy >= 70) return 'bg-blue-500';
    return 'bg-slate-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Fine-Tuning Visualization</h3>
        <p className="text-slate-600">Watch how a pre-trained model adapts to specialized domains through additional training</p>
      </div>

      {/* Domain Selection */}
      <div className="flex gap-4">
        {Object.entries(domains).map(([key, domain]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedDomain(key);
              resetTraining();
            }}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedDomain === key 
                ? getColorClasses(key)
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {domain.name}
          </button>
        ))}
      </div>

      {/* Model Architecture */}
      <div className="flex items-center gap-8 w-full max-w-4xl">
        {/* Pre-trained Model */}
        <div className="flex-1">
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6">
            <h4 className="text-blue-800 font-semibold mb-3">Pre-trained Model</h4>
            <div className="space-y-2">
              {['Language Understanding', 'Grammar & Syntax', 'General Knowledge', 'Reasoning'].map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700 text-sm">{skill}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-700 mb-1">
                <span>General Accuracy</span>
                <span>{modelAccuracy.general}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${modelAccuracy.general}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <div className="text-2xl">→</div>
          <span className="text-sm text-slate-500 mt-1">Fine-tune</span>
        </div>

        {/* Specialized Model */}
        <div className="flex-1">
          <div className={`border-2 rounded-lg p-6 transition-all duration-500 ${getColorClasses(selectedDomain)}`}>
            <h4 className="font-semibold mb-3">
              {domains[selectedDomain].name} Specialist
            </h4>
            <div className="space-y-2 mb-4">
              {domains[selectedDomain].data.map((skill, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 transition-opacity duration-500 ${
                    trainingStep > idx * 2 ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    trainingStep > idx * 2 
                      ? `bg-${domains[selectedDomain].color}-500` 
                      : 'bg-slate-300'
                  }`}></div>
                  <span className="text-sm">{skill}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Specialized Accuracy</span>
                <span>{modelAccuracy.specialized}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getAccuracyBarColor(modelAccuracy.specialized)}`}
                  style={{ width: `${modelAccuracy.specialized}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Progress */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-slate-700">Training Progress</h4>
          <span className="text-sm text-slate-500">Step {trainingStep}/{maxSteps}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(trainingStep / maxSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={startTraining}
          disabled={isTraining}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTraining ? 'Training...' : 'Start Fine-Tuning'}
        </button>
        <button
          onClick={resetTraining}
          className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Status */}
      {trainingStep >= maxSteps && (
        <div className="text-center p-4 bg-emerald-100 border border-emerald-300 rounded-lg">
          <p className="text-emerald-800 font-medium">
            Fine-tuning complete! The model now excels at {domains[selectedDomain].name.toLowerCase()} tasks 
            with {modelAccuracy.specialized}% accuracy.
          </p>
        </div>
      )}
    </div>
  );
}