import { NextFunction, Request, Response } from 'express';

export interface PaginationParams {
  limit: number;
  offset: number;
}

interface PaginationRequest {
  page?: string;
  pageSize?: string;
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE = 10_000;

function parseInteger(value: string | undefined): number | undefined {
  if (!value || !/^-?\d+$/.test(value)) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

export function getPagination(query: PaginationRequest, maxLimit = 100): PaginationParams {
  const requestedPageSize = parseInteger(query.pageSize);
  let limit = requestedPageSize !== undefined && requestedPageSize >= 0 ? requestedPageSize : DEFAULT_PAGE_SIZE;

  if (requestedPageSize === -1) {
    return { limit: -1, offset: 0 };
  }

  limit = Math.min(limit, maxLimit);

  const requestedPage = parseInteger(query.page);
  const page = Math.min(requestedPage !== undefined && requestedPage >= 1 ? requestedPage : 1, MAX_PAGE);
  const offset = (page - 1) * limit;

  return { limit, offset };
}

export function pagination(
  maxLimit = 100,
): (req: Request<never, never, never, PaginationParams>, _: Response, next: NextFunction) => void {
  return (req: Request<never, never, never, PaginationRequest & PaginationParams>, _: Response, next: NextFunction) => {
    const { limit, offset } = getPagination(req.query, maxLimit);
    req.query.limit = limit;
    req.query.offset = offset;

    next();
  };
}
