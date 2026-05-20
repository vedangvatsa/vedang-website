"use client";

import { useState } from 'react';

export function FewShotPromptingVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [selectedTask, setSelectedTask] = useState<'sentiment' | 'translation' | 'classification'>('sentiment');

  const tasks = {
    sentiment: {
      name: 'Sentiment Analysis',
      examples: [
        { input: 'I love this movie!', output: 'Positive' },
        { input: 'This is terrible.', output: 'Negative' },
        { input: 'Best day ever!', output: 'Positive' }
      ],
      testInput: 'I hate waiting in line.',
      expectedOutput: 'Negative'
    },
    translation: {
      name: 'English to Spanish',
      examples: [
        { input: 'Hello', output: 'Hola' },
        { input: 'Thank you', output: 'Gracias' },
        { input: 'Good morning', output: 'Buenos días' }
      ],
      testInput: 'Good night',
      expectedOutput: 'Buenas noches'
    },
    classification: {
      name: 'Animal Classification',
      examples: [
        { input: 'Lion', output: 'Mammal' },
        { input: 'Eagle', output: 'Bird' },
        { input: 'Shark', output: 'Fish' }
      ],
      testInput: 'Dolphin',
      expectedOutput: 'Mammal'
    }
  };

  const currentTask = tasks[selectedTask];
  const maxSteps = currentTask.examples.length + 1;

  const handleStepForward = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
      if (currentStep === maxSteps - 1) {
        setShowOutput(true);
      }
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowOutput(false);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setShowOutput(false);
    setUserInput('');
  };

  const handleTaskChange = (taskKey: 'sentiment' | 'translation' | 'classification') => {
    setSelectedTask(taskKey);
    resetDemo();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Few-Shot Prompting Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how AI models learn patterns from just a few examples to perform new tasks without training updates
        </p>
      </div>

      {/* Task Selection */}
      <div className="flex gap-2 mb-4">
        {Object.entries(tasks).map(([key, task]) => (
          <button
            key={key}
            onClick={() => handleTaskChange(key as 'sentiment' | 'translation' | 'classification')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTask === key
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {task.name}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between mb-2 text-sm text-slate-600">
          <span>Examples</span>
          <span>Your Task</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / maxSteps) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-slate-600">
          Step {currentStep} of {maxSteps}
        </div>
      </div>

      {/* Prompt Construction Area */}
      <div className="w-full max-w-3xl bg-white rounded-xl border border-slate-200 p-6">
        <div className="space-y-4">
          {/* Examples */}
          {currentTask.examples.map((example, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                currentStep > index
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Example {index + 1}:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono text-sm">
                  {example.input}
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md font-mono text-sm">
                  {example.output}
                </span>
              </div>
              {currentStep > index && (
                <div className="ml-auto">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* User Input Section */}
          {currentStep === maxSteps && (
            <div className="p-4 rounded-lg border-2 border-rose-300 bg-rose-50 animate-pulse">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500">Your task:</span>
                <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-md font-mono text-sm">
                  {currentTask.testInput}
                </span>
                <span className="text-slate-400">→</span>
                {showOutput ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md font-mono text-sm animate-fade-in">
                    {currentTask.expectedOutput}
                  </span>
                ) : (
                  <div className="px-3 py-1 bg-slate-100 text-slate-400 rounded-md font-mono text-sm">
                    ?
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pattern Recognition Indicator */}
        {currentStep >= 2 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">AI Pattern Recognition Active</span>
            </div>
            <p className="text-sm text-blue-600">
              Model is identifying the input-output pattern from {currentStep} examples...
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleStepBack}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-slate-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
        >
          ← Previous
        </button>
        
        {currentStep < maxSteps ? (
          <button
            onClick={handleStepForward}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            {currentStep === maxSteps - 1 ? 'Generate Output' : 'Add Example'} →
          </button>
        ) : (
          <button
            onClick={resetDemo}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            🔄 Reset Demo
          </button>
        )}
      </div>

      {/* Key Insight */}
      {showOutput && (
        <div className="max-w-2xl text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-2">🎯 Few-Shot Learning Complete!</h4>
          <p className="text-sm text-amber-700">
            The AI learned the pattern from just {currentTask.examples.length} examples and applied it to new input - no training required!
          </p>
        </div>
      )}
    </div>
  );
}