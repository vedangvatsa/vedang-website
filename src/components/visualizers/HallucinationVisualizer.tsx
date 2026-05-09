"use client";

import { useState } from 'react';

export function HallucinationVisualizer() {
  const [selectedQuery, setSelectedQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTruthCheck, setShowTruthCheck] = useState(false);

  const queries = [
    "Who wrote the paper 'Neural Quantum Computing in 2019'?",
    "What did Einstein say about artificial intelligence?",
    "List three studies on chocolate preventing cancer from 2020."
  ];

  const hallucinatedResponses = [
    {
      query: queries[0],
      response: "Dr. Sarah Mitchell and Dr. James Chen from MIT published this groundbreaking paper in the Journal of Advanced Computing in March 2019.",
      truth: "This paper doesn't exist. No researchers by these names published on this topic.",
      patterns: ["Academic names", "Institution names", "Journal names", "Specific dates"]
    },
    {
      query: queries[1],
      response: "Einstein famously said 'Artificial intelligence will either be humanity's greatest achievement or its final mistake' in a 1955 lecture at Princeton.",
      truth: "Einstein died in 1955 and never made statements about AI. The field barely existed then.",
      patterns: ["Quote format", "Historical figure", "Institution", "Plausible timeframe"]
    },
    {
      query: queries[2],
      response: "1) Johnson et al. (2020) in Nature Medicine 2) Rodriguez study in JAMA (2020) 3) The Copenhagen Chocolate Trial published in Lancet (2020)",
      truth: "These studies are fictional. The journals exist but not these specific papers.",
      patterns: ["Citation format", "Real journal names", "Believable author names", "Recent dates"]
    }
  ];

  const patternWeights = [
    { pattern: "Academic authority", weight: 0.85, description: "Learned: papers have authors with titles" },
    { pattern: "Institutional credibility", weight: 0.78, description: "Learned: prestigious institutions add credibility" },
    { pattern: "Citation formatting", weight: 0.92, description: "Learned: specific citation formats" },
    { pattern: "Date specificity", weight: 0.73, description: "Learned: specific dates sound more credible" },
    { pattern: "Technical language", weight: 0.81, description: "Learned: complex terms increase believability" }
  ];

  const handleQuerySelect = (query: string) => {
    setSelectedQuery(query);
    setCurrentStep(0);
    setIsGenerating(true);
    setShowTruthCheck(false);
    
    setTimeout(() => {
      setCurrentStep(1);
      setTimeout(() => {
        setCurrentStep(2);
        setIsGenerating(false);
      }, 1500);
    }, 1000);
  };

  const selectedResponse = hallucinatedResponses.find(r => r.query === selectedQuery);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Hallucination Explorer</h3>
        <p className="text-slate-600">See how AI generates convincing but false information through pattern matching</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Query Selection */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Select a query to see hallucination in action:</h4>
          <div className="space-y-2">
            {queries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleQuerySelect(query)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedQuery === query 
                    ? 'bg-blue-50 border-blue-300 text-blue-800' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {selectedQuery && (
          <div className="space-y-6">
            {/* Pattern Matching Visualization */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-700 mb-4">Pattern Weights in AI's "Mind"</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patternWeights.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{item.pattern}</span>
                      <span className="text-sm text-slate-500">{(item.weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${item.weight * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generation Process */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-700 mb-4">AI Response Generation</h4>
              
              {currentStep >= 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-slate-600">Analyzing query patterns...</span>
                  </div>
                  
                  {currentStep >= 2 && selectedResponse && (
                    <div className="mt-4">
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="font-medium text-rose-800">Hallucinated Response:</span>
                        </div>
                        <p className="text-slate-700 ml-4">{selectedResponse.response}</p>
                      </div>
                      
                      <div className="mt-4 flex gap-4">
                        <button
                          onClick={() => setShowTruthCheck(!showTruthCheck)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          {showTruthCheck ? 'Hide Truth Check' : 'Fact Check This'}
                        </button>
                      </div>
                      
                      {showTruthCheck && (
                        <div className="mt-4 space-y-4">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="font-medium text-emerald-800">Truth:</span>
                            </div>
                            <p className="text-slate-700 ml-4">{selectedResponse.truth}</p>
                          </div>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h5 className="font-medium text-amber-800 mb-2">Patterns the AI Combined:</h5>
                            <div className="flex flex-wrap gap-2 ml-4">
                              {selectedResponse.patterns.map((pattern, idx) => (
                                <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                  {pattern}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Key Insight */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h4 className="font-semibold text-indigo-800 mb-2">Why This Happens</h4>
              <p className="text-indigo-700">
                AI models learn statistical patterns from training data, not facts. They know that "research papers" 
                typically have authors, institutions, and dates - so they generate plausible combinations of these 
                elements even when the specific information doesn't exist.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}