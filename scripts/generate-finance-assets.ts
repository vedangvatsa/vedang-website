import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateFinanceCosts, financeCostAssumptions, financeSources } from '../src/lib/finance-data';
import { generateTerminalOgImage } from '../src/lib/og-image';

async function main() {
  const manuscript = fs.readFileSync('src/content/essays/finance.mdx', 'utf8');
  const links = new Set([...manuscript.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]));
  assert.equal(links.size, financeSources.length, 'Each external source must appear in the register.');
  for (const source of financeSources) assert(links.has(source.url), `Uncited source: ${source.id}`);
  const scenarios = [5, 20, 50].map((review) => calculateFinanceCosts(review));
  const register = {
    title: 'Agentic Finance',
    url: 'https://veda.ng/finance',
    checkedOn: '2026-10-17',
    evidence: 'Review of linked public primary sources, not a live payment or trading experiment.',
    survey: { year: 2024, respondingFirms: 118, aiUsingFirmPercent: 75, fullyAutonomousUseCasePercent: 2,
      warning: 'Firm and use-case percentages have different denominators; these are not current agent-market shares.', sourceId: 'boe-fca-survey' },
    costModel: {
      status: 'Illustrative assumptions, not observed results or vendor prices',
      currency: 'USD', assumptions: financeCostAssumptions, scenarios,
      formula: '(monthly overhead + automated costs for all submitted tasks + review costs) / accepted tasks',
      excluded: ['Financial-error losses', 'Sales costs', 'Taxes', 'Costs outside the stated overhead'],
      caveat: 'Holding acceptance constant isolates arithmetic sensitivity; it does not establish that less review preserves quality.',
    },
    sources: financeSources,
  };
  const dataPath = path.resolve('public/data/finance-research.json');
  const ogPath = path.resolve('public/og/finance.png');
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.mkdirSync(path.dirname(ogPath), { recursive: true });
  fs.writeFileSync(dataPath, `${JSON.stringify(register, null, 2)}\n`);
  const image = generateTerminalOgImage('Agentic', 'Finance', 'veda.ng/finance', [
    { text: 'Read financial records', color: 'command' },
    { text: 'Check authority', color: 'success' },
    { text: 'Confirm the result', color: 'success' },
  ], 'Banking, payments, investing');
  fs.writeFileSync(ogPath, Buffer.from(await image.arrayBuffer()));
  console.log(JSON.stringify({ sources: financeSources.length, scenarios, files: [dataPath, ogPath] }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
