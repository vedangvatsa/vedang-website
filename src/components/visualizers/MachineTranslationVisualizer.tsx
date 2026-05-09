"use client";

import { useState } from 'react';

export function MachineTranslationVisualizer() {
  const [selectedMethod, setSelectedMethod] = useState<'rule' | 'statistical' | 'neural'>('rule');
  const [sourceText, setSourceText] = useState("The cat sits on the mat");
  const [animationStep, setAnimationStep] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  const translations = {
    rule: {
      steps: [
        { step: "Tokenize", text: "['The', 'cat', 'sits', 'on', 'the', 'mat']" },
        { step: "POS Tag", text: "[DET, NOUN, VERB, PREP, DET, NOUN]" },
        { step: "Parse", text: "Subject-Verb-Object structure" },
        { step: "Transfer", text: "Apply German grammar rules" },
        { step: "Generate", text: "Die Katze sitzt auf der Matte" }
      ],
      quality: 65,
      color: "rose"
    },
    statistical: {
      steps: [
        { step: "Align", text: "Find phrase alignments from corpus" },
        { step: "Extract", text: "Build phrase translation table" },
        { step: "Score", text: "Calculate translation probabilities" },
        { step: "Decode", text: "Find best translation sequence" },
        { step: "Output", text: "Die Katze sitzt auf der Matte" }
      ],
      quality: 78,
      color: "amber"
    },
    neural: {
      steps: [
        { step: "Encode", text: "Transform to vector representations" },
        { step: "Attend", text: "Focus on relevant source words" },
        { step: "Decode", text: "Generate target words sequentially" },
        { step: "Score", text: "Apply attention mechanisms" },
        { step: "Output", text: "Die Katze sitzt auf der Matte" }
      ],
      quality: 92,
      color: "emerald"
    }
  };

  const startTranslation = () => {
    setIsTranslating(true);
    setAnimationStep(0);
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 4) {
          setIsTranslating(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 800);
  };

  const currentTranslation = translations[selectedMethod];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Machine Translation Evolution</h3>
        <p className="text-slate-600">Explore how different MT approaches translate text with varying quality and methods</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Method Selection */}
        <div className="flex justify-center gap-4">
          {Object.entries(translations).map(([method, config]) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedMethod === method
                  ? `bg-${config.color}-100 text-${config.color}-800 border-2 border-${config.color}-300`
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {method === 'rule' ? 'Rule-Based' : method === 'statistical' ? 'Statistical' : 'Neural'}
            </button>
          ))}
        </div>

        {/* Source Text Input */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Source Text (English)</label>
          <input
            type="text"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter text to translate..."
          />
        </div>

        {/* Translation Process */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-800">
              {selectedMethod === 'rule' ? 'Rule-Based MT' : selectedMethod === 'statistical' ? 'Statistical MT' : 'Neural MT'}
            </h4>
            <button
              onClick={startTranslation}
              disabled={isTranslating}
              className={`px-4 py-2 bg-${currentTranslation.color}-500 text-white rounded-lg hover:bg-${currentTranslation.color}-600 disabled:opacity-50`}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>

          <div className="space-y-4">
            {currentTranslation.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isTranslating && animationStep === index
                    ? `bg-${currentTranslation.color}-500 text-white animate-pulse`
                    : isTranslating && animationStep > index
                    ? `bg-${currentTranslation.color}-400 text-white`
                    : `bg-${currentTranslation.color}-100 text-${currentTranslation.color}-600`
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{step.step}</div>
                  <div className={`text-sm text-slate-600 transition-opacity ${
                    isTranslating && animationStep >= index ? 'opacity-100' : 'opacity-60'
                  }`}>
                    {step.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Comparison */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(translations).map(([method, config]) => (
            <div key={method} className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-2">
                {method === 'rule' ? 'Rule-Based' : method === 'statistical' ? 'Statistical' : 'Neural'}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-${config.color}-500 h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${config.quality}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">{config.quality}%</span>
              </div>
              <div className="text-xs text-slate-500">Translation Quality</div>
            </div>
          ))}
        </div>

        {/* Key Challenges */}
        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <h4 className="font-semibold text-indigo-800 mb-3">Translation Challenges</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-700">Word order differences</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-700">Cultural context</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-700">Ambiguous words</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-700">Gender agreement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-700">Idiomatic expressions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-700">Syntactic structure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}