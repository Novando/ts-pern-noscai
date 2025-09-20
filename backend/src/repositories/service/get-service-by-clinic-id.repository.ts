import type {ServiceEntity} from "../../models/entity/service.entity";
import {serviceQueryGetServicesByClinicId} from "./service-query.repository";
import type {ServiceRepository} from "./service.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function getServiceByClinicIdRepository(this: ServiceRepository, clinicId: number): Promise<ServiceEntity[]> {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const result = await db.query<ServiceEntity>(serviceQueryGetServicesByClinicId, [clinicId]);

  if (result.rows.length < 1) throw new AppError('Service not available', 'NOT_FOUND', constants.HTTP_STATUS_NOT_FOUND)

  return result.rows.map((item) => ({
    id: item.id,
    name: item.name,
    duration: item.duration,
  }));
}