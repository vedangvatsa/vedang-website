'use client';

import * as React from 'react';

export function StateOfWeb3KeywordsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "blockchain", value: 9450, color: "bg-blue-500" },
          { label: "smart (contracts)", value: 1791, color: "bg-indigo-500" },
          { label: "cryptocurrency", value: 1264, color: "bg-purple-500" },
          { label: "metaverse", value: 1038, color: "bg-teal-500" },
          { label: "decentralized", value: 989, color: "bg-emerald-500" },
          { label: "bitcoin", value: 951, color: "bg-orange-500" },
          { label: "security", value: 907, color: "bg-rose-500" },
          { label: "DeFi", value: 747, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-36 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 9450) * 100}%` }}
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
          { label: "blockchain based", value: 1696, color: "bg-blue-500" },
          { label: "blockchain technology", value: 1231, color: "bg-indigo-500" },
          { label: "smart contracts", value: 728, color: "bg-rose-500" },
          { label: "supply chain", value: 620, color: "bg-orange-500" },
          { label: "smart contract", value: 498, color: "bg-amber-500" },
          { label: "using blockchain", value: 477, color: "bg-teal-500" },
          { label: "the metaverse", value: 382, color: "bg-emerald-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-44 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 1696) * 100}%` }}
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
