'use client';

import { useId, useState } from 'react';
import { tokenTaxFormats, tokenTaxStudy } from '@/lib/token-tax-data';

type Count = 'inputTokens' | 'pageTokens';

export function TokenTaxFormatChart() {
  const [count, setCount] = useState<Count>('inputTokens');
  const titleId = useId();
  const descriptionId = useId();
  const maximum = Math.max(...tokenTaxFormats.map((format) => format[count]));

  return (
    <figure
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="not-prose my-10 w-full overflow-hidden rounded-[3px] border border-[#e3e3e0] bg-white text-[#37352f]"
    >
      <div className="p-5 sm:p-7">
        <h3 id={titleId} className="text-lg font-bold tracking-tight md:text-xl">
          Tokens by page format
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          {tokenTaxStudy.sections} saved sections. {tokenTaxStudy.questions} questions per format.
        </p>
        <div role="group" aria-label="Token measure" className="my-6 flex flex-wrap gap-2">
          {([
            ['inputTokens', 'Complete input'],
            ['pageTokens', 'Page text only'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={count === value}
              onClick={() => setCount(value)}
              className={`rounded border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                count === value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p id={descriptionId} className="mb-5 text-sm leading-relaxed text-zinc-600" aria-live="polite">
          {count === 'inputTokens'
            ? 'Recorded tokens for the whole request, including questions and instructions. Replies are excluded.'
            : 'Tokens in the page representation alone, counted with o200k_base. Questions, instructions, and replies are excluded.'}
          {' '}All bars start at zero.
        </p>
        <dl className="space-y-5" aria-live="polite">
          {tokenTaxFormats.map((format) => (
            <div key={format.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-sm font-semibold">{format.label}</dt>
                <dd className="text-sm tabular-nums">
                  {format[count].toLocaleString('en-US')} tokens
                </dd>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-sm bg-zinc-100" aria-hidden="true">
                <div
                  className={`h-full rounded-sm ${format.id === 'markdown' ? 'bg-indigo-500/65' : 'bg-slate-500/65'}`}
                  style={{ width: `${(format[count] / maximum) * 100}%` }}
                />
              </div>
              <dd className="mt-1 text-xs text-zinc-600">
                {format.matches} answer-key matches out of {tokenTaxStudy.questions}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption className="border-t border-[#e3e3e0] px-5 py-4 text-xs leading-relaxed text-zinc-600 sm:px-7">
        Source: <a className="underline underline-offset-2" href={tokenTaxStudy.paperUrl}>The Token Tax of the Web</a>,
        main-run results. <a className="underline underline-offset-2" href={tokenTaxStudy.dataUrl}>Count data (JSON)</a>.
      </figcaption>
    </figure>
  );
}
