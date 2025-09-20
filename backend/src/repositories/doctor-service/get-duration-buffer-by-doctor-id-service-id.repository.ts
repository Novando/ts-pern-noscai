import { getAsyncLocalStorage } from "../../utils/local-storage.util";
import {doctorServiceQueryCheckDoctorService} from "./doctor-service-query.repository";
import type {DoctorServiceRepository} from "./doctor-service.repository";
import type {GetDurationBufferEntity} from "../../models/entity/doctor-service.entity";
import { Logger } from "../../utils/logger.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function getDurationBufferByDoctorIdServiceIdRepository(
  this: DoctorServiceRepository,
  doctorId: number,
  serviceId: number,
  clinicId: number,
): Promise<GetDurationBufferEntity> {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(doctorServiceQueryCheckDoctorService, [doctorId, serviceId, clinicId])

    if (res.rows.length < 1) throw new AppError('Doctor service not exists', 'NOT_FOUND', constants.HTTP_STATUS_NOT_FOUND)

    return {
      id: res.rows[0].id,
      duration: res.rows[0].duration_minutes,
      buffer: res.rows[0].buffer,
      roomIds: res.rows[0].rooms,
    }
  } catch (e) {
    Logger.error('getDurationBufferByDoctorIdServiceIdRepository', (e as Error).message)
    if (!(e instanceof AppError)) throw new AppError((e as Error).message)
    throw e
  }
}