"use client";

import { useState } from 'react';

export function SyntheticDataVisualizer() {
  const [activeTab, setActiveTab] = useState<'real' | 'synthetic'>('real');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(null);

  const realData = [
    { id: 1, text: "Customer review: Great product!", sentiment: "positive", quality: 0.9, cost: 1.0 },
    { id: 2, text: "Support ticket: Login issue", sentiment: "neutral", quality: 0.8, cost: 1.0 },
    { id: 3, text: "Email: Meeting tomorrow", sentiment: "neutral", quality: 0.7, cost: 1.0 },
    { id: 4, text: "[PRIVATE DATA REDACTED]", sentiment: "unknown", quality: 0.0, cost: 1.0 },
    { id: 5, text: "[INSUFFICIENT EXAMPLES]", sentiment: "unknown", quality: 0.0, cost: 1.0 }
  ];

  const syntheticData = [
    { id: 1, text: "Generated review: Excellent quality!", sentiment: "positive", quality: 0.8, cost: 0.1 },
    { id: 2, text: "Synthetic ticket: Password reset needed", sentiment: "neutral", quality: 0.85, cost: 0.1 },
    { id: 3, text: "AI email: Project update scheduled", sentiment: "neutral", quality: 0.9, cost: 0.1 },
    { id: 4, text: "Privacy-safe complaint example", sentiment: "negative", quality: 0.8, cost: 0.1 },
    { id: 5, text: "Augmented rare case scenario", sentiment: "negative", quality: 0.75, cost: 0.1 }
  ];

  const generateSynthetic = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    
    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsGenerating(false);
          setActiveTab('synthetic');
          return 0;
        }
        return prev + 1;
      });
    }, 800);
  };

  const generationSteps = [
    "Analyzing real data patterns...",
    "Learning statistical distributions...", 
    "Generating new examples...",
    "Validating synthetic quality..."
  ];

  const currentData = activeTab === 'real' ? realData : syntheticData;
  const avgQuality = currentData.reduce((sum, item) => sum + item.quality, 0) / currentData.length;
  const avgCost = currentData.reduce((sum, item) => sum + item.cost, 0) / currentData.length;
  const dataCount = currentData.filter(item => item.quality > 0).length;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Synthetic Data Generation</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how AI creates artificial training data to overcome real-world data limitations, privacy concerns, and scarcity
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('real')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'real' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          Real World Data
        </button>
        <button
          onClick={generateSynthetic}
          disabled={isGenerating}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isGenerating
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Synthetic'}
        </button>
        <button
          onClick={() => setActiveTab('synthetic')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'synthetic' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          Synthetic Data
        </button>
      </div>

      {isGenerating && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-center mb-4">
            <div className="text-lg font-medium text-slate-800">{generationSteps[generationStep]}</div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-800"
              style={{ width: `${((generationStep + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {!isGenerating && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{dataCount}</div>
              <div className="text-sm text-slate-600">Usable Samples</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-emerald-600">{(avgQuality * 100).toFixed(0)}%</div>
              <div className="text-sm text-slate-600">Avg Quality</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-rose-600">${(avgCost * 10).toFixed(1)}</div>
              <div className="text-sm text-slate-600">Cost per Sample</div>
            </div>
          </div>

          <div className="w-full max-w-4xl">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              {activeTab === 'real' ? 'Real World Data Challenges' : 'Synthetic Data Benefits'}
            </h4>
            
            <div className="space-y-3">
              {currentData.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedDataPoint(selectedDataPoint === index ? null : index)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    item.quality === 0 
                      ? 'bg-rose-50 border-rose-200' 
                      : selectedDataPoint === index
                      ? 'bg-blue-50 border-blue-300 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`font-medium ${item.quality === 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {item.text}
                      </div>
                      {selectedDataPoint === index && (
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Sentiment: </span>
                            <span className={`font-medium ${
                              item.sentiment === 'positive' ? 'text-emerald-600' :
                              item.sentiment === 'negative' ? 'text-rose-600' : 'text-blue-600'
                            }`}>
                              {item.sentiment}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Quality: </span>
                            <span className="font-medium">{(item.quality * 100).toFixed(0)}%</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Cost: </span>
                            <span className="font-medium">${(item.cost * 10).toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.quality > 0.8 ? 'bg-emerald-500' :
                        item.quality > 0.5 ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <div className={`text-xs px-2 py-1 rounded ${
                        activeTab === 'real' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {activeTab === 'real' ? 'Real' : 'Synthetic'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}