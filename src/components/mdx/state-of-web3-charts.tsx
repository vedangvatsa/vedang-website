'use client';

import * as React from 'react';

export function StateOfWeb3KeywordsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "blockchain", value: 35093, color: "bg-blue-500" },
          { label: "decentralized", value: 8088, color: "bg-indigo-500" },
          { label: "smart (contracts)", value: 6723, color: "bg-purple-500" },
          { label: "bitcoin", value: 5919, color: "bg-orange-500" },
          { label: "security", value: 4784, color: "bg-rose-500" },
          { label: "digital", value: 4622, color: "bg-teal-500" },
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
                  style={{ width: `${(item.value / 35093) * 100}%` }}
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
          { label: "blockchain technology", value: 5224, color: "bg-blue-500" },
          { label: "supply chain", value: 3775, color: "bg-orange-500" },
          { label: "smart contract(s)", value: 4606, color: "bg-indigo-500" },
          { label: "zero knowledge", value: 1874, color: "bg-purple-500" },
          { label: "blockchain enabled", value: 1401, color: "bg-teal-500" },
          { label: "distributed ledger", value: 1368, color: "bg-rose-500" },
          { label: "digital currency", value: 1251, color: "bg-amber-500" },
          { label: "central bank", value: 1026, color: "bg-emerald-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-44 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 5224) * 100}%` }}
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
