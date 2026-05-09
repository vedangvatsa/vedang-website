"use client";

import { useState } from 'react';

export function PerplexityTrapVisualizer() {
  const [selectedModel, setSelectedModel] = useState<'A' | 'B'>('A');
  const [selectedTask, setSelectedTask] = useState<'creative' | 'factual' | 'conversational'>('creative');
  
  const models = {
    A: {
      name: "Model A",
      benchmarkPerplexity: 12.4,
      tasks: {
        creative: { score: 2.1, example: "The sunset was orange. The end." },
        factual: { score: 3.8, example: "Paris is in France. It has buildings." },
        conversational: { score: 2.5, example: "Hello. Yes. No. Goodbye." }
      }
    },
    B: {
      name: "Model B", 
      benchmarkPerplexity: 18.7,
      tasks: {
        creative: { score: 4.2, example: "As twilight painted the sky in shades of amber and rose, memories danced like fireflies..." },
        factual: { score: 4.5, example: "Paris, the capital of France, is renowned for its rich history, iconic architecture including the Eiffel Tower..." },
        conversational: { score: 4.8, example: "Hi there! I'd be happy to help you with that. What specific aspects are you most curious about?" }
      }
    }
  };

  const currentModel = models[selectedModel];
  const currentTask = currentModel.tasks[selectedTask];

  const getPerplexityColor = (perplexity: number) => {
    return perplexity < 15 ? 'text-emerald-600' : 'text-rose-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-600';
    if (score >= 3) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreWidth = (score: number) => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">The Perplexity Trap</h3>
        <p className="text-slate-600">Explore how lower benchmark perplexity doesn't guarantee better real-world performance</p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(models).map(([key, model]) => (
            <div 
              key={key}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedModel === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSelectedModel(key as 'A' | 'B')}
            >
              <h4 className="text-xl font-semibold text-slate-800 mb-3">{model.name}</h4>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Benchmark Perplexity</div>
                <div className={`text-3xl font-bold ${getPerplexityColor(model.benchmarkPerplexity)}`}>
                  {model.benchmarkPerplexity}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {model.benchmarkPerplexity < 15 ? '✓ Lower is "better"' : '✗ Higher perplexity'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Real-World Task Performance</h4>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {(['creative', 'factual', 'conversational'] as const).map((task) => (
              <button
                key={task}
                onClick={() => setSelectedTask(task)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  selectedTask === task
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {task} Writing
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-slate-700 mb-3">Quality Score (1-5)</div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{currentModel.name}</span>
                  <span className={`font-bold ${getScoreColor(currentTask.score)}`}>
                    {currentTask.score}/5
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mt-1">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      currentTask.score >= 4 ? 'bg-emerald-500' :
                      currentTask.score >= 3 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: getScoreWidth(currentTask.score) }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-3">Sample Output</div>
              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 italic min-h-[80px] flex items-center">
                "{currentTask.example}"
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-6 rounded-xl border border-rose-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">The Trap Revealed</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                Model A has <strong>lower perplexity</strong> ({models.A.benchmarkPerplexity} vs {models.B.benchmarkPerplexity}) 
                but performs <strong>worse on real tasks</strong>. This happens because perplexity only measures 
                how well a model predicts text from the benchmark distribution, not how useful or engaging 
                the generated text actually is for users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}