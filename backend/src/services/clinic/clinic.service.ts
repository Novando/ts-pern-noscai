import type { ClinicRepository } from '../../repositories/clinic/clinic.repository';
import {getClinicsService} from "./get-clinics.service";

export class ClinicService {

  constructor(
    protected readonly clinicRepository: ClinicRepository,
  ) {}

  getClinics = getClinicsService
}
