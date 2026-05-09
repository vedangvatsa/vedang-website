"use client";

import React, { useState } from 'react';

export function RlhfVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([
    { id: 1, text: "The cat sat on the mat. It was a nice day.", quality: 0.3, humanRank: null },
    { id: 2, text: "The graceful feline settled comfortably upon the woven rug, enjoying the warm afternoon sunlight.", quality: 0.8, humanRank: null },
    { id: 3, text: "Cat mat sit good yes very much so indeed.", quality: 0.1, humanRank: null }
  ]);
  const [rewardModelAccuracy, setRewardModelAccuracy] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const steps = [
    "Generate Multiple Outputs",
    "Human Ranking",
    "Train Reward Model",
    "Fine-tune Original Model"
  ];

  const handleHumanRanking = (responseId: number, rank: number) => {
    setResponses(prev => prev.map(r => 
      r.id === responseId ? { ...r, humanRank: rank } : r
    ));
    
    // Calculate reward model accuracy based on how well rankings match quality scores
    const rankedResponses = responses.map(r => 
      r.id === responseId ? { ...r, humanRank: rank } : r
    );
    
    if (rankedResponses.every(r => r.humanRank !== null)) {
      const sortedByQuality = [...rankedResponses].sort((a, b) => b.quality - a.quality);
      const sortedByRank = [...rankedResponses].sort((a, b) => (a.humanRank || 0) - (b.humanRank || 0));
      
      let matches = 0;
      for (let i = 0; i < sortedByQuality.length; i++) {
        if (sortedByQuality[i].id === sortedByRank[i].id) matches++;
      }
      
      setRewardModelAccuracy(matches / sortedByQuality.length);
    }
  };

  const simulateTraining = () => {
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Improve response quality based on reward model
          setResponses(prevResponses => prevResponses.map(r => ({
            ...r,
            quality: Math.min(1, r.quality + (rewardModelAccuracy * 0.4))
          })));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setTrainingProgress(0);
    setRewardModelAccuracy(0);
    setResponses([
      { id: 1, text: "The cat sat on the mat. It was a nice day.", quality: 0.3, humanRank: null },
      { id: 2, text: "The graceful feline settled comfortably upon the woven rug, enjoying the warm afternoon sunlight.", quality: 0.8, humanRank: null },
      { id: 3, text: "Cat mat sit good yes very much so indeed.", quality: 0.1, humanRank: null }
    ]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">
          Reinforcement Learning from Human Feedback (RLHF)
        </h3>
        <p className="text-slate-600 text-lg">
          Interactive demonstration of how AI models learn from human preferences
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-4 mb-6">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === index
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {index + 1}. {step}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-4xl">
        {currentStep === 0 && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-xl font-bold text-slate-800 mb-4">Step 1: Generate Multiple Outputs</h4>
            <p className="text-slate-600 mb-4">The model generates multiple responses to the same prompt:</p>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={response.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-slate-700">Response {index + 1}:</span>
                      <p className="text-slate-800 mt-1">{response.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Quality:</span>
                      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-400 to-emerald-400 transition-all duration-300"
                          style={{ width: `${response.quality * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-xl font-bold text-slate-800 mb-4">Step 2: Human Ranking</h4>
            <p className="text-slate-600 mb-4">Rank these responses from best (1) to worst (3):</p>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={response.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium text-slate-700">Response {index + 1}:</span>
                      <p className="text-slate-800 mt-1">{response.text}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {[1, 2, 3].map(rank => (
                        <button
                          key={rank}
                          onClick={() => handleHumanRanking(response.id, rank)}
                          className={`w-8 h-8 rounded-full border-2 font-bold transition-colors ${
                            response.humanRank === rank
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-slate-300 text-slate-600 hover:border-blue-400'
                          }`}
                        >
                          {rank}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {rewardModelAccuracy > 0 && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-800 font-medium">
                  Ranking Complete! Reward Model Accuracy: {Math.round(rewardModelAccuracy * 100)}%
                </span>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-xl font-bold text-slate-800 mb-4">Step 3: Train Reward Model</h4>
            <p className="text-slate-600 mb-4">A reward model learns to predict human preferences:</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-slate-700 mb-3">Human Rankings:</h5>
                <div className="space-y-2">
                  {responses
                    .sort((a, b) => (a.humanRank || 0) - (b.humanRank || 0))
                    .map((response, index) => (
                    <div key={response.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold ${
                        response.humanRank === 1 ? 'bg-emerald-500' :
                        response.humanRank === 2 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}>
                        {response.humanRank}
                      </div>
                      <span className="text-sm text-slate-600 truncate">
                        {response.text.substring(0, 40)}...
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-slate-700 mb-3">Reward Model Predictions:</h5>
                <div className="space-y-2">
                  {responses
                    .sort((a, b) => b.quality - a.quality)
                    .map((response) => (
                    <div key={response.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${response.quality * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 truncate">
                        Score: {response.quality.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
              <p className="text-indigo-800 font-medium">
                Reward Model Accuracy: {Math.round(rewardModelAccuracy * 100)}%
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-xl font-bold text-slate-800 mb-4">Step 4: Fine-tune Original Model</h4>
            <p className="text-slate-600 mb-4">Use the reward model to improve the original model:</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={simulateTraining}
                  disabled={trainingProgress > 0 && trainingProgress < 100}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {trainingProgress === 0 ? 'Start Training' : 
                   trainingProgress === 100 ? 'Training Complete' : 'Training...'}
                </button>
                
                <div className="flex-1">
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                </div>
                
                <span className="text-slate-600 font-medium">{trainingProgress}%</span>
              </div>

              {trainingProgress === 100 && (
                <div className="space-y-4">
                  <h5 className="font-semibold text-slate-700">Improved Model Outputs:</h5>
                  {responses.map((response, index) => (
                    <div key={response.id} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-slate-700">Response {index + 1} (Improved):</span>
                          <p className="text-slate-800 mt-1">{response.text}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">Quality:</span>
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-rose-400 to-emerald-400 transition-all duration-1000"
                              style={{ width: `${response.quality * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={resetDemo}
        className="px-6 py-2 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600"
      >
        Reset Demo
      </button>
    </div>
  );
}