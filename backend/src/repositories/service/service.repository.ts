import {Pool} from 'pg';
import {getServiceByClinicIdRepository} from "./get-service-by-clinic-id.repository";
import {getDoctorsByServiceIdAndClinicIdRepository} from "./get-doctors-by-service-id-and-clinic-id.repository";

export class ServiceRepository {
  constructor(
    protected readonly db: Pool,
  ) {}

  getServicesByClinicId = getServiceByClinicIdRepository
  getDoctorsByServiceIdAndClinicId = getDoctorsByServiceIdAndClinicIdRepository
}
