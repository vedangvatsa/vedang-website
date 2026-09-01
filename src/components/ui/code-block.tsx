'use client';

import React, { useState } from 'react';
import { copyText } from '@/lib/copy-text';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({ code, language, filename, showCopy = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await copyText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // keep UI resilient
    }
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden text-xs', className)}>
      {(filename || language || showCopy) && (
        <div className="px-3.5 py-2 bg-muted/40 border-b border-border flex items-center justify-between gap-2 text-muted-foreground">
          <span className="font-mono text-[11px] font-medium text-foreground/80 truncate">
            {filename || language || 'Code'}
          </span>
          {showCopy && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
              ) : (
                <span>Copy</span>
              )}
            </Button>
          )}
        </div>
      )}
      <pre className="p-4 bg-muted/20 text-foreground font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
}
