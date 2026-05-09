"use client";

import React, { useState } from 'react';

export function ZeroKnowledgeProofsZkpsVisualizer() {
  const [secret, setSecret] = useState(7);
  const [guess, setGuess] = useState<number | null>(null);
  const [challenges, setChallenges] = useState<{challenge: number; response: number; valid: boolean}[]>([]);

  const handleChallenge = () => {
    const c = Math.floor(Math.random() * 10) + 1;
    const response = (secret * c) % 13; // simple modular arithmetic proof
    setChallenges(prev => [...prev, { challenge: c, response, valid: true }]);
  };

  const handleVerify = () => {
    setGuess(null); // verifier never learns the secret
  };

  const reset = () => { setChallenges([]); setGuess(null); };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Zero-Knowledge Proof</h3>
        <p className="text-slate-500 mt-2">Prove you know a secret without ever revealing it.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <div className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Prover (You)</div>
            <div className="text-4xl font-bold text-indigo-700 mt-2">Secret: {secret}</div>
            <div className="text-xs text-indigo-400 mt-1">Only you can see this</div>
          </div>
          <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-center">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Verifier</div>
            <div className="text-4xl font-bold text-slate-400 mt-2">Secret: ???</div>
            <div className="text-xs text-slate-400 mt-1">Never learns the secret</div>
          </div>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {challenges.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm font-mono">
              <span>Challenge #{i+1}: c={c.challenge}</span>
              <span>Response: {c.response}</span>
              <span className="text-emerald-600 font-bold">✓ Valid</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all">Reset</button>
          <button onClick={handleChallenge} className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all">Send Challenge</button>
        </div>
        <div className="bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-600">
          After {challenges.length} challenge{challenges.length !== 1 ? 's' : ''}, the verifier is {challenges.length === 0 ? 'not yet' : challenges.length < 3 ? 'somewhat' : 'highly'} confident the prover knows the secret — without ever learning what it is.
        </div>
      </div>
    </div>
  );
}
