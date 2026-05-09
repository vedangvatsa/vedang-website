"use client";

import { useState } from 'react';

export function QuestionAnsweringVisualizer() {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [showAnswerSpan, setShowAnswerSpan] = useState(false);
  const [qaMode, setQaMode] = useState<'extractive' | 'generative'>('extractive');

  const sampleData = {
    passage: "The Eiffel Tower was built in 1889 for the World's Fair in Paris. It was designed by Gustave Eiffel and stands 324 meters tall. The construction took approximately two years to complete.",
    questions: [
      { text: "When was the Eiffel Tower built?", answer: "1889", startPos: 7, endPos: 7 },
      { text: "Who designed the Eiffel Tower?", answer: "Gustave Eiffel", startPos: 18, endPos: 19 },
      { text: "How tall is the Eiffel Tower?", answer: "324 meters", startPos: 23, endPos: 24 }
    ]
  };

  const tokens = sampleData.passage.split(' ');
  const currentQuestion = sampleData.questions[selectedQuestion];

  const getTokenAttention = (tokenIndex: number) => {
    const distance = Math.abs(tokenIndex - (currentQuestion.startPos + currentQuestion.endPos) / 2);
    return Math.max(0, 1 - distance / 10);
  };

  const getTokenColor = (tokenIndex: number) => {
    if (showAnswerSpan && tokenIndex >= currentQuestion.startPos && tokenIndex <= currentQuestion.endPos) {
      return 'bg-emerald-200 text-emerald-800 border-emerald-400';
    }
    
    if (hoveredToken !== null || showAnswerSpan) {
      const attention = getTokenAttention(tokenIndex);
      if (attention > 0.7) return 'bg-blue-100 text-blue-800';
      if (attention > 0.4) return 'bg-blue-50 text-blue-700';
      if (attention > 0.2) return 'bg-slate-100 text-slate-700';
    }
    
    return 'bg-white text-slate-700 hover:bg-slate-100';
  };

  const generativeAnswers = [
    "The Eiffel Tower was constructed in 1889.",
    "Gustave Eiffel was the designer of the famous tower.",
    "The tower reaches a height of 324 meters."
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Question Answering Systems</h3>
        <p className="text-slate-600">Explore how AI systems extract or generate answers from text passages</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setQaMode('extractive')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            qaMode === 'extractive' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-blue-500 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Extractive QA
        </button>
        <button
          onClick={() => setQaMode('generative')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            qaMode === 'generative' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-white text-indigo-500 border border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          Generative QA
        </button>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Source Passage</h4>
          <div className="flex flex-wrap gap-1">
            {tokens.map((token, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded border transition-all duration-200 cursor-pointer ${getTokenColor(index)}`}
                onMouseEnter={() => setHoveredToken(index)}
                onMouseLeave={() => setHoveredToken(null)}
              >
                {token}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Question</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleData.questions.map((q, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedQuestion(index);
                  setShowAnswerSpan(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedQuestion === index 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                }`}
              >
                Q{index + 1}
              </button>
            ))}
          </div>
          <p className="text-slate-700 text-lg">{currentQuestion.text}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800">
              {qaMode === 'extractive' ? 'Extractive Answer' : 'Generative Answer'}
            </h4>
            {qaMode === 'extractive' && (
              <button
                onClick={() => setShowAnswerSpan(!showAnswerSpan)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                {showAnswerSpan ? 'Hide Span' : 'Show Answer Span'}
              </button>
            )}
          </div>
          
          {qaMode === 'extractive' ? (
            <div>
              <p className="text-slate-600 mb-2">
                Model identifies answer span in passage: positions {currentQuestion.startPos} to {currentQuestion.endPos}
              </p>
              <p className="text-xl font-semibold text-emerald-700">
                {currentQuestion.answer}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-slate-600 mb-2">
                Model generates answer based on learned knowledge:
              </p>
              <p className="text-xl font-semibold text-indigo-700">
                {generativeAnswers[selectedQuestion]}
              </p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-amber-800 mb-1">How it works:</p>
              <p className="text-amber-700 text-sm">
                {qaMode === 'extractive' 
                  ? 'Extractive QA models predict start and end positions of answer spans within the input text. The model calculates attention scores for each token to identify the most relevant text segment.'
                  : 'Generative QA models use transformer architectures to generate coherent answers based on the question and passage context, creating new text rather than extracting existing spans.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}