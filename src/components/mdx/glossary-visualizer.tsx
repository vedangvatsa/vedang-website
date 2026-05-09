"use client";

import { VisualizerMap } from '@/components/visualizers/VisualizerMap';
import Image from 'next/image';

export function GlossaryVisualizer({ term }: { term: string }) {
  const Visualizer = VisualizerMap[term];
  
  if (!Visualizer) {
    // Fallback to SVG if visualizer doesn't exist
    return (
      <div className="my-12 w-full border border-border/50 rounded-xl p-4 md:p-6 bg-card shadow-sm overflow-hidden flex flex-col items-center">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6 self-start">Visual Concept: {term.replace(/-/g, ' ')}</div>
        <div className="w-full max-w-2xl">
          <Image
            src={`/images/glossary/${term}.svg?v=4`}
            alt={`${term} infographic`}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 w-full border border-border/50 rounded-xl p-4 md:p-6 bg-card shadow-sm overflow-hidden">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6">Interactive Concept: {term.replace(/-/g, ' ')}</div>
      <Visualizer />
    </div>
  );
}
