'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CopyButton() {
  const [label, setLabel] = useState('Copy prompt');

  async function handleCopy() {
    try {
      const res = await fetch('/noslop.md');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setLabel('Copied');
    } catch {
      setLabel('Failed');
    }
    setTimeout(() => setLabel('Copy prompt'), 2000);
  }

  return (
    <Button variant='outline' className='border-black text-black hover:bg-zinc-100' onClick={handleCopy}>
      {label}
    </Button>
  );
}
