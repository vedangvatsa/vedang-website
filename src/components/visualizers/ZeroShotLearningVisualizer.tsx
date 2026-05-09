"use client";

import React, { useState } from 'react';

export function ZeroShotLearningVisualizer() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [hoveredPattern, setHoveredPattern] = useState<string | null>(null);

  const trainingTasks = [
    { id: 'translate-es', name: 'Spanish Translation', pattern: 'language-structure' },
    { id: 'translate-fr', name: 'French Translation', pattern: 'language-structure' },
    { id: 'math-basic', name: 'Basic Math', pattern: 'logical-reasoning' },
    { id: 'story-write', name: 'Story Writing', pattern: 'narrative-flow' },
    { id: 'code-python', name: 'Python Coding', pattern: 'syntax-patterns' }
  ];

  const zeroShotTasks = [
    { 
      id: 'translate-italian', 
      name: 'Italian Translation', 
      pattern: 'language-structure',
      example: 'Hello → Ciao',
      confidence: 85
    },
    { 
      id: 'math-advanced', 
      name: 'Advanced Calculus', 
      pattern: 'logical-reasoning',
      example: '∫x²dx → x³/3 + C',
      confidence: 78
    },
    { 
      id: 'code-rust', 
      name: 'Rust Programming', 
      pattern: 'syntax-patterns',
      example: 'let x: i32 = 42;',
      confidence: 72
    }
  ];

  const patterns = {
    'language-structure': { name: 'Language Structure', color: 'bg-blue-500' },
    'logical-reasoning': { name: 'Logical Reasoning', color: 'bg-emerald-500' },
    'narrative-flow': { name: 'Narrative Flow', color: 'bg-rose-500' },
    'syntax-patterns': { name: 'Syntax Patterns', color: 'bg-indigo-500' }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setShowPrediction(false);
    setTimeout(() => setShowPrediction(true), 500);
  };

  const getPatternStrength = (patternId: string) => {
    const trainingCount = trainingTasks.filter(task => task.pattern === patternId).length;
    return Math.min(trainingCount * 25, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Zero-Shot Learning</h3>
        <p className="text-slate-600 max-w-2xl">
          AI systems can perform tasks they were never explicitly trained on by leveraging learned patterns. 
          Click on zero-shot tasks to see how training patterns enable new capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Training Data */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Training Tasks</h4>
          <div className="space-y-3">
            {trainingTasks.map((task) => (
              <div 
                key={task.id}
                className="p-3 bg-slate-100 rounded-lg border-l-4 border-slate-400"
              >
                <div className="text-sm font-medium text-slate-700">{task.name}</div>
                <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${patterns[task.pattern].color} text-white`}>
                  {patterns[task.pattern].name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learned Patterns */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Learned Patterns</h4>
          <div className="space-y-4">
            {Object.entries(patterns).map(([patternId, pattern]) => {
              const strength = getPatternStrength(patternId);
              const isHovered = hoveredPattern === patternId;
              const isActive = selectedTask && zeroShotTasks.find(t => t.id === selectedTask)?.pattern === patternId;
              
              return (
                <div 
                  key={patternId}
                  className="space-y-2"
                  onMouseEnter={() => setHoveredPattern(patternId)}
                  onMouseLeave={() => setHoveredPattern(null)}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium transition-colors ${isHovered || isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                      {pattern.name}
                    </span>
                    <span className="text-xs text-slate-500">{strength}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${pattern.color} ${isActive ? 'animate-pulse' : ''}`}
                      style={{ width: `${strength}%`, opacity: isHovered || isActive ? 1 : 0.7 }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zero-Shot Tasks */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Zero-Shot Tasks</h4>
          <div className="space-y-3">
            {zeroShotTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all ${
                  selectedTask === task.id 
                    ? 'bg-amber-50 border-amber-400 shadow-md' 
                    : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-sm font-medium text-slate-700 mb-1">{task.name}</div>
                <div className={`text-xs px-2 py-1 rounded inline-block ${patterns[task.pattern].color} text-white`}>
                  Uses: {patterns[task.pattern].name}
                </div>
                {selectedTask === task.id && showPrediction && (
                  <div className="mt-3 p-2 bg-white rounded border animate-pulse">
                    <div className="text-xs text-slate-600 mb-1">Prediction:</div>
                    <div className="text-sm font-mono text-slate-800">{task.example}</div>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${task.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600 ml-2">{task.confidence}% confidence</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center max-w-3xl">
        <div className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200">
          <strong>How it works:</strong> The model learns generalizable patterns from training data. 
          When faced with new tasks, it recognizes which patterns apply and transfers that knowledge, 
          even without explicit training on the specific task.
        </div>
      </div>
    </div>
  );
}