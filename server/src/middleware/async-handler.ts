import { ParamsDictionary, RequestHandler } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Needed for Express 4 that does not forward rejected async handlers to error middleware
export function asyncHandler<
  Params = ParamsDictionary,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery = ParsedQs,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals>,
): RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
