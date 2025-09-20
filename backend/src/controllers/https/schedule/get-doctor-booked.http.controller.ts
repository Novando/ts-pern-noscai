import type {Request, Response} from "express";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {ScheduleHttpController} from "./schedule.http.controller";
import dayjs from "dayjs";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";

export async function getDoctorBookedHttpController(this: ScheduleHttpController, req: Request, res: Response): Promise<void> {
  try {
    const doctorId = parseInt(req.params.id || '0');
    const clinicId = getAsyncLocalStorage('tenantId') as number

    // Default between now and next 3 days
    const from = dayjs(req.query.from as string).isValid()
      ? new Date(req.query.from as string)
      : new Date();

    const to = dayjs(req.query.to as string).isValid() && dayjs(req.query.to as string).isAfter(from)
      ? new Date(req.query.to as string)
      : dayjs(from).add(3, 'days').toDate();

    const availability = await this.scheduleService.doctorBookedSchedule({
      doctorId,
      clinicId,
      from,
      to,
    })

    res.status(constants.HTTP_STATUS_OK).json(standardResponse(availability));
  } catch (error) {
    Logger.error('Error getting service availability:', error);
    res.status(500).json({
      error: 'Failed to get service availability',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}