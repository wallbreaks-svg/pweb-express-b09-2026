import type { Response } from "express";

export interface PaginationMetadata {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
  metadata?: PaginationMetadata,
): void => {
  const payload: Record<string, unknown> = {
    status: true,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (metadata !== undefined) {
    payload.metadata = metadata;
  }

  res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
): void => {
  res.status(statusCode).json({
    status: false,
    message,
  });
};
