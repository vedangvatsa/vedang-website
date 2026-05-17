'use client';

import * as React from 'react';

export function StateOfWeb3KeywordsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "blockchain", value: 54780, color: "bg-blue-500" },
          { label: "decentralized", value: 12897, color: "bg-indigo-500" },
          { label: "technology", value: 9982, color: "bg-purple-500" },
          { label: "smart", value: 8043, color: "bg-teal-500" },
          { label: "data", value: 8032, color: "bg-emerald-500" },
          { label: "bitcoin", value: 6024, color: "bg-orange-500" },
          { label: "security", value: 5702, color: "bg-rose-500" },
          { label: "IoT", value: 5521, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-36 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 54780) * 100}%` }}
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
          { label: "blockchain technology", value: 8181, color: "bg-blue-500" },
          { label: "smart contract(s)", value: 5103, color: "bg-indigo-500" },
          { label: "supply chain", value: 3960, color: "bg-orange-500" },
          { label: "blockchain enabled", value: 2313, color: "bg-teal-500" },
          { label: "federated learning", value: 1712, color: "bg-purple-500" },
          { label: "internet of things", value: 1587, color: "bg-emerald-500" },
          { label: "distributed ledger", value: 1352, color: "bg-rose-500" },
          { label: "privacy preserving", value: 1342, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-44 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 8181) * 100}%` }}
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
