import assert from 'node:assert/strict';
import { isPipeFilterUrl, matchesPipeFilters, normalizePipeValue, pipeFilterOptions, readPipeFilters } from '../src/lib/pipe-filters.mjs';

const product = { data: {
  title: 'Rura bez szwu 88,9 x 6,3 mm', category: 'bez-szwu', description: '',
  technicalParameters: [
    { label: 'Średnica', value: '88,9mm' },
    { label: 'Ścianka', value: '6,3mm' },
    { label: 'Długość', value: '12mb, 6mb' },
    { label: 'Gatunek', value: 'S235JRH, S355' },
    { label: 'Norma', value: 'PN-EN 10219; PN-EN 10210' }
  ]
} };

assert.equal(matchesPipeFilters(product, {
  type: 'bez-szwu', diameter: '88.9', wall: '6,3 mm', length: '6', grade: 's355', standard: 'PN-EN 10219'
}), true, 'All six constraints must work together');
assert.equal(matchesPipeFilters(product, { grade: 'S235' }), false, 'A grade must not match a longer grade by prefix');
assert.equal(matchesPipeFilters(product, { diameter: '88' }), false);
assert.equal(matchesPipeFilters(product, { type: 'uzywane' }), false);
assert.equal(matchesPipeFilters(product, { diameter: '88.9', wall: '10' }), false, 'Combine constraints with AND');
assert.equal(matchesPipeFilters(product, { standard: 'PN-EN 1021' }), false);
assert.equal(matchesPipeFilters(product, readPipeFilters(new URLSearchParams('q=rura+szwu'))), true);
assert.equal(normalizePipeValue('8,mm', true), '', 'Do not silently guess malformed dimensions');
assert.equal(normalizePipeValue('<script>', true), '');
assert.deepEqual(pipeFilterOptions([product])[2].values, ['6', '12'], 'Split multiple lengths and sort numerically');
assert.deepEqual(pipeFilterOptions([product, product])[0].values, ['88.9'], 'Deduplicate options');
assert.equal(isPipeFilterUrl(new URL('https://example.com/rury-stalowe/?grade=S355')), true);
assert.equal(isPipeFilterUrl(new URL('https://example.com/rury-stalowe/?q=rura')), true);
assert.equal(isPipeFilterUrl(new URL('https://example.com/rury-stalowe/?utm_source=test')), false);
assert.equal(isPipeFilterUrl(new URL('https://example.com/rury-stalowe-bez-szwu/')), false);
assert.equal(isPipeFilterUrl(new URL('https://example.com/kontakt/?type=x')), false);
console.log('PASS: combined filters, exact values, numeric normalization, multi-value attributes, search and noindex scope');
