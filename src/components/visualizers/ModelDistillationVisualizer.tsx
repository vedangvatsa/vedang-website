"use client";

import { useState } from 'react';

export function ModelDistillationVisualizer() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [temperature, setTemperature] = useState(3);

  const images = [
    { name: "Cat", correct: 0 },
    { name: "Dog", correct: 1 },
    { name: "Fox", correct: 2 }
  ];

  const teacherConfidences = [
    [0.85, 0.10, 0.05], // Cat image
    [0.15, 0.80, 0.05], // Dog image
    [0.20, 0.15, 0.65]  // Fox image
  ];

  const softmax = (logits: number[], temp: number) => {
    const scaled = logits.map(x => x / temp);
    const maxVal = Math.max(...scaled);
    const exp = scaled.map(x => Math.exp(x - maxVal));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(x => x / sum);
  };

  const getStudentPrediction = (step: number, imageIdx: number) => {
    const baseLogits = [1.2, 1.8, 1.0];
    const targetLogits = teacherConfidences[imageIdx].map(x => Math.log(x + 1e-8));
    const progress = Math.min(step / 100, 1);
    
    const currentLogits = baseLogits.map((base, i) => 
      base + progress * (targetLogits[i] - base)
    );
    
    return softmax(currentLogits, 1);
  };

  const startTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
    
    const interval = setInterval(() => {
      setTrainingStep(prev => {
        if (prev >= 100) {
          setIsTraining(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const resetTraining = () => {
    setTrainingStep(0);
    setIsTraining(false);
  };

  const currentTeacher = teacherConfidences[selectedImage];
  const currentStudent = getStudentPrediction(trainingStep, selectedImage);
  const classes = ["Cat", "Dog", "Fox"];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Model Distillation</h3>
        <p className="text-slate-600">Interactive visualization of knowledge transfer from teacher to student model</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 lg:w-1/4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Image:</label>
            <div className="flex flex-col gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedImage === idx 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Temperature: {temperature}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={startTraining}
              disabled={isTraining}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTraining ? 'Training...' : 'Start Training'}
            </button>
            <button
              onClick={resetTraining}
              className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="text-sm text-slate-600">
            Training Progress: {trainingStep}%
          </div>
        </div>

        {/* Teacher Model */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            Teacher Model (Large)
          </h4>
          
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Prediction for: {images[selectedImage].name}
            </div>
            
            {classes.map((cls, idx) => {
              const confidence = currentTeacher[idx];
              const softmaxValue = softmax([Math.log(confidence + 1e-8)], temperature)[0];
              
              return (
                <div key={cls} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{cls}</span>
                    <span className="font-mono text-emerald-600">
                      {(confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            Rich probability distribution provides soft targets for student learning
          </div>
        </div>

        {/* Student Model */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-rose-700 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            Student Model (Small)
          </h4>
          
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Learning from teacher...
            </div>
            
            {classes.map((cls, idx) => {
              const confidence = currentStudent[idx];
              
              return (
                <div key={cls} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{cls}</span>
                    <span className="font-mono text-rose-600">
                      {(confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-rose-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            Student learns to mimic teacher's confidence patterns, not just hard labels
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="text-sm text-amber-800">
          <strong>Key Insight:</strong> Instead of learning "the answer is {classes[images[selectedImage].correct]}", 
          the student learns the full probability distribution from the teacher. This transfers more nuanced 
          knowledge about relationships between classes and uncertainty patterns.
        </div>
      </div>
    </div>
  );
}