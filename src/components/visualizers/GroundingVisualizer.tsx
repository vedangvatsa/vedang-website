"use client";

import { useState } from 'react';

export function GroundingVisualizer() {
  const [selectedQuery, setSelectedQuery] = useState("What is the capital of Japan?");
  const [modelType, setModelType] = useState<"ungrounded" | "grounded">("ungrounded");
  const [showSources, setShowSources] = useState(false);
  const [confidence, setConfidence] = useState(0.95);

  const queries = [
    "What is the capital of Japan?",
    "What did the CEO of Tesla say about AI yesterday?",
    "How many people live in Mars colonies?",
    "What is the current stock price of Apple?"
  ];

  const responses = {
    ungrounded: {
      "What is the capital of Japan?": "Tokyo is the capital of Japan, established in 1868.",
      "What did the CEO of Tesla say about AI yesterday?": "Elon Musk said that AI will revolutionize transportation and achieve full autonomy by 2024.",
      "How many people live in Mars colonies?": "Approximately 50,000 people currently live in established Mars colonies across three settlements.",
      "What is the current stock price of Apple?": "Apple's stock is trading at $178.42, up 2.3% from yesterday's close."
    },
    grounded: {
      "What is the capital of Japan?": "Tokyo is the capital of Japan.",
      "What did the CEO of Tesla say about AI yesterday?": "I cannot find recent statements from Tesla's CEO about AI from yesterday. My last update was in April 2024.",
      "How many people live in Mars colonies?": "There are currently no permanent human settlements on Mars. No humans live in Mars colonies.",
      "What is the current stock price of Apple?": "I cannot provide real-time stock prices. Please check a financial website for current Apple stock prices."
    }
  };

  const sources = {
    "What is the capital of Japan?": [
      { title: "Wikipedia: Tokyo", url: "wikipedia.org/Tokyo", reliability: 0.92 },
      { title: "Britannica: Japan Capital", url: "britannica.com/japan", reliability: 0.96 }
    ],
    "What did the CEO of Tesla say about AI yesterday?": [],
    "How many people live in Mars colonies?": [
      { title: "NASA Mars Exploration", url: "nasa.gov/mars", reliability: 0.98 },
      { title: "SpaceX Mars Plans", url: "spacex.com/mars", reliability: 0.85 }
    ],
    "What is the current stock price of Apple?": []
  };

  const getResponseColor = () => {
    if (modelType === "ungrounded") {
      return selectedQuery === "What is the capital of Japan?" ? "text-emerald-700" : "text-rose-700";
    }
    return "text-blue-700";
  };

  const getConfidenceColor = () => {
    if (modelType === "ungrounded") return "bg-rose-500";
    return confidence > 0.8 ? "bg-emerald-500" : "bg-amber-500";
  };

  const getActualConfidence = () => {
    if (modelType === "grounded") {
      if (sources[selectedQuery as keyof typeof sources].length === 0) return 0.1;
      return sources[selectedQuery as keyof typeof sources].reduce((acc, s) => acc + s.reliability, 0) / sources[selectedQuery as keyof typeof sources].length;
    }
    return confidence;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Grounding Visualization</h3>
        <p className="text-slate-600 max-w-2xl">Compare how ungrounded vs grounded AI models respond to queries. Grounded models verify claims against external sources.</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setModelType("ungrounded")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            modelType === "ungrounded" 
              ? "bg-rose-500 text-white shadow-lg" 
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          Ungrounded Model
        </button>
        <button
          onClick={() => setModelType("grounded")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            modelType === "grounded" 
              ? "bg-blue-500 text-white shadow-lg" 
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          Grounded Model
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-700 mb-3">Select a Query:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {queries.map((query) => (
              <button
                key={query}
                onClick={() => setSelectedQuery(query)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedQuery === query
                    ? "bg-indigo-100 border-2 border-indigo-400 text-indigo-800"
                    : "bg-slate-100 border-2 border-slate-200 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-700">
              {modelType === "ungrounded" ? "Ungrounded" : "Grounded"} Response:
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Confidence:</span>
              <div className="w-20 bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getConfidenceColor()}`}
                  style={{ width: `${getActualConfidence() * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {Math.round(getActualConfidence() * 100)}%
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-l-4 ${
            modelType === "ungrounded" 
              ? selectedQuery === "What is the capital of Japan?" 
                ? "border-emerald-400 bg-emerald-50" 
                : "border-rose-400 bg-rose-50"
              : "border-blue-400 bg-blue-50"
          }`}>
            <p className={`font-medium ${getResponseColor()}`}>
              {responses[modelType][selectedQuery as keyof typeof responses.ungrounded]}
            </p>
          </div>

          {modelType === "grounded" && (
            <div className="mt-4">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>{showSources ? "Hide" : "Show"} Sources</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showSources ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSources && (
                <div className="mt-3 space-y-2">
                  {sources[selectedQuery as keyof typeof sources].length > 0 ? (
                    sources[selectedQuery as keyof typeof sources].map((source, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">{source.title}</p>
                          <p className="text-sm text-slate-500">{source.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 bg-emerald-500 rounded-full"
                              style={{ width: `${source.reliability * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">
                            {Math.round(source.reliability * 100)}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic p-3 bg-amber-50 rounded-lg border border-amber-200">
                      No verifiable sources found - response modified accordingly
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-600 max-w-3xl text-center">
        <strong>Key Insight:</strong> Grounded models acknowledge uncertainty when sources are unavailable, 
        while ungrounded models may generate confident-sounding but potentially false information.
      </div>
    </div>
  );
}