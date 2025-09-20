import {getPatientsHttpController} from "./get-patients.http.controller";
import type {PatientService} from "../../../services/patient/patient.service";

export class PatientHttpController {
  constructor(
    protected readonly patientService: PatientService
  ) {}

  getPatients = getPatientsHttpController
}
