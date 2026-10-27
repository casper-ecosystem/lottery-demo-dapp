import { NextFunction, Request, Response } from 'express';

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

export function getErrorResponse(error: HttpError): { status: number; message: string } {
  const providedStatus = error.status ?? error.statusCode;
  const status =
    Number.isInteger(providedStatus) && providedStatus >= 400 && providedStatus <= 599 ? providedStatus : 500;

  return {
    status,
    message: status < 500 ? error.message : 'Internal server error',
  };
}

export function errorHandler(error: HttpError, _: Request, res: Response, next: NextFunction) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const response = getErrorResponse(error);
  return res.status(response.status).json({ error: response.message });
}
