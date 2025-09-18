import type {ClinicScheduleRepository} from "./clinic-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {clinicScheduleQueryCheckBusinessHour} from "./clinic-schedule-query.repository";
import type {ClinicScheduleCheckWorkingHourParam} from "../../models/entity/clinic-schedule.entity";


export async function checkClinicBusinessHourRepository(this: ClinicScheduleRepository, param: ClinicScheduleCheckWorkingHourParam) {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    clinicScheduleQueryCheckBusinessHour,
    [param.clinicId, param.day, param.startsAt, param.endsAt],
  )
  if (res.rows.length < 1) throw Error('Clinic schedule unavailable')
}