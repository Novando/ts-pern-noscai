import type {AppointmentHttpController} from "./appointment.http.controller";
import type {Request, Response} from "express";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";
import {standardErrorResponse} from "../../../utils/error.util";
import type {PostAppointmentDTOReq} from "../../../models/dto/request/appointment.dto.request";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";


export async function postAppointmentHttpController(this: AppointmentHttpController, req: Request, res: Response) {
  try {
    const param: PostAppointmentDTOReq = req.body
    param.clinicId = getAsyncLocalStorage('tenantId') as number
    const result = await this.appointmentService.createAppointment(param)

    res.status(200).json(standardResponse(result))
  } catch (e) {
    Logger.error(e as Error)
    standardErrorResponse(res, e as Error)
  }
}