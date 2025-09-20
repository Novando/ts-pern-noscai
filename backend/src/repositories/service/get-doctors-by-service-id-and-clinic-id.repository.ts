import type {ServiceRepository} from "./service.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {serviceQueryGetDoctorsByServiceIdAndClinicIdRepository} from "./service-query.repository";
import {Logger} from "../../utils/logger.util";


export async function getDoctorsByServiceIdAndClinicIdRepository(this: ServiceRepository, serviceId: number, clinicId: number) {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;
    const result = await db.query(serviceQueryGetDoctorsByServiceIdAndClinicIdRepository, [serviceId, clinicId]);

    return result.rows;
  } catch (e) {
    Logger.error('getDoctorsByServiceIdAndClinicIdRepository', e as Error)
    throw e
  }

}