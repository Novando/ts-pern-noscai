import {getServiceByClinicIdService} from "./get-service-by-clinic-id.service";
import type { ServiceRepository } from '../../repositories/service/service.repository';

export type GetServicesOutput = {
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
};

export class ServiceService {
  constructor(
    protected readonly serviceRepository: ServiceRepository,
  ) {}

  getServicesByClinicId = getServiceByClinicIdService
}
