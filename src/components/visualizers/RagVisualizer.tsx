"use client";

import { useState } from 'react';

export function RagVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const [query, setQuery] = useState("What is the capital of France?");
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const knowledgeBase = [
    { id: 0, title: "Geography Facts", content: "Paris is the capital and largest city of France", relevance: 95 },
    { id: 1, title: "History Database", content: "The French Revolution began in 1789", relevance: 15 },
    { id: 2, title: "Culture Guide", content: "France is famous for its cuisine and art", relevance: 25 },
    { id: 3, title: "Travel Info", content: "Paris has over 2 million residents", relevance: 70 }
  ];

  const steps = [
    "User Query",
    "Retrieve Docs",
    "Rank & Select",
    "Generate Response"
  ];

  const handleStepClick = (step: number) => {
    setActiveStep(step);
    setSelectedDoc(null);
    if (step === 1) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleDocClick = (docId: number) => {
    setSelectedDoc(docId);
    if (activeStep < 3) setActiveStep(3);
  };

  const getResponse = () => {
    if (selectedDoc === 0) {
      return "Based on the retrieved information, Paris is the capital and largest city of France.";
    }
    return "I found relevant information about your query. Please select a document to see the generated response.";
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Retrieval-Augmented Generation (RAG)</h3>
        <p className="text-slate-600">Interactive demonstration of how LLMs retrieve external knowledge before generating responses</p>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-4 mb-6">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleStepClick(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeStep === index
                ? 'bg-blue-600 text-white shadow-md'
                : activeStep > index
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {index + 1}. {step}
          </button>
        ))}
      </div>

      {/* Main Visualization Area */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Query Input */}
        <div className={`lg:col-span-3 p-4 rounded-lg border-2 transition-all ${
          activeStep === 0 ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'
        }`}>
          <h4 className="font-semibold text-slate-700 mb-2">User Query</h4>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400"
            placeholder="Enter your question..."
          />
        </div>

        {/* Knowledge Base */}
        <div className={`lg:col-span-2 p-4 rounded-lg border-2 transition-all ${
          activeStep === 1 || activeStep === 2 ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'
        }`}>
          <h4 className="font-semibold text-slate-700 mb-4">External Knowledge Base</h4>
          <div className="space-y-3">
            {knowledgeBase.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocClick(doc.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedDoc === doc.id
                    ? 'border-emerald-400 bg-emerald-50 shadow-md'
                    : isAnimating
                    ? 'border-amber-300 bg-amber-50 animate-pulse'
                    : activeStep >= 2
                    ? doc.relevance > 80
                      ? 'border-emerald-300 bg-emerald-50'
                      : doc.relevance > 50
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-slate-200 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm text-slate-700">{doc.title}</span>
                  {activeStep >= 2 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.relevance > 80 ? 'bg-emerald-200 text-emerald-800' :
                      doc.relevance > 50 ? 'bg-amber-200 text-amber-800' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {doc.relevance}% match
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{doc.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Response */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          activeStep === 3 ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'
        }`}>
          <h4 className="font-semibold text-slate-700 mb-4">Generated Response</h4>
          <div className={`p-4 rounded-lg min-h-32 transition-all ${
            activeStep === 3 && selectedDoc !== null
              ? 'bg-white border border-slate-200 shadow-sm'
              : 'bg-slate-100'
          }`}>
            {activeStep === 3 ? (
              <p className="text-slate-700 leading-relaxed">{getResponse()}</p>
            ) : (
              <p className="text-slate-400 italic">Response will appear after document selection...</p>
            )}
          </div>
          
          {activeStep === 3 && selectedDoc !== null && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>RAG Benefit:</strong> Response is grounded in retrieved facts, reducing hallucination
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 max-w-2xl">
        Click through the steps to see how RAG retrieves relevant documents from external sources before generating responses, 
        ensuring factual accuracy and up-to-date information.
      </div>
    </div>
  );
}