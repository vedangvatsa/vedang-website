"use client";
import { useState, useEffect } from 'react';

export function OracleVisualizer() {
  const [isFlowing, setIsFlowing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDataType, setSelectedDataType] = useState('price');
  const [oracleData, setOracleData] = useState({
    price: { value: '$42,350', status: 'verified' },
    weather: { value: '72°F', status: 'verified' },
    sports: { value: 'Lakers 108-95', status: 'verified' }
  });

  const dataTypes = [
    { id: 'price', label: 'BTC Price', icon: '₿', color: 'amber' },
    { id: 'weather', label: 'Temperature', icon: '🌡️', color: 'blue' },
    { id: 'sports', label: 'Game Score', icon: '🏀', color: 'emerald' }
  ];

  const steps = [
    'External data sources',
    'Oracle nodes fetch data',
    'Data verification',
    'On-chain posting',
    'Smart contract reads data'
  ];

  useEffect(() => {
    if (isFlowing) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isFlowing]);

  const simulateDataFetch = () => {
    const newData = { ...oracleData };
    if (selectedDataType === 'price') {
      newData.price.value = `$${(Math.random() * 50000 + 20000).toFixed(0)}`;
    } else if (selectedDataType === 'weather') {
      newData.weather.value = `${Math.floor(Math.random() * 40 + 50)}°F`;
    } else {
      const scores = ['Lakers 112-98', 'Warriors 105-103', 'Celtics 118-92'];
      newData.sports.value = scores[Math.floor(Math.random() * scores.length)];
    }
    setOracleData(newData);
  };

  const getStepColor = (stepIndex: number) => {
    if (!isFlowing) return 'slate';
    return currentStep === stepIndex ? 'indigo' : currentStep > stepIndex ? 'emerald' : 'slate';
  };

  const getDataColor = (dataType: string) => {
    const type = dataTypes.find(t => t.id === dataType);
    return type ? type.color : 'slate';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Oracle Networks</h3>
        <p className="text-slate-600">Interactive visualization of how oracles bring external data to blockchain smart contracts</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {dataTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedDataType(type.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedDataType === type.id
                ? `bg-${type.color}-100 text-${type.color}-800 border-2 border-${type.color}-300`
                : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className="mr-2">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => setIsFlowing(!isFlowing)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isFlowing
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          {isFlowing ? 'Stop Oracle Flow' : 'Start Oracle Flow'}
        </button>
        <button
          onClick={simulateDataFetch}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all"
        >
          Fetch New Data
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-5 gap-4 items-center">
          {/* External World */}
          <div className={`p-6 rounded-xl text-center transition-all ${
            getStepColor(0) === 'indigo' ? 'bg-indigo-100 border-2 border-indigo-300 scale-105' :
            getStepColor(0) === 'emerald' ? 'bg-emerald-100 border-2 border-emerald-300' :
            'bg-slate-100 border-2 border-slate-200'
          }`}>
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-semibold text-sm mb-2">External World</div>
            <div className={`text-lg font-mono bg-${getDataColor(selectedDataType)}-50 p-2 rounded border`}>
              {oracleData[selectedDataType as keyof typeof oracleData].value}
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="flex justify-center">
            <div className={`w-8 h-1 transition-all ${
              currentStep >= 1 && isFlowing ? 'bg-indigo-500' : 'bg-slate-300'
            }`}>
              <div className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ml-6 -mt-1.5 transition-all ${
                currentStep >= 1 && isFlowing ? 'border-b-indigo-500' : 'border-b-slate-300'
              }`}></div>
            </div>
          </div>

          {/* Oracle Nodes */}
          <div className={`p-6 rounded-xl text-center transition-all ${
            getStepColor(1) === 'indigo' ? 'bg-indigo-100 border-2 border-indigo-300 scale-105' :
            getStepColor(1) === 'emerald' ? 'bg-emerald-100 border-2 border-emerald-300' :
            'bg-slate-100 border-2 border-slate-200'
          }`}>
            <div className="text-2xl mb-2">🔗</div>
            <div className="font-semibold text-sm mb-2">Oracle Nodes</div>
            <div className="grid grid-cols-2 gap-1">
              {[1, 2, 3, 4].map((node) => (
                <div key={node} className={`w-4 h-4 rounded-full transition-all ${
                  isFlowing && currentStep >= 1 ? 'bg-blue-400' : 'bg-slate-300'
                }`}></div>
              ))}
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex justify-center">
            <div className={`w-8 h-1 transition-all ${
              currentStep >= 3 && isFlowing ? 'bg-indigo-500' : 'bg-slate-300'
            }`}>
              <div className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ml-6 -mt-1.5 transition-all ${
                currentStep >= 3 && isFlowing ? 'border-b-indigo-500' : 'border-b-slate-300'
              }`}></div>
            </div>
          </div>

          {/* Blockchain */}
          <div className={`p-6 rounded-xl text-center transition-all ${
            getStepColor(4) === 'indigo' ? 'bg-indigo-100 border-2 border-indigo-300 scale-105' :
            getStepColor(4) === 'emerald' ? 'bg-emerald-100 border-2 border-emerald-300' :
            'bg-slate-100 border-2 border-slate-200'
          }`}>
            <div className="text-2xl mb-2">⛓️</div>
            <div className="font-semibold text-sm mb-2">Smart Contract</div>
            <div className={`text-sm font-mono bg-slate-50 p-2 rounded border ${
              currentStep === 4 && isFlowing ? 'animate-pulse' : ''
            }`}>
              Data: {currentStep >= 4 && isFlowing ? oracleData[selectedDataType as keyof typeof oracleData].value : '---'}
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full transition-all ${
                  getStepColor(index) === 'indigo' ? 'bg-indigo-500 animate-pulse' :
                  getStepColor(index) === 'emerald' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}></div>
                <span className={`text-sm transition-all ${
                  getStepColor(index) === 'indigo' ? 'text-indigo-700 font-semibold' :
                  getStepColor(index) === 'emerald' ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && <div className="w-4 h-px bg-slate-300 ml-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-slate-600 text-sm">
          Click data types to see different oracle feeds. Start the flow to watch how external data moves through oracle nodes onto the blockchain for smart contracts to use.
        </p>
      </div>
    </div>
  );
}