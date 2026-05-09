"use client";

import React, { useState, useEffect } from 'react';

export function KnowledgeDistillationVisualizer() {
  const [temperature, setTemperature] = useState(3);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  const [selectedSample, setSelectedSample] = useState(0);

  const samples = [
    { input: "🐱", teacherLogits: [4.2, 1.8, 0.5], trueLabel: 0, name: "Cat" },
    { input: "🐕", teacherLogits: [1.2, 4.5, 0.8], trueLabel: 1, name: "Dog" },
    { input: "🐰", teacherLogits: [2.1, 2.3, 3.8], trueLabel: 2, name: "Rabbit" }
  ];

  const classes = ["Cat", "Dog", "Rabbit"];

  const softmax = (logits: number[], temp: number = 1) => {
    const scaled = logits.map(l => l / temp);
    const maxLogit = Math.max(...scaled);
    const exp = scaled.map(l => Math.exp(l - maxLogit));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(e => e / sum);
  };

  const currentSample = samples[selectedSample];
  const teacherProbs = softmax(currentSample.teacherLogits, 1);
  const softTeacherProbs = softmax(currentSample.teacherLogits, temperature);

  const studentLogits = [
    currentSample.teacherLogits[0] * (0.3 + trainingStep * 0.02),
    currentSample.teacherLogits[1] * (0.3 + trainingStep * 0.02),
    currentSample.teacherLogits[2] * (0.3 + trainingStep * 0.02)
  ];
  const studentProbs = softmax(studentLogits, 1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingStep(prev => {
          if (prev >= 35) {
            setIsTraining(false);
            return 35;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTraining]);

  const ProbabilityBar = ({ label, prob, color, isTarget = false }: { 
    label: string; 
    prob: number; 
    color: string; 
    isTarget?: boolean;
  }) => (
    <div className="flex items-center gap-3 w-full">
      <div className="w-12 text-sm font-medium text-slate-600">{label}</div>
      <div className="flex-1 bg-slate-200 rounded-full h-6 relative overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color} ${isTarget ? 'ring-2 ring-amber-400' : ''}`}
          style={{ width: `${prob * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
          {(prob * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Knowledge Distillation</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how a student model learns from soft probability distributions instead of hard labels. 
          The teacher's uncertainty and near-miss predictions contain valuable knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Input Sample Selection */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Input Sample</h4>
          <div className="flex gap-2 mb-4">
            {samples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSample(idx)}
                className={`p-3 rounded-lg border-2 transition-all text-2xl ${
                  selectedSample === idx 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {sample.input}
              </button>
            ))}
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">{currentSample.input}</div>
            <div className="text-sm text-slate-600">True Label: {currentSample.name}</div>
          </div>
        </div>

        {/* Teacher Model */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">🎓 Teacher Model (Large)</h4>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700 mb-2">Confident Predictions:</div>
            {classes.map((cls, idx) => (
              <ProbabilityBar
                key={idx}
                label={cls}
                prob={teacherProbs[idx]}
                color="bg-indigo-500"
              />
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-slate-700">Soft Targets (T=</span>
              <input
                type="range"
                min="1"
                max="10"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-slate-700">{temperature})</span>
            </div>
            <div className="space-y-2">
              {classes.map((cls, idx) => (
                <ProbabilityBar
                  key={idx}
                  label={cls}
                  prob={softTeacherProbs[idx]}
                  color="bg-emerald-500"
                  isTarget={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Student Model */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">🎒 Student Model (Small)</h4>
          <div className="space-y-3 mb-6">
            <div className="text-sm font-medium text-slate-700 mb-2">Learning Progress:</div>
            {classes.map((cls, idx) => (
              <ProbabilityBar
                key={idx}
                label={cls}
                prob={studentProbs[idx]}
                color="bg-rose-500"
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setIsTraining(!isTraining);
                if (!isTraining) setTrainingStep(0);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isTraining 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isTraining ? 'Stop Training' : 'Start Distillation'}
            </button>
            
            <div className="text-center">
              <div className="text-sm text-slate-600">Training Step: {trainingStep}/35</div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${(trainingStep / 35) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full max-w-4xl">
        <h5 className="font-semibold text-amber-800 mb-2">💡 Key Insights:</h5>
        <div className="text-sm text-amber-700 space-y-1">
          <div>• <strong>Temperature Scaling:</strong> Higher T={temperature} makes teacher predictions softer, revealing more about class relationships</div>
          <div>• <strong>Rich Supervision:</strong> Student learns from probability distributions, not just hard labels</div>
          <div>• <strong>Dark Knowledge:</strong> The teacher's uncertainty and near-miss predictions transfer valuable knowledge</div>
        </div>
      </div>
    </div>
  );
}