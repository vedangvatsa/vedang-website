"use client";

import { useState } from 'react';

export function CachingStrategyVisualizer() {
  const [strategy, setStrategy] = useState<'cache-aside' | 'read-through'>('cache-aside');
  const [cache, setCache] = useState<{[key: string]: string}>({});
  const [database] = useState<{[key: string]: string}>({
    'user:1': 'Alice Johnson',
    'user:2': 'Bob Smith', 
    'user:3': 'Carol Davis',
    'product:1': 'Laptop Pro',
    'product:2': 'Wireless Mouse'
  });
  const [currentRequest, setCurrentRequest] = useState<string>('');
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [requestHistory, setRequestHistory] = useState<Array<{key: string, hit: boolean, strategy: string}>>([]);

  const simulateRequest = async (key: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentRequest(key);
    setAnimationStep(0);

    const isHit = cache.hasOwnProperty(key);
    
    // Step 1: Check cache
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnimationStep(1);

    if (isHit) {
      // Cache hit
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnimationStep(2);
    } else {
      // Cache miss
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnimationStep(3);

      // Fetch from database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimationStep(4);

      // Update cache
      if (strategy === 'cache-aside') {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnimationStep(5);
      }
      
      setCache(prev => ({...prev, [key]: database[key]}));
    }

    setRequestHistory(prev => [...prev, {key, hit: isHit, strategy}]);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnimationStep(0);
    setCurrentRequest('');
    setIsAnimating(false);
  };

  const clearCache = () => {
    if (!isAnimating) {
      setCache({});
      setRequestHistory([]);
    }
  };

  const getStepDescription = () => {
    switch (animationStep) {
      case 1: return 'Checking cache...';
      case 2: return 'Cache HIT! Returning data';
      case 3: return 'Cache MISS! Need to fetch from database';
      case 4: return 'Fetching from database...';
      case 5: return 'Populating cache with fetched data';
      default: return 'Ready for request';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Caching Strategy Simulator</h3>
        <p className="text-slate-600">
          Compare cache-aside vs read-through strategies by simulating data requests
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setStrategy('cache-aside')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            strategy === 'cache-aside'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-blue-300'
          }`}
        >
          Cache-Aside
        </button>
        <button
          onClick={() => setStrategy('read-through')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            strategy === 'read-through'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-indigo-300'
          }`}
        >
          Read-Through
        </button>
      </div>

      <div className="flex items-center gap-8 w-full max-w-4xl">
        {/* Application */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold mb-2">
            APP
          </div>
          <span className="text-sm text-slate-600">Application</span>
        </div>

        {/* Request Arrow */}
        <div className="flex-1 relative">
          <div className="h-1 bg-slate-300 w-full relative">
            {(animationStep === 1) && (
              <div className="absolute top-0 left-0 h-1 bg-blue-500 animate-pulse w-full"></div>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1 text-center">
            {currentRequest && `Request: ${currentRequest}`}
          </div>
        </div>

        {/* Cache */}
        <div className="flex flex-col items-center">
          <div className={`w-32 h-32 rounded-lg flex flex-col items-center justify-center text-white font-bold mb-2 transition-all ${
            animationStep === 1 ? 'ring-4 ring-blue-400' :
            animationStep === 2 ? 'bg-emerald-500' :
            animationStep === 3 ? 'bg-rose-500' :
            animationStep === 5 ? 'ring-4 ring-amber-400' :
            'bg-blue-500'
          }`}>
            <div className="text-lg mb-1">CACHE</div>
            <div className="text-xs text-center px-2">
              {Object.keys(cache).length} items
            </div>
          </div>
          <span className="text-sm text-slate-600 text-center">
            {strategy === 'cache-aside' ? 'Manual Management' : 'Auto Management'}
          </span>
        </div>

        {/* Database Arrow */}
        <div className="flex-1 relative">
          <div className="h-1 bg-slate-300 w-full relative">
            {(animationStep === 4) && (
              <div className="absolute top-0 left-0 h-1 bg-amber-500 animate-pulse w-full"></div>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1 text-center">
            {(animationStep === 3 || animationStep === 4) && 'Fetching...'}
          </div>
        </div>

        {/* Database */}
        <div className="flex flex-col items-center">
          <div className={`w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold mb-2 transition-all ${
            animationStep === 4 ? 'ring-4 ring-amber-400 bg-amber-500' : 'bg-slate-600'
          }`}>
            DB
          </div>
          <span className="text-sm text-slate-600">Database</span>
        </div>
      </div>

      <div className="text-center py-2">
        <div className="text-lg font-semibold text-slate-700">{getStepDescription()}</div>
        <div className="text-sm text-slate-500 mt-1">
          Strategy: <span className="font-medium">{strategy}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(database).map(key => (
          <button
            key={key}
            onClick={() => simulateRequest(key)}
            disabled={isAnimating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              cache.hasOwnProperty(key)
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-300 hover:border-blue-300'
            } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
          >
            {key} {cache.hasOwnProperty(key) ? '✓' : ''}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={clearCache}
          disabled={isAnimating}
          className={`px-4 py-2 bg-rose-500 text-white rounded-lg font-medium transition-all ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-600 hover:shadow-md'
          }`}
        >
          Clear Cache
        </button>
      </div>

      {requestHistory.length > 0 && (
        <div className="w-full max-w-2xl">
          <h4 className="text-lg font-semibold text-slate-700 mb-2">Request History</h4>
          <div className="bg-white rounded-lg border border-slate-200 p-4 max-h-32 overflow-y-auto">
            {requestHistory.slice(-5).map((req, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span>{req.key}</span>
                <span className={`font-medium ${req.hit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {req.hit ? 'HIT' : 'MISS'} ({req.strategy})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}