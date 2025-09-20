import type {Request, Response} from 'express';
import {AppointmentHttpController} from './appointment.http.controller';
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {Logger} from "../../../utils/logger.util";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {standardErrorResponse} from "../../../utils/error.util";


/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     tags:
 *       - Appointments
 *     summary: Cancel an appointment
 *     description: Cancels an existing appointment by ID. Only the clinic that created the appointment can cancel it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numeric ID of the appointment to cancel
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the clinic
 *     responses:
 *       '200':
 *         description: Appointment cancelled successfully
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
 *                   example: "Appointment cancelled successfully"
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         description: Forbidden - User doesn't have permission to cancel this appointment
 *       '404':
 *         description: Appointment not found
 *       '409':
 *         description: Conflict - Cannot cancel an already cancelled or completed appointment
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

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
    Logger.error('Error getting service availability:', (e as Error).message);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}
