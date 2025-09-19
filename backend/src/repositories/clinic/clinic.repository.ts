import type { Pool } from 'pg';
import {getClinicsRepository} from "./get-clinics.repository";

export class ClinicRepository {

  constructor(
    protected readonly db: Pool,
  ) {}

  getClinics = getClinicsRepository
}
