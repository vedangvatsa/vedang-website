'use client';

const studyUrl = 'https://github.com/vedangvatsa/research-paper-framework/blob/076f6f45c7a71d801cb58d202938422b39b48e1f/papers/linguistic-markers-paper/linguistic_markers_paper.md';

const accuracy = [
  { name: 'Forest, eight features', internal: 95.99, external: 53.89 },
  { name: 'Logistic, eight features', internal: 90.06, external: 68.91 },
  { name: 'Forest, length only', internal: 90.38, external: 51.60 },
];

function StudySource({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="border-t border-[#e3e3e0] px-5 py-4 text-xs leading-relaxed text-[#64748b] sm:px-7">
      {children}
      <a href={studyUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-[10px] underline underline-offset-2">
        Source: High Accuracy, Poor Transfer, Tables 3 and 5
      </a>
    </figcaption>
  );
}

export function AbstractTransferComparison() {
  return (
    <figure aria-labelledby="abstract-transfer-comparison" className="not-prose my-10 w-full overflow-hidden rounded-[3px] border border-[#e3e3e0] bg-white text-[#37352f]">
      <div className="p-5 sm:p-7">
        <h3 id="abstract-transfer-comparison" className="text-lg font-bold tracking-tight sm:text-xl">Accuracy within and across corpora</h3>
        <p className="mt-2 text-sm text-[#64748b]">Percentage correct at the fixed 0.5 threshold</p>
        <div className="my-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#475569]">
          <span className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 bg-[#2563eb]/65" />Internal validation</span>
          <span className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 bg-[#b45309]/65" />External corpus</span>
        </div>
        <div className="space-y-6">
          {accuracy.map((model) => (
            <div key={model.name}>
              <p className="mb-2 text-sm font-semibold">{model.name}</p>
              <dl className="space-y-2">
                {(['internal', 'external'] as const).map((evaluation) => (
                  <div key={evaluation} className="grid grid-cols-[58px_minmax(0,1fr)_55px] items-center gap-2 text-xs sm:grid-cols-[66px_minmax(0,1fr)_60px] sm:text-sm">
                    <dt>{evaluation === 'internal' ? 'Internal' : 'External'}</dt>
                    <dd className="col-span-2 grid grid-cols-[minmax(0,1fr)_55px] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_60px]">
                      <div aria-hidden="true" className="h-4 bg-[#f1f5f9]">
                        <div className={`h-full ${evaluation === 'internal' ? 'bg-[#2563eb]/65' : 'bg-[#b45309]/65'}`} style={{ width: `${model[evaluation]}%` }} />
                      </div>
                      <span className="text-right font-semibold tabular-nums">{model[evaluation].toFixed(2)}%</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="mt-3 ml-[66px] mr-[63px] flex justify-between text-[10px] text-[#64748b] sm:ml-[74px] sm:mr-[68px]">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>
      <StudySource>
        Internal results pool five held-out source-group folds. External results use models fitted to all eligible local texts. Both corpora contain equal class counts. Bars start at zero.
      </StudySource>
    </figure>
  );
}

export function AbstractTransferErrors() {
  const total = 8319;
  const rows = [
    { label: 'Published-class texts', correct: 7991, error: 328, correctLabel: 'Correctly accepted', errorLabel: 'Incorrectly flagged' },
    { label: 'Generated-class texts', correct: 976, error: 7343, correctLabel: 'Correctly detected', errorLabel: 'Missed' },
  ];

  return (
    <figure aria-labelledby="abstract-transfer-errors" className="not-prose my-10 w-full overflow-hidden rounded-[3px] border border-[#e3e3e0] bg-white text-[#37352f]">
      <div className="p-5 sm:p-7">
        <h3 id="abstract-transfer-errors" className="text-lg font-bold tracking-tight sm:text-xl">Where the external forest makes mistakes</h3>
        <p className="mt-2 text-sm text-[#64748b]">8,319 texts in each recorded class; score above 0.5 means generated</p>
        <div className="mt-6 space-y-7">
          {rows.map((row) => (
            <div key={row.label}>
              <p className="mb-3 text-sm font-semibold">{row.label}</p>
              <div aria-hidden="true" className="flex h-6 overflow-hidden bg-[#f1f5f9]">
                <div className="h-full bg-[#2563eb]/65" style={{ width: `${row.correct / total * 100}%` }} />
                <div className="h-full bg-[#b45309]/65" style={{ width: `${row.error / total * 100}%` }} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <dt className="text-[#475569]">{row.correctLabel}</dt>
                  <dd className="mt-1 font-semibold tabular-nums">{row.correct.toLocaleString('en-US')} ({(row.correct / total * 100).toFixed(2)}%)</dd>
                </div>
                <div>
                  <dt className="text-[#475569]">{row.errorLabel}</dt>
                  <dd className="mt-1 font-semibold tabular-nums">{row.error.toLocaleString('en-US')} ({(row.error / total * 100).toFixed(2)}%)</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
      <StudySource>
        Blue denotes correct classifications; brown denotes errors. Each percentage uses its own recorded class as the denominator. Counts describe the supplied labels, not independently authenticated authorship.
      </StudySource>
    </figure>
  );
}
