import { getAsyncLocalStorage } from "../../../utils/local-storage.util";
import { standardResponse } from "../../../utils/response.util";
import { Logger } from "../../../utils/logger.util";
import { standardErrorResponse } from "../../../utils/error.util";
import { constants } from "http2";
import type { Request, Response } from "express";
import type { PatientHttpController } from "./patient.http.controller";

/**
 * @swagger
 * /patients:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Get all patients
 *     description: Retrieves a list of all patients for the current clinic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the tenant
 *     responses:
 *       '200':
 *         description: A list of patients
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
 *                         description: Unique identifier for the patient
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the patient
 *                         example: "Mr. Patients"
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function getPatientsHttpController(this: PatientHttpController, req: Request, res: Response) {
  try {
    const clinicId = getAsyncLocalStorage('tenantId') as number;

    const result = await this.patientService.getPatients(clinicId);

    standardResponse(res, constants.HTTP_STATUS_OK, result);
  } catch (e) {
    Logger.error('Error getting patients:', (e as Error).message);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error);
  }
}