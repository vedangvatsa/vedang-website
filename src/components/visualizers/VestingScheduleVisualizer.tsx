"use client";

import { useState, useEffect } from 'react';

export function VestingScheduleVisualizer() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vestingParams, setVestingParams] = useState({
    totalTokens: 10000,
    cliffMonths: 12,
    vestingMonths: 48
  });

  const calculateVestedTokens = (month: number) => {
    if (month < vestingParams.cliffMonths) return 0;
    if (month >= vestingParams.vestingMonths) return vestingParams.totalTokens;
    
    const monthsAfterCliff = month - vestingParams.cliffMonths;
    const totalVestingPeriod = vestingParams.vestingMonths - vestingParams.cliffMonths;
    return Math.floor((monthsAfterCliff / totalVestingPeriod) * vestingParams.totalTokens);
  };

  const vestedTokens = calculateVestedTokens(currentMonth);
  const unvestedTokens = vestingParams.totalTokens - vestedTokens;
  const vestingProgress = (currentMonth / vestingParams.vestingMonths) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMonth(prev => {
          if (prev >= vestingParams.vestingMonths) {
            setIsPlaying(false);
            return vestingParams.vestingMonths;
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, vestingParams.vestingMonths]);

  const resetAnimation = () => {
    setCurrentMonth(0);
    setIsPlaying(false);
  };

  const getMonthColor = (month: number) => {
    if (month < vestingParams.cliffMonths) return 'bg-rose-200';
    if (month <= currentMonth) return 'bg-emerald-400';
    return 'bg-slate-200';
  };

  const stakeholders = [
    { name: 'Founders', percentage: 25, color: 'bg-blue-500' },
    { name: 'Team', percentage: 20, color: 'bg-indigo-500' },
    { name: 'Investors', percentage: 30, color: 'bg-rose-500' },
    { name: 'Advisors', percentage: 5, color: 'bg-amber-500' }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Vesting Schedule Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how token vesting works with cliff periods and gradual releases to align stakeholder incentives
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Vesting Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Total Tokens: {vestingParams.totalTokens.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={vestingParams.totalTokens}
                onChange={(e) => setVestingParams(prev => ({ ...prev, totalTokens: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Cliff Period: {vestingParams.cliffMonths} months
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={vestingParams.cliffMonths}
                onChange={(e) => setVestingParams(prev => ({ ...prev, cliffMonths: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Total Vesting: {vestingParams.vestingMonths} months
              </label>
              <input
                type="range"
                min="12"
                max="60"
                value={vestingParams.vestingMonths}
                onChange={(e) => setVestingParams(prev => ({ ...prev, vestingMonths: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-slate-700">Vesting Timeline</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Month indicators */}
          <div className="grid grid-cols-12 gap-1 mb-4">
            {Array.from({ length: Math.min(vestingParams.vestingMonths, 60) }, (_, i) => (
              <div
                key={i}
                className={`h-8 rounded ${getMonthColor(i)} transition-colors duration-200 flex items-center justify-center cursor-pointer`}
                onClick={() => setCurrentMonth(i)}
              >
                {i % 6 === 0 && <span className="text-xs font-medium">{i}</span>}
              </div>
            ))}
          </div>

          {/* Current status */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-slate-700">
              Month {currentMonth} of {vestingParams.vestingMonths}
            </p>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-200 rounded"></div>
                Cliff Period
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                Vested
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded"></div>
                Future
              </span>
            </div>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vested vs Unvested */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-4">Token Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-medium">Vested Tokens</span>
                <span className="font-bold text-emerald-600">{vestedTokens.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(vestedTokens / vestingParams.totalTokens) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Unvested Tokens</span>
                <span className="font-bold text-slate-600">{unvestedTokens.toLocaleString()}</span>
              </div>
              <div className="text-center pt-2">
                <span className="text-2xl font-bold text-blue-600">
                  {((vestedTokens / vestingParams.totalTokens) * 100).toFixed(1)}%
                </span>
                <p className="text-sm text-slate-600">Vested</p>
              </div>
            </div>
          </div>

          {/* Stakeholder Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-4">Stakeholder Distribution</h4>
            <div className="space-y-3">
              {stakeholders.map((stakeholder, index) => {
                const stakeholderTokens = Math.floor((stakeholder.percentage / 100) * vestedTokens);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${stakeholder.color}`}></div>
                      <span className="font-medium text-slate-700">{stakeholder.name}</span>
                      <span className="text-sm text-slate-500">({stakeholder.percentage}%)</span>
                    </div>
                    <span className="font-bold text-slate-700">{stakeholderTokens.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">Current Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg text-blue-600">
                {currentMonth < vestingParams.cliffMonths ? 'Cliff Period' : 'Vesting Active'}
              </p>
              <p className="text-blue-700">Current Phase</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-indigo-600">
                {Math.max(0, vestingParams.cliffMonths - currentMonth)} months
              </p>
              <p className="text-indigo-700">Until First Vest</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-rose-600">
                {Math.max(0, vestingParams.vestingMonths - currentMonth)} months
              </p>
              <p className="text-rose-700">Until Fully Vested</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}