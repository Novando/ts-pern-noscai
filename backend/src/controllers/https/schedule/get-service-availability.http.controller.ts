import type {Request, Response} from "express";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {ScheduleHttpController} from "./schedule.http.controller";
import dayjs from "dayjs";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";
import {standardErrorResponse} from "../../../utils/error.util";

export async function getServiceAvailabilityHttpController(this: ScheduleHttpController, req: Request, res: Response): Promise<void> {
  try {
    const serviceId = parseInt(req.params.id || '0');
    const clinicId = getAsyncLocalStorage('tenantId') as number

    // Default to now
    const selectedTime = req.query.selectedTime && dayjs(req.query.selectedTime as string).isValid()
      ? dayjs(req.query.selectedTime as string).toDate()
      : new Date();

    const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;

    const availability = await this.scheduleService.searchAvailability({
      serviceId,
      clinicId,
      selectedTime,
      doctorId,
    })

    standardResponse(res, constants.HTTP_STATUS_OK, availability);
  } catch (e) {
    Logger.error('Error getting service availability:', e);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}