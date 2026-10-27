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
const MAX_PAGE_SIZE = 100;
const MAX_PAGE = 10_000;

class PaginationError extends Error {
  readonly status = 400;
}

function parsePositiveInteger(value: string | undefined, name: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!/^\d+$/.test(value)) {
    throw new PaginationError(`${name} must be a positive integer`);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new PaginationError(`${name} must be a positive integer`);
  }

  return parsed;
}

export function getPagination(query: PaginationRequest, maxLimit = MAX_PAGE_SIZE): PaginationParams {
  const requestedPageSize = parsePositiveInteger(query.pageSize, 'pageSize');
  const limit = Math.min(requestedPageSize ?? DEFAULT_PAGE_SIZE, maxLimit);

  const page = parsePositiveInteger(query.page, 'page') ?? 1;
  if (page > MAX_PAGE) {
    throw new PaginationError(`page must not exceed ${MAX_PAGE}`);
  }

  const offset = (page - 1) * limit;

  return { limit, offset };
}

export function pagination(
  maxLimit = MAX_PAGE_SIZE,
): (req: Request<never, never, never, PaginationParams>, _: Response, next: NextFunction) => void {
  return (req: Request<never, never, never, PaginationRequest & PaginationParams>, _: Response, next: NextFunction) => {
    const { limit, offset } = getPagination(req.query, maxLimit);
    req.query.limit = limit;
    req.query.offset = offset;

    next();
  };
}
