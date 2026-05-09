"use client";

import React, { useState, useEffect } from 'react';

export function PredictiveAnalyticsVisualizer() {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(11);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [modelAccuracy, setModelAccuracy] = useState<number>(0);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  // Historical sales data (representing months 1-12)
  const historicalData = [
    { month: 1, sales: 120, season: 'Winter', holiday: false },
    { month: 2, sales: 110, season: 'Winter', holiday: true },
    { month: 3, sales: 130, season: 'Spring', holiday: false },
    { month: 4, sales: 140, season: 'Spring', holiday: true },
    { month: 5, sales: 150, season: 'Spring', holiday: false },
    { month: 6, sales: 180, season: 'Summer', holiday: false },
    { month: 7, sales: 190, season: 'Summer', holiday: false },
    { month: 8, sales: 175, season: 'Summer', holiday: false },
    { month: 9, sales: 160, season: 'Fall', holiday: false },
    { month: 10, sales: 170, season: 'Fall', holiday: true },
    { month: 11, sales: 220, season: 'Fall', holiday: true },
    { month: 12, sales: 280, season: 'Winter', holiday: true }
  ];

  // Simple predictive model based on trends and seasonality
  const predictSales = (month: number) => {
    const seasonalFactors = { Winter: 1.2, Spring: 1.0, Summer: 1.1, Fall: 1.3 };
    const baselineGrowth = 0.05; // 5% monthly growth trend
    const holidayBoost = selectedPeriod <= 12 && historicalData[selectedPeriod - 1]?.holiday ? 1.4 : 1.0;
    
    const avgSales = historicalData.reduce((sum, d) => sum + d.sales, 0) / historicalData.length;
    const seasonKey = month <= 2 || month === 12 ? 'Winter' : 
                     month <= 5 ? 'Spring' : 
                     month <= 8 ? 'Summer' : 'Fall';
    
    const prediction = avgSales * (1 + baselineGrowth * (month - 6)) * 
                      seasonalFactors[seasonKey as keyof typeof seasonalFactors] * 
                      holidayBoost;
    
    return Math.round(prediction);
  };

  const trainModel = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setShowPrediction(false);
    setModelAccuracy(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setShowPrediction(true);
          setModelAccuracy(85 + Math.random() * 10); // Simulate 85-95% accuracy
        }
        return newProgress;
      });
    }, 200);
  };

  const maxSales = Math.max(...historicalData.map(d => d.sales), showPrediction ? predictSales(selectedPeriod) : 0);
  const chartHeight = 200;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Predictive Analytics</h3>
        <p className="text-slate-600 max-w-2xl">
          Train a model on historical sales data to forecast future demand. Adjust the prediction period and see how patterns in past data inform future predictions.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls */}
          <div className="lg:w-1/3 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prediction Period: Month {selectedPeriod}
              </label>
              <input
                type="range"
                min="13"
                max="18"
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(Number(e.target.value));
                  setShowPrediction(false);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">Future months (13-18)</div>
            </div>

            <button
              onClick={trainModel}
              disabled={isTraining}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isTraining ? 'Training Model...' : 'Train Predictive Model'}
            </button>

            {isTraining && (
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Training Progress</div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">{trainingProgress}%</div>
              </div>
            )}

            {showPrediction && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <div className="font-medium text-emerald-800">Prediction Result</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {predictSales(selectedPeriod)} units
                </div>
                <div className="text-sm text-emerald-700">
                  Model Accuracy: {modelAccuracy.toFixed(1)}%
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="lg:w-2/3">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h4 className="font-medium text-slate-700 mb-4">Sales Forecast Chart</h4>
              <div className="relative" style={{ height: `${chartHeight}px` }}>
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200, 250, 300].map(value => (
                    <g key={value}>
                      <line
                        x1="40"
                        y1={chartHeight - (value / maxSales) * (chartHeight - 40)}
                        x2="100%"
                        y2={chartHeight - (value / maxSales) * (chartHeight - 40)}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                      <text
                        x="35"
                        y={chartHeight - (value / maxSales) * (chartHeight - 40) + 5}
                        textAnchor="end"
                        className="text-xs fill-slate-500"
                      >
                        {value}
                      </text>
                    </g>
                  ))}

                  {/* Historical data bars */}
                  {historicalData.map((data, index) => {
                    const barWidth = (100 - 5) / 18; // Account for 18 total periods
                    const x = 45 + index * (barWidth * 8);
                    const height = (data.sales / maxSales) * (chartHeight - 40);
                    const y = chartHeight - height;

                    return (
                      <g key={index}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth * 6}
                          height={height}
                          fill={data.holiday ? "#3b82f6" : "#64748b"}
                          className="transition-all duration-300"
                        />
                        <text
                          x={x + (barWidth * 3)}
                          y={chartHeight + 15}
                          textAnchor="middle"
                          className="text-xs fill-slate-600"
                        >
                          {data.month}
                        </text>
                      </g>
                    );
                  })}

                  {/* Prediction bar */}
                  {showPrediction && (
                    <g>
                      <rect
                        x={45 + (selectedPeriod - 1) * (6.5 * 8)}
                        y={chartHeight - (predictSales(selectedPeriod) / maxSales) * (chartHeight - 40)}
                        width={6 * 6}
                        height={(predictSales(selectedPeriod) / maxSales) * (chartHeight - 40)}
                        fill="#10b981"
                        stroke="#059669"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <text
                        x={45 + (selectedPeriod - 1) * (6.5 * 8) + 18}
                        y={chartHeight + 15}
                        textAnchor="middle"
                        className="text-xs fill-emerald-600 font-medium"
                      >
                        {selectedPeriod}
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-500 rounded"></div>
                  <span className="text-slate-600">Regular Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="text-slate-600">Holiday Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-600 rounded border-2 border-emerald-700"></div>
                  <span className="text-slate-600">Prediction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}