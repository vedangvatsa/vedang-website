"use client";

import React, { useState } from 'react';

export function LoadBalancerVisualizer() {
  const [algorithm, setAlgorithm] = useState<'round-robin' | 'least-connections' | 'random'>('round-robin');
  const [requests, setRequests] = useState<number[]>([0, 0, 0]);
  const [nextServer, setNextServer] = useState(0);

  const sendRequest = () => {
    const newRequests = [...requests];
    let target: number;

    if (algorithm === 'round-robin') {
      target = nextServer;
      setNextServer((nextServer + 1) % 3);
    } else if (algorithm === 'least-connections') {
      target = newRequests.indexOf(Math.min(...newRequests));
    } else {
      target = Math.floor(Math.random() * 3);
    }

    newRequests[target]++;
    setRequests(newRequests);
  };

  const reset = () => { setRequests([0, 0, 0]); setNextServer(0); };
  const total = requests.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Load Balancer</h3>
        <p className="text-slate-500 mt-2">Distributing requests across multiple servers.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex gap-3 justify-center">
          {(['round-robin', 'least-connections', 'random'] as const).map(alg => (
            <button key={alg} onClick={() => { setAlgorithm(alg); reset(); }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${algorithm === alg ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {alg.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {requests.map((count, i) => (
            <div key={i} className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-center">
              <div className="text-sm font-semibold text-slate-500">Server {i + 1}</div>
              <div className="text-3xl font-bold text-indigo-600 mt-2">{count}</div>
              <div className="text-xs text-slate-400 mt-1">requests</div>
              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all">Reset</button>
          <button onClick={sendRequest} className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all">Send Request</button>
        </div>

        <div className="bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-600">
          {algorithm === 'round-robin' && 'Round Robin: Each server gets a turn in order. Simple and fair.'}
          {algorithm === 'least-connections' && 'Least Connections: Sends to the server handling the fewest requests.'}
          {algorithm === 'random' && 'Random: Picks a server at random for each request.'}
        </div>
      </div>
    </div>
  );
}