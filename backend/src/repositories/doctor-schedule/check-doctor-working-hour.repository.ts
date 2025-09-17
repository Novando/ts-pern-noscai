import type {DoctorScheduleRepository} from "./doctor-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {doctorScheduleQueryCheckWorkingHour} from "./doctor-schedule-query.repository";
import type {DoctorScheduleCheckWorkingHourParam} from "../../models/entity/doctor-schedule.entity";


export async function checkDoctorWorkingHourRepository(this: DoctorScheduleRepository, param: DoctorScheduleCheckWorkingHourParam) {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    doctorScheduleQueryCheckWorkingHour,
    [param.doctorId, param.day, param.startsAt, param.endsAt],
  )
  if (res.rows.length < 1) throw Error('Clinic schedule unavailable')
}