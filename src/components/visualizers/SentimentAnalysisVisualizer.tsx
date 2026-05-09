"use client";

import { useState } from 'react';

export function SentimentAnalysisVisualizer() {
  const [inputText, setInputText] = useState('The food was excellent but the service was slow');
  const [analysisLevel, setAnalysisLevel] = useState<'document' | 'aspect'>('document');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const positiveWords = ['excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'good', 'love', 'perfect', 'beautiful', 'awesome'];
  const negativeWords = ['terrible', 'awful', 'bad', 'horrible', 'hate', 'worst', 'slow', 'poor', 'disappointing', 'ugly'];
  
  const aspectKeywords = {
    food: ['food', 'meal', 'dish', 'taste', 'flavor', 'cooking', 'cuisine', 'menu'],
    service: ['service', 'staff', 'waiter', 'waitress', 'server', 'employee', 'team'],
    ambiance: ['atmosphere', 'ambiance', 'music', 'lighting', 'decor', 'environment']
  };

  const analyzeDocument = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: 'neutral', confidence: 0, positive: 0, negative: 0 };
    
    const positiveScore = positiveCount / total;
    const negativeScore = negativeCount / total;
    
    if (positiveScore > negativeScore) {
      return { sentiment: 'positive', confidence: positiveScore * 100, positive: positiveCount, negative: negativeCount };
    } else if (negativeScore > positiveScore) {
      return { sentiment: 'negative', confidence: negativeScore * 100, positive: positiveCount, negative: negativeCount };
    } else {
      return { sentiment: 'neutral', confidence: 50, positive: positiveCount, negative: negativeCount };
    }
  };

  const analyzeAspects = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const results: any = {};
    
    Object.entries(aspectKeywords).forEach(([aspect, keywords]) => {
      const hasAspect = keywords.some(keyword => text.toLowerCase().includes(keyword));
      if (hasAspect) {
        // Simple context window analysis
        const sentences = text.split(/[.!?]+/);
        let aspectSentiment = { positive: 0, negative: 0 };
        
        sentences.forEach(sentence => {
          if (keywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
            const sentenceWords = sentence.toLowerCase().split(/\s+/);
            sentenceWords.forEach(word => {
              if (positiveWords.includes(word)) aspectSentiment.positive++;
              if (negativeWords.includes(word)) aspectSentiment.negative++;
            });
          }
        });
        
        const total = aspectSentiment.positive + aspectSentiment.negative;
        if (total > 0) {
          if (aspectSentiment.positive > aspectSentiment.negative) {
            results[aspect] = { sentiment: 'positive', confidence: (aspectSentiment.positive / total) * 100 };
          } else if (aspectSentiment.negative > aspectSentiment.positive) {
            results[aspect] = { sentiment: 'negative', confidence: (aspectSentiment.negative / total) * 100 };
          } else {
            results[aspect] = { sentiment: 'neutral', confidence: 50 };
          }
        }
      }
    });
    
    return results;
  };

  const performAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1000);
  };

  const documentResult = analyzeDocument(inputText);
  const aspectResults = analyzeAspects(inputText);

  const highlightWords = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (positiveWords.includes(cleanWord)) {
        return <span key={index} className="bg-emerald-200 text-emerald-800 px-1 rounded">{word}</span>;
      }
      if (negativeWords.includes(cleanWord)) {
        return <span key={index} className="bg-rose-200 text-rose-800 px-1 rounded">{word}</span>;
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Sentiment Analysis</h3>
        <p className="text-slate-600 max-w-2xl">
          Enter text to see how AI determines emotional tone. Switch between document-level and aspect-based analysis to explore different granularities.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to analyze..."
            className="w-full p-4 border border-slate-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setAnalysisLevel('document')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  analysisLevel === 'document'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Document Level
              </button>
              <button
                onClick={() => setAnalysisLevel('aspect')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  analysisLevel === 'aspect'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Aspect Based
              </button>
            </div>
            
            <button
              onClick={performAnalysis}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Text Highlighting */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">Word-level Analysis</h4>
          <div className="text-lg leading-relaxed">
            {highlightWords(inputText)}
          </div>
          <div className="flex gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-200 rounded"></div>
              <span className="text-slate-600">Positive words</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-200 rounded"></div>
              <span className="text-slate-600">Negative words</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {analysisLevel === 'document' && (
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Document-Level Sentiment</h4>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg text-center ${
                documentResult.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                documentResult.sentiment === 'negative' ? 'bg-rose-100 text-rose-800' :
                'bg-slate-100 text-slate-800'
              } ${isAnalyzing ? 'animate-pulse' : ''}`}>
                <div className="text-2xl font-bold capitalize">{documentResult.sentiment}</div>
                <div className="text-lg">{documentResult.confidence.toFixed(1)}% confidence</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{documentResult.positive}</div>
                  <div className="text-slate-600">Positive words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">{documentResult.negative}</div>
                  <div className="text-slate-600">Negative words</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysisLevel === 'aspect' && (
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Aspect-Based Sentiment</h4>
            <div className="space-y-4">
              {Object.keys(aspectResults).length === 0 ? (
                <p className="text-slate-600 text-center py-8">
                  No recognizable aspects found. Try mentioning food, service, or ambiance.
                </p>
              ) : (
                Object.entries(aspectResults).map(([aspect, result]: [string, any]) => (
                  <div key={aspect} className={`p-4 rounded-lg flex justify-between items-center ${
                    result.sentiment === 'positive' ? 'bg-emerald-50 border border-emerald-200' :
                    result.sentiment === 'negative' ? 'bg-rose-50 border border-rose-200' :
                    'bg-slate-50 border border-slate-200'
                  } ${isAnalyzing ? 'animate-pulse' : ''}`}>
                    <div>
                      <div className="font-semibold text-slate-800 capitalize">{aspect}</div>
                      <div className={`text-sm ${
                        result.sentiment === 'positive' ? 'text-emerald-600' :
                        result.sentiment === 'negative' ? 'text-rose-600' :
                        'text-slate-600'
                      }`}>
                        {result.sentiment} sentiment
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      result.sentiment === 'positive' ? 'text-emerald-600' :
                      result.sentiment === 'negative' ? 'text-rose-600' :
                      'text-slate-600'
                    }`}>
                      {result.confidence.toFixed(1)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}