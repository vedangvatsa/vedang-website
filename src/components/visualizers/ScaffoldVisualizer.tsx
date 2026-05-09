"use client";

import React, { useState } from 'react';

export function ScaffoldVisualizer() {
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepInputs, setStepInputs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const problems = [
    {
      title: "Calculate Compound Interest",
      description: "Find the final amount after 3 years with $1000 principal at 5% annual interest",
      steps: [
        { label: "Identify Variables", hint: "What are P, r, t, and n?", answer: "P=$1000, r=5%=0.05, t=3 years, n=1 (annually)" },
        { label: "Choose Formula", hint: "What's the compound interest formula?", answer: "A = P(1 + r/n)^(nt)" },
        { label: "Substitute Values", hint: "Replace variables with numbers", answer: "A = 1000(1 + 0.05/1)^(1×3)" },
        { label: "Calculate Result", hint: "Solve the equation", answer: "A = 1000(1.05)^3 = 1000 × 1.157625 = $1,157.63" },
        { label: "Verify", hint: "Does this make sense?", answer: "Yes, 5% growth over 3 years should be ~15.8% total growth" }
      ]
    },
    {
      title: "Analyze Data Pattern",
      description: "Determine if the sequence 2, 6, 18, 54 follows a pattern",
      steps: [
        { label: "Examine Data", hint: "What do you notice about consecutive terms?", answer: "2, 6, 18, 54 - each term appears to be multiplied by 3" },
        { label: "Identify Pattern", hint: "What's the relationship?", answer: "Geometric sequence with first term a₁=2 and ratio r=3" },
        { label: "Test Hypothesis", hint: "Verify the pattern holds", answer: "2×3=6 ✓, 6×3=18 ✓, 18×3=54 ✓" },
        { label: "Predict Next", hint: "What comes next?", answer: "Next term: 54×3=162" },
        { label: "General Formula", hint: "Express as equation", answer: "aₙ = 2 × 3^(n-1) where n is the position" }
      ]
    }
  ];

  const handleStepInput = (value: string, stepIndex: number) => {
    const newInputs = [...stepInputs];
    newInputs[stepIndex] = value;
    setStepInputs(newInputs);
  };

  const checkStep = (stepIndex: number) => {
    const userInput = stepInputs[stepIndex]?.toLowerCase().trim();
    const correctAnswer = problems[selectedProblem].steps[stepIndex].answer.toLowerCase();
    return userInput.length > 10 && (
      correctAnswer.includes(userInput.substring(0, 15)) || 
      userInput.includes(correctAnswer.substring(0, 15))
    );
  };

  const nextStep = () => {
    if (currentStep < problems[selectedProblem].steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const resetProblem = () => {
    setCurrentStep(0);
    setStepInputs([]);
    setIsComplete(false);
  };

  const switchProblem = (problemIndex: number) => {
    setSelectedProblem(problemIndex);
    resetProblem();
  };

  const currentProblem = problems[selectedProblem];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Scaffolding Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Experience how AI scaffolding breaks down complex problems into structured steps. Choose a problem and work through each guided stage.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        {problems.map((problem, index) => (
          <button
            key={index}
            onClick={() => switchProblem(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProblem === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            Problem {index + 1}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-indigo-500 text-white p-4">
          <h4 className="text-lg font-semibold">{currentProblem.title}</h4>
          <p className="text-indigo-100 text-sm mt-1">{currentProblem.description}</p>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            {currentProblem.steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? (index === currentStep ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white')
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < currentProblem.steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {!isComplete ? (
            <div className="space-y-6">
              {currentProblem.steps.map((step, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all ${
                    index === currentStep
                      ? 'border-blue-300 bg-blue-50'
                      : index < currentStep
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-slate-800">{step.label}</h5>
                    {index < currentStep && (
                      <span className="text-emerald-600 font-medium">✓ Complete</span>
                    )}
                  </div>
                  
                  {index <= currentStep && (
                    <>
                      <p className="text-slate-600 text-sm mb-3">{step.hint}</p>
                      <textarea
                        value={stepInputs[index] || ''}
                        onChange={(e) => handleStepInput(e.target.value, index)}
                        placeholder="Enter your answer here..."
                        className="w-full p-3 border border-slate-300 rounded-lg resize-none"
                        rows={2}
                        disabled={index < currentStep}
                      />
                      {index < currentStep && (
                        <div className="mt-2 p-2 bg-emerald-100 rounded text-emerald-800 text-sm">
                          <strong>Answer:</strong> {step.answer}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {currentStep < currentProblem.steps.length && (
                <div className="flex justify-center">
                  <button
                    onClick={nextStep}
                    disabled={!checkStep(currentStep) && stepInputs[currentStep]?.length < 10}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      checkStep(currentStep) || stepInputs[currentStep]?.length >= 10
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {currentStep === currentProblem.steps.length - 1 ? 'Complete' : 'Next Step'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h4 className="text-xl font-semibold text-emerald-600">Problem Solved!</h4>
              <p className="text-slate-600">You've successfully worked through the scaffolded approach.</p>
              <button
                onClick={resetProblem}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-slate-600 text-sm">
          <strong>Key Insight:</strong> Scaffolding prevents AI models from jumping to conclusions by enforcing a step-by-step reasoning process. 
          Each step builds on the previous one, reducing errors and improving explanation quality.
        </p>
      </div>
    </div>
  );
}               <rect x={x} y={30} width={120} height={80} rx={12}
                  fill={isCurrent ? '#6366f1' : isActive ? '#eff6ff' : '#f8fafc'}
                  stroke={isActive ? '#6366f1' : '#e2e8f0'} strokeWidth={isCurrent ? 2.5 : 1.5}
                  className="transition-all duration-300" />
                <text x={x + 60} y={55} textAnchor="middle" fontSize="16">{p.icon}</text>
                <text x={x + 60} y={75} textAnchor="middle" fontSize="8" fill={isCurrent ? 'white' : '#334155'} fontWeight="600">{p.name}</text>
                <text x={x + 60} y={98} textAnchor="middle" fontSize="7" fill={isCurrent ? 'rgba(255,255,255,0.8)' : '#64748b'}>{p.desc}</text>

                {/* Items */}
                {isCurrent && p.items.map((item, j) => (
                  <g key={j} transform={`translate(${x + 10}, ${125 + j * 25})`}>
                    <rect width={100} height={20} rx={4} fill="#f0f0ff" stroke="#c7d2fe" />
                    <text x={50} y={14} textAnchor="middle" fontSize="7" fill="#4338ca" fontWeight="600">{item}</text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* Progress bar */}
          <rect x={40} y={220} width={520} height={6} rx={3} fill="#e2e8f0" />
          <rect x={40} y={220} width={520 * ((phase + 1) / phases.length)} height={6} rx={3} fill="#6366f1" className="transition-all duration-500" />
        </svg>
      </div>

      <div className="flex gap-2">
        {phases.map((p, i) => (
          <button key={i} onClick={() => setPhase(i)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${phase === i ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        Scaffolding gives AI agents a structured execution framework instead of trying to solve everything in one pass. The agent decomposes the task, selects appropriate tools, executes subtasks, and synthesizes results. Frameworks like LangChain, CrewAI, and AutoGPT implement various scaffolding patterns for building reliable AI agents.
      </p>
    </div>
  );
}