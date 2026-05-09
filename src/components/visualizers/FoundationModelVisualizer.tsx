"use client";

import { useState } from 'react';

export function FoundationModelVisualizer() {
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [adaptationMethod, setAdaptationMethod] = useState('fine-tuning');
  const [hoveredTask, setHoveredTask] = useState(null);
  const [showTrainingCost, setShowTrainingCost] = useState(false);

  const foundationModels = {
    'GPT-4': { size: '1.7T', cost: 100, company: 'OpenAI', color: 'bg-emerald-500' },
    'Claude': { size: '52B', cost: 25, company: 'Anthropic', color: 'bg-blue-500' },
    'Gemini': { size: '540B', cost: 75, company: 'Google', color: 'bg-indigo-500' },
    'LLaMA': { size: '65B', cost: 15, company: 'Meta', color: 'bg-rose-500' },
    'BERT': { size: '340M', cost: 0.1, company: 'Google', color: 'bg-amber-500' }
  };

  const adaptationMethods = {
    'fine-tuning': { 
      cost: 0.1, 
      time: '1-7 days',
      description: 'Update model weights on task-specific data'
    },
    'prompting': { 
      cost: 0.001, 
      time: 'minutes',
      description: 'Add instructions without changing weights'
    },
    'few-shot': { 
      cost: 0.01, 
      time: 'hours',
      description: 'Provide examples in context'
    }
  };

  const downstreamTasks = [
    'Code Generation', 'Text Summarization', 'Language Translation',
    'Question Answering', 'Creative Writing', 'Data Analysis',
    'Medical Diagnosis', 'Legal Research', 'Customer Support'
  ];

  const currentModel = foundationModels[selectedModel];
  const currentMethod = adaptationMethods[adaptationMethod];
  const adaptationCost = currentModel.cost * currentMethod.cost;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Foundation Model Architecture</h3>
        <p className="text-slate-600">Explore how one massive pretrained model adapts to many downstream tasks</p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Foundation Model Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">1. Select Foundation Model</h4>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(foundationModels).map(([name, model]) => (
              <button
                key={name}
                onClick={() => setSelectedModel(name)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedModel === name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-full h-12 rounded mb-2 ${model.color}`}></div>
                <div className="text-sm font-medium text-slate-700">{name}</div>
                <div className="text-xs text-slate-500">{model.size} params</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pretraining Cost Visualization */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-700">2. Pretraining Investment</h4>
            <button
              onClick={() => setShowTrainingCost(!showTrainingCost)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showTrainingCost ? 'Hide' : 'Show'} Cost Breakdown
            </button>
          </div>
          
          {showTrainingCost && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-slate-100 rounded">
                <div className="text-2xl font-bold text-slate-800">${currentModel.cost}M</div>
                <div className="text-sm text-slate-600">Training Cost</div>
              </div>
              <div className="text-center p-4 bg-slate-100 rounded">
                <div className="text-2xl font-bold text-slate-800">{currentModel.size}</div>
                <div className="text-sm text-slate-600">Parameters</div>
              </div>
              <div className="text-center p-4 bg-slate-100 rounded">
                <div className="text-2xl font-bold text-slate-800">{currentModel.company}</div>
                <div className="text-sm text-slate-600">Developer</div>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${currentModel.color} transition-all duration-1000`}
                style={{ width: `${Math.min(currentModel.cost, 100)}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600 mt-2">
              One-time pretraining cost: ${currentModel.cost}M (amortized across all applications)
            </div>
          </div>
        </div>

        {/* Adaptation Method Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">3. Choose Adaptation Method</h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(adaptationMethods).map(([method, details]) => (
              <button
                key={method}
                onClick={() => setAdaptationMethod(method)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  adaptationMethod === method
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-medium text-slate-700 capitalize mb-2">{method.replace('-', ' ')}</div>
                <div className="text-sm text-slate-600 mb-2">{details.description}</div>
                <div className="text-xs text-slate-500">Cost: {(details.cost * 100).toFixed(1)}% of pretraining</div>
                <div className="text-xs text-slate-500">Time: {details.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Downstream Applications */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">4. Downstream Applications</h4>
          <div className="grid grid-cols-3 gap-3">
            {downstreamTasks.map((task, index) => (
              <div
                key={task}
                onMouseEnter={() => setHoveredTask(index)}
                onMouseLeave={() => setHoveredTask(null)}
                className={`p-4 rounded-lg border border-slate-200 bg-white transition-all cursor-pointer ${
                  hoveredTask === index ? 'bg-blue-50 border-blue-300 scale-105' : 'hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-medium text-slate-700">{task}</div>
                {hoveredTask === index && (
                  <div className="text-xs text-slate-500 mt-2">
                    Adaptation cost: ${adaptationCost.toFixed(2)}M
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cost Efficiency Summary */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Economic Advantage</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-2">Without Foundation Models:</div>
              <div className="text-2xl font-bold text-rose-600">
                ${(currentModel.cost * downstreamTasks.length).toFixed(1)}M
              </div>
              <div className="text-xs text-slate-500">Training {downstreamTasks.length} specialized models</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-2">With Foundation Model:</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${(currentModel.cost + (adaptationCost * downstreamTasks.length)).toFixed(1)}M
              </div>
              <div className="text-xs text-slate-500">1 foundation + {downstreamTasks.length} adaptations</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-100 rounded text-center">
            <span className="text-emerald-800 font-semibold">
              Savings: ${(currentModel.cost * (downstreamTasks.length - 1) - (adaptationCost * downstreamTasks.length)).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}