'use client';

export function ToolboxExplainer() {
  return (
    <div className="not-prose my-10 p-6 rounded-lg border border-border bg-card">
      <div className="mb-6 border-b border-border pb-4">
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">
          Vibe Coding Toolbox Archetypes
        </h3>
        <p className="text-muted-foreground text-xs">
          Tool selection determines iteration velocity and operational autonomy.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Row 1: Environment types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded border border-border bg-muted/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Cloud IDEs</h4>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              Browser-hosted execution, zero local configuration, instant live share.
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">
              Examples: Replit, Lovable.dev, v0
            </span>
          </div>
          <div className="p-4 rounded border border-border bg-muted/20">
            <h4 className="font-semibold text-foreground text-sm mb-1">Local IDEs & Agents</h4>
            <p className="text-muted-foreground mb-2 leading-relaxed">
              Native file system access, terminal execution, deep workspace indexing.
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">
              Examples: Cursor, VS Code, Windsurf
            </span>
          </div>
        </div>

        {/* Row 2: Autonomous Agents */}
        <div className="p-4 rounded border border-border bg-muted/10">
          <h4 className="font-semibold text-foreground text-sm mb-1">
            Autonomous Coding Agents
          </h4>
          <p className="text-muted-foreground mb-3 leading-relaxed">
            Multi-turn CLI and background agents that read entire workspaces, execute shell commands, run test suites, and refactor across multiple files.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded border border-border bg-card">
              <span className="font-semibold text-foreground block mb-1">Antigravity</span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Deep project indexing, multi-agent orchestration, and verified multi-file refactoring.
              </p>
            </div>
            <div className="p-3 rounded border border-border bg-card">
              <span className="font-semibold text-foreground block mb-1">Claude Code</span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Terminal agent for multi-file refactoring, test execution, and Git workflows.
              </p>
            </div>
            <div className="p-3 rounded border border-border bg-card">
              <span className="font-semibold text-foreground block mb-1">OpenCode / Cursor</span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                In-editor pair programming and context-aware diff generation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
