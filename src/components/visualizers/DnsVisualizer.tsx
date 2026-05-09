"use client";

import React, { useState, useEffect } from 'react';

export function DnsVisualizer() {
  const [domain, setDomain] = useState('example.com');
  const [step, setStep] = useState(-1);
  const [isResolving, setIsResolving] = useState(false);
  const [cache, setCache] = useState<Record<string, string>>({});

  const steps = [
    { label: 'Browser Cache', x: 100, y: 80, desc: 'Check if this domain was visited recently', color: '#6366f1' },
    { label: 'OS Resolver', x: 100, y: 160, desc: 'Ask the operating system\'s DNS cache', color: '#8b5cf6' },
    { label: 'Recursive Resolver', x: 300, y: 160, desc: 'ISP\'s DNS server checks its own cache', color: '#a855f7' },
    { label: 'Root Server', x: 500, y: 80, desc: 'Directs to the right TLD server (.com, .org)', color: '#d946ef' },
    { label: 'TLD Server', x: 500, y: 200, desc: 'Knows which nameserver handles .com domains', color: '#ec4899' },
    { label: 'Authoritative NS', x: 500, y: 320, desc: 'Has the actual IP address for this domain', color: '#f43f5e' },
    { label: 'IP Returned!', x: 300, y: 320, desc: '93.184.216.34 — Browser connects directly', color: '#22c55e' },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
  ];

  const resolve = () => {
    if (cache[domain]) {
      setStep(6);
      return;
    }
    setIsResolving(true);
    setStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= steps.length) {
        clearInterval(interval);
        setIsResolving(false);
        setCache(prev => ({ ...prev, [domain]: '93.184.216.34' }));
      } else {
        setStep(current);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DNS Resolution Journey</h3>
        <p className="text-slate-600 max-w-2xl">Follow a domain name as it gets translated into an IP address</p>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden">
          <span className="px-3 py-2 bg-slate-100 text-slate-500 text-sm border-r border-slate-300">https://</span>
          <input
            type="text"
            value={domain}
            onChange={e => { setDomain(e.target.value); setStep(-1); }}
            className="px-3 py-2 w-40 outline-none text-sm"
            placeholder="example.com"
          />
        </div>
        <button
          onClick={resolve}
          disabled={isResolving}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-all text-sm"
        >
          {isResolving ? 'Resolving...' : '🔍 Resolve DNS'}
        </button>
      </div>

      <div className="w-full max-w-3xl">
        <svg viewBox="0 0 600 400" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Connection arrows */}
          {connections.map(([from, to], i) => {
            const f = steps[from];
            const t = steps[to];
            const isActive = step >= to;
            return (
              <line
                key={i}
                x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke={isActive ? '#6366f1' : '#e2e8f0'}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isActive ? 'none' : '6 3'}
                className="transition-all duration-500"
              />
            );
          })}

          {/* Step nodes */}
          {steps.map((s, i) => {
            const isActive = step >= i;
            const isCurrent = step === i;
            return (
              <g key={i} transform={`translate(${s.x}, ${s.y})`}>
                {isCurrent && (
                  <circle r={35} fill={s.color} opacity={0.15}>
                    <animate attributeName="r" from="30" to="45" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.2" to="0" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={25}
                  fill={isActive ? s.color : '#f1f5f9'}
                  stroke={isActive ? s.color : '#cbd5e1'}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                <text y={-2} textAnchor="middle" fontSize="8" fill={isActive ? 'white' : '#64748b'} fontWeight="600">
                  {s.label.split(' ').slice(0, 1)}
                </text>
                <text y={8} textAnchor="middle" fontSize="7" fill={isActive ? 'white' : '#94a3b8'}>
                  {s.label.split(' ').slice(1).join(' ')}
                </text>
              </g>
            );
          })}

          {/* Current step description */}
          {step >= 0 && step < steps.length && (
            <g transform="translate(300, 380)">
              <text textAnchor="middle" fontSize="11" fill="#334155" fontWeight="600">
                Step {step + 1}: {steps[step].label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {step >= 0 && step < steps.length && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-lg text-center">
          <p className="text-indigo-800 text-sm font-medium">{steps[step].desc}</p>
        </div>
      )}

      {Object.keys(cache).length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-lg">
          <h4 className="font-semibold text-emerald-900 text-sm mb-2">DNS Cache</h4>
          {Object.entries(cache).map(([d, ip]) => (
            <div key={d} className="flex justify-between text-sm text-emerald-700">
              <span className="font-mono">{d}</span>
              <span className="font-mono">→ {ip}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-slate-500 text-sm text-center max-w-xl">
        DNS translates human-readable domain names into IP addresses. The lookup traverses a hierarchy of servers, from local caches to authoritative nameservers, with results cached at each level for faster future lookups.
      </p>
    </div>
  );
}
