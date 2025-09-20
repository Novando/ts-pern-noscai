import type { Pool } from 'pg';
import {getPatientByClinicIdRepository} from "./get-patient-by-clinic-id.repository";

export class PatientRepository {
  constructor(protected readonly pool: Pool) {}

  getPatientByClinicId = getPatientByClinicIdRepository;
}