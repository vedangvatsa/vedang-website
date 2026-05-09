"use client";

import { useState } from 'react';

export function MultimodalAiVisualizer() {
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const modalities = [
    { id: 'text', name: 'Text', icon: '📝', color: 'blue', sample: 'A red car driving on a highway' },
    { id: 'image', name: 'Image', icon: '🖼️', color: 'emerald', sample: 'Visual data of car scene' },
    { id: 'audio', name: 'Audio', icon: '🎵', color: 'rose', sample: 'Engine sound, wind noise' },
    { id: 'video', name: 'Video', icon: '🎬', color: 'indigo', sample: 'Motion sequence frames' }
  ];

  const processingSteps = [
    'Input Encoding',
    'Feature Extraction', 
    'Cross-Modal Fusion',
    'Unified Representation',
    'Output Generation'
  ];

  const toggleInput = (modalityId: string) => {
    setSelectedInputs(prev => 
      prev.includes(modalityId) 
        ? prev.filter(id => id !== modalityId)
        : [...prev, modalityId]
    );
    setProcessingStep(0);
    setIsProcessing(false);
  };

  const startProcessing = () => {
    if (selectedInputs.length === 0) return;
    
    setIsProcessing(true);
    setProcessingStep(0);
    
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsProcessing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const getModalityColor = (modalityId: string) => {
    const modality = modalities.find(m => m.id === modalityId);
    return modality?.color || 'slate';
  };

  const getPowerScore = () => {
    const baseScore = selectedInputs.length * 25;
    const crossModalBonus = selectedInputs.length > 1 ? (selectedInputs.length - 1) * 15 : 0;
    return Math.min(baseScore + crossModalBonus, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Multimodal AI System</h3>
        <p className="text-slate-600">Select different data modalities to see how AI processes them together</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {modalities.map((modality) => {
          const isSelected = selectedInputs.includes(modality.id);
          const colorClass = isSelected ? `bg-${modality.color}-100 border-${modality.color}-300` : 'bg-white border-slate-200';
          
          return (
            <button
              key={modality.id}
              onClick={() => toggleInput(modality.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${colorClass}`}
            >
              <div className="text-2xl mb-2">{modality.icon}</div>
              <div className="font-semibold text-slate-800">{modality.name}</div>
              <div className="text-xs text-slate-600 mt-1">{modality.sample}</div>
              {isSelected && (
                <div className={`mt-2 w-full h-1 bg-${modality.color}-400 rounded`}></div>
              )}
            </button>
          );
        })}
      </div>

      {selectedInputs.length > 0 && (
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-slate-800">
              Processing Pipeline
            </div>
            <button
              onClick={startProcessing}
              disabled={isProcessing}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Start Processing'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              {processingSteps.map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    processingStep >= index 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 text-center max-w-16">
                    {step}
                  </div>
                  {index < processingSteps.length - 1 && (
                    <div className={`absolute mt-4 w-16 h-0.5 transition-colors ${
                      processingStep > index ? 'bg-indigo-300' : 'bg-slate-200'
                    }`} style={{ marginLeft: '32px' }}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800">Selected Inputs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInputs.map(inputId => {
                    const modality = modalities.find(m => m.id === inputId);
                    const color = getModalityColor(inputId);
                    return (
                      <span key={inputId} className={`px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm`}>
                        {modality?.icon} {modality?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800">Cross-Modal Connections</h4>
                <div className="text-sm text-slate-600">
                  {selectedInputs.length > 1 ? (
                    <div>
                      <div className="text-emerald-600 font-medium">✓ Active</div>
                      <div>{selectedInputs.length} modalities linked</div>
                    </div>
                  ) : (
                    <div className="text-amber-600">Single modality only</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800">AI Power Score</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div 
                      className="h-3 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${getPowerScore()}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {getPowerScore()}%
                  </div>
                </div>
              </div>
            </div>

            {processingStep >= 4 && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">🎉 Multimodal Output Generated!</h4>
                <div className="text-emerald-700 text-sm">
                  The AI has successfully fused {selectedInputs.length} data modalities to create a unified understanding.
                  {selectedInputs.length > 1 && " Cross-modal reasoning enabled rich contextual insights!"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedInputs.length === 0 && (
        <div className="text-center text-slate-500 py-8">
          Select one or more data modalities above to see the multimodal AI in action
        </div>
      )}
    </div>
  );
}