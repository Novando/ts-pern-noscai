import type {AppointmentHttpController} from "./appointment.http.controller";
import type {Request, Response} from "express";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";
import {standardErrorResponse} from "../../../utils/error.util";
import type {PostAppointmentDTOReq} from "../../../models/dto/request/appointment.dto.request";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {constants} from "http2";

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Create a new appointment
 *     description: Creates a new appointment with the provided details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostAppointmentDTOReq'
 *     responses:
 *       '200':
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function postAppointmentHttpController(this: AppointmentHttpController, req: Request, res: Response) {
  try {
    const param: PostAppointmentDTOReq = req.body
    param.clinicId = getAsyncLocalStorage('tenantId') as number
    const result = await this.appointmentService.createAppointment(param)

    standardResponse(res, constants.HTTP_STATUS_OK, result)
  } catch (e) {
    Logger.error(e as Error)
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}