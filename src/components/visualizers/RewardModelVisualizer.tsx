"use client";

import React, { useState, useEffect } from 'react';

export function RewardModelVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [humanPreferences, setHumanPreferences] = useState<Array<{id: number, outputA: string, outputB: string, preference: 'A' | 'B' | null}>>([]);
  const [rewardScores, setRewardScores] = useState<{[key: string]: number}>({});
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const sampleOutputs = [
    { id: 1, text: "Hello! How can I help you today?", type: "polite" },
    { id: 2, text: "What do you want?", type: "rude" },
    { id: 3, text: "I'd be happy to assist you with any questions.", type: "helpful" },
    { id: 4, text: "I don't know.", type: "unhelpful" },
    { id: 5, text: "Let me provide a detailed explanation...", type: "thorough" },
    { id: 6, text: "Whatever.", type: "dismissive" }
  ];

  const [currentPair, setCurrentPair] = useState({
    outputA: sampleOutputs[0],
    outputB: sampleOutputs[1]
  });

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            calculateRewardScores();
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const handlePreference = (preference: 'A' | 'B') => {
    const newPreference = {
      id: humanPreferences.length + 1,
      outputA: currentPair.outputA.text,
      outputB: currentPair.outputB.text,
      preference
    };
    
    setHumanPreferences(prev => [...prev, newPreference]);
    
    // Generate new random pair
    const shuffled = [...sampleOutputs].sort(() => Math.random() - 0.5);
    setCurrentPair({
      outputA: shuffled[0],
      outputB: shuffled[1]
    });
  };

  const startTraining = () => {
    if (humanPreferences.length >= 3) {
      setIsTraining(true);
      setTrainingProgress(0);
    }
  };

  const calculateRewardScores = () => {
    const scores: {[key: string]: number} = {};
    
    // Initialize scores
    sampleOutputs.forEach(output => {
      scores[output.text] = 0.5; // Base score
    });

    // Adjust scores based on human preferences
    humanPreferences.forEach(pref => {
      const winnerText = pref.preference === 'A' ? pref.outputA : pref.outputB;
      const loserText = pref.preference === 'A' ? pref.outputB : pref.outputA;
      
      scores[winnerText] = Math.min(1.0, scores[winnerText] + 0.2);
      scores[loserText] = Math.max(0.0, scores[loserText] - 0.2);
    });

    setRewardScores(scores);
  };

  const getScoreColor = (score: number) => {
    if (score > 0.7) return "bg-emerald-500";
    if (score > 0.4) return "bg-amber-500";
    return "bg-rose-500";
  };

  const steps = [
    "Collect Human Preferences",
    "Train Reward Model", 
    "Evaluate Model Outputs"
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Reward Model Training</h3>
        <p className="text-slate-600 max-w-2xl">
          Train a neural network to predict human preferences by comparing model outputs. 
          The reward model learns to score outputs based on human feedback.
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center gap-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep >= index 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-200 text-slate-500'
            }`}>
              {index + 1}. {step}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                currentStep > index ? 'bg-indigo-500' : 'bg-slate-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Human Preference Collection */}
      {currentStep === 0 && (
        <div className="w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Compare Model Outputs</h4>
            <p className="text-slate-600 mb-4">Which response do you prefer? Click to indicate your preference.</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handlePreference('A')}
                className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-blue-800 mb-2">Output A</div>
                <div className="text-slate-700">{currentPair.outputA.text}</div>
              </button>
              
              <button
                onClick={() => handlePreference('B')}
                className="p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-rose-800 mb-2">Output B</div>
                <div className="text-slate-700">{currentPair.outputB.text}</div>
              </button>
            </div>
            
            <div className="text-sm text-slate-500">
              Preferences collected: {humanPreferences.length}
              {humanPreferences.length >= 3 && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="ml-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Train Model
                </button>
              )}
            </div>
          </div>

          {/* Preference History */}
          {humanPreferences.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="font-medium text-slate-800 mb-3">Preference History</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {humanPreferences.map((pref) => (
                  <div key={pref.id} className="text-sm p-2 bg-slate-50 rounded">
                    <span className="font-medium">Preferred:</span> "{pref.preference === 'A' ? pref.outputA : pref.outputB}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Training */}
      {currentStep === 1 && (
        <div className="w-full max-w-2xl">
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Training Reward Model</h4>
            
            {!isTraining && trainingProgress === 0 && (
              <button
                onClick={startTraining}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
              >
                Start Training
              </button>
            )}
            
            {(isTraining || trainingProgress > 0) && (
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-200"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
                <p className="text-slate-600">Training Progress: {trainingProgress}%</p>
                
                {trainingProgress === 100 && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                  >
                    View Results
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Evaluation */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Reward Model Scores</h4>
            <p className="text-slate-600 mb-6">The trained model now assigns scores to outputs based on learned preferences:</p>
            
            <div className="grid gap-4">
              {sampleOutputs.map((output) => {
                const score = rewardScores[output.text] || 0.5;
                return (
                  <div key={output.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <div className="text-slate-800">{output.text}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreColor(score)}`}
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-slate-700">
                        {score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setHumanPreferences([]);
                  setRewardScores({});
                  setTrainingProgress(0);
                }}
                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}