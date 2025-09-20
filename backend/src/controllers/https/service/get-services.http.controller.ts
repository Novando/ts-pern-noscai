import type { Request, Response } from 'express';
import type {ServiceHttpController} from "./service.http.controller";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {constants} from "http2";

export async function getServicesController (this: ServiceHttpController, req: Request, res: Response) {
  try {
    const clinicId = getAsyncLocalStorage('tenantId') as number

    const result = await this.serviceService.getServicesByClinicId(clinicId);

    return res.status(constants.HTTP_STATUS_OK).json(result);
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while fetching services'
    });
  }
}
