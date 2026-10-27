import assert from 'node:assert/strict';
import { it } from 'node:test';

import { asyncHandler } from './async-handler';

it('forwards rejected request handlers to Express error handling', async () => {
  const expectedError = new Error('database query failed');

  await new Promise<void>((resolve, reject) => {
    const handler = asyncHandler(async () => {
      throw expectedError;
    });

    handler({} as never, {} as never, (error) => {
      try {
        assert.equal(error, expectedError);
        resolve();
      } catch (assertionError) {
        reject(assertionError);
      }
    });
  });
});
