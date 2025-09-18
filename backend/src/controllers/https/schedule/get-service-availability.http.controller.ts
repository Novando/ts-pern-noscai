import type {Request, Response} from "express";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {ScheduleHttpController} from "./schedule.http.controller";
import dayjs from "dayjs";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";

export async function getServiceAvailabilityHttpController(this: ScheduleHttpController, req: Request, res: Response): Promise<void> {
  try {
    const serviceId = parseInt(req.params.id || '0');
    const clinicId = getAsyncLocalStorage('tenantId') as number

    // Default to next 7 days
    const startDate = dayjs(req.query.startDate as string).isValid()
      ? dayjs(req.query.startDate as string).toDate()
      : dayjs().toDate();

    const availability = await this.scheduleService.searchAvailability({
      serviceId,
      clinicId,
      startDate,
    })

    res.status(constants.HTTP_STATUS_OK).json(standardResponse(availability));
  } catch (error) {
    console.error('Error getting service availability:', error);
    res.status(500).json({
      error: 'Failed to get service availability',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}