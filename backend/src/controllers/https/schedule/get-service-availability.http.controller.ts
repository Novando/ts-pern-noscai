import type {Request, Response} from "express";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {ScheduleHttpController} from "./schedule.http.controller";
import dayjs from "dayjs";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";
import {standardErrorResponse} from "../../../utils/error.util";

/**
 * @swagger
 * /schedules/services/{id}/availability:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Get service availability
 *     description: Retrieves available time slots for a specific service, optionally filtered by doctor and date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numeric ID of the service
 *       - in: query
 *         name: selectedTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Reference date and time to check availability from (ISO 8601 format). Defaults to current time if not provided.
 *         example: "2023-09-21T10:00:00.000Z"
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Optional ID of a specific doctor to check availability for
 *         example: 1
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the tenant
 *     responses:
 *       '200':
 *         description: List of available time slots
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
 *                   example: "Success"
 *                 value:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AvailabilitySlot'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *
 * components:
 *   schemas:
 *     AvailabilitySlot:
 *       type: object
 *       properties:
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the available slot
 *           example: "2023-09-21T10:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the available slot
 *           example: "2023-09-21T10:30:00.000Z"
 *         doctorId:
 *           type: integer
 *           description: ID of the available doctor
 *           example: 1
 *         doctorName:
 *           type: string
 *           description: Name of the available doctor
 *           example: "Dr. Smith"
 */
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
      selectedTime: selectedTime instanceof Date ? selectedTime : new Date(),
      doctorId: doctorId ? Number(doctorId) : undefined,
    });

    standardResponse(res, constants.HTTP_STATUS_OK, availability);
  } catch (e) {
    Logger.error('Error getting service availability:', (e as Error).message);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}