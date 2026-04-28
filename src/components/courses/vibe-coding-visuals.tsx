'use client';

/* ─── Module 6: Debugging & Iteration ─── */
export function DebuggingFlow() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 180" className="w-full h-auto" role="img" aria-label="Debugging cycle: Error → Read → Copy → Paste to AI → Fix → Test">
        {/* Flow arrows */}
        {[
          { x: 20, label: '1. Error', desc: 'Code breaks', color: '#ef4444' },
          { x: 170, label: '2. Read', desc: 'Find the message', color: '#f59e0b' },
          { x: 320, label: '3. Copy', desc: 'Full error text', color: '#3b82f6' },
          { x: 470, label: '4. Paste to AI', desc: 'With context', color: '#8b5cf6' },
          { x: 620, label: '5. Apply Fix', desc: 'Test again', color: '#10b981' },
        ].map((step, i) => (
          <g key={step.label}>
            <rect x={step.x} y={30} width={130} height={90} rx={12} fill={`${step.color}15`} stroke={step.color} strokeWidth={1.5} />
            <text x={step.x + 65} y={65} textAnchor="middle" fill={step.color} fontSize={13} fontWeight={700}>{step.label}</text>
            <text x={step.x + 65} y={95} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.6}>{step.desc}</text>
            {i < 4 && (
              <path d={`M${step.x + 135} 75 L${step.x + 165} 75`} stroke="currentColor" strokeWidth={1.5} opacity={0.3} markerEnd="url(#arrowhead)" />
            )}
          </g>
        ))}
        {/* Loop back arrow */}
        <path d="M750 120 Q780 150 400 165 Q20 150 50 120" fill="none" stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
        <text x={400} y={160} textAnchor="middle" fill="#ef4444" fontSize={10} opacity={0.7}>Still broken? Loop again with more context</text>
        <defs>
          <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <path d="M0 0 L8 3 L0 6 Z" fill="currentColor" opacity={0.4} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Module 7: Deployment & Databases ─── */
export function DeploymentStack() {
  const layers = [
    { label: 'Frontend', desc: 'Next.js, React, HTML/CSS', color: '#3b82f6', y: 20 },
    { label: 'Hosting', desc: 'Vercel, Netlify, Cloudflare', color: '#8b5cf6', y: 70 },
    { label: 'Database', desc: 'Supabase, Firebase, Neon', color: '#10b981', y: 120 },
    { label: 'Domain', desc: 'yourapp.com via DNS', color: '#f59e0b', y: 170 },
  ];
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 700 220" className="w-full h-auto" role="img" aria-label="Deployment stack: Frontend, Hosting, Database, Domain">
        {layers.map((l) => (
          <g key={l.label}>
            <rect x={50} y={l.y} width={600} height={40} rx={8} fill={`${l.color}12`} stroke={l.color} strokeWidth={1.5} />
            <text x={80} y={l.y + 25} fill={l.color} fontSize={14} fontWeight={700}>{l.label}</text>
            <text x={620} y={l.y + 25} textAnchor="end" fill="currentColor" fontSize={12} opacity={0.5}>{l.desc}</text>
          </g>
        ))}
        {/* Connecting lines */}
        {[55, 105, 155].map((y) => (
          <line key={y} x1={350} y1={y + 5} x2={350} y2={y + 15} stroke="currentColor" strokeWidth={1.2} opacity={0.2} strokeDasharray="3 2" />
        ))}
      </svg>
    </div>
  );
}
