'use client';

import { useId, useState } from 'react';
import { calculateFinanceCosts, financeCostAssumptions } from '@/lib/finance-data';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function FinanceCostModel() {
  const [reviewedPercent, setReviewedPercent] = useState(20);
  const [acceptedPercent, setAcceptedPercent] = useState(financeCostAssumptions.acceptedPercent);
  const id = useId();
  const result = calculateFinanceCosts(reviewedPercent, acceptedPercent);
  const costs = [
    { label: 'Automated processing', value: result.automatedCost, color: 'bg-slate-500/65' },
    { label: 'Allocated overhead', value: result.overhead, color: 'bg-sky-600/65' },
    { label: 'Human review', value: result.reviewCost, color: 'bg-indigo-500/65' },
  ];

  return (
    <figure aria-labelledby={`${id}-title`} className="not-prose my-10 w-full overflow-hidden rounded-[3px] border border-[#e3e3e0] bg-white text-[#37352f]">
      <div className="p-5 sm:p-7">
        <h3 id={`${id}-title`} className="text-lg font-bold tracking-tight md:text-xl">Cost per accepted task</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Illustrative assumptions, not measured company results. Change the inputs to see the arithmetic.
        </p>
        <div className="my-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-review`} className="block text-sm font-semibold">Tasks reviewed by a person</label>
            <output htmlFor={`${id}-review`} className="mt-1 block text-xl font-semibold tabular-nums">{reviewedPercent}%</output>
            <input
              id={`${id}-review`} type="range" min={0} max={100} step={5} value={reviewedPercent}
              aria-valuetext={`${reviewedPercent}% of submitted tasks reviewed`}
              onChange={(event) => setReviewedPercent(Number(event.target.value))}
              className="mt-3 h-8 w-full accent-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
          </div>
          <div>
            <label htmlFor={`${id}-accepted`} className="block text-sm font-semibold">Tasks completed and accepted</label>
            <output htmlFor={`${id}-accepted`} className="mt-1 block text-xl font-semibold tabular-nums">{acceptedPercent}%</output>
            <input
              id={`${id}-accepted`} type="range" min={50} max={100} step={1} value={acceptedPercent}
              aria-valuetext={`${acceptedPercent}% of submitted tasks accepted`}
              onChange={(event) => setAcceptedPercent(Number(event.target.value))}
              className="mt-3 h-8 w-full accent-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
          </div>
        </div>
        <div aria-live="polite" className="grid gap-5 border-y border-[#e3e3e0] py-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-600">USD per accepted task</p>
            <p data-finance-result="unit-cost" className="mt-1 text-4xl font-bold tabular-nums">{usd.format(result.costPerAccepted ?? 0)}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-600">Accepted tasks per month</p>
            <p className="mt-1 text-4xl font-bold tabular-nums">{result.acceptedTasks.toLocaleString('en-US')}</p>
          </div>
        </div>
        <dl className="mt-6 space-y-4">
          {costs.map((cost) => (
            <div key={cost.label}>
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <dt>{cost.label}</dt>
                <dd className="font-medium tabular-nums">{usd.format(cost.value)} / month</dd>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-sm bg-zinc-100" aria-hidden="true">
                <div className={`h-full ${cost.color}`} style={{ width: `${cost.value / result.totalCost * 100}%` }} />
              </div>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm font-semibold tabular-nums">Total monthly operating cost: {usd.format(result.totalCost)}</p>
        <p className="mt-4 text-xs leading-relaxed text-zinc-600">
          Fixed inputs: 10,000 submitted tasks, $0.20 automated cost per submitted task, $3,000 monthly overhead,
          three minutes per review, and $40 per labor hour. Completion is an assumption, not a prediction.
          Financial-error losses, sales, taxes, and costs outside the stated overhead are excluded.
        </p>
        <button type="button" onClick={() => { setReviewedPercent(20); setAcceptedPercent(95); }}
          className="mt-4 rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Reset assumptions
        </button>
      </div>
      <figcaption className="border-t border-[#e3e3e0] px-5 py-4 text-xs leading-relaxed text-zinc-600 sm:px-7">
        Calculation from the assumptions stated in this essay. <a href="/data/finance-research.json" className="underline underline-offset-2">Source and calculation register</a>.
      </figcaption>
    </figure>
  );
}
