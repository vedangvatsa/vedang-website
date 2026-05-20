"use client";

import { useState } from 'react';

export function ContextWindowVisualizer() {
  const [tokens, setTokens] = useState(4000);
  const [selectedModel, setSelectedModel] = useState<'gpt-3' | 'gpt-4' | 'claude' | 'gpt-4-turbo'>('gpt-3');
  const [contentType, setContentType] = useState<'conversation' | 'document' | 'code'>('conversation');
  const [contentAmount, setContentAmount] = useState(2000);

  const models = {
    'gpt-3': { name: 'GPT-3', window: 4000, color: 'bg-rose-400' },
    'gpt-4': { name: 'GPT-4', window: 8000, color: 'bg-blue-400' },
    'claude': { name: 'Claude', window: 100000, color: 'bg-emerald-400' },
    'gpt-4-turbo': { name: 'GPT-4 Turbo', window: 128000, color: 'bg-indigo-400' }
  };

  const contentTypes = {
    conversation: { name: 'Conversation', tokensPerUnit: 100, unit: 'messages' },
    document: { name: 'Document Pages', tokensPerUnit: 500, unit: 'pages' },
    code: { name: 'Lines of Code', tokensPerUnit: 50, unit: 'lines' }
  };

  const currentModel = models[selectedModel];
  const currentContentType = contentTypes[contentType];
  const windowSize = currentModel.window;
  const usedTokens = Math.min(contentAmount, windowSize);
  const remainingTokens = Math.max(0, windowSize - usedTokens);
  const overflow = Math.max(0, contentAmount - windowSize);
  const fillPercentage = (usedTokens / windowSize) * 100;

  const getBarSegments = () => {
    const segments = [];
    const barWidth = 400;
    
    // Used tokens
    if (usedTokens > 0) {
      segments.push({
        width: (usedTokens / windowSize) * barWidth,
        color: overflow > 0 ? 'bg-rose-500' : 'bg-blue-500',
        label: 'Used'
      });
    }
    
    // Remaining tokens
    if (remainingTokens > 0) {
      segments.push({
        width: (remainingTokens / windowSize) * barWidth,
        color: 'bg-slate-200',
        label: 'Available'
      });
    }
    
    return segments;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Context Window Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how different AI models handle varying amounts of text within their context windows. 
          Adjust the content to see when you exceed the model's capacity.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Model</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(models).map(([key, model]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModel(key as 'gpt-3' | 'gpt-4' | 'claude' | 'gpt-4-turbo')}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedModel === key
                      ? `${model.color} text-white shadow-md`
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {model.name}
                  <div className="text-xs opacity-80">
                    {model.window.toLocaleString()} tokens
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as 'conversation' | 'document' | 'code')}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              {Object.entries(contentTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content Amount: {Math.ceil(contentAmount / currentContentType.tokensPerUnit)} {currentContentType.unit}
            </label>
            <input
              type="range"
              min="0"
              max={windowSize * 1.5}
              step={currentContentType.tokensPerUnit}
              value={contentAmount}
              onChange={(e) => setContentAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-slate-500 mt-1">
              ≈ {contentAmount.toLocaleString()} tokens
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              {currentModel.name} Context Window
            </h4>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>0</span>
                <span>{windowSize.toLocaleString()} tokens</span>
              </div>
              <div className="w-full h-8 bg-slate-200 rounded-lg overflow-hidden flex">
                {getBarSegments().map((segment, index) => (
                  <div
                    key={index}
                    className={`h-full ${segment.color} transition-all duration-300`}
                    style={{ width: `${segment.width}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-semibold text-blue-800">Used Tokens</div>
                <div className="text-blue-600">{usedTokens.toLocaleString()}</div>
                <div className="text-xs text-blue-500">{fillPercentage.toFixed(1)}% of window</div>
              </div>
              
              <div className="bg-slate-100 p-3 rounded-lg">
                <div className="font-semibold text-slate-800">Remaining</div>
                <div className="text-slate-600">{remainingTokens.toLocaleString()}</div>
                <div className="text-xs text-slate-500">tokens available</div>
              </div>
            </div>

            {overflow > 0 && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="font-semibold text-rose-800">Context Window Exceeded!</span>
                </div>
                <div className="text-rose-600 text-sm mt-1">
                  {overflow.toLocaleString()} tokens will be truncated or cause an error
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-slate-500">
              💡 Tip: When content exceeds the window, older parts of the conversation are typically removed first.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}