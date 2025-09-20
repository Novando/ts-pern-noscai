import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import type {ScheduleEntity} from "../../models/entity/common.entity";
import type {DoctorScheduleRepository} from "./doctor-schedule.repository";
import {doctorScheduleQueryGetMultipleDoctorBusinessHoursByServiceId} from "./doctor-schedule-query.repository";
import {normalizeIsoDate} from "../../utils/time.util";
import {Logger} from "../../utils/logger.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function getMultipleDoctorBusinessHoursByServiceIdRepository(
  this: DoctorScheduleRepository,
  serviceId: number,
  clinicId: number,
  doctorId?: number,
): Promise<ScheduleEntity[]> {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(
      doctorScheduleQueryGetMultipleDoctorBusinessHoursByServiceId(doctorId ? [`AND d.id = ${doctorId}`] : [""]),
      [serviceId, clinicId],
    )
    if (res.rows.length < 1) throw new AppError('Doctor schedule unavailable', 'NOT_FOUND', constants.HTTP_STATUS_NOT_FOUND)

    return res.rows.map<ScheduleEntity>((item) => ({
      doctorId: item.doctor_id,
      doctorName: item.doctor_name,
      dayOfWeek: item.day_of_week,
      startsAt: new Date(normalizeIsoDate(`1970-01-01T${item.starts_at}`)),
      endsAt: new Date(normalizeIsoDate(`1970-01-01T${item.ends_at}`)),
      breaks: item.breaks.map((breakItem: {starts_at: string, ends_at: string}) => ({
        startsAt: new Date(normalizeIsoDate(`1970-01-01T${breakItem.starts_at}`)),
        endsAt: new Date(normalizeIsoDate(`1970-01-01T${breakItem.ends_at}`)),
      }))
    }))
  } catch (e) {
    Logger.error('getMultipleDoctorBusinessHoursByServiceIdRepository', (e as Error).message)
    if (!(e instanceof AppError)) throw new AppError((e as Error).message)
    throw e
  }
}