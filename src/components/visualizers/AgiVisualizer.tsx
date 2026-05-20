"use client";

import React, { useState, useEffect } from 'react';

export function AgiVisualizer() {
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [aiType, setAiType] = useState('narrow');
  const [taskProgress, setTaskProgress] = useState<Record<string, number>>({});
  const [isLearning, setIsLearning] = useState(false);

  const domains = [
    { id: 'chess', name: 'Chess Strategy', color: 'blue', icon: '♟️' },
    { id: 'art', name: 'Art Creation', color: 'rose', icon: '🎨' },
    { id: 'physics', name: 'Physics Research', color: 'indigo', icon: '⚛️' },
    { id: 'medicine', name: 'Medical Diagnosis', color: 'emerald', icon: '🏥' },
    { id: 'language', name: 'Language Translation', color: 'amber', icon: '💬' },
    { id: 'robotics', name: 'Robotics Control', color: 'slate', icon: '🤖' }
  ];

  const narrowAICapabilities = {
    chess: 95,
    art: 0,
    physics: 0,
    medicine: 0,
    language: 0,
    robotics: 0
  };

  const agiCapabilities = {
    chess: 92,
    art: 88,
    physics: 94,
    medicine: 89,
    language: 96,
    robotics: 91
  };

  useEffect(() => {
    if (isLearning && aiType === 'agi') {
      const interval = setInterval(() => {
        setTaskProgress(prev => {
          const newProgress = { ...prev };
          Object.keys(agiCapabilities).forEach(domain => {
            const key = domain as keyof typeof agiCapabilities;
            if (!newProgress[domain]) newProgress[domain] = 0;
            if (newProgress[domain] < agiCapabilities[key]) {
              newProgress[domain] = Math.min(
                newProgress[domain] + Math.random() * 8 + 2,
                agiCapabilities[key]
              );
            }
          });
          return newProgress;
        });
      }, 150);

      setTimeout(() => {
        setIsLearning(false);
        clearInterval(interval);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLearning, aiType]);

  const handleDomainClick = (domain: any) => {
    setSelectedDomain(domain);
    if (aiType === 'narrow') {
      setTaskProgress({ [domain.id]: narrowAICapabilities[domain.id as keyof typeof narrowAICapabilities] });
    } else {
      setTaskProgress(agiCapabilities);
    }
  };

  const switchAIType = (type: string) => {
    setAiType(type);
    setSelectedDomain(null);
    setTaskProgress({});
    if (type === 'agi') {
      setIsLearning(true);
    }
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Expert', color: 'emerald' };
    if (score >= 70) return { level: 'Advanced', color: 'blue' };
    if (score >= 50) return { level: 'Intermediate', color: 'amber' };
    if (score >= 20) return { level: 'Basic', color: 'rose' };
    return { level: 'None', color: 'slate' };
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Artificial General Intelligence (AGI)
        </h3>
        <p className="text-slate-600 max-w-2xl">
          Compare how Narrow AI excels at single domains vs. AGI's human-like adaptability across all intellectual tasks
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => switchAIType('narrow')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            aiType === 'narrow'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-blue-500 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Narrow AI
        </button>
        <button
          onClick={() => switchAIType('agi')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            aiType === 'agi'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white text-indigo-500 border border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          AGI
        </button>
      </div>

      {isLearning && (
        <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-700">
            <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
            <span className="font-semibold">AGI Learning Across All Domains...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {domains.map(domain => {
          const progress = taskProgress[domain.id] || 0;
          const performance = getPerformanceLevel(progress);
          const isActive = selectedDomain?.id === domain.id;
          const canPerform = aiType === 'agi' || 
            (aiType === 'narrow' && narrowAICapabilities[domain.id as keyof typeof narrowAICapabilities] > 0);

          return (
            <div
              key={domain.id}
              onClick={() => handleDomainClick(domain)}
              className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                isActive
                  ? `bg-${domain.color}-50 border-${domain.color}-300 shadow-lg`
                  : `bg-white border-slate-200 hover:border-${domain.color}-200`
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{domain.icon}</div>
                <h4 className="font-semibold text-slate-800 mb-3">{domain.name}</h4>
                
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-${performance.color}-500 transition-all duration-300 ease-out`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`font-semibold text-${performance.color}-600`}>
                        {performance.level}
                      </span>
                      <span className="text-slate-600">{Math.round(progress)}%</span>
                    </div>
                  </div>
                )}

                {progress === 0 && aiType === 'narrow' && !canPerform && (
                  <div className="text-slate-400 text-sm font-medium">
                    Cannot perform
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 w-full max-w-2xl">
        <h4 className="font-semibold text-slate-800 mb-4">Key Differences</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-blue-600 mb-2">Narrow AI</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Excels at single, specific tasks</li>
              <li>• Requires retraining for new domains</li>
              <li>• Current state of AI technology</li>
              <li>• Deep but narrow expertise</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-indigo-600 mb-2">AGI</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Human-level performance across all tasks</li>
              <li>• Transfers knowledge between domains</li>
              <li>• Future AI milestone</li>
              <li>• Broad, adaptable intelligence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}