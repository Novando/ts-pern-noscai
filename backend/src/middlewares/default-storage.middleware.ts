import type { Request, Response, NextFunction } from "express";
import {runWithStore, type Store} from "../utils/local-storage.util";
import dayjs from "dayjs";


export function defaultStorageMiddleware(req: Request, res: Response, next: NextFunction) {
  const store: Store = {
    timeNow: dayjs(),
    endpoint: `[${req.method}] ${req.url}`,
  }
  const xTenantId = req.header('x-tenant-id')
  if (xTenantId) {
    store.tenantId = parseInt(xTenantId);
  }
  runWithStore(store, () => { next() });
}