'use client';

const techniques = [
  {
    title: 'Persona Prompting',
    tag: 'Role Definition',
    description: 'Tell the AI to adopt a specific expert role to anchor tone, technical rigor, and domain constraints.',
    example: '"You are a senior security engineer. Audit this smart contract for reentrancy and integer overflow vulnerabilities."',
  },
  {
    title: 'Chain of Thought',
    tag: 'Step-by-Step',
    description: 'Instruct the AI to plan and reason before generating code, significantly reducing architectural and logic errors.',
    example: '"I need to integrate a payment gateway. Outline the data model changes, API routes, and webhook handlers before writing any code."',
  },
  {
    title: 'Negative Constraints',
    tag: 'Boundary Setting',
    description: 'Explicitly define forbidden patterns or libraries to prevent default boilerplate and hallucinated dependencies.',
    example: '"Build this auth system using standard Web Crypto primitives. Do not use external crypto libraries or legacy packages."',
  },
];

export function PromptTechniques() {
  return (
    <div className="not-prose my-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      {techniques.map((t) => (
        <div
          key={t.title}
          className="p-5 rounded-lg border border-border bg-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm text-foreground">{t.title}</h4>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {t.tag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.description}</p>
          </div>
          <div className="bg-muted/40 rounded p-3 border border-border/60">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
              Example
            </span>
            <p className="text-xs font-mono text-foreground/90 leading-relaxed">{t.example}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
