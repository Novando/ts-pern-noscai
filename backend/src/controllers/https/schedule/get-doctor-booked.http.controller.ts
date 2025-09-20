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
 * /schedules/doctors/{id}/booked:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Get doctor's booked appointments
 *     description: Retrieves a list of booked time slots for a specific doctor within a date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numeric ID of the doctor
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the search range (ISO 8601 format). Defaults to current time if not provided.
 *         example: "2023-09-20T00:00:00.000Z"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the search range (ISO 8601 format). Defaults to 3 days from 'from' date if not provided or invalid.
 *         example: "2023-09-23T23:59:59.999Z"
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the tenant
 *     responses:
 *       '200':
 *         description: List of booked time slots
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
 *                     $ref: '#/components/schemas/BookedSlot'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *
 * components:
 *   schemas:
 *     BookedSlot:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Appointment ID
 *           example: 123
 *         startsAt:
 *           type: string
 *           format: date-time
 *           description: Start time of the booked slot
 *           example: "2023-09-20T14:00:00.000Z"
 *         endsAt:
 *           type: string
 *           format: date-time
 *           description: End time of the booked slot
 *           example: "2023-09-20T14:30:00.000Z"
 *         patientName:
 *           type: string
 *           description: Name of the patient
 *           example: "John Doe"
 *         serviceName:
 *           type: string
 *           description: Name of the service
 *           example: "General Checkup"
 */
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

    standardResponse(res, constants.HTTP_STATUS_OK, availability);
  } catch (e) {
    Logger.error('Error getting service availability:', (e as Error).message);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}