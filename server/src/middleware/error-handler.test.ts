import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getErrorResponse } from './error-handler';

describe('getErrorResponse', () => {
  it('preserves client error status codes', () => {
    assert.deepEqual(getErrorResponse(Object.assign(new Error('Malformed JSON'), { status: 400 })), {
      status: 400,
      message: 'Malformed JSON',
    });
    assert.deepEqual(getErrorResponse(Object.assign(new Error('Payload too large'), { status: 413 })), {
      status: 413,
      message: 'Payload too large',
    });
  });

  it('hides unexpected server error details', () => {
    assert.deepEqual(getErrorResponse(new Error('database credentials')), {
      status: 500,
      message: 'Internal server error',
    });
  });
});
