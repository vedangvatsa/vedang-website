'use client';

import React from 'react';

const benchmarkSource = 'https://arxiv.org/abs/2606.17698v3';

// EComAgentBench v3, Table 3. These are distinct reported measures on 662 tasks.
const benchmarkModels = [
  { name: 'Claude Opus 4.6', accuracy: 57.1, requirements: 76.6, color: '#4f46e5' },
  { name: 'GPT-5.4', accuracy: 47.0, requirements: 81.0, color: '#15803d' },
] as const;

const metrics = [
  {
    key: 'accuracy',
    label: 'Full-task accuracy',
    description: 'Exact target product or every requirement met.',
  },
  {
    key: 'requirements',
    label: 'Requirements satisfied',
    description: 'The separate rubric-satisfaction score.',
  },
] as const;

export function CommerceBenchmarkScores() {
  return (
    <figure className="not-prose chart-card" aria-labelledby="commerce-benchmark-title">
      <div className="p-5 md:p-8 text-[#37352f]">
        <h3 id="commerce-benchmark-title" className="text-lg md:text-xl font-bold tracking-tight">
          Two measures rank the models differently
        </h3>
        <p className="mt-2 text-sm text-[#62625c]">
          Two of seven tested models. Each bar uses a 0-100% scale.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {metrics.map((metric) => (
            <section key={metric.key} aria-labelledby={`commerce-${metric.key}`}>
              <h4 id={`commerce-${metric.key}`} className="text-sm font-semibold">
                {metric.label}
              </h4>
              <p className="mt-1 min-h-10 text-xs leading-relaxed text-[#62625c]">
                {metric.description}
              </p>
              <dl className="mt-4 space-y-5">
                {benchmarkModels.map((model) => (
                  <div key={model.name}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <dt>{model.name}</dt>
                      <dd className="font-semibold tabular-nums">{model[metric.key].toFixed(1)}%</dd>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-sm bg-[#eeeeeb]" aria-hidden="true">
                      <div
                        className="h-full rounded-sm"
                        style={{ width: `${model[metric.key]}%`, backgroundColor: model.color, opacity: 0.65 }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
      <figcaption className="mx-5 border-t border-[#e3e3e0] pb-5 pt-4 text-xs leading-relaxed text-[#62625c] md:mx-8 md:pb-8">
        Source: <a href={benchmarkSource} className="underline underline-offset-2">EComAgentBench v3, Table 3</a>.
        {' '}Constructed tasks and buyer profiles; runs end in recommendations. These point estimates are not customer-order success rates. The table reports no uncertainty intervals.
      </figcaption>
    </figure>
  );
}

const purchaseOutcomes = [
  {
    title: 'Suitable first delivery',
    detail: 'The received item meets the agreed requirements or a preapproved substitute rule.',
    record: 'Keep requested, ordered, and received details.',
  },
  {
    title: 'Permission respected',
    detail: 'The action stays within current spending, seller, timing, and account limits.',
    record: 'Keep the permission version and actual actions.',
  },
  {
    title: 'Justified stop',
    detail: 'The agent asks or declines when the task rules make buying impossible or unauthorized.',
    record: 'Keep the missing condition and stopping reason.',
  },
  {
    title: 'Error resolved',
    detail: 'A wrong order reaches a refund, replacement, or another agreed resolution.',
    record: 'Keep net charges and the buyer\'s correction time.',
  },
] as const;

export function CommerceOutcomeChecks() {
  return (
    <figure className="not-prose chart-card" aria-labelledby="commerce-outcomes-title">
      <div className="p-5 md:p-8 text-[#37352f]">
        <h3 id="commerce-outcomes-title" className="text-lg md:text-xl font-bold tracking-tight">
          Report the purchase outcomes separately
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {purchaseOutcomes.map((outcome) => (
            <section key={outcome.title} className="rounded-[3px] border border-[#e3e3e0] p-4">
              <h4 className="text-sm font-semibold">{outcome.title}</h4>
              <p className="mt-2 text-sm leading-relaxed">{outcome.detail}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#62625c]">{outcome.record}</p>
            </section>
          ))}
        </div>
      </div>
      <figcaption className="px-5 pb-5 text-xs leading-relaxed text-[#62625c] md:px-8 md:pb-8">
        Suggested measures for a purchase test, not results from a completed experiment. A refund can resolve an error without making the first order correct.
      </figcaption>
    </figure>
  );
}
