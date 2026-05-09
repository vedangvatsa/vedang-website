"use client";

import { useState } from 'react';

export function TransferLearningVisualizer() {
  const [stage, setStage] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [fineTuningProgress, setFineTuningProgress] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const stages = [
    "Pre-trained Model",
    "Feature Extraction", 
    "Fine-tuning",
    "New Task Performance"
  ];

  const pretrainedFeatures = [
    { name: "Edges", learned: true, transferable: true },
    { name: "Textures", learned: true, transferable: true },
    { name: "Shapes", learned: true, transferable: true },
    { name: "Objects", learned: true, transferable: false }
  ];

  const layers = [
    { name: "Input", frozen: false, color: "bg-blue-200" },
    { name: "Conv1", frozen: true, color: "bg-indigo-300" },
    { name: "Conv2", frozen: true, color: "bg-indigo-400" },
    { name: "Conv3", frozen: stage < 2, color: stage < 2 ? "bg-indigo-500" : "bg-rose-300" },
    { name: "Output", frozen: false, color: "bg-rose-400" }
  ];

  const handleFineTuning = () => {
    if (fineTuningProgress < 100) {
      setFineTuningProgress(prev => Math.min(prev + 20, 100));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Transfer Learning Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how pre-trained models transfer knowledge to new tasks by reusing learned features and fine-tuning specific layers
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        {stages.map((stageName, index) => (
          <button
            key={index}
            onClick={() => setStage(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              stage === index 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {stageName}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl">
        {stage === 0 && (
          <div className="text-center space-y-6">
            <h4 className="text-xl font-semibold text-slate-800">ImageNet Pre-trained Model</h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Training Data</h5>
                  <div className="text-blue-600">14 million images, 1000 classes</div>
                </div>
                <div className="space-y-2">
                  {pretrainedFeatures.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="bg-emerald-100 p-3 rounded cursor-pointer hover:bg-emerald-200 transition-colors"
                      onMouseEnter={() => setHoveredFeature(feature.name)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-800 font-medium">{feature.name}</span>
                        <span className="text-emerald-600 text-sm">Learned ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {layers.map((layer, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg ${layer.color} transition-all cursor-pointer hover:scale-105`}
                    onClick={() => setSelectedLayer(selectedLayer === idx ? null : idx)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800">{layer.name}</span>
                      {selectedLayer === idx && (
                        <span className="text-xs bg-white px-2 py-1 rounded">
                          {idx < 3 ? 'Feature Detection' : 'Classification'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div className="text-center space-y-6">
            <h4 className="text-xl font-semibold text-slate-800">Feature Extraction Phase</h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-indigo-100 p-6 rounded-lg">
                <h5 className="font-semibold text-indigo-800 mb-4">Frozen Layers</h5>
                <div className="space-y-2">
                  {layers.slice(1, 4).map((layer, idx) => (
                    <div key={idx} className="bg-indigo-300 p-2 rounded flex items-center justify-between">
                      <span className="text-indigo-800">{layer.name}</span>
                      <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Frozen ❄️</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-100 p-6 rounded-lg">
                <h5 className="font-semibold text-amber-800 mb-4">Transferred Features</h5>
                <div className="space-y-2">
                  {pretrainedFeatures.filter(f => f.transferable).map((feature, idx) => (
                    <div key={idx} className="bg-amber-200 p-2 rounded">
                      <span className="text-amber-800">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-rose-100 p-6 rounded-lg">
                <h5 className="font-semibold text-rose-800 mb-4">New Output Layer</h5>
                <div className="bg-rose-300 p-4 rounded">
                  <div className="text-rose-800 font-medium">Medical Images</div>
                  <div className="text-rose-600 text-sm mt-2">500 training samples</div>
                  <div className="text-rose-600 text-sm">3 classes</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div className="text-center space-y-6">
            <h4 className="text-xl font-semibold text-slate-800">Fine-tuning Process</h4>
            <div className="space-y-4">
              <button
                onClick={handleFineTuning}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Run Fine-tuning Step
              </button>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div 
                  className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${fineTuningProgress}%` }}
                ></div>
              </div>
              <div className="text-slate-600">Progress: {fineTuningProgress}%</div>
              
              <div className="grid grid-cols-5 gap-2 mt-6">
                {layers.map((layer, idx) => (
                  <div key={idx} className="text-center">
                    <div 
                      className={`h-20 rounded-lg mb-2 transition-all ${
                        layer.frozen 
                          ? 'bg-indigo-400' 
                          : fineTuningProgress > (idx * 25) 
                            ? 'bg-emerald-400' 
                            : 'bg-slate-300'
                      }`}
                    ></div>
                    <div className="text-sm text-slate-600">{layer.name}</div>
                    <div className="text-xs text-slate-500">
                      {layer.frozen ? 'Frozen' : 'Training'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="text-center space-y-6">
            <h4 className="text-xl font-semibold text-slate-800">Performance Comparison</h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-slate-100 p-6 rounded-lg">
                <h5 className="font-semibold text-slate-800 mb-4">Training from Scratch</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Training Time:</span>
                    <span className="text-rose-600 font-medium">2 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Required:</span>
                    <span className="text-rose-600 font-medium">10,000+ samples</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="text-rose-600 font-medium">75%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-3 mt-4">
                  <div className="bg-rose-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="bg-emerald-100 p-6 rounded-lg">
                <h5 className="font-semibold text-emerald-800 mb-4">Transfer Learning</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Training Time:</span>
                    <span className="text-emerald-600 font-medium">2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Required:</span>
                    <span className="text-emerald-600 font-medium">500 samples</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="text-emerald-600 font-medium">92%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-300 rounded-full h-3 mt-4">
                  <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
            
            {hoveredFeature && (
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="text-blue-800 font-medium">
                  Feature: {hoveredFeature} - Reused from pre-trained model!
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}