import type { Request, Response } from 'express';
import type {ServiceHttpController} from "./service.http.controller";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {constants} from "http2";
import {Logger} from "../../../utils/logger.util";
import {standardResponse} from "../../../utils/response.util";
import {standardErrorResponse} from "../../../utils/error.util";

export async function getServicesController (this: ServiceHttpController, req: Request, res: Response) {
  try {
    const clinicId = getAsyncLocalStorage('tenantId') as number

    const result = await this.serviceService.getServicesByClinicId(clinicId);

    standardResponse(res, constants.HTTP_STATUS_OK, result);
  } catch (e) {
    Logger.error('Error getting service availability:', e);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}
