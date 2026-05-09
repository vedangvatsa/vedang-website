"use client";

import { useState } from 'react';

export function WebassemblyVisualizer() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationStep, setCompilationStep] = useState(0);
  const [executionSpeed, setExecutionSpeed] = useState(1);
  const [showPerformance, setShowPerformance] = useState(false);

  const languages = {
    javascript: { name: 'JavaScript', color: 'bg-amber-400', speed: 1 },
    rust: { name: 'Rust', color: 'bg-rose-400', speed: 4.2 },
    cpp: { name: 'C++', color: 'bg-blue-400', speed: 4.5 },
    go: { name: 'Go', color: 'bg-indigo-400', speed: 3.8 }
  };

  const compilationSteps = [
    'Source Code',
    'LLVM IR',
    'WebAssembly Binary',
    'Browser Runtime'
  ];

  const handleCompile = () => {
    if (selectedLanguage === 'javascript') return;
    
    setIsCompiling(true);
    setCompilationStep(0);
    setShowPerformance(false);
    
    const interval = setInterval(() => {
      setCompilationStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsCompiling(false);
          setShowPerformance(true);
          setExecutionSpeed(languages[selectedLanguage as keyof typeof languages].speed);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const resetDemo = () => {
    setIsCompiling(false);
    setCompilationStep(0);
    setShowPerformance(false);
    setExecutionSpeed(1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">WebAssembly Interactive Demo</h3>
        <p className="text-lg text-slate-600">
          Explore how different languages compile to WebAssembly for near-native browser performance
        </p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Language Selection */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-slate-700 mb-4">Choose Your Language</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLanguage(key);
                  resetDemo();
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedLanguage === key 
                    ? 'border-slate-400 bg-white shadow-md' 
                    : 'border-slate-200 bg-slate-100 hover:bg-white'
                }`}
              >
                <div className={`w-8 h-8 ${lang.color} rounded-full mx-auto mb-2`}></div>
                <div className="font-medium text-slate-800">{lang.name}</div>
                {key === 'javascript' ? (
                  <div className="text-sm text-slate-500">Interpreted</div>
                ) : (
                  <div className="text-sm text-emerald-600">→ Wasm</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Compilation Pipeline */}
        {selectedLanguage !== 'javascript' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-slate-700">Compilation Pipeline</h4>
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isCompiling ? 'Compiling...' : 'Compile to Wasm'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              {compilationSteps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`p-4 rounded-xl border-2 transition-all ${
                    index <= compilationStep 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-slate-200 bg-slate-100'
                  }`}>
                    <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                      index <= compilationStep ? 'bg-blue-500' : 'bg-slate-300'
                    } ${index === compilationStep && isCompiling ? 'animate-pulse' : ''}`}></div>
                    <div className="text-sm font-medium text-slate-700">{step}</div>
                  </div>
                  {index < compilationSteps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 rounded ${
                      index < compilationStep ? 'bg-blue-400' : 'bg-slate-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Comparison */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-slate-700 mb-4">Performance Comparison</h4>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-lg font-medium text-slate-700 mb-3">JavaScript (Baseline)</div>
                <div className="w-full bg-slate-200 rounded-full h-8 relative overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{width: '25%'}}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-800">
                    1x speed
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-lg font-medium text-slate-700 mb-3">
                  {languages[selectedLanguage as keyof typeof languages].name} 
                  {selectedLanguage !== 'javascript' && showPerformance ? ' (WebAssembly)' : ''}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className={`${languages[selectedLanguage as keyof typeof languages].color} h-full rounded-full transition-all duration-1000`} 
                    style={{
                      width: `${(executionSpeed / 4.5) * 100}%`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-800">
                    {executionSpeed.toFixed(1)}x speed
                  </div>
                </div>
              </div>
            </div>
            
            {showPerformance && (
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="text-emerald-800 font-medium">
                    Performance boost: {((executionSpeed - 1) * 100).toFixed(0)}% faster than JavaScript!
                  </div>
                </div>
                <div className="text-emerald-700 text-sm mt-1">
                  WebAssembly enables near-native performance in the browser
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="w-8 h-8 bg-blue-500 rounded-full mb-3"></div>
            <h5 className="font-semibold text-slate-800 mb-2">Near-Native Speed</h5>
            <p className="text-sm text-slate-600">Binary format executes 3-4x faster than JavaScript</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <div className="w-8 h-8 bg-indigo-500 rounded-full mb-3"></div>
            <h5 className="font-semibold text-slate-800 mb-2">Language Flexibility</h5>
            <p className="text-sm text-slate-600">Compile C++, Rust, Go, and more to run in browsers</p>
          </div>
          
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="w-8 h-8 bg-emerald-500 rounded-full mb-3"></div>
            <h5 className="font-semibold text-slate-800 mb-2">Universal Runtime</h5>
            <p className="text-sm text-slate-600">Runs securely in any modern browser environment</p>
          </div>
        </div>
      </div>
    </div>
  );
}