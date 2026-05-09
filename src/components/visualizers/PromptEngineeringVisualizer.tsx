"use client";

import React, { useState } from 'react';

export function PromptEngineeringVisualizer() {
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [hoveredTechnique, setHoveredTechnique] = useState<string | null>(null);

  const prompts = [
    {
      title: "Basic Prompt",
      text: "Analyze this text",
      techniques: [],
      output: "The text discusses various topics. It contains multiple sentences and ideas.",
      quality: 30
    },
    {
      title: "With Context",
      text: "You are a literary analyst. Analyze this text for its main themes.",
      techniques: ["Context"],
      output: "This text explores themes of human strength and social change through vivid imagery and metaphorical language.",
      quality: 60
    },
    {
      title: "With Format",
      text: "You are a literary analyst. Analyze this text and provide:\n1. Main theme\n2. Literary devices\n3. Tone",
      techniques: ["Context", "Format"],
      output: "1. Main theme: Human strength in adversity\n2. Literary devices: Metaphor, symbolism, imagery\n3. Tone: Hopeful yet somber",
      quality: 80
    },
    {
      title: "Optimized",
      text: "As a literature professor, analyze this text. Provide exactly 3 insights about:\n1. Central theme\n2. Key literary devices\n3. Overall tone\n\nExample format:\n1. Theme: [specific theme]\n2. Devices: [2-3 devices]\n3. Tone: [descriptive tone]",
      techniques: ["Context", "Format", "Examples", "Constraints"],
      output: "1. Theme: Triumph of human spirit over systemic oppression\n2. Devices: Extended metaphor, vivid imagery, parallel structure\n3. Tone: Cautiously optimistic with underlying determination",
      quality: 95
    }
  ];

  const techniques = [
    { name: "Context", color: "bg-blue-500", description: "Define the AI's role or expertise" },
    { name: "Format", color: "bg-emerald-500", description: "Specify output structure" },
    { name: "Examples", color: "bg-amber-500", description: "Show desired output format" },
    { name: "Constraints", color: "bg-rose-500", description: "Set limits and requirements" }
  ];

  const currentPrompt = prompts[selectedPrompt];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Prompt Engineering</h3>
        <p className="text-slate-600 max-w-2xl">
          Craft better AI inputs by adding context, format requirements, examples, and constraints. 
          See how each technique improves output quality.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Technique Legend</h4>
          <div className="flex flex-wrap gap-3">
            {techniques.map((technique) => (
              <div
                key={technique.name}
                className={`px-3 py-2 rounded-lg ${technique.color} text-white text-sm font-medium cursor-pointer transition-all duration-200 ${
                  hoveredTechnique === technique.name ? 'scale-105 shadow-lg' : ''
                }`}
                onMouseEnter={() => setHoveredTechnique(technique.name)}
                onMouseLeave={() => setHoveredTechnique(null)}
              >
                {technique.name}
                {hoveredTechnique === technique.name && (
                  <div className="absolute mt-2 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10 max-w-48">
                    {technique.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Prompt Examples</h4>
            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedPrompt === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setSelectedPrompt(index);
                    setShowOutput(false);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-800">{prompt.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {prompt.techniques.map((tech) => {
                          const techColor = techniques.find(t => t.name === tech)?.color || 'bg-slate-400';
                          return (
                            <div key={tech} className={`w-3 h-3 rounded-full ${techColor}`}></div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">Quality:</span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              prompt.quality >= 80 ? 'bg-emerald-500' : 
                              prompt.quality >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${prompt.quality}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">{prompt.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Selected Prompt</h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-800">{currentPrompt.title}</span>
                  <button
                    onClick={() => setShowOutput(!showOutput)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 text-sm"
                  >
                    {showOutput ? 'Hide Output' : 'Generate Output'}
                  </button>
                </div>
                <div className="bg-slate-50 p-3 rounded border text-sm text-slate-700 font-mono whitespace-pre-wrap">
                  {currentPrompt.text}
                </div>
              </div>
            </div>

            {showOutput && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-slate-700 mb-4">AI Output</h4>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">AI Response</span>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-xs text-emerald-600">Quality Score:</span>
                      <span className="text-sm font-bold text-emerald-700">{currentPrompt.quality}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{currentPrompt.output}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">Techniques Used:</h5>
              {currentPrompt.techniques.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentPrompt.techniques.map((tech) => {
                    const techColor = techniques.find(t => t.name === tech)?.color || 'bg-slate-400';
                    return (
                      <span key={tech} className={`px-2 py-1 ${techColor} text-white text-xs rounded`}>
                        {tech}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-blue-600">No advanced techniques applied</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}