import type {ClinicScheduleRepository} from "./clinic-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {clinicScheduleQueryGetClinicBusinessHours} from "./clinic-schedule-query.repository";
import type {ScheduleEntity} from "../../models/entity/common.entity";
import {normalizeIsoDate} from "../../utils/time.util";


export async function getClinicBusinessHoursRepository(this: ClinicScheduleRepository, id: number): Promise<ScheduleEntity[]> {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    clinicScheduleQueryGetClinicBusinessHours,
    [id],
  )
  if (res.rows.length < 1) throw Error('Clinic schedule unavailable')

  return res.rows.map<ScheduleEntity>((item) => ({
    dayOfWeek: item.day_of_week,
    startsAt: new Date(normalizeIsoDate(`1970-01-01T${item.starts_at}`)),
    endsAt: new Date(normalizeIsoDate(`1970-01-01T${item.ends_at}`)),
    breaks: item.breaks.map((breakItem: {starts_at: string, ends_at: string}) => ({
      startsAt: new Date(normalizeIsoDate(`1970-01-01T${breakItem.starts_at}`)),
      endsAt: new Date(normalizeIsoDate(`1970-01-01T${breakItem.ends_at}`)),
    }))
  }))
}