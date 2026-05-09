"use client";

import { useState } from 'react';

export function ExplainableAiXaiVisualizer() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);

  const cases = [
    {
      id: 'loan',
      title: 'Loan Application',
      decision: 'Denied',
      confidence: 87,
      features: [
        { name: 'Credit Score', value: 620, weight: -0.4, importance: 35 },
        { name: 'Income', value: 45000, weight: 0.2, importance: 25 },
        { name: 'Debt Ratio', value: 0.8, weight: -0.3, importance: 30 },
        { name: 'Employment Years', value: 2, weight: 0.1, importance: 10 }
      ]
    },
    {
      id: 'medical',
      title: 'Medical Diagnosis',
      decision: 'High Risk',
      confidence: 92,
      features: [
        { name: 'Blood Pressure', value: 180, weight: 0.5, importance: 40 },
        { name: 'Age', value: 65, weight: 0.3, importance: 25 },
        { name: 'BMI', value: 32, weight: 0.2, importance: 20 },
        { name: 'Family History', value: 1, weight: 0.15, importance: 15 }
      ]
    }
  ];

  const currentCaseData = cases[currentCase];

  const getFeatureColor = (weight: number) => {
    if (weight > 0) return 'bg-emerald-500';
    if (weight < -0.2) return 'bg-rose-500';
    return 'bg-amber-500';
  };

  const getFeatureTextColor = (weight: number) => {
    if (weight > 0) return 'text-emerald-700';
    if (weight < -0.2) return 'text-rose-700';
    return 'text-amber-700';
  };

  const getDecisionColor = (decision: string) => {
    if (decision === 'Denied' || decision === 'High Risk') return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Explainable AI (XAI) Visualizer</h3>
        <p className="text-slate-600 text-lg">Explore how AI decisions become transparent and interpretable</p>
      </div>

      <div className="flex gap-4 mb-4">
        {cases.map((caseItem, index) => (
          <button
            key={caseItem.id}
            onClick={() => {
              setCurrentCase(index);
              setSelectedFeature(null);
              setShowExplanation(false);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentCase === index
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {caseItem.title}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Black Box vs Explainable */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-slate-800 text-center">AI Decision Process</h4>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-center mb-4">
              <span className="text-lg font-medium text-slate-700">Input Data</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              {currentCaseData.features.map((feature) => (
                <div key={feature.name} className="bg-slate-100 p-2 rounded text-sm text-center">
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-slate-600">{feature.value}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-6">
              <div 
                className={`w-32 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                  showExplanation 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-slate-800 border-slate-600'
                }`}
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <span className={`text-sm font-medium ${
                  showExplanation ? 'text-blue-700' : 'text-white'
                }`}>
                  {showExplanation ? 'Transparent AI' : 'Black Box AI'}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-lg border font-medium ${getDecisionColor(currentCaseData.decision)}`}>
                {currentCaseData.decision} ({currentCaseData.confidence}% confidence)
              </div>
            </div>
          </div>
        </div>

        {/* Feature Explanations */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-slate-800 text-center">
            {showExplanation ? 'Feature Importance' : 'Click "Black Box" to Reveal'}
          </h4>
          
          {showExplanation && (
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="space-y-4">
                {currentCaseData.features
                  .sort((a, b) => b.importance - a.importance)
                  .map((feature, index) => (
                  <div 
                    key={feature.name}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFeature === feature.name
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedFeature(
                      selectedFeature === feature.name ? null : feature.name
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">{feature.name}</span>
                      <span className={`text-sm font-medium ${getFeatureTextColor(feature.weight)}`}>
                        {feature.weight > 0 ? '+' : ''}{(feature.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getFeatureColor(feature.weight)}`}
                            style={{ width: `${feature.importance}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600">{feature.importance}%</span>
                    </div>

                    {selectedFeature === feature.name && (
                      <div className="mt-3 p-3 bg-slate-50 rounded text-sm">
                        <div className="font-medium mb-1">Explanation:</div>
                        <div className="text-slate-600">
                          This feature contributes <strong>{feature.importance}%</strong> to the decision with a{' '}
                          <span className={getFeatureTextColor(feature.weight)}>
                            {feature.weight > 0 ? 'positive' : 'negative'}
                          </span>{' '}
                          weight of {(feature.weight * 100).toFixed(0)}%.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExplanation && (
        <div className="w-full max-w-4xl bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h5 className="font-semibold text-indigo-900 mb-2">XAI Benefits:</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-indigo-800">Regulatory Compliance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-indigo-800">Trust & Transparency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              <span className="text-indigo-800">Bias Detection</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}