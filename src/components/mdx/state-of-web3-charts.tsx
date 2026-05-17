'use client';

import * as React from 'react';

export function StateOfWeb3KeywordsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "blockchain", value: 53951, color: "bg-blue-500" },
          { label: "decentralized", value: 12897, color: "bg-indigo-500" },
          { label: "smart (contracts)", value: 7910, color: "bg-purple-500" },
          { label: "bitcoin", value: 6022, color: "bg-orange-500" },
          { label: "digital", value: 5572, color: "bg-teal-500" },
          { label: "security", value: 5552, color: "bg-rose-500" },
          { label: "cryptocurrency", value: 4467, color: "bg-emerald-500" },
          { label: "supply (chain)", value: 4312, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-36 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 53951) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-xs font-semibold text-foreground text-right tabular-nums">
              {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StateOfWeb3BigramsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "blockchain technology", value: 7971, color: "bg-blue-500" },
          { label: "smart contract(s)", value: 5065, color: "bg-indigo-500" },
          { label: "supply chain", value: 3973, color: "bg-orange-500" },
          { label: "blockchain enabled", value: 2236, color: "bg-teal-500" },
          { label: "federated learning", value: 1711, color: "bg-purple-500" },
          { label: "distributed ledger", value: 1355, color: "bg-rose-500" },
          { label: "privacy preserving", value: 1311, color: "bg-emerald-500" },
          { label: "internet of things", value: 1314, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-44 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 7971) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-xs font-semibold text-foreground text-right tabular-nums">
              {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
