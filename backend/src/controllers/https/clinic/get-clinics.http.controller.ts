import type {Request, Response} from "express";
import type {ClinicHttpController} from "./clinic.http.controller";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";
import {standardErrorResponse} from "../../../utils/error.util";

export async function getClinicsHttpController(this: ClinicHttpController, req: Request, res: Response) {
  try {
    const clinics = await this.clinicService.getClinics()

    standardResponse(res, constants.HTTP_STATUS_OK, clinics);
  } catch (e) {
    Logger.error('Error getting service availability:', e);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}