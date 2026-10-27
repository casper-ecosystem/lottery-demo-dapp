import { RequestHandler } from 'express';

// Needed for Express 4 that does not forward rejected async handlers to error middleware
export function asyncHandler<
  Params = Record<string, string>,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery = Record<string, string | undefined>,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals>,
): RequestHandler<Params, ResponseBody, RequestBody, RequestQuery, Locals> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
