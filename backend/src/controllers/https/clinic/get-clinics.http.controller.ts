import type {Request, Response} from "express";
import type {ClinicHttpController} from "./clinic.http.controller";
import {constants} from "http2";
import {standardResponse} from "../../../utils/response.util";
import {Logger} from "../../../utils/logger.util";
import {standardErrorResponse} from "../../../utils/error.util";

/**
 * @swagger
 * /clinics:
 *   get:
 *     tags:
 *       - Clinics
 *     summary: Get all clinics
 *     description: Retrieves a list of all available clinics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of clinics
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
 *                         description: Unique identifier for the clinic
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the clinic
 *                         example: "Downtown Medical Center"
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function getClinicsHttpController(this: ClinicHttpController, req: Request, res: Response) {
  try {
    const clinics = await this.clinicService.getClinics()

    standardResponse(res, constants.HTTP_STATUS_OK, clinics);
  } catch (e) {
    Logger.error('Error getting service availability:', (e as Error).message);
    standardErrorResponse(res, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, e as Error)
  }
}