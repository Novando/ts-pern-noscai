import type {Request, Response} from 'express';
import {AppointmentHttpController} from './appointment.http.controller';
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {Logger} from "../../../utils/logger.util";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {standardErrorResponse} from "../../../utils/error.util";
export async function deleteAppointmentHttpController(
  this: AppointmentHttpController,
  req: Request,
  res: Response
) {
  try {
    const appointmentId = parseInt(req.params.id as string);
    const clinicId = getAsyncLocalStorage('tenantId') as number;

    const result = await this.appointmentService.cancelAppointment(appointmentId, clinicId);

    standardResponse(res, constants.HTTP_STATUS_OK, result);
  } catch (e) {
    Logger.error('Error getting service availability:', e);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}
