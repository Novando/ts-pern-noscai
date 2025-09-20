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
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - patientId
 *               - serviceId
 *               - startsAt
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 description: ID of the doctor
 *                 example: 1
 *               patientId:
 *                 type: integer
 *                 description: ID of the patient
 *                 example: 1
 *               serviceId:
 *                 type: integer
 *                 description: ID of the service
 *                 example: 1
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the appointment
 *                 example: "2023-12-31T14:00:00.000Z"
 *     responses:
 *       '200':
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Appointment created successfully"
 *                 value:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     startsAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-31T14:00:00.000Z"
 *                     endsAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-31T14:30:00.000Z"
 *                     status:
 *                       type: string
 *                       example: "scheduled"
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