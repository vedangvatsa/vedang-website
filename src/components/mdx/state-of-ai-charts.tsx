export function StateOfAiKeywordsChart() {
  const data = [
    { label: "systems", value: 5790, color: "bg-blue-500" },
    { label: "framework", value: 5423, color: "bg-indigo-500" },
    { label: "digital", value: 3254, color: "bg-purple-500" },
    { label: "clinical", value: 2621, color: "bg-teal-500" },
    { label: "accuracy", value: 2545, color: "bg-emerald-500" },
  ];

  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="my-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">Deep-Text Keyword Frequency</h3>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Top single keywords extracted from the full abstract body text of 10,264 documents.
      </p>
      
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-24 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StateOfAiBigramsChart() {
  const data = [
    { label: "Large Language", value: 750, color: "bg-blue-500" },
    { label: "Mental Health", value: 310, color: "bg-indigo-500" },
    { label: "Digital Transform", value: 298, color: "bg-purple-500" },
    { label: "Supply Chain", value: 287, color: "bg-teal-500" },
    { label: "Higher Education", value: 282, color: "bg-emerald-500" },
    { label: "Natural Language", value: 277, color: "bg-cyan-500" },
    { label: "Public Health", value: 249, color: "bg-rose-500" },
    { label: "RAG", value: 228, color: "bg-amber-500" },
  ];

  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="my-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">Emerging Operational Trends (Bigrams)</h3>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Top two-word phrases found within the deep text of the 10,264 documents analyzed.
      </p>
      
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-32 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="relative h-6 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
