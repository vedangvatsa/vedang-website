import { appendFileSync } from 'node:fs';

const steps = JSON.parse(process.env.PLATFORM_STEPS || '{}');
const names = process.argv.slice(2);
const rows = names.map(name => [name, steps[name]?.outcome || 'skipped']);
const report = ['## Platform execution results', '', '| Platform / check | Outcome |', '| --- | --- |',
  ...rows.map(([name, outcome]) => `| ${name} | ${outcome} |`),
  '', 'Success means the executor completed; publication is confirmed by its queue receipt.', ''].join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
if (rows.some(([, outcome]) => outcome === 'failure')) process.exitCode = 1;
