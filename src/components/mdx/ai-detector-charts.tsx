'use client';

export function AIDetectorFeatureComparison() {
  const data = [
    { label: '11-feature AUC', value: 0.9645, color: '#94a3b8' },
    { label: '35-feature AUC', value: 0.9826, color: '#18181b' },
    { label: '11-feature Accuracy', value: 0.9011, color: '#cbd5e1' },
    { label: '35-feature Accuracy', value: 0.9361, color: '#18181b' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">11-feature vs 35-feature model</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Stylometric detector benchmarks</p>
        <svg viewBox="0 0 400 160" className="h-auto w-full" role="img" aria-label="Bar chart comparing 11-feature and 35-feature model AUC and accuracy">
          {data.map((d, i) => {
            const y = i * 36 + 20;
            const width = d.value * 380;
            return (
              <g key={d.label}>
                <text x="0" y={y + 14} className="fill-[#64748b]" style={{ fontSize: 10 }}>
                  {d.label}
                </text>
                <rect x="120" y={y} width={width} height={18} rx={4} fill={d.color} />
                <text x={128 + width} y={y + 14} className="fill-[#334155]" style={{ fontSize: 10 }}>
                  {d.value.toFixed(4)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
