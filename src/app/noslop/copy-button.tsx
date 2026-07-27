'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyText } from '@/lib/copy-text';

export function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState('Copy prompt');

  async function handleCopy() {
    try {
      // Text is already in memory (passed from the server) so we never
      // `await fetch` inside the click — Safari keeps user activation.
      await copyText(text);
      setLabel('Copied');
    } catch {
      setLabel('Failed');
    }
    setTimeout(() => setLabel('Copy prompt'), 2000);
  }

  return (
    <Button
      type='button'
      variant='outline'
      className='border-black text-black hover:bg-zinc-100'
      onClick={handleCopy}
    >
      {label}
    </Button>
  );
}
