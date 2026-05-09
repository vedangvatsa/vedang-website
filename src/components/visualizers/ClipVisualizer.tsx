"use client";

import { useState } from 'react';

export function ClipVisualizer() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedText, setSelectedText] = useState(0);
  const [showEmbeddings, setShowEmbeddings] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);

  const imageData = [
    { id: 0, label: "Cat Photo", icon: "🐱", embedding: [0.8, 0.6] },
    { id: 1, label: "Dog Photo", icon: "🐶", embedding: [0.2, 0.9] },
    { id: 2, label: "Car Photo", icon: "🚗", embedding: [0.1, 0.2] },
    { id: 3, label: "Tree Photo", icon: "🌳", embedding: [0.9, 0.1] }
  ];

  const textData = [
    { id: 0, text: "A cute cat sitting", embedding: [0.75, 0.65] },
    { id: 1, text: "A happy dog playing", embedding: [0.25, 0.85] },
    { id: 2, text: "A red sports car", embedding: [0.15, 0.25] },
    { id: 3, text: "A green oak tree", embedding: [0.85, 0.15] }
  ];

  const calculateSimilarity = (img: number[], txt: number[]) => {
    const dotProduct = img[0] * txt[0] + img[1] * txt[1];
    const imgMag = Math.sqrt(img[0] * img[0] + img[1] * img[1]);
    const txtMag = Math.sqrt(txt[0] * txt[0] + txt[1] * txt[1]);
    return dotProduct / (imgMag * txtMag);
  };

  const similarity = calculateSimilarity(
    imageData[selectedImage].embedding,
    textData[selectedText].embedding
  );

  const getMatchColor = (similarity: number) => {
    if (similarity > 0.9) return "bg-emerald-500";
    if (similarity > 0.7) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">CLIP: Contrastive Language-Image Pre-training</h3>
        <p className="text-slate-600">Interactive visualization of how CLIP learns to align images and text in a shared embedding space</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Image Encoder */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Image Encoder (Vision Transformer)</h4>
          <div className="grid grid-cols-2 gap-3">
            {imageData.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedImage === img.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">{img.icon}</div>
                <div className="text-sm font-medium text-slate-600">{img.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Embedding Space */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Shared Embedding Space</h4>
          <div className="relative h-64 bg-slate-100 rounded-lg border">
            <svg className="w-full h-full">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Axes */}
              <line x1="20" y1="244" x2="300" y2="244" stroke="#64748b" strokeWidth="2"/>
              <line x1="20" y1="20" x2="20" y2="244" stroke="#64748b" strokeWidth="2"/>
              
              {/* Points */}
              {showEmbeddings && imageData.map((img) => (
                <circle
                  key={`img-${img.id}`}
                  cx={20 + img.embedding[0] * 260}
                  cy={244 - img.embedding[1] * 224}
                  r="8"
                  fill={selectedImage === img.id ? "#3b82f6" : "#94a3b8"}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              
              {showEmbeddings && textData.map((txt) => (
                <rect
                  key={`txt-${txt.id}`}
                  x={20 + txt.embedding[0] * 260 - 6}
                  y={244 - txt.embedding[1] * 224 - 6}
                  width="12"
                  height="12"
                  fill={selectedText === txt.id ? "#6366f1" : "#94a3b8"}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              
              {/* Connection line */}
              {showEmbeddings && (
                <line
                  x1={20 + imageData[selectedImage].embedding[0] * 260}
                  y1={244 - imageData[selectedImage].embedding[1] * 224}
                  x2={20 + textData[selectedText].embedding[0] * 260}
                  y2={244 - textData[selectedText].embedding[1] * 224}
                  stroke={similarity > 0.9 ? "#10b981" : similarity > 0.7 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </svg>
            
            {!showEmbeddings && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowEmbeddings(true)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Show Embeddings
                </button>
              </div>
            )}
          </div>
          
          {showEmbeddings && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <div className="text-sm font-medium text-slate-700">
                Cosine Similarity: {similarity.toFixed(3)}
              </div>
              <div className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 ${getMatchColor(similarity)}`}>
                {similarity > 0.9 ? "Strong Match" : similarity > 0.7 ? "Good Match" : "Poor Match"}
              </div>
            </div>
          )}
        </div>

        {/* Text Encoder */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Text Encoder (Transformer)</h4>
          <div className="space-y-3">
            {textData.map((txt) => (
              <div
                key={txt.id}
                onClick={() => setSelectedText(txt.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedText === txt.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-medium text-slate-700">"{txt.text}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contrastive Learning Demo */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-700 mb-4">Contrastive Learning Process</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {imageData.map((img, imgIdx) => 
            textData.map((txt, txtIdx) => {
              const sim = calculateSimilarity(img.embedding, txt.embedding);
              const isCorrectPair = imgIdx === txtIdx;
              return (
                <div
                  key={`${imgIdx}-${txtIdx}`}
                  className={`p-3 rounded-lg border-2 text-center ${
                    isCorrectPair 
                      ? 'border-emerald-300 bg-emerald-50' 
                      : 'border-rose-300 bg-rose-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{img.icon}</div>
                  <div className="text-xs text-slate-600 mb-2">"{txt.text}"</div>
                  <div className="text-xs font-medium">
                    Sim: {sim.toFixed(2)}
                  </div>
                  <div className={`text-xs ${isCorrectPair ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isCorrectPair ? 'Positive' : 'Negative'}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <p className="text-sm text-slate-600">
          CLIP learns by maximizing similarity between correct image-text pairs (green, positive examples) 
          while minimizing similarity between incorrect pairs (red, negative examples).
        </p>
      </div>
    </div>
  );
}