import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateFinanceCosts } from '../src/lib/finance-data';

test('published scenarios charge all submitted work against accepted completions', () => {
  for (const [review, reviewCost, totalCost, balance] of [
    [5, 1000, 6000, 3500], [20, 4000, 9000, 500], [50, 10000, 15000, -5500],
  ]) {
    const result = calculateFinanceCosts(review);
    assert.equal(result.acceptedTasks, 9500);
    assert.equal(result.reviewCost, reviewCost);
    assert.equal(result.totalCost, totalCost);
    assert.equal(result.costPerAccepted, totalCost / 9500);
    assert.equal(result.revenue, 9500);
    assert.equal(result.balanceAfterListedCosts, balance);
  }
});

test('unaccepted work still incurs costs', () => {
  const normal = calculateFinanceCosts(20, 95);
  const lowerAcceptance = calculateFinanceCosts(20, 50);
  assert.equal(lowerAcceptance.totalCost, normal.totalCost);
  assert.equal(lowerAcceptance.costPerAccepted, 1.8);
  assert.equal(calculateFinanceCosts(20, 0).costPerAccepted, null);
});

test('automation cost reduction and review reduction are separate assumptions', () => {
  const normal = calculateFinanceCosts(20);
  assert.equal(normal.totalCost - calculateFinanceCosts(20, 95, 0.10).totalCost, 1000);
  assert.equal(normal.totalCost - calculateFinanceCosts(5).totalCost, 3000);
  assert.throws(() => calculateFinanceCosts(-1), RangeError);
  assert.throws(() => calculateFinanceCosts(20, 101), RangeError);
});
