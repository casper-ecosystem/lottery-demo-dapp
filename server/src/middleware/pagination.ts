import { NextFunction, Request, Response } from 'express';

export interface PaginationParams {
  limit: number;
  offset: number;
}

interface PaginationRequest {
  page?: string;
  pageSize?: string;
}

export function pagination(
  maxLimit = 100,
): (req: Request<never, never, never, PaginationParams>, _: Response, next: NextFunction) => void {
  return (req: Request<never, never, never, PaginationRequest & PaginationParams>, _: Response, next: NextFunction) => {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    req.query.limit = pageSize >= 0 ? pageSize : 10;

    if (req.query.limit > maxLimit) {
      req.query.limit = maxLimit;
    }

    const page = parseInt(req.query.page);
    req.query.offset = page >= 1 ? (page - 1) * req.query.limit : 0;

    next();
  };
}
