import type {ClinicScheduleRepository} from "./clinic-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {clinicScheduleQueryCheckWorkingHour} from "./clinic-schedule-query.repository";
import type {ClinicScheduleCheckWorkingHourParam} from "../../models/entity/clinic-schedule.entity";


export async function checkClinicWorkingHourRepository(this: ClinicScheduleRepository, param: ClinicScheduleCheckWorkingHourParam) {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    clinicScheduleQueryCheckWorkingHour,
    [param.clinicId, param.day, param.startsAt, param.endsAt],
  )
  if (res.rows.length < 1) throw Error('Clinic schedule unavailable')
}