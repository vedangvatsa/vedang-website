"use client";

import { VisualizerMap } from '@/components/visualizers/VisualizerMap';

export function GlossaryVisualizer({ term }: { term: string }) {
  const Visualizer = VisualizerMap[term];
  
  if (!Visualizer) {
    return null;
  }

  return (
    <div className="my-12 w-full border border-border/50 rounded-lg p-4 md:p-6 bg-card shadow-sm overflow-hidden">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6">Interactive Concept: {term.replace(/-/g, ' ')}</div>
      <Visualizer />
    </div>
  );
}
