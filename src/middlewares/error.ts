import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error";
import { sendError } from "../utils/response";

export const notFound = (req: Request, res: Response): void => {
  sendError(res, 404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`);
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof HttpError) {
    sendError(res, err.status, err.message);
    return;
  }

  if (typeof err === "object" && err !== null && "code" in err) {
    const prismaErr = err as { code: string };
    if (prismaErr.code === "P2002") {
      sendError(res, 409, "Data sudah ada (nilai unik bentrok)");
      return;
    }
    if (prismaErr.code === "P2025") {
      sendError(res, 404, "Data tidak ditemukan");
      return;
    }
    if (prismaErr.code === "P2003") {
      sendError(res, 400, "Relasi data tidak valid");
      return;
    }
  }

  console.error(err);
  sendError(res, 500, "Terjadi kesalahan internal pada server");
};
