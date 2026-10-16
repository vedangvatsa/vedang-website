'use client';

import { useMemo, useState } from 'react';
import study from '@/lib/personality-data.json';

export function PersonalityProfileExplorer() {
  const [query, setQuery] = useState('');
  const [coverage, setCoverage] = useState('all');
  const models = useMemo(() => study.models.filter((model) => {
    const matchesName = model.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCoverage = coverage === 'all' ||
      (coverage === 'complete' && model.eligibleTraits === 5) ||
      (coverage === 'partial' && model.eligibleTraits > 0 && model.eligibleTraits < 5) ||
      (coverage === 'none' && model.eligibleTraits === 0);
    return matchesName && matchesCoverage;
  }), [query, coverage]);

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white text-[#37352f] overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-lg md:text-xl font-bold tracking-tight">All 55 questionnaire profiles</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#52525b]">
          Means use the 1 to 5 keyed scale. Each cell shows complete assessments out of planned attempts.
          A missing mean indicates insufficient numeric support, not a low trait score.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="personality-model-search" className="block text-sm font-medium mb-1">Find a model</label>
            <input id="personality-model-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Model name" className="w-full rounded border border-[#d4d4d8] bg-white px-3 py-2 text-base outline-offset-2" />
          </div>
          <div>
            <label htmlFor="personality-coverage-filter" className="block text-sm font-medium mb-1">Profile coverage</label>
            <select id="personality-coverage-filter" value={coverage} onChange={(event) => setCoverage(event.target.value)} className="w-full rounded border border-[#d4d4d8] bg-white px-3 py-2 text-base outline-offset-2">
              <option value="all">All configurations</option>
              <option value="complete">All five traits reported</option>
              <option value="partial">One to four traits reported</option>
              <option value="none">No reportable traits</option>
            </select>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#52525b]" role="status" aria-live="polite">{models.length} of {study.models.length} configurations shown, ordered alphabetically.</p>
      </div>
      <div className="max-h-[36rem] overflow-auto border-y border-[#e3e3e0] outline-offset-[-2px]" tabIndex={0} role="region" aria-label="Scrollable personality profile table">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">Reported IPIP-50 mean scores and complete-assessment counts for every tested model configuration. Missing means indicate insufficient support.</caption>
          <thead className="sticky top-0 z-10 bg-[#f8fafc]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Model</th>
              {study.traits.map((trait) => <th key={trait.abbr} scope="col" className="px-3 py-3 text-left font-semibold"><abbr title={trait.name} className="no-underline">{trait.abbr}</abbr></th>)}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="border-t border-[#e3e3e0]">
                <th scope="row" className="px-4 py-3 text-left font-medium whitespace-nowrap">{model.name}</th>
                {model.traits.map((trait) => (
                  <td key={trait.abbr} className="px-3 py-3" style={{ backgroundColor: trait.eligible ? `rgba(79, 70, 229, ${0.03 + ((Number(trait.mean) - 1) / 4) * 0.11})` : '#fafafa' }}>
                    <span className="block font-semibold">{trait.mean ?? 'Not reported'}</span>
                    <span className="block mt-1 text-xs text-[#52525b]">{trait.n}/{model.planned} complete</span>
                    {trait.sd !== null && <span className="block mt-1 text-xs text-[#52525b]">SD {trait.sd}</span>}
                  </td>
                ))}
              </tr>
            ))}
            {models.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center">No configuration matches these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <figcaption className="px-5 py-4 text-xs leading-relaxed text-[#52525b]">
        E = Extraversion; A = Agreeableness; C = Conscientiousness; ES = Emotional Stability; I = Intellect/Imagination.
        Shading reflects the coded mean, not model quality. Reporting requires five of ten, three of five, or three of three complete assessments.
        {' '}Source: <a className="underline underline-offset-2" href="/research/personality/reported-profiles.csv">verified score table</a> and <a className="underline underline-offset-2" href="/research/personality/coverage.csv">coverage data</a>.
      </figcaption>
    </figure>
  );
}
