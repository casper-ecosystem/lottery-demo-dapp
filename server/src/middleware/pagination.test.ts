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
    assert.throws(() => getPagination({ page: '2abc' }), { message: 'page must be a positive integer', status: 400 });
    assert.throws(() => getPagination({ pageSize: '20abc' }), {
      message: 'pageSize must be a positive integer',
      status: 400,
    });
  });

  it('rejects zero and the old unlimited page size', () => {
    assert.throws(() => getPagination({ pageSize: '0' }), {
      message: 'pageSize must be a positive integer',
      status: 400,
    });
    assert.throws(() => getPagination({ pageSize: '-1' }), {
      message: 'pageSize must be a positive integer',
      status: 400,
    });
  });

  it('rejects pages past the maximum instead of returning page 10,000', () => {
    assert.throws(() => getPagination({ page: '10001' }), {
      message: 'page must not exceed 10000',
      status: 400,
    });
  });

  it('rejects a page that previously produced exponential SQL notation', () => {
    assert.throws(() => getPagination({ page: '10000000000000000000000' }), {
      message: 'page must be a positive integer',
      status: 400,
    });
  });
});
