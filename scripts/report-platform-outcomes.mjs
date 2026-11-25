import { appendFileSync } from 'node:fs';

const steps = JSON.parse(process.env.PLATFORM_STEPS || '{}');
const names = process.argv.slice(2);
const rows = names.map(name => [name, steps[name]?.outcome || 'skipped']);
const report = ['## Platform execution results', '', '| Platform / check | Outcome |', '| --- | --- |',
  ...rows.map(([name, outcome]) => `| ${name} | ${outcome} |`),
  '', 'Success means the executor completed; publication is confirmed by its queue receipt.', ''].join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

const required = process.env.REQUIRED_PLATFORMS
  ? process.env.REQUIRED_PLATFORMS.split(',').map(s => s.trim()).filter(Boolean)
  : null;

if (required) {
  if (rows.some(([name, outcome]) => required.includes(name) && outcome === 'failure')) {
    process.exitCode = 1;
  }
} else if (rows.some(([, outcome]) => outcome === 'failure')) {
  process.exitCode = 1;
}

