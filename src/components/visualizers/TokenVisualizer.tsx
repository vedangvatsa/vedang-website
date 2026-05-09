"use client";

import { useState } from 'react';

export function TokenVisualizer() {
  const [inputText, setInputText] = useState("The quick brown fox jumps over the lazy dog.");
  const [selectedModel, setSelectedModel] = useState("gpt4");
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);

  // Simulate tokenization (simplified approximation)
  const tokenizeText = (text: string): string[] => {
    const words = text.split(/(\s+|[.,!?;])/);
    const tokens: string[] = [];
    
    words.forEach(word => {
      if (word.trim() === '' || /[.,!?;]/.test(word)) {
        if (word.trim()) tokens.push(word);
        return;
      }
      
      // Simulate subword tokenization
      if (word.length <= 3) {
        tokens.push(word);
      } else if (word.length <= 6) {
        tokens.push(word.slice(0, Math.ceil(word.length / 2)));
        tokens.push(word.slice(Math.ceil(word.length / 2)));
      } else {
        const third = Math.ceil(word.length / 3);
        tokens.push(word.slice(0, third));
        tokens.push(word.slice(third, third * 2));
        tokens.push(word.slice(third * 2));
      }
    });
    
    return tokens.filter(t => t.trim());
  };

  const tokens = tokenizeText(inputText);
  const tokenCount = tokens.length;
  const wordCount = inputText.split(/\s+/).filter(w => w.trim()).length;
  const tokensPerWord = wordCount > 0 ? (tokenCount / wordCount).toFixed(2) : "0";

  const models = {
    gpt4: { name: "GPT-4", contextWindow: 128000, color: "emerald" },
    llama2: { name: "Llama 2", contextWindow: 4000, color: "blue" },
    gpt3: { name: "GPT-3.5", contextWindow: 16000, color: "indigo" }
  };

  const currentModel = models[selectedModel as keyof typeof models];
  const contextUsage = (tokenCount / currentModel.contextWindow) * 100;
  const maxWords = Math.floor(currentModel.contextWindow * 0.75);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Token Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how text gets broken down into tokens - the smallest units LLMs process. Type text below and see real-time tokenization!
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Input Text:</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Type or paste text to tokenize..."
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          {Object.entries(models).map(([key, model]) => (
            <button
              key={key}
              onClick={() => setSelectedModel(key)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedModel === key
                  ? `bg-${model.color}-100 border-${model.color}-300 text-${model.color}-800`
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Tokenized Output</h4>
          <div className="flex flex-wrap gap-1 mb-4 p-4 bg-slate-50 rounded-lg min-h-24">
            {tokens.map((token, index) => (
              <span
                key={index}
                onMouseEnter={() => setHoveredToken(index)}
                onMouseLeave={() => setHoveredToken(null)}
                className={`px-2 py-1 rounded border text-sm cursor-pointer transition-all ${
                  hoveredToken === index
                    ? 'bg-blue-200 border-blue-400 text-blue-800 transform scale-105'
                    : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-150'
                }`}
              >
                {token}
              </span>
            ))}
          </div>
          
          {hoveredToken !== null && (
            <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded p-2">
              Token #{hoveredToken + 1}: "{tokens[hoveredToken]}"
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Tokens:</span>
                <span className="font-medium text-slate-800">{tokenCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Words:</span>
                <span className="font-medium text-slate-800">{wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tokens/Word:</span>
                <span className="font-medium text-slate-800">{tokensPerWord}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              {currentModel.name} Context Usage
            </h4>
            <div className="space-y-3">
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    contextUsage > 80 ? 'bg-rose-500' : contextUsage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(contextUsage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{tokenCount} / {currentModel.contextWindow.toLocaleString()} tokens</span>
                <span className="font-medium text-slate-800">{contextUsage.toFixed(2)}%</span>
              </div>
              <div className="text-xs text-slate-500">
                Max ~{maxWords.toLocaleString()} words for this model
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
              i
            </div>
            <div className="text-sm text-indigo-800">
              <strong>Key Insight:</strong> Tokens aren't words! They're subword units that help models understand text more efficiently. 
              Notice how longer words get split into multiple tokens, and punctuation often becomes separate tokens.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}