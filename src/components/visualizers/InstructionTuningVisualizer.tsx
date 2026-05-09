"use client";

import { useState } from 'react';

export function InstructionTuningVisualizer() {
  const [selectedTask, setSelectedTask] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [trainedTasks, setTrainedTasks] = useState(new Set());
  const [modelResponse, setModelResponse] = useState('');

  const tasks = [
    {
      category: 'Question Answering',
      instruction: 'Answer the following question based on the context:',
      input: 'Context: The Eiffel Tower was built in 1889. Question: When was the Eiffel Tower built?',
      output: 'The Eiffel Tower was built in 1889.',
      color: 'blue'
    },
    {
      category: 'Summarization',
      instruction: 'Summarize the following text in one sentence:',
      input: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It involves algorithms that can identify patterns in data.',
      output: 'Machine learning is an AI subset that allows computers to learn from data patterns without explicit programming.',
      color: 'indigo'
    },
    {
      category: 'Translation',
      instruction: 'Translate the following English text to French:',
      input: 'Hello, how are you today?',
      output: 'Bonjour, comment allez-vous aujourd\'hui?',
      color: 'emerald'
    },
    {
      category: 'Code Generation',
      instruction: 'Write a Python function that:',
      input: 'Creates a function to calculate the factorial of a number',
      output: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)',
      color: 'amber'
    },
    {
      category: 'Creative Writing',
      instruction: 'Write a short poem about:',
      input: 'The ocean at sunset',
      output: 'Golden waves dance in evening light,\nAs sun melts into ocean blue,\nWhispers of tide bid day goodnight,\nPainting dreams in crimson hue.',
      color: 'rose'
    }
  ];

  const handleTrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      setTrainedTasks(new Set([...trainedTasks, selectedTask]));
      setIsTraining(false);
      setModelResponse(tasks[selectedTask].output);
    }, 1500);
  };

  const handleTest = () => {
    if (trainedTasks.has(selectedTask)) {
      setModelResponse(tasks[selectedTask].output);
    } else {
      setModelResponse('Error: Model not trained on this task type yet.');
    }
  };

  const resetModel = () => {
    setTrainedTasks(new Set());
    setModelResponse('');
  };

  const currentTask = tasks[selectedTask];
  const isTaskTrained = trainedTasks.has(selectedTask);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Instruction Tuning</h3>
        <p className="text-lg text-slate-600 max-w-2xl">
          Train language models on diverse instruction-response pairs to follow natural language commands across multiple task types
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Task Selection */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Training Data: Task Types</h4>
          <div className="grid grid-cols-5 gap-2">
            {tasks.map((task, index) => (
              <button
                key={index}
                onClick={() => setSelectedTask(index)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedTask === index
                    ? `bg-${task.color}-100 border-2 border-${task.color}-500 text-${task.color}-800`
                    : 'bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200'
                } ${trainedTasks.has(index) ? 'ring-2 ring-emerald-400' : ''}`}
              >
                {task.category}
                {trainedTasks.has(index) && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Training Example */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">
            Training Example: {currentTask.category}
          </h4>
          <div className="space-y-4">
            <div className={`p-4 bg-${currentTask.color}-50 rounded-lg border border-${currentTask.color}-200`}>
              <div className="font-medium text-slate-700 mb-2">Instruction:</div>
              <div className="text-slate-800">{currentTask.instruction}</div>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
              <div className="font-medium text-slate-700 mb-2">Input:</div>
              <div className="text-slate-800 whitespace-pre-wrap">{currentTask.input}</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="font-medium text-slate-700 mb-2">Expected Output:</div>
              <div className="text-slate-800 whitespace-pre-wrap">{currentTask.output}</div>
            </div>
          </div>
        </div>

        {/* Training Controls */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Model Training</h4>
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleTrain}
              disabled={isTraining || isTaskTrained}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isTaskTrained
                  ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                  : isTraining
                  ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isTraining ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Training...
                </div>
              ) : isTaskTrained ? (
                '✓ Trained'
              ) : (
                'Train on This Task'
              )}
            </button>
            <button
              onClick={handleTest}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Test Model
            </button>
            <button
              onClick={resetModel}
              className="px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
            >
              Reset Model
            </button>
          </div>
          <div className="text-sm text-slate-600">
            Trained Tasks: {trainedTasks.size}/{tasks.length}
          </div>
        </div>

        {/* Model Output */}
        {modelResponse && (
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Model Response</h4>
            <div className={`p-4 rounded-lg border ${
              modelResponse.startsWith('Error:')
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-slate-800'
            }`}>
              <div className="whitespace-pre-wrap">{modelResponse}</div>
            </div>
          </div>
        )}

        {/* Progress Visualization */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Training Progress</h4>
          <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(trainedTasks.size / tasks.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-slate-600 text-center">
            Model can handle {trainedTasks.size} out of {tasks.length} task types
          </div>
        </div>
      </div>
    </div>
  );
}