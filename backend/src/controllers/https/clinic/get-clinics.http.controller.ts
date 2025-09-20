import type {Request, Response} from "express";
import type {ClinicHttpController} from "./clinic.http.controller";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";

export async function getClinicsHttpController(this: ClinicHttpController, req: Request, res: Response) {
  try {
    const clinics = await this.clinicService.getClinics()

    return res.status(constants.HTTP_STATUS_OK).json(standardResponse(clinics));
  } catch (error) {
    Logger.error('Error getting service availability:', error);
    res.status(500).json({
      error: 'Failed to get service availability',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}