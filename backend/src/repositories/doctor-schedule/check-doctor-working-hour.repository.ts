import type {DoctorScheduleRepository} from "./doctor-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {doctorScheduleQueryCheckWorkingHour} from "./doctor-schedule-query.repository";
import type {DoctorScheduleCheckWorkingHourParam} from "../../models/entity/doctor-schedule.entity";
import {Logger} from "../../utils/logger.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function checkDoctorWorkingHourRepository(this: DoctorScheduleRepository, param: DoctorScheduleCheckWorkingHourParam) {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(
      doctorScheduleQueryCheckWorkingHour,
      [param.doctorId, param.day, param.startsAt, param.endsAt],
    )
    if (res.rows.length < 1) throw new AppError('Clinic schedule unavailable', 'CONFLIX', constants.HTTP_STATUS_CONFLICT)
  } catch (e) {
    Logger.error('checkDoctorWorkingHourRepository', (e as Error).message)
    if (!(e instanceof AppError)) throw new AppError((e as Error).message)
    throw e
  }
}