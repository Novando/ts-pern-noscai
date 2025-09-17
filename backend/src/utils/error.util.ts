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

export function standardErrorResponse(res: Response, e: Error) {
  if (e instanceof AppError) {
    res.status(e.status).json(
      standardResponse(null, e.code, e.message)
    );
  } else {
    // Fallback for unknown errors
    res.status(500).json(
      standardResponse(null, "INTERNAL_ERROR", "Something went wrong")
    );
  }
}