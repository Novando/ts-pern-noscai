import type {NextFunction, Request, Response} from "express";
import {getAsyncLocalStorage} from "../utils/local-storage.util";
import {constants} from "http2";
import { Logger } from "../utils/logger.util";
import {AppError, standardErrorResponse} from "../utils/error.util";


export function guardMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getAsyncLocalStorage('tenantId') as number
    if (!id || id < 1) throw new AppError('X-Tenant-Id is required', 'UNAUTHORIZED', constants.HTTP_STATUS_UNAUTHORIZED)

    next()
  } catch (e) {
    standardErrorResponse(res, constants.HTTP_STATUS_UNAUTHORIZED, e as Error)
  }
}