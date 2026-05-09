"use client";

import React, { useState, useMemo } from 'react';

export function DocumentRetrievalVisualizer() {
  const [query, setQuery] = useState('machine learning algorithms');
  const [retrievalMethod, setRetrievalMethod] = useState<'tfidf' | 'dense'>('tfidf');
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const documents = [
    { id: 1, title: 'Introduction to Machine Learning', content: 'machine learning algorithms supervised unsupervised neural networks classification regression' },
    { id: 2, title: 'Deep Learning Fundamentals', content: 'neural networks deep learning backpropagation gradient descent optimization' },
    { id: 3, title: 'Natural Language Processing', content: 'text processing language models transformers embeddings semantic analysis' },
    { id: 4, title: 'Computer Vision Techniques', content: 'image processing convolutional networks object detection computer vision' },
    { id: 5, title: 'AI Model Training', content: 'artificial intelligence training algorithms model optimization performance' }
  ];

  const queryEmbedding = useMemo(() => {
    const words = query.toLowerCase().split(' ');
    return words.map((_, i) => Math.cos(i * 0.5) * 0.8 + Math.sin(i * 0.3) * 0.6);
  }, [query]);

  const getDocumentEmbedding = (doc: typeof documents[0]) => {
    const words = doc.content.toLowerCase().split(' ');
    return words.slice(0, queryEmbedding.length).map((_, i) => {
      const similarity = queryEmbedding[i] || 0;
      return similarity + (Math.random() - 0.5) * 0.4;
    });
  };

  const calculateTfIdfScore = (doc: typeof documents[0]) => {
    const queryTerms = query.toLowerCase().split(' ');
    const docWords = doc.content.toLowerCase().split(' ');
    let score = 0;

    queryTerms.forEach(term => {
      const tf = docWords.filter(word => word.includes(term) || term.includes(word)).length / docWords.length;
      const idf = Math.log(documents.length / (1 + documents.filter(d => d.content.toLowerCase().includes(term)).length));
      score += tf * idf;
    });

    return Math.max(0, score);
  };

  const calculateDenseScore = (doc: typeof documents[0]) => {
    const docEmb = getDocumentEmbedding(doc);
    const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * (docEmb[i] || 0), 0);
    const queryNorm = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0));
    const docNorm = Math.sqrt(docEmb.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (queryNorm * docNorm) || 0;
  };

  const scoredDocs = useMemo(() => {
    return documents.map(doc => ({
      ...doc,
      score: retrievalMethod === 'tfidf' ? calculateTfIdfScore(doc) : calculateDenseScore(doc)
    })).sort((a, b) => b.score - a.score);
  }, [query, retrievalMethod, queryEmbedding]);

  const maxScore = Math.max(...scoredDocs.map(d => d.score));

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Document Retrieval Visualizer</h3>
        <p className="text-slate-600">Compare TF-IDF lexical matching vs dense vector retrieval methods</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Query Input */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Search Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your search query..."
          />
        </div>

        {/* Method Selection */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setRetrievalMethod('tfidf')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              retrievalMethod === 'tfidf'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            TF-IDF (Lexical)
          </button>
          <button
            onClick={() => setRetrievalMethod('dense')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              retrievalMethod === 'dense'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Dense Vectors (Semantic)
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800">
            Retrieved Documents ({retrievalMethod === 'tfidf' ? 'TF-IDF' : 'Dense Vector'} Scores)
          </h4>
          {scoredDocs.map((doc, index) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
              className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-amber-500' : 'bg-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <h5 className="font-medium text-slate-800">{doc.title}</h5>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Score: {doc.score.toFixed(3)}</div>
                  <div className="w-24 h-2 bg-slate-200 rounded-full mt-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        retrievalMethod === 'tfidf' ? 'bg-blue-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${(doc.score / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {selectedDoc === doc.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">Document Content:</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                    {doc.content.split(' ').map((word, i) => {
                      const isMatch = query.toLowerCase().split(' ').some(qWord => 
                        word.toLowerCase().includes(qWord.toLowerCase()) || qWord.toLowerCase().includes(word.toLowerCase())
                      );
                      return (
                        <span
                          key={i}
                          className={isMatch && retrievalMethod === 'tfidf' ? 'bg-blue-200 px-1 rounded' : ''}
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                  </p>
                  
                  {retrievalMethod === 'dense' && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2">Vector Similarity Visualization:</p>
                      <div className="flex gap-1">
                        {getDocumentEmbedding(doc).slice(0, 8).map((val, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className="w-6 h-16 bg-slate-200 rounded flex flex-col justify-end">
                              <div
                                className="bg-indigo-500 rounded-b w-full transition-all"
                                style={{ height: `${Math.max(5, (val + 1) * 50)}%` }}
                              />
                            </div>
                            <div className="text-xs text-slate-500">{val.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Method Explanation */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-2">
            {retrievalMethod === 'tfidf' ? 'TF-IDF Method' : 'Dense Vector Method'}
          </h5>
          <p className="text-sm text-slate-600">
            {retrievalMethod === 'tfidf'
              ? 'Uses term frequency and inverse document frequency to find exact word matches. Fast and interpretable but misses semantic similarity.'
              : 'Embeds queries and documents into vector space for semantic matching. Captures meaning beyond exact words but requires more computation.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}