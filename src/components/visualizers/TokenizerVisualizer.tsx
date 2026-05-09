"use client";

import { useState } from 'react';

export function TokenizerVisualizer() {
  const [inputText, setInputText] = useState("Hello world! This is tokenization.");
  const [selectedTokenizer, setSelectedTokenizer] = useState("word");
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);

  const tokenizers = {
    word: {
      name: "Word-based",
      description: "Splits on whitespace and punctuation",
      tokenize: (text: string) => {
        return text.split(/(\s+|[.,!?;:])/).filter(token => token.trim() !== '');
      }
    },
    character: {
      name: "Character-based",
      description: "Each character becomes a token",
      tokenize: (text: string) => {
        return text.split('');
      }
    },
    subword: {
      name: "Subword (BPE-like)",
      description: "Breaks words into common subword units",
      tokenize: (text: string) => {
        const words = text.split(/(\s+|[.,!?;:])/).filter(token => token.trim() !== '');
        const tokens: string[] = [];
        words.forEach(word => {
          if (/\s/.test(word) || /[.,!?;:]/.test(word)) {
            tokens.push(word);
          } else if (word.length > 3) {
            // Simple BPE simulation - break longer words
            const mid = Math.floor(word.length / 2);
            tokens.push(word.slice(0, mid) + "@@");
            tokens.push(word.slice(mid));
          } else {
            tokens.push(word);
          }
        });
        return tokens;
      }
    }
  };

  const currentTokens = tokenizers[selectedTokenizer as keyof typeof tokenizers].tokenize(inputText);
  const vocabularySize = new Set(currentTokens.filter(t => t.trim() !== '')).size;

  const getTokenColor = (index: number) => {
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-rose-100 border-rose-300 text-rose-800",
      "bg-emerald-100 border-emerald-300 text-emerald-800",
      "bg-amber-100 border-amber-300 text-amber-800",
    ];
    return colors[index % colors.length];
  };

  const getTokenId = (token: string, index: number) => {
    // Simple hash function for consistent token IDs
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      const char = token.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 10000;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Tokenizer Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          See how different tokenization strategies convert raw text into discrete tokens that AI models can process.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Input Text Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Input Text</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            rows={3}
            placeholder="Enter text to tokenize..."
          />
        </div>

        {/* Tokenizer Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Tokenization Strategy</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(tokenizers).map(([key, tokenizer]) => (
              <button
                key={key}
                onClick={() => setSelectedTokenizer(key)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTokenizer === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-semibold text-slate-800">{tokenizer.name}</div>
                <div className="text-sm text-slate-600 mt-1">{tokenizer.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Token Visualization */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-800">Tokens</h4>
            <div className="text-sm text-slate-600">
              {currentTokens.length} tokens • Vocab size: {vocabularySize}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-slate-200 min-h-[100px]">
            {currentTokens.map((token, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredToken(index)}
                onMouseLeave={() => setHoveredToken(null)}
                className={`relative px-3 py-2 rounded-md border-2 cursor-pointer transition-all transform ${
                  getTokenColor(index)
                } ${hoveredToken === index ? 'scale-110 shadow-lg' : ''}`}
              >
                <span className="font-mono text-sm">
                  {token === ' ' ? '␣' : token}
                </span>
                {hoveredToken === index && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Token #{index} • ID: {getTokenId(token, index)}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Token Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentTokens.length}</div>
            <div className="text-sm text-slate-600">Total Tokens</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-indigo-600">{vocabularySize}</div>
            <div className="text-sm text-slate-600">Unique Tokens</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {inputText.length > 0 ? (currentTokens.length / inputText.length * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-slate-600">Compression Ratio</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {currentTokens.length > 0 ? (inputText.length / currentTokens.length).toFixed(1) : 0}
            </div>
            <div className="text-sm text-slate-600">Chars per Token</div>
          </div>
        </div>
      </div>
    </div>
  );
}