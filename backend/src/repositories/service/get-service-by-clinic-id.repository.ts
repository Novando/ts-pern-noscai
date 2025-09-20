import type {ServiceEntity} from "../../models/entity/service.entity";
import {serviceQueryGetServicesByClinicId} from "./service-query.repository";
import type {ServiceRepository} from "./service.repository";


export async function getServiceByClinicIdRepository(this: ServiceRepository, clinicId: number): Promise<ServiceEntity[]> {
  const result = await this.db.query<ServiceEntity>(serviceQueryGetServicesByClinicId, [clinicId]);
  return result.rows;
}