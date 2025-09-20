import {Pool} from 'pg';
import {serviceQueryGetServicesByClinicId} from "./service-query.repository";
import type {ServiceEntity} from "../../models/entity/service.entity";
import {getServiceByClinicIdRepository} from "./get-service-by-clinic-id.repository";

export class ServiceRepository {
  constructor(
    protected readonly db: Pool,
  ) {}

  getServicesByClinicId = getServiceByClinicIdRepository
}
