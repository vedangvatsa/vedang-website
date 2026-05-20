"use client";

import { useState } from 'react';

interface MedicalCase {
  id: number;
  name: string;
  symptoms: string[];
  expectedRules: number[];
  diagnosis: string;
}

export function ExpertSystemsVisualizer() {
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [inferenceActive, setInferenceActive] = useState(false);

  const knowledgeBase = [
    { id: 1, rule: "IF fever > 38°C AND headache THEN check for infection", active: false },
    { id: 2, rule: "IF chest_pain AND shortness_of_breath THEN cardiac_concern", active: false },
    { id: 3, rule: "IF rash AND fever THEN viral_infection_likely", active: false },
    { id: 4, rule: "IF viral_infection_likely THEN prescribe_rest_and_fluids", active: false }
  ];

  const [rules, setRules] = useState(knowledgeBase);

  const medicalCases = [
    {
      id: 1,
      name: "Patient A",
      symptoms: ["fever: 39°C", "headache", "fatigue"],
      expectedRules: [1],
      diagnosis: "Possible infection - recommend blood tests"
    },
    {
      id: 2,
      name: "Patient B", 
      symptoms: ["chest pain", "shortness of breath", "sweating"],
      expectedRules: [2],
      diagnosis: "Cardiac concern - immediate ECG required"
    },
    {
      id: 3,
      name: "Patient C",
      symptoms: ["skin rash", "fever: 38.5°C", "body aches"],
      expectedRules: [3, 4],
      diagnosis: "Viral infection likely - rest and fluids recommended"
    }
  ];

  const runInference = (caseData: MedicalCase) => {
    setInferenceActive(true);
    setCurrentStep(0);
    
    const newRules = rules.map(rule => ({ ...rule, active: false }));
    setRules(newRules);

    caseData.expectedRules.forEach((ruleId, index) => {
      setTimeout(() => {
        setRules(prev => prev.map(rule => 
          rule.id === ruleId ? { ...rule, active: true } : rule
        ));
        setCurrentStep(index + 1);
        
        if (index === caseData.expectedRules.length - 1) {
          setTimeout(() => {
            setInferenceActive(false);
          }, 1500);
        }
      }, (index + 1) * 1200);
    });
  };

  const resetSystem = () => {
    setSelectedCase(null);
    setCurrentStep(0);
    setInferenceActive(false);
    setRules(knowledgeBase);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Expert Systems</h3>
        <p className="text-slate-600">Interactive medical diagnosis system showing knowledge base and inference engine</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Cases */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Patient Cases</h4>
          <div className="space-y-3">
            {medicalCases.map((case_) => (
              <div
                key={case_.id}
                onClick={() => {
                  setSelectedCase(case_);
                  runInference(case_);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedCase?.id === case_.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-25'
                }`}
              >
                <div className="font-medium text-slate-800">{case_.name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  {case_.symptoms.join(", ")}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={resetSystem}
            className="w-full mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Reset System
          </button>
        </div>

        {/* Knowledge Base */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Knowledge Base</h4>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                  rule.active
                    ? 'border-emerald-500 bg-emerald-50 shadow-md transform scale-105'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-sm font-mono text-slate-700">
                  Rule {rule.id}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {rule.rule}
                </div>
                {rule.active && (
                  <div className="mt-2">
                    <div className="text-xs text-emerald-600 font-medium">
                      ✓ Rule Activated
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inference Engine & Results */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Inference Engine</h4>
          
          {!selectedCase ? (
            <div className="text-center text-slate-500 py-8">
              Select a patient case to start diagnosis
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="font-medium text-indigo-800">Processing:</div>
                <div className="text-sm text-indigo-600 mt-1">
                  {selectedCase.name}
                </div>
                <div className="text-xs text-indigo-500 mt-2">
                  Symptoms: {selectedCase.symptoms.join(", ")}
                </div>
              </div>

              {inferenceActive && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                    <div className="text-sm text-amber-700">
                      Evaluating rules... (Step {currentStep})
                    </div>
                  </div>
                </div>
              )}

              {!inferenceActive && selectedCase && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="font-medium text-emerald-800 mb-2">Diagnosis:</div>
                  <div className="text-sm text-emerald-700">
                    {selectedCase.diagnosis}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 mt-4 p-3 bg-slate-50 rounded">
                <strong>How it works:</strong> The inference engine evaluates each rule in the knowledge base against the patient symptoms, activating matching rules to reach a diagnosis.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}