'use client';

import { useEffect } from 'react';

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  execute?: (args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Registers the homepage declarative WebMCP tools with the browser's
 * Model Context Protocol surface when present (Chrome origin trial).
 * Fully guarded: renders nothing and never throws where unsupported.
 */
export function WebMCPRegister() {
  useEffect(() => {
    try {
      const doc = document as Document & {
        modelContext?: { registerTool?: (tool: ModelContextTool) => Promise<unknown> | unknown };
      };
      const register = doc.modelContext?.registerTool;
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
        Promise.resolve(register.call(doc.modelContext, tool)).catch(() => {});
      }
    } catch {
      // WebMCP unavailable: declarative form fallback on the page still applies.
    }
  }, []);
  return null;
}
