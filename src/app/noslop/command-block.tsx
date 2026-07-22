'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // ignore
    }
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='relative'>
      <pre className='overflow-x-auto rounded-lg bg-black p-4 pr-12 text-sm font-mono text-white'>
        {command}
      </pre>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2 h-8 w-8 text-zinc-400 hover:bg-white/10 hover:text-white'
        onClick={handleCopy}
        aria-label='Copy command'
      >
        {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
      </Button>
    </div>
  );
}
