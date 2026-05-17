'use client';

export function StateOfAiKeywordsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "learning", value: 35068, color: "bg-blue-500" },
          { label: "network", value: 15570, color: "bg-indigo-500" },
          { label: "neural", value: 14965, color: "bg-purple-500" },
          { label: "detection", value: 11495, color: "bg-teal-500" },
          { label: "deep", value: 11253, color: "bg-emerald-500" },
          { label: "language", value: 8936, color: "bg-cyan-500" },
          { label: "intelligence", value: 8911, color: "bg-rose-500" },
          { label: "generative", value: 8142, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-28 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 35068) * 100}%` }}
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

export function StateOfAiBigramsChart() {
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        {[
          { label: "neural network", value: 12449, color: "bg-blue-500" },
          { label: "machine learning", value: 10278, color: "bg-indigo-500" },
          { label: "artificial intelligence", value: 8054, color: "bg-purple-500" },
          { label: "deep learning", value: 7788, color: "bg-teal-500" },
          { label: "reinforcement learning", value: 4856, color: "bg-emerald-500" },
          { label: "few shot", value: 4466, color: "bg-cyan-500" },
          { label: "large language", value: 4449, color: "bg-rose-500" },
          { label: "object detection", value: 4292, color: "bg-amber-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-44 text-right text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / 12449) * 100}%` }}
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
