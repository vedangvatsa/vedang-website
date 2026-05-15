'use client';

import * as React from 'react';

export function StateOfWeb3KeywordsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "infrastructure", value: 6102, color: "bg-blue-500" },
          { label: "tokenomics", value: 4893, color: "bg-indigo-500" },
          { label: "interoperability", value: 3910, color: "bg-purple-500" },
          { label: "governance", value: 3105, color: "bg-teal-500" },
          { label: "identity", value: 2844, color: "bg-emerald-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-32 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 6102) * 100}%` }}
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
          { label: "zero knowledge", value: 480, color: "bg-rose-500" },
          { label: "real world", value: 425, color: "bg-orange-500" },
          { label: "smart contract", value: 390, color: "bg-amber-500" },
          { label: "institutional adoption", value: 365, color: "bg-teal-500" },
          { label: "layer two", value: 310, color: "bg-emerald-500" },
          { label: "decentralized identity", value: 295, color: "bg-blue-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-40 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 480) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-xs font-semibold text-foreground text-right tabular-nums">
              {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
