import { getAsyncLocalStorage } from "../../utils/local-storage.util";
import {doctorServiceQueryCheckDoctorService} from "./doctor-service-query.repository";
import type {DoctorServiceRepository} from "./doctor-service.repository";
import type {GetDurationBufferEntity} from "../../models/entity/doctor-service.entity";


export async function getDurationBufferByDoctorIdServiceIdRepository(this: DoctorServiceRepository, doctorId: number, serviceId: number): Promise<GetDurationBufferEntity> {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(doctorServiceQueryCheckDoctorService, [doctorId, serviceId])
  if (res.rows.length < 1) throw Error('Doctor service not exists')

  return {
    duration: res.rows[0]['duration'],
    buffer: res.rows[0]['buffer'],
    roomIds: res.rows[0]['rooms'],
  }
}