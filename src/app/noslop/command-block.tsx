'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyText } from '@/lib/copy-text';

export function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await copyText(command);
      setCopied(true);
    } catch {
      // keep UI quiet; user can still select the command manually
    }
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='relative w-full'>
      <pre className='overflow-x-auto rounded-lg bg-black px-12 py-4 text-center text-sm font-mono text-white'>
        {command}
      </pre>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 text-zinc-400 hover:bg-white/10 hover:text-white'
        onClick={handleCopy}
        aria-label='Copy command'
      >
        {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
      </Button>
    </div>
  );
}
