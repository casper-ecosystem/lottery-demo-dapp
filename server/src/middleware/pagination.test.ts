import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getPagination } from './pagination';

describe('getPagination', () => {
  it('uses the requested page and page size', () => {
    assert.deepEqual(getPagination({ page: '3', pageSize: '25' }), { limit: 25, offset: 50 });
  });

  it('caps the page size', () => {
    assert.deepEqual(getPagination({ page: '2', pageSize: '1000' }), { limit: 100, offset: 100 });
  });

  it('rejects partial and non-integer values', () => {
    assert.deepEqual(getPagination({ page: '2abc', pageSize: '20abc' }), { limit: 10, offset: 0 });
  });

  it('caps an oversized page', () => {
    const pagination = getPagination({ page: '9007199254740991', pageSize: '100' });

    assert.deepEqual(pagination, { limit: 100, offset: 999_900 });
  });

  it('caps a page that previously produced exponential SQL notation', () => {
    assert.deepEqual(getPagination({ page: '10000000000000000000000', pageSize: '100' }), {
      limit: 100,
      offset: 999_900,
    });
  });

  it('does not calculate an offset when pagination is disabled', () => {
    assert.deepEqual(getPagination({ page: '1000000', pageSize: '-1' }), { limit: -1, offset: 0 });
  });
});
