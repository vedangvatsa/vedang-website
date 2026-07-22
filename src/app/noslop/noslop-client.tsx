'use client';

import { useCallback, useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function NoSlopClient() {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cleaned, setCleaned] = useState('');
  const [error, setError] = useState('');

  const getAnalyzer = () =>
    typeof window !== 'undefined' ? (window as any).NOSLOP : null;

  const analyze = useCallback(() => {
    const n = getAnalyzer();
    if (!n) {
      setError('Analyzer is still loading.');
      return;
    }
    setError('');
    setResult(n.analyze(text));
    setCleaned('');
  }, [text]);

  const clean = useCallback(() => {
    const n = getAnalyzer();
    if (!n || !result) {
      setError('Analyze first.');
      return;
    }
    setCleaned(n.clean(text, result.findings));
  }, [text, result]);

  return (
    <div className='space-y-8 pb-16'>
      <Script src='/noslop/noslop.js' strategy='afterInteractive' onLoad={() => setLoaded(true)} />
      {!loaded && <p className='text-sm text-muted-foreground'>Loading analyzer...</p>}
      <Card>
        <CardHeader>
          <CardTitle>Paste your text</CardTitle>
          <CardDescription>It stays in your browser. No data leaves your device.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Paste the prose you want to check...'
            className='min-h-[12rem] w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
          />
          <div className='flex flex-wrap gap-3'>
            <Button onClick={analyze} disabled={!loaded || !text.trim()}>
              Analyze
            </Button>
            <Button variant='outline' onClick={clean} disabled={!loaded || !result}>
              Clean removable slop
            </Button>
          </div>
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              {result.words} words · {result.findings.length} flags
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='text-4xl font-semibold'>{result.score}</div>
              <div className='text-lg font-medium'>{result.verdict}</div>
            </div>
            {result.top.length > 0 && (
              <ul className='space-y-2'>
                {result.top.map((f: any, i: number) => (
                  <li key={i} className='text-sm'>
                    <span className='font-medium'>{f.name}</span>
                    <span className='text-muted-foreground'> — {f.message}</span>
                    <span className='block truncate text-xs text-muted-foreground'>{f.match}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {cleaned && (
        <Card>
          <CardHeader>
            <CardTitle>Cleaned text</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              readOnly
              value={cleaned}
              className='min-h-[12rem] w-full rounded-lg border border-input bg-background p-3 text-sm'
            />
          </CardContent>
        </Card>
      )}

      <p className='text-sm text-muted-foreground'>
        Use the{' '}
        <a href='/noslop/noslop.user.js' className='underline hover:text-primary'>
          userscript
        </a>
        {' '}on any page, or read the{' '}
        <a href='/noslop/noslop.md' className='underline hover:text-primary'>
          agent prompt
        </a>
        .
      </p>
    </div>
  );
}
