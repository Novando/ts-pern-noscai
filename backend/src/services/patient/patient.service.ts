import {getPatientsByClinicIdService} from "./get-patient-by-clinic-id.service";
import type {PatientRepository} from "../../repositories/patient/patient.repository";


export class PatientService {
  constructor(
    protected readonly patientRepository: PatientRepository,
  ) {}

  getPatients = getPatientsByClinicIdService
}