import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parse } from 'yaml';

test('a failed platform is reported alongside later successful platforms', () => {
  const result = spawnSync(process.execPath, ['scripts/report-platform-outcomes.mjs', 'x', 'bluesky', 'hashnode'], {
    encoding: 'utf8',
    env: { ...process.env, GITHUB_STEP_SUMMARY: '', PLATFORM_STEPS: JSON.stringify({
      x: { outcome: 'failure', conclusion: 'success' },
      bluesky: { outcome: 'success' }, hashnode: { outcome: 'failure' },
    }) },
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /\| x \| failure \|/);
  assert.match(result.stdout, /\| bluesky \| success \|/);
  assert.match(result.stdout, /\| hashnode \| failure \|/);
});

test('skipped platforms do not fail a healthy run', () => {
  const result = spawnSync(process.execPath, ['scripts/report-platform-outcomes.mjs', 'buffer', 'hashnode'], {
    env: { ...process.env, GITHUB_STEP_SUMMARY: '', PLATFORM_STEPS: '{"buffer":{"outcome":"success"}}' },
  });
  assert.equal(result.status, 0);
});

for (const workflow of ['social-scheduler', 'viz-scheduler']) {
  test(`${workflow} isolates platform errors and saves receipts before reporting failures`, () => {
    const { steps } = parse(readFileSync(`.github/workflows/${workflow}.yml`, 'utf8')).jobs.post;
    const platformSteps = steps.filter(step => /scheduled-executor\.ts|preflight\.ts|verify-buffer-launch\.ts/.test(step.run || ''));
    assert.ok(platformSteps.length > 0);
    for (const step of platformSteps) {
      assert.equal(step['continue-on-error'], true, step.name);
      assert.ok(step.id, step.name);
    }
    const save = steps.findIndex(step => step.uses?.includes('git-auto-commit-action'));
    const report = steps.findIndex(step => step.run?.includes('report-platform-outcomes.mjs'));
    assert.ok(save > 0 && report > save);
    assert.match(steps[save].if, /always\(\)/);
    assert.match(steps[report].if, /always\(\)/);
  });
}
