import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp } from '../src/clamp.js';

test('clamps finite numbers to the inclusive range', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
});

test('rejects NaN inputs', () => {
  assert.throws(() => clamp(Number.NaN, 0, 10), TypeError);
  assert.throws(() => clamp(5, Number.NaN, 10), TypeError);
  assert.throws(() => clamp(5, 0, Number.NaN), TypeError);
});

test('rejects infinite inputs', () => {
  assert.throws(() => clamp(Number.POSITIVE_INFINITY, 0, 10), TypeError);
  assert.throws(() => clamp(5, Number.NEGATIVE_INFINITY, 10), TypeError);
  assert.throws(() => clamp(5, 0, Number.POSITIVE_INFINITY), TypeError);
});
