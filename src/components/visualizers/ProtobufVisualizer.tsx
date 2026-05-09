"use client";

import { useState } from 'react';

export function ProtobufVisualizer() {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'protobuf'>('json');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const sampleData = {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    active: true
  };

  const jsonSize = JSON.stringify(sampleData).length;
  const protobufSize = 28; // Realistic protobuf size for this data

  const protoSchema = `syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
  bool active = 4;
}`;

  const steps = [
    { title: "Define Schema", desc: "Create .proto file with message structure" },
    { title: "Compile", desc: "Generate language-specific code" },
    { title: "Serialize", desc: "Convert object to binary format" },
    { title: "Transmit", desc: "Send compact binary data" }
  ];

  const handleAnimate = () => {
    setAnimationStep(0);
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Protocol Buffer Serialization</h3>
        <p className="text-slate-600">Interactive comparison of data formats and serialization process</p>
      </div>

      {/* Format Comparison */}
      <div className="w-full max-w-4xl">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedFormat('json')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFormat === 'json'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            JSON Format
          </button>
          <button
            onClick={() => setSelectedFormat('protobuf')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFormat === 'protobuf'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            Protocol Buffer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Representation */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Data Representation</h4>
            {selectedFormat === 'json' ? (
              <pre className="text-sm bg-blue-50 p-4 rounded border overflow-x-auto">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            ) : (
              <pre className="text-sm bg-indigo-50 p-4 rounded border overflow-x-auto whitespace-pre-wrap">
                {protoSchema}
              </pre>
            )}
          </div>

          {/* Size Comparison */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Size Analysis</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>JSON Size</span>
                  <span className="font-mono">{jsonSize} bytes</span>
                </div>
                <div className="bg-slate-200 rounded-full h-6 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Protobuf Size</span>
                  <span className="font-mono">{protobufSize} bytes</span>
                </div>
                <div className="bg-slate-200 rounded-full h-6 overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${(protobufSize / jsonSize) * 100}%` }}></div>
                </div>
              </div>
              <div className="text-center text-sm text-emerald-600 font-medium">
                {Math.round(((jsonSize - protobufSize) / jsonSize) * 100)}% size reduction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Serialization Process */}
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-semibold text-slate-800">Serialization Process</h4>
          <button
            onClick={handleAnimate}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Animate Process
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                animationStep === index
                  ? 'border-amber-400 bg-amber-50 scale-105'
                  : hoveredStep === index
                  ? 'border-slate-300 bg-slate-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-3 ${
                animationStep >= index ? 'bg-emerald-500' : 'bg-slate-400'
              }`}>
                {index + 1}
              </div>
              <h5 className="font-medium text-slate-800 mb-2">{step.title}</h5>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Binary Representation */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-4">Binary Encoding Visualization</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {Object.entries(sampleData).map(([key, value], index) => (
            <div key={key} className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-xs text-slate-600 mb-1">Field {index + 1}</div>
              <div className="font-medium text-slate-800 mb-2">{key}</div>
              <div className="font-mono text-xs bg-indigo-100 p-2 rounded">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={`inline-block w-3 h-3 mx-px rounded ${
                    Math.random() > 0.5 ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}></span>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-1">{String(value).length} bytes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}