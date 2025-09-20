import type { Response } from "express";
import { standardResponse } from "./response.util";

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function standardErrorResponse(res: Response, code: number, e: Error) {
  if (e instanceof AppError) {
    return standardResponse(res, e.status, null, e.code, e.message);
  } else {
    // Fallback for unknown errors
    return standardResponse(res, code, null, "INTERNAL_ERROR", "Something went wrong");
  }
}