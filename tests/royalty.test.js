import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { amount, calculateTotals, classifyStatus, validateDataset, validateRequest } from '../src/royalty.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'bookleaf_sample_data.json'), 'utf8'));

test('validates source counts and unique identifiers', () => {
  assert.deepEqual(validateDataset(data), { authors: 10, books: 18 });
});

test('calculates supplied snapshot totals', () => {
  assert.deepEqual(calculateTotals(data), {
    total_copies_sold: 7205,
    total_royalty_earned: 243382,
    royalty_paid: 202543,
    royalty_pending: 40839,
  });
});

test('rejects duplicate author and book IDs', () => {
  assert.throws(() => validateDataset({ authors: [data.authors[0], data.authors[0]] }), /duplicate author_id/);
  const copy = structuredClone(data);
  copy.authors[1].books.push(copy.authors[0].books[0]);
  assert.throws(() => validateDataset(copy), /duplicate book_id/);
});

test('keeps null distinct from zero and rejects invalid amounts', () => {
  assert.equal(amount(0), 0);
  assert.throws(() => amount(null), /finite non-negative/);
  assert.throws(() => amount(-1), /finite non-negative/);
});

test('classifies paid and leaves positive balances pending without policy', () => {
  assert.equal(classifyStatus({ pending: 0, asOf: '2026-01-01' }), 'Paid');
  assert.equal(classifyStatus({ pending: 25, lastPayoutDate: '2024-01-01', asOf: '2026-01-01' }), 'Pending');
});

test('supports provisional overdue policy and avoids missing/future date guesses', () => {
  assert.equal(classifyStatus({ pending: 25, lastPayoutDate: '2025-01-01', asOf: '2026-01-01', overdueDays: 90 }), 'Overdue');
  assert.equal(classifyStatus({ pending: 25, lastPayoutDate: null, publicationDate: '2024-01-01', asOf: '2026-01-01', overdueDays: 90 }), 'Overdue');
  assert.equal(classifyStatus({ pending: 25, lastPayoutDate: null, asOf: '2026-01-01', overdueDays: 90 }), 'Pending');
  assert.equal(classifyStatus({ pending: 25, lastPayoutDate: '2026-02-01', asOf: '2026-01-01', overdueDays: 90 }), 'Pending');
});

test('validates webhook request shape', () => {
  assert.throws(() => validateRequest({ request_id: 'r1', author: {}, books: [] }), /author.author_id/);
  assert.doesNotThrow(() => validateRequest({ request_id: 'r1', author: { author_id: 'a1' }, books: [
    { book_id: 'b1', copies_sold: 0, earned: 0, paid: 0, pending: 0 },
  ] }));
});
