"use client";

import React, { useState } from 'react';

export function DnsVisualizer() {
  const [step, setStep] = useState(0);
  const steps = ["You type \"google.com\" in your browser.","Browser asks DNS resolver: \"What is the IP for google.com?\"","Resolver queries root → TLD → authoritative nameserver.","Response: 142.250.80.46. Browser connects to that IP."];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">DNS (Domain Name System)</h3>
        <p className="text-slate-500 mt-2">The phone book of the internet — translates domain names to IP addresses.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <div key={i} className={`p-4 rounded-xl border-2 transition-all duration-500 ${i <= step ? 'border-indigo-400 bg-indigo-50 opacity-100' : 'border-slate-200 bg-slate-50 opacity-40'}`}>
              <span className="font-mono text-sm text-indigo-600 font-bold mr-2">Step {i + 1}</span>
              <span className="text-slate-700">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all">Reset</button>
          <button onClick={() => setStep(Math.min(step + 1, steps.length - 1))} disabled={step >= steps.length - 1} className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50">Next Step</button>
        </div>
      </div>
    </div>
  );
}
