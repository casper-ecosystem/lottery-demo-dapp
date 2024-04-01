import { NextFunction, Request, Response } from 'express';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export function pagination(
  maxLimit = 100,
): (
  req: Request<never, never, never, { page?: string; pageSize?: string } & PaginationParams>,
  _: Response,
  next: NextFunction,
) => void {
  return (
    req: Request<never, never, never, { page?: string; pageSize?: string } & PaginationParams>,
    _: Response,
    next: NextFunction,
  ) => {
    req.query.limit = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

    if (req.query.limit > maxLimit) {
      req.query.limit = maxLimit;
    }

    req.query.offset = req.query.page ? parseInt(req.query.page) * req.query.limit : 0;

    next();
  };
}
