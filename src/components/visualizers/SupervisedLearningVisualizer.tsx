"use client";

import { useState } from 'react';

export function SupervisedLearningVisualizer() {
  const [phase, setPhase] = useState<'training' | 'testing'>('training');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [testResults, setTestResults] = useState<{correct: boolean, prediction: string}[]>([]);

  const trainingData = [
    { id: 1, type: 'car', features: ['🔳', '🔳', '○', '○'], label: 'Car', learned: trainingProgress > 20 },
    { id: 2, type: 'car', features: ['🔳', '🔳', '○', '○'], label: 'Car', learned: trainingProgress > 40 },
    { id: 3, type: 'bicycle', features: ['|', '|', '○', '○'], label: 'Bicycle', learned: trainingProgress > 60 },
    { id: 4, type: 'bicycle', features: ['|', '|', '○', '○'], label: 'Bicycle', learned: trainingProgress > 80 },
  ];

  const testData = [
    { id: 5, type: 'car', features: ['🔳', '🔳', '○', '○'], actualLabel: 'Car' },
    { id: 6, type: 'bicycle', features: ['|', '|', '○', '○'], actualLabel: 'Bicycle' },
  ];

  const patterns = {
    car: { windows: '🔳', wheels: '○', confidence: Math.min(trainingProgress / 25, 4) },
    bicycle: { frame: '|', wheels: '○', confidence: Math.min(trainingProgress / 25, 4) }
  };

  const startTraining = () => {
    setTrainingProgress(0);
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const testModel = () => {
    if (trainingProgress < 100) return;
    
    const results = testData.map(item => {
      const hasCarFeatures = item.features.includes('🔳');
      const prediction = hasCarFeatures ? 'Car' : 'Bicycle';
      return {
        correct: prediction === item.actualLabel,
        prediction
      };
    });
    setTestResults(results);
    setPhase('testing');
  };

  const resetVisualization = () => {
    setPhase('training');
    setTrainingProgress(0);
    setTestResults([]);
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Supervised Learning</h3>
        <p className="text-slate-600">Train a model with labeled data, then test it on new examples</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPhase('training')}
          className={`px-4 py-2 rounded-lg font-medium ${
            phase === 'training' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Training Phase
        </button>
        <button
          onClick={() => setPhase('testing')}
          disabled={trainingProgress < 100}
          className={`px-4 py-2 rounded-lg font-medium ${
            phase === 'testing' 
              ? 'bg-indigo-500 text-white' 
              : trainingProgress >= 100
                ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Testing Phase
        </button>
      </div>

      {phase === 'training' && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-slate-700">Training Data (Labeled Examples)</h4>
            <div className="flex gap-2">
              <button
                onClick={startTraining}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Start Training
              </button>
              <button
                onClick={resetVisualization}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {trainingData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedImage === item.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                } ${item.learned ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className="text-center mb-2">
                  <div className="text-2xl mb-2 font-mono">
                    {item.features.join(' ')}
                  </div>
                  <div className={`text-sm font-medium px-2 py-1 rounded ${
                    item.type === 'car' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.label}
                  </div>
                </div>
                {item.learned && (
                  <div className="text-xs text-emerald-600 text-center">✓ Learned</div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h5 className="font-semibold mb-4 text-slate-700">Training Progress</h5>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600 mb-4">{trainingProgress}% Complete</div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h6 className="font-medium text-blue-700 mb-2">Car Pattern</h6>
                <div className="text-sm text-slate-600">
                  <div>Windows: 🔳 (confidence: {patterns.car.confidence.toFixed(1)}/4)</div>
                  <div>Wheels: ○ (confidence: {patterns.car.confidence.toFixed(1)}/4)</div>
                </div>
              </div>
              <div className="bg-rose-50 p-4 rounded">
                <h6 className="font-medium text-rose-700 mb-2">Bicycle Pattern</h6>
                <div className="text-sm text-slate-600">
                  <div>Frame: | (confidence: {patterns.bicycle.confidence.toFixed(1)}/4)</div>
                  <div>Wheels: ○ (confidence: {patterns.bicycle.confidence.toFixed(1)}/4)</div>
                </div>
              </div>
            </div>

            {trainingProgress >= 100 && (
              <div className="mt-4 text-center">
                <button
                  onClick={testModel}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Test Model on New Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'testing' && (
        <div className="w-full max-w-4xl">
          <h4 className="text-lg font-semibold text-slate-700 mb-6">Testing Phase (Unlabeled Data)</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testData.map((item, index) => (
              <div key={item.id} className="bg-white p-6 rounded-lg border">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-3 font-mono">
                    {item.features.join(' ')}
                  </div>
                  <div className="text-slate-500 mb-2">Unknown Image #{index + 1}</div>
                </div>
                
                {testResults.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Model Prediction:</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        testResults[index]?.prediction === 'Car'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {testResults[index]?.prediction}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Actual Label:</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        item.actualLabel === 'Car'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.actualLabel}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        testResults[index]?.correct
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {testResults[index]?.correct ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {testResults.length > 0 && (
            <div className="bg-white p-6 rounded-lg border mt-6 text-center">
              <h5 className="font-semibold mb-2">Model Accuracy</h5>
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round((testResults.filter(r => r.correct).length / testResults.length) * 100)}%
              </div>
              <div className="text-sm text-slate-600">
                {testResults.filter(r => r.correct).length} out of {testResults.length} predictions correct
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}