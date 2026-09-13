'use client';

import { useEffect } from 'react';

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  execute?: (args: Record<string, unknown>) => Promise<unknown>;
}

interface ModelContext {
  registerTool?: (tool: ModelContextTool) => Promise<unknown> | unknown;
}

/**
 * Registers homepage tools with the standard document surface, then falls
 * back to the legacy navigator surface for early WebMCP implementations.
 * Fully guarded: renders nothing and never throws where unsupported.
 */
export function WebMCPRegister() {
  useEffect(() => {
    try {
      const documentContext = (document as Document & { modelContext?: ModelContext }).modelContext;
      const navigatorContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
      const modelContext = documentContext ?? navigatorContext;
      const register = modelContext?.registerTool;
      if (typeof register !== 'function') return;
      const tools: ModelContextTool[] = [
        {
          name: 'search_reports',
          description: 'Search 233,000+ indexed academic papers in AI and Web3 on veda.ng',
          inputSchema: {
            type: 'object',
            properties: { q: { type: 'string', description: 'Keywords' } },
            required: ['q'],
          },
          execute: async (args) => {
            const res = await fetch(`/api/v1/reports/search?q=${encodeURIComponent(String(args.q ?? ''))}`);
            return res.json();
          },
        },
        {
          name: 'search_essays',
          description: 'Search 50+ long-form research essays by keyword or tag on veda.ng',
          inputSchema: {
            type: 'object',
            properties: { tag: { type: 'string', description: 'Topic tag' } },
            required: ['tag'],
          },
          execute: async (args) => {
            const res = await fetch(`/api/v1/essays?tag=${encodeURIComponent(String(args.tag ?? ''))}`);
            return res.json();
          },
        },
      ];
      for (const tool of tools) {
        Promise.resolve(register.call(modelContext, tool)).catch(() => {});
      }
    } catch {
      // WebMCP unavailable: declarative form fallback on the page still applies.
    }
  }, []);
  return null;
}
