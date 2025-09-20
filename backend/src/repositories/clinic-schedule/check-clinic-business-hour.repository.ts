import type {ClinicScheduleRepository} from "./clinic-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {clinicScheduleQueryCheckBusinessHour} from "./clinic-schedule-query.repository";
import type {ClinicScheduleCheckWorkingHourParam} from "../../models/entity/clinic-schedule.entity";
import { Logger } from "../../utils/logger.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function checkClinicBusinessHourRepository(this: ClinicScheduleRepository, param: ClinicScheduleCheckWorkingHourParam) {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(
      clinicScheduleQueryCheckBusinessHour,
      [param.clinicId, param.day, param.startsAt, param.endsAt],
    )

    if (res.rows.length < 1) throw new AppError('Clinic schedule unavailable', 'CONFLIX', constants.HTTP_STATUS_CONFLICT)
  } catch (e) {
    Logger.error('checkClinicBusinessHourRepository', (e as Error).message)
    if (!(e instanceof AppError)) throw new AppError((e as Error).message)
    throw e
  }
}