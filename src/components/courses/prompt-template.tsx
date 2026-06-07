'use client';

import { useState, ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

interface PromptTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PromptTemplate({ title, description, children }: PromptTemplateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = extractText(children).trim();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Prompt Template</span>
          <h4 className="font-semibold text-sm mt-0.5">{title}</h4>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border bg-background hover:bg-muted transition-colors"
          aria-label="Copy prompt"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {description && (
        <p className="px-4 pt-3 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

