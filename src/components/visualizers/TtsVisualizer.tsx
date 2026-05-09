"use client";

import { useState, useEffect } from 'react';

export function TtsVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState("Hello, world! How are you today?");
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [prosodySettings, setProsodySettings] = useState({
    pitch: 50,
    speed: 50,
    stress: 50
  });

  const steps = [
    { name: "Text Input", color: "bg-blue-500" },
    { name: "Text Analysis", color: "bg-indigo-500" },
    { name: "Prosody Prediction", color: "bg-rose-500" },
    { name: "Waveform Synthesis", color: "bg-emerald-500" },
    { name: "Audio Output", color: "bg-amber-500" }
  ];

  const generateWaveform = () => {
    const length = 100;
    const data = [];
    const pitchFactor = prosodySettings.pitch / 50;
    const speedFactor = prosodySettings.speed / 50;
    const stressFactor = prosodySettings.stress / 50;
    
    for (let i = 0; i < length; i++) {
      const baseWave = Math.sin(i * 0.2 * pitchFactor) * 0.5;
      const noise = (Math.random() - 0.5) * 0.1;
      const stress = Math.sin(i * 0.05 * stressFactor) * 0.3;
      data.push((baseWave + noise + stress) * 50 + 50);
    }
    setWaveformData(data);
  };

  useEffect(() => {
    generateWaveform();
  }, [prosodySettings]);

  const getAnalyzedText = () => {
    return inputText
      .replace(/\d+/g, (match) => `[${match}]`)
      .replace(/[.!?]/g, (match) => `${match}⏸`)
      .replace(/,/g, ',⏵');
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => setIsPlaying(false), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Text-to-Speech (TTS)</h3>
        <p className="text-lg text-slate-600">Interactive visualization of neural speech synthesis pipeline</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Input Text */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Input Text:</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter text to synthesize..."
          />
        </div>

        {/* Pipeline Steps */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-slate-200">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                currentStep >= index ? step.color : 'bg-slate-300'
              } ${currentStep === index ? 'scale-110 shadow-lg' : ''}`}>
                {index + 1}
              </div>
              <span className="text-xs text-slate-600 mt-2 text-center max-w-20">{step.name}</span>
              {index < steps.length - 1 && (
                <div className={`absolute h-1 w-16 mt-6 ml-16 transition-all duration-500 ${
                  currentStep > index ? 'bg-slate-400' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Analysis */}
          <div className={`bg-white p-4 rounded-lg border-2 transition-all duration-300 ${
            currentStep === 1 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
          }`}>
            <h4 className="font-semibold text-slate-800 mb-3">Text Analysis</h4>
            <div className="text-sm font-mono bg-slate-100 p-3 rounded">
              {getAnalyzedText()}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Numbers: [bracketed], Pauses: ⏸, Stress: ⏵
            </div>
          </div>

          {/* Prosody Controls */}
          <div className={`bg-white p-4 rounded-lg border-2 transition-all duration-300 ${
            currentStep === 2 ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
          }`}>
            <h4 className="font-semibold text-slate-800 mb-3">Prosody Settings</h4>
            <div className="space-y-3">
              {Object.entries(prosodySettings).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs text-slate-600 capitalize">{key}: {value}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setProsodySettings(prev => ({
                      ...prev,
                      [key]: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className={`bg-white p-4 rounded-lg border-2 transition-all duration-300 ${
          currentStep >= 3 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
        }`}>
          <h4 className="font-semibold text-slate-800 mb-3">Generated Waveform</h4>
          <div className="h-32 bg-slate-900 rounded-lg p-4 flex items-end justify-center">
            {waveformData.map((height, index) => (
              <div
                key={index}
                className={`w-1 mx-px transition-all duration-100 ${
                  isPlaying && currentStep >= 3 ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
                style={{
                  height: `${Math.max(height, 5)}%`,
                  animationDelay: isPlaying ? `${index * 10}ms` : '0ms'
                }}
              />
            ))}
          </div>
        </div>

        {/* Play Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              isPlaying 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isPlaying ? 'Processing...' : 'Synthesize Speech'}
          </button>
        </div>
      </div>
    </div>
  );
}