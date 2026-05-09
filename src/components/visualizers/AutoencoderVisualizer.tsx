"use client";

import { useState } from 'react';

export function AutoencoderVisualizer() {
  const [inputData, setInputData] = useState([0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.3, 0.8]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0.5);
  const [selectedNeuron, setSelectedNeuron] = useState<number | null>(null);

  const inputSize = 8;
  const latentSize = Math.max(2, Math.floor(inputSize * compressionRatio));
  const outputSize = inputSize;

  // Simulate encoding (compression)
  const encode = (input: number[]): number[] => {
    const encoded = [];
    for (let i = 0; i < latentSize; i++) {
      const sum = input.reduce((acc, val, idx) => acc + val * Math.sin(idx + i + epoch * 0.1), 0);
      encoded.push(Math.max(0, Math.min(1, sum / input.length)));
    }
    return encoded;
  };

  // Simulate decoding (reconstruction)
  const decode = (latent: number[]): number[] => {
    const decoded = [];
    for (let i = 0; i < outputSize; i++) {
      const sum = latent.reduce((acc, val, idx) => acc + val * Math.cos(idx + i + epoch * 0.1), 0);
      decoded.push(Math.max(0, Math.min(1, sum / latent.length)));
    }
    return decoded;
  };

  const latentRepresentation = encode(inputData);
  const reconstructedData = decode(latentRepresentation);

  // Calculate reconstruction error
  const reconstructionError = inputData.reduce((sum, val, idx) => 
    sum + Math.pow(val - reconstructedData[idx], 2), 0) / inputSize;

  const startTraining = () => {
    setIsTraining(true);
    const interval = setInterval(() => {
      setEpoch(prev => {
        if (prev >= 100) {
          setIsTraining(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);
  };

  const resetTraining = () => {
    setEpoch(0);
    setIsTraining(false);
  };

  const updateInputNeuron = (index: number, value: number) => {
    const newInput = [...inputData];
    newInput[index] = value;
    setInputData(newInput);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Autoencoder Neural Network</h3>
        <p className="text-slate-600">Interactive visualization showing how autoencoders compress and reconstruct data through a latent bottleneck</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Compression Ratio</label>
            <input
              type="range"
              min="0.25"
              max="0.75"
              step="0.25"
              value={compressionRatio}
              onChange={(e) => setCompressionRatio(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-xs text-slate-600">{Math.round(compressionRatio * 100)}%</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={startTraining}
              disabled={isTraining}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 text-sm"
            >
              {isTraining ? 'Training...' : 'Start Training'}
            </button>
            <button
              onClick={resetTraining}
              className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 text-sm"
            >
              Reset
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm font-medium text-slate-700">Epoch: {epoch}</div>
            <div className="text-sm text-slate-600">Error: {reconstructionError.toFixed(3)}</div>
          </div>
        </div>

        {/* Neural Network Visualization */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-slate-200">
          {/* Input Layer */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-lg font-semibold text-slate-700">Input</h4>
            <div className="flex flex-col gap-2">
              {inputData.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => updateInputNeuron(index, parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center cursor-pointer transition-all"
                    style={{ backgroundColor: `rgb(59, 130, 246, ${value})` }}
                    onMouseEnter={() => setSelectedNeuron(index)}
                    onMouseLeave={() => setSelectedNeuron(null)}
                  >
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encoder Connections */}
          <div className="flex-1 relative h-64">
            <svg className="absolute inset-0 w-full h-full">
              {inputData.map((_, inputIdx) => (
                latentRepresentation.map((_, latentIdx) => (
                  <line
                    key={`encode-${inputIdx}-${latentIdx}`}
                    x1="10"
                    y1={20 + inputIdx * 30}
                    x2="90%"
                    y2={60 + latentIdx * 40}
                    stroke={selectedNeuron === inputIdx ? "#ef4444" : "#cbd5e1"}
                    strokeWidth={selectedNeuron === inputIdx ? "3" : "1"}
                    opacity="0.6"
                  />
                ))
              ))}
            </svg>
          </div>

          {/* Latent Layer */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-lg font-semibold text-indigo-600">Latent Space</h4>
            <div className="flex flex-col gap-3 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              {latentRepresentation.map((value, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 rounded-full border-2 border-indigo-400 flex items-center justify-center"
                  style={{ backgroundColor: `rgb(99, 102, 241, ${value})` }}
                >
                  <span className="text-xs font-bold text-white">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-center text-indigo-600">
              {inputSize}→{latentSize} compression
            </div>
          </div>

          {/* Decoder Connections */}
          <div className="flex-1 relative h-64">
            <svg className="absolute inset-0 w-full h-full">
              {latentRepresentation.map((_, latentIdx) => (
                reconstructedData.map((_, outputIdx) => (
                  <line
                    key={`decode-${latentIdx}-${outputIdx}`}
                    x1="10%"
                    y1={60 + latentIdx * 40}
                    x2="90"
                    y2={20 + outputIdx * 30}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))
              ))}
            </svg>
          </div>

          {/* Output Layer */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-lg font-semibold text-emerald-600">Reconstructed</h4>
            <div className="flex flex-col gap-2">
              {reconstructedData.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-emerald-300 flex items-center justify-center"
                    style={{ backgroundColor: `rgb(34, 197, 94, ${value})` }}
                  >
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                  <div className="w-20 text-xs text-center">
                    <div className="text-emerald-600 font-medium">{value.toFixed(2)}</div>
                    <div className="text-rose-500">
                      Δ{Math.abs(inputData[index] - value).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Progress */}
        {isTraining && (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Training Progress</span>
              <span className="text-sm text-slate-600">{epoch}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${epoch}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-2">Encoder</h5>
            <p className="text-blue-700">Compresses {inputSize}D input to {latentSize}D latent representation, capturing essential features.</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h5 className="font-semibold text-indigo-800 mb-2">Latent Space</h5>
            <p className="text-indigo-700">Compressed representation forces the network to learn meaningful patterns and structure.</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h5 className="font-semibold text-emerald-800 mb-2">Decoder</h5>
            <p className="text-emerald-700">Reconstructs original data from latent code. Training minimizes reconstruction error.</p>
          </div>
        </div>
      </div>
    </div>
  );
}