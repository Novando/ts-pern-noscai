import {getServiceByClinicIdService} from "./get-service-by-clinic-id.service";
import type { ServiceRepository } from '../../repositories/service/service.repository';

export class ServiceService {
  constructor(
    protected readonly serviceRepository: ServiceRepository,
  ) {}

  getServicesByClinicId = getServiceByClinicIdService
}
