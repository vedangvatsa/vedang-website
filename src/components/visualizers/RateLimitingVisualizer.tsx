"use client";

import { useState, useEffect, useRef } from 'react';

export function RateLimitingVisualizer() {
  const [requests, setRequests] = useState([]);
  const [rateLimit, setRateLimit] = useState(5);
  const [timeWindow, setTimeWindow] = useState(10);
  const [tokens, setTokens] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [requestId, setRequestId] = useState(0);
  const intervalRef = useRef(null);

  const sendRequest = () => {
    const newRequest = {
      id: requestId,
      timestamp: Date.now(),
      status: tokens > 0 ? 'allowed' : 'blocked'
    };

    if (tokens > 0) {
      setTokens(prev => prev - 1);
    }

    setRequests(prev => [...prev, newRequest].slice(-20));
    setRequestId(prev => prev + 1);
  };

  const startAutoRequests = () => {
    setIsActive(true);
    intervalRef.current = setInterval(() => {
      sendRequest();
    }, 500);
  };

  const stopAutoRequests = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    const tokenRefillInterval = setInterval(() => {
      setTokens(prev => Math.min(rateLimit, prev + 1));
    }, (timeWindow * 1000) / rateLimit);

    const cleanupInterval = setInterval(() => {
      setRequests(prev => prev.filter(req => Date.now() - req.timestamp < 30000));
    }, 1000);

    return () => {
      clearInterval(tokenRefillInterval);
      clearInterval(cleanupInterval);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rateLimit, timeWindow]);

  useEffect(() => {
    setTokens(rateLimit);
  }, [rateLimit]);

  const allowedRequests = requests.filter(req => req.status === 'allowed').length;
  const blockedRequests = requests.filter(req => req.status === 'blocked').length;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Rate Limiting Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how rate limiting controls API requests using a token bucket algorithm. Adjust limits and send requests to see protection in action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Rate Limit Configuration</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Rate Limit: {rateLimit} requests
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={rateLimit}
                onChange={(e) => setRateLimit(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Time Window: {timeWindow} seconds
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={timeWindow}
                onChange={(e) => setTimeWindow(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h5 className="text-sm font-semibold text-slate-700 mb-2">Token Bucket</h5>
            <div className="flex items-center gap-2">
              {Array.from({ length: rateLimit }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 ${
                    i < tokens
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-slate-200 border-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Available tokens: {tokens}/{rateLimit}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Request Controls</h4>
          
          <div className="space-y-4">
            <button
              onClick={sendRequest}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Send Single Request
            </button>

            <button
              onClick={isActive ? stopAutoRequests : startAutoRequests}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isActive ? 'Stop Auto Requests' : 'Start Auto Requests'}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-700">{allowedRequests}</div>
              <div className="text-xs text-emerald-600">Allowed</div>
            </div>
            <div className="text-center p-3 bg-rose-50 rounded-lg border border-rose-200">
              <div className="text-2xl font-bold text-rose-700">{blockedRequests}</div>
              <div className="text-xs text-rose-600">Blocked</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-700 mb-4">Request Timeline</h4>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {requests.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No requests yet. Send some requests to see the timeline.</p>
          ) : (
            requests.slice().reverse().map((request) => (
              <div
                key={request.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  request.status === 'allowed'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span className="font-medium">Request #{request.id}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    {new Date(request.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'allowed'
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-rose-200 text-rose-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}