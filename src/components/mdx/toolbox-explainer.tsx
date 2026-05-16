'use client';

import { Cloud, Laptop, Paintbrush, Terminal, Code2, Server } from 'lucide-react';

export function ToolboxExplainer() {
  return (
    <div className="my-10 p-6 md:p-8 bg-card border rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold tracking-tight mb-2">Vibe Coding Toolbox</h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Tool choice defines your speed and capabilities. There is no single &quot;best&quot; tool, only the right one for the job.
        </p>
      </div>

      <div className="space-y-6">

        {/* Row 1: Environment types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 p-5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Cloud className="w-5 h-5" />
              </div>
              <h4 className="font-semibold">Cloud IDEs</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Browser-based, zero setup, start immediately.
            </p>
            <p className="text-xs font-medium text-foreground">
              Examples: Replit, Lovable.dev, v0
            </p>
          </div>
          <div className="bg-muted p-5 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-background p-2 rounded-lg text-foreground shadow-sm">
                <Laptop className="w-5 h-5" />
              </div>
              <h4 className="font-semibold">Local IDEs</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Installed software, more control and power, requires setup.
            </p>
            <p className="text-xs font-medium text-foreground">
              Examples: Cursor, VS Code, Windsurf
            </p>
          </div>
        </div>

        {/* Row 2: Visual Builders */}
        <div className="bg-purple-500/5 p-5 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-600 dark:text-purple-400">
              <Paintbrush className="w-5 h-5" />
            </div>
            <h4 className="font-semibold">Visual Builders</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Build visual web apps like dashboards or landing pages instantly. Chat with AI to design UI, generate React code, and connect databases.
          </p>
          <p className="text-xs font-medium text-purple-700 dark:text-purple-400">
            Top Pick: Lovable.dev, v0 by Vercel
          </p>
        </div>

        {/* Row 3: Autonomous Agents */}
        <div className="bg-blue-500/5 p-5 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="font-semibold">Autonomous Agents and Production Tools</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                <Terminal className="w-4 h-4" />
                Antigravity
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Google&apos;s agentic coding assistant. Reads your full project, runs commands, edits files, and browses the web.
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                <Terminal className="w-4 h-4" />
                Claude Code
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Anthropic&apos;s terminal agent. Multi-file refactors, test execution, and git operations with minimal supervision.
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                <Code2 className="w-4 h-4" />
                Replit
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All-in-one cloud workshop. Full projects from a single prompt. Built-in hosting and deployment.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
