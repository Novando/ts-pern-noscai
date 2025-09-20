import type { Request, Response } from 'express';
import type {ServiceHttpController} from "./service.http.controller";
import {getAsyncLocalStorage} from "../../../utils/local-storage.util";
import {constants} from "http2";
import {Logger} from "../../../utils/logger.util";
import {standardResponse} from "../../../utils/response.util";
import {standardErrorResponse} from "../../../utils/error.util";

/**
 * @swagger
 * /services/{id}/doctors:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get doctors by service ID
 *     description: Retrieves a list of doctors who provide a specific service in the current clinic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the tenant
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numeric ID of the service
 *     responses:
 *       '200':
 *         description: A list of doctors
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the doctor
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the doctor
 *                         example: "Dr. Bruder"
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         description: Service not found
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function getDoctorsController (this: ServiceHttpController, req: Request, res: Response) {
  try {
    const clinicId = getAsyncLocalStorage('tenantId') as number
    const serviceId = parseInt(req.params.id || '0')
    const result = await this.serviceService.getDoctorsByServiceIdAndClinicId(serviceId, clinicId);

    standardResponse(res, constants.HTTP_STATUS_OK, result);
  } catch (e) {
    Logger.error('Error getting service availability:', (e as Error).message);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}
