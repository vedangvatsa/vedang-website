"use client";

import { useState } from 'react';

export function SemanticSimilarityVisualizer() {
  const [selectedSentence1, setSelectedSentence1] = useState(0);
  const [selectedSentence2, setSelectedSentence2] = useState(1);
  const [showEmbeddings, setShowEmbeddings] = useState(false);

  const sentences = [
    { text: "The cat sat on the mat", embedding: [0.8, 0.6, 0.2, 0.9] },
    { text: "A feline rested on the rug", embedding: [0.7, 0.5, 0.3, 0.8] },
    { text: "Dogs like to play fetch", embedding: [0.3, 0.8, 0.7, 0.4] },
    { text: "I love eating pizza", embedding: [0.1, 0.2, 0.9, 0.1] },
    { text: "The weather is sunny today", embedding: [0.2, 0.1, 0.1, 0.7] }
  ];

  const calculateCosineSimilarity = (vec1: number[], vec2: number[]) => {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  };

  const similarity = calculateCosineSimilarity(
    sentences[selectedSentence1].embedding,
    sentences[selectedSentence2].embedding
  );

  const getSimilarityColor = (sim: number) => {
    if (sim > 0.8) return 'text-emerald-600 bg-emerald-100';
    if (sim > 0.6) return 'text-blue-600 bg-blue-100';
    if (sim > 0.4) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  const getWordOverlap = (text1: string, text2: string) => {
    const words1 = text1.toLowerCase().split(' ');
    const words2 = text2.toLowerCase().split(' ');
    const overlap = words1.filter(word => words2.includes(word));
    return overlap.length;
  };

  const wordOverlap = getWordOverlap(
    sentences[selectedSentence1].text,
    sentences[selectedSentence2].text
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Semantic Similarity</h3>
        <p className="text-slate-600">
          Compare sentence meanings beyond surface-level word overlap using vector embeddings
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">Sentence 1</h4>
            {sentences.map((sentence, index) => (
              <button
                key={index}
                onClick={() => setSelectedSentence1(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedSentence1 === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {sentence.text}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">Sentence 2</h4>
            {sentences.map((sentence, index) => (
              <button
                key={index}
                onClick={() => setSelectedSentence2(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedSentence2 === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {sentence.text}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Word Overlap</div>
              <div className="text-3xl font-bold text-slate-800">{wordOverlap}</div>
              <div className="text-sm text-slate-500">shared words</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Semantic Similarity</div>
              <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getSimilarityColor(similarity)}`}>
                {(similarity * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-500">cosine similarity</div>
            </div>
          </div>

          <button
            onClick={() => setShowEmbeddings(!showEmbeddings)}
            className="w-full mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
          >
            {showEmbeddings ? 'Hide' : 'Show'} Vector Embeddings
          </button>

          {showEmbeddings && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">Vector 1</div>
                  <div className="flex space-x-1">
                    {sentences[selectedSentence1].embedding.map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-blue-200 rounded"
                        style={{ height: `${val * 60 + 20}px` }}
                        title={val.toFixed(2)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-indigo-700">Vector 2</div>
                  <div className="flex space-x-1">
                    {sentences[selectedSentence2].embedding.map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-200 rounded"
                        style={{ height: `${val * 60 + 20}px` }}
                        title={val.toFixed(2)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center">
                Hover over bars to see embedding values. Similar meanings cluster in vector space.
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200">
          Notice how "cat/mat" and "feline/rug" have high semantic similarity despite zero word overlap, 
          while unrelated sentences score lower regardless of potential word matches.
        </div>
      </div>
    </div>
  );
}