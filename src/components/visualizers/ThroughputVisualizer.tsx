"use client";

import { useState, useEffect } from 'react';

export function ThroughputVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'sequential' | 'batched'>('sequential');
  const [batchSize, setBatchSize] = useState(4);
  const [requests, setRequests] = useState<Array<{id: number, status: 'waiting' | 'processing' | 'completed', startTime: number, endTime?: number}>>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [processingLatency] = useState(2000); // 2 seconds per request/batch

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isRunning) {
      if (mode === 'sequential') {
        // Process one request at a time
        const waitingRequest = requests.find(r => r.status === 'waiting');
        if (waitingRequest && !requests.some(r => r.status === 'processing')) {
          setRequests(prev => prev.map(r => 
            r.id === waitingRequest.id 
              ? { ...r, status: 'processing', startTime: elapsedTime }
              : r
          ));
          
          timeout = setTimeout(() => {
            setRequests(prev => prev.map(r => 
              r.id === waitingRequest.id 
                ? { ...r, status: 'completed', endTime: elapsedTime + processingLatency }
                : r
            ));
            setCompletedCount(prev => prev + 1);
          }, processingLatency);
        }
      } else {
        // Process requests in batches
        const waitingRequests = requests.filter(r => r.status === 'waiting');
        if (waitingRequests.length > 0 && !requests.some(r => r.status === 'processing')) {
          const batchToProcess = waitingRequests.slice(0, batchSize);
          
          setRequests(prev => prev.map(r => 
            batchToProcess.some(br => br.id === r.id)
              ? { ...r, status: 'processing', startTime: elapsedTime }
              : r
          ));
          
          timeout = setTimeout(() => {
            setRequests(prev => prev.map(r => 
              batchToProcess.some(br => br.id === r.id)
                ? { ...r, status: 'completed', endTime: elapsedTime + processingLatency }
                : r
            ));
            setCompletedCount(prev => prev + batchToProcess.length);
          }, processingLatency);
        }
      }
    }
    
    return () => clearTimeout(timeout);
  }, [isRunning, requests, mode, batchSize, elapsedTime, processingLatency]);

  const addRequests = () => {
    const newRequests = Array.from({ length: 8 }, (_, i) => ({
      id: requests.length + i,
      status: 'waiting' as const,
      startTime: 0
    }));
    setRequests(prev => [...prev, ...newRequests]);
  };

  const reset = () => {
    setIsRunning(false);
    setRequests([]);
    setCompletedCount(0);
    setElapsedTime(0);
  };

  const throughput = elapsedTime > 0 ? (completedCount / (elapsedTime / 1000)).toFixed(2) : '0.00';
  const avgLatency = completedCount > 0 ? (processingLatency / 1000).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Throughput vs Latency</h3>
        <p className="text-slate-600 text-lg">
          Compare sequential vs batched processing to understand how throughput differs from latency
        </p>
      </div>

      <div className="flex gap-4 items-center flex-wrap justify-center">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('sequential')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              mode === 'sequential' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-blue-500 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Sequential
          </button>
          <button
            onClick={() => setMode('batched')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              mode === 'batched' 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'bg-white text-indigo-500 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            Batched
          </button>
        </div>

        {mode === 'batched' && (
          <div className="flex items-center gap-2">
            <label className="text-slate-700 font-medium">Batch Size:</label>
            <input
              type="range"
              min="2"
              max="8"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="w-20"
              disabled={isRunning}
            />
            <span className="text-slate-700 font-semibold w-8">{batchSize}</span>
          </div>
        )}

        <button
          onClick={addRequests}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all"
          disabled={isRunning}
        >
          Add 8 Requests
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            isRunning 
              ? 'bg-rose-500 text-white hover:bg-rose-600' 
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
          disabled={requests.length === 0}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all"
        >
          Reset
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-100 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{throughput}</div>
            <div className="text-slate-600">Requests/sec</div>
            <div className="text-sm text-slate-500">Throughput</div>
          </div>
          <div className="text-center p-4 bg-slate-100 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{avgLatency}</div>
            <div className="text-slate-600">Seconds</div>
            <div className="text-sm text-slate-500">Latency per request</div>
          </div>
          <div className="text-center p-4 bg-slate-100 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{completedCount}</div>
            <div className="text-slate-600">Completed</div>
            <div className="text-sm text-slate-500">Total processed</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Request Queue</span>
            <span>{(elapsedTime / 1000).toFixed(1)}s elapsed</span>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {requests.slice(0, 16).map((request) => (
              <div
                key={request.id}
                className={`h-12 rounded-lg flex items-center justify-center text-white font-semibold text-sm transition-all duration-300 ${
                  request.status === 'waiting' 
                    ? 'bg-slate-300' 
                    : request.status === 'processing'
                    ? (mode === 'sequential' ? 'bg-blue-500 animate-pulse' : 'bg-indigo-500 animate-pulse')
                    : 'bg-emerald-500'
                }`}
              >
                {request.id + 1}
              </div>
            ))}
          </div>
          {requests.length > 16 && (
            <div className="text-center text-slate-500 text-sm">
              +{requests.length - 16} more requests...
            </div>
          )}
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-slate-600">
          <span className="font-semibold text-blue-600">Sequential processing</span> handles one request at a time, 
          while <span className="font-semibold text-indigo-600">batched processing</span> groups multiple requests together. 
          Notice how batching improves throughput while keeping the same latency per individual request!
        </p>
      </div>
    </div>
  );
}