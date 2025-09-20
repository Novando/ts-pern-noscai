import {getServiceByClinicIdService} from "./get-service-by-clinic-id.service";
import type { ServiceRepository } from '../../repositories/service/service.repository';
import {getDoctorsByServiceIdAndClinicIdService} from "./get-doctors-by-service-id.service";

export class ServiceService {
  constructor(
    protected readonly serviceRepository: ServiceRepository,
  ) {}

  getServicesByClinicId = getServiceByClinicIdService
  getDoctorsByServiceIdAndClinicId = getDoctorsByServiceIdAndClinicIdService
}
